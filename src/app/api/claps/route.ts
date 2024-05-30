// app/api/claps/route.ts

import { NextRequest, NextResponse } from "next/server";
import redis from "../../../lib/redis";

export async function POST(request: NextRequest) {
  const { slug } = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const claps = await redis.incr(`claps:${slug}`);
  return NextResponse.json({ claps });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const claps = await redis.get<number>(`claps:${slug}`);
  return NextResponse.json({ claps: claps || 0 });
}
