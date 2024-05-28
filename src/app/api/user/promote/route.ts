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

  // console.log("mostRecentApiToken:", mostRecentApiToken);

  if (mostRecentApiToken) {
    const { accessToken, expirationDate } = mostRecentApiToken;

    const tokenExpirationDate = new Date(expirationDate);
    const currentDate = new Date();

    token = accessToken;

    // compare the current date to the expiration date
    if (currentDate > tokenExpirationDate) {
      // console.log("the token is expired - get a new one");

      // console.log("currentDate:", currentDate);
      // console.log("tokenExpirationDate:", tokenExpirationDate);

      //Get Access Token
      const tokenazure: any = await AzureToken();
      const newTokens = tokenazure;

      // console.log("newTokens:", newTokens);

      const accessToken = newTokens.access_token;
      const { exp, nbf } = urlBase64Decode(accessToken.split(".")[1]);
      const newExpirationDate = unixTimestampToDate(exp);

      // console.log("exp:", newExpirationDate);

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

      // console.log("the token is valid - you good!");
    }
  } else {
    //Wenn keine Tokens vorhanden sind, dann hole dir einen
    // console.log("the token is existing - get a new one");

    //Get Access Token
    const tokenazure: any = await AzureToken();
    const newTokens = tokenazure;

    // const newTokens = await getAzureAccessToken();

    // console.log("newTokens:", newTokens);

    const accessToken = newTokens.access_token;
    const { exp, nbf } = urlBase64Decode(accessToken.split(".")[1]);
    // console.log(urlBase64Decode(accessToken.split(".")[1]));
    const newExpirationDate = unixTimestampToDate(exp);

    // console.log("exp:", newExpirationDate);

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

    // console.log("the token is valid - you good!");
  }

  return token;
}

export async function POST(req: NextRequest) {
  // Extract the `messages` from the body of the request
  const { id, role } = await req.json();

  const AZURE_B2C_EXTENSION = `{${process.env.AZURE_B2C_EXTENSION_USER}: '${role}'}`;
  const azurerole = JSON.stringify(AZURE_B2C_EXTENSION);
  // console.log("AZURE_B2C_EXTENSION:", azurerole);

  const authtoken = await getToken({ req });
  const isAdmin = authtoken?.role === "Admin";
  if (!authtoken || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //Get Access Token
  const token = await AzureData();

  const patchUrl = "https://graph.microsoft.com/v1.0/users/" + id;
  // console.log("patchUrl:", patchUrl);

  const res = await fetch(patchUrl, {
    method: "PATCH",
    body: AZURE_B2C_EXTENSION,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  // console.log("patchdata:", res.statusText);
  // console.log("patchdata:", res.status);

  return new NextResponse(undefined, {
    status: res.status,
    statusText: res.statusText,
  });
}
