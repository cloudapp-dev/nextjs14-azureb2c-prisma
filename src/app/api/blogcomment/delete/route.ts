import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import redis from "@/lib/redis";

export async function POST(req: NextRequest, res: NextResponse) {
  const headersList = headers();
  const token = await getToken({ req });
  let referer = headersList.get("referer");
  const newPath = referer?.split("/");
  referer = newPath.slice(newPath.length - 1).join("/");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!referer) {
    return NextResponse.json(
      { error: "Referer Header not set" },
      { status: 400 }
    );
  }
  try {
    const { comment } = await req.json();

    const isAdmin = token.role === "Admin";
    const isAuthor = token.sub === comment.user.sub;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await redis.lrem(referer, 0, comment);

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}
