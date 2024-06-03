import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { name, email, username } = await req.json();

  let data = await prisma.users.findFirst({
    where: { email: email },
  });

  if (data) {
    data["status"] = "present";
  }

  if (!data) {
    data = await prisma.users.create({
      data: {
        name: name,
        email: email,
        username: username,
      },
    });
    data["status"] = "new";
  }

  return NextResponse.json({
    data,
  });
}
