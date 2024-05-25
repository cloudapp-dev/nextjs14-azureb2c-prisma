import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    const validUser = process.env.BASIC_AUTH_USER;
    const validPassWord = process.env.BASIC_AUTH_PASSWORD;

    if (user === validUser && pwd === validPassWord) {
      // Get the current user email address
      const { displayName, email, objectId, ui_locales } = await req.json();

      if (!ui_locales) {
        const language = "default";
      } else {
        const language = ui_locales;
      }

      let user: any = "";

      user = await prisma.logins.create({
        data: {
          name: displayName,
          email: email,
          logins: 1,
          objectId: objectId,
          lastLogin: new Date(),
        },
      });

      return NextResponse.json({
        user,
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
}
