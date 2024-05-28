import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const authtoken = await getToken({ req });
  const isAdmin = authtoken?.role === "Admin";
  if (!authtoken || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Extract the `messages` from the body of the request
  const { name } = await req.json();

  let data: any = await prisma.roles.findFirst({
    where: { name: name },
  });

  if (data) {
    data["status"] = "present";
  }

  if (!data) {
    data = await prisma.roles.create({
      data: {
        name: name,
      },
    });
    data["status"] = "new";
  }

  return NextResponse.json({
    data,
  });
}
