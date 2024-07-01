import { NextRequest, NextResponse } from "next/server";
import { getSitemapEntries } from "@/lib/sitemapcounter";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 1 requests per 45 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "45 s"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  // Use a constant string to limit all requests with a single ratelimit
  // Or use a userID, apiKey or ip address for individual limits.
  const identifier = "sitemapcounter";
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    console.log("Unable to process at this time");
    return NextResponse.json({ error: "Quota exceeded" }, { status: 429 });
  }

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const entries = await getSitemapEntries(url);

  if (entries !== null) {
    return NextResponse.json({ entries: entries || 0 });
  } else {
    return NextResponse.json(
      { error: "Failed to fetch or parse sitemap" },
      { status: 500 }
    );
  }

  // Alternatively, you could return a 202 Accepted status code

  return new NextResponse(null, { status: 202 });
}
