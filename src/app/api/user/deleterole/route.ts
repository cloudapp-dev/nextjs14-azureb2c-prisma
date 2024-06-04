import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { id } = await req.json();
  let data: any = null;

  if (id) {
    data = await prisma.roles.delete({
      where: {
        id: id,
      },
    });
  }

  if (data) {
    data["status"] = "success";
  }

  return NextResponse.json({
    data,
  });
}
