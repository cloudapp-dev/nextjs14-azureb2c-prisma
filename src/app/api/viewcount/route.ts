import { NextRequest, NextResponse } from "next/server";
import redis from "../../../lib/redis";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // export default async function incr(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const slug = body.slug as string | undefined;
  if (!slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }

  //   const ip = req.ip;
  const { ip } = req;

  // Hash the IP and turn it into a hex string
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip)
  );
  const hash = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const isNew = await redis.set(["deduplicate", hash, slug].join(":"), true, {
    nx: true,
    ex: 24 * 60 * 60,
  });
  if (!isNew) {
    new NextResponse(null, { status: 202 });
  }

  await redis.incr(["pageviews", "example", slug].join(":"));
  return new NextResponse(null, { status: 202 });
}
