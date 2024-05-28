import type { AuthTokenResp } from "@/types/api";
import prisma from "@/lib/prisma";
import { unixTimestampToDate, urlBase64Decode } from "@/lib/utils";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

async function AzureToken() {
  const formdata = new FormData();

  formdata.append("grant_type", "client_credentials");
  formdata.append("client_id", process.env.AZURE_CLIENT_ID || "");
  formdata.append("client_secret", process.env.AZURE_CLIENT_SECRET || "");
  formdata.append("scope", process.env.AZURE_SCOPE || "");

  if (!process.env.AZURE_TOKEN_URL) {
    throw new Error("AZURE_TOKEN_URL is not set");
  }

  const res = await fetch(process.env.AZURE_TOKEN_URL, {
    method: "POST",
    body: formdata,
  });

  if (!res.ok) {
    const text = await res.text(); // get the response body for more information

    throw new Error(`
      Failed to fetch data
      Status: ${res.status}
      Response: ${text}
    `);
  }

  const newTokens: AuthTokenResp = await res.json();

  return newTokens;
}

async function AzureData() {
  const mostRecentApiToken = await prisma.apiToken.findFirst({
    where: { tokenType: "Azure" },
    orderBy: {
      addedOn: "desc",
    },
  });

  let token: string = "";

  if (mostRecentApiToken) {
    const { accessToken, expirationDate } = mostRecentApiToken;

    const tokenExpirationDate = new Date(expirationDate);
    const currentDate = new Date();

    token = accessToken;

    // compare the current date to the expiration date
    if (currentDate > tokenExpirationDate) {
      //Get Access Token
      const tokenazure: any = await AzureToken();
      const newTokens = tokenazure;

      const accessToken = newTokens.access_token;
      const { exp, nbf } = urlBase64Decode(accessToken.split(".")[1]);
      const newExpirationDate = unixTimestampToDate(exp);

      await prisma.apiToken.create({
        data: {
          accessToken: accessToken,
          expirationDate: newExpirationDate,
          tokenType: "Azure",
          addedOn: new Date(),
        },
      });

      //Accesstoken der Variablen zuweisen
      token = accessToken;
    }
  } else {
    //Get Access Token
    const tokenazure: any = await AzureToken();
    const newTokens = tokenazure;

    const accessToken = newTokens.access_token;
    const { exp, nbf } = urlBase64Decode(accessToken.split(".")[1]);
    const newExpirationDate = unixTimestampToDate(exp);

    await prisma.apiToken.create({
      data: {
        accessToken: accessToken,
        expirationDate: newExpirationDate,
        tokenType: "Azure",
        addedOn: new Date(),
      },
    });

    //Accesstoken der Variablen zuweisen
    token = accessToken;
  }

  return token;
}

export async function GET(req: NextRequest) {
  const authtoken = await getToken({ req });
  const isAdmin = authtoken?.role === "Admin";
  if (!authtoken || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data = null;

  //Get Access Token
  const token = await AzureData();

  const res = await fetch(
    `https://graph.microsoft.com/beta/users?$select=displayName,id,identities,createdDateTime,otherMails,${process.env.AZURE_B2C_EXTENSION_USER}`,
    {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
  data = await res.json();

  return NextResponse.json({
    data,
  });
}
