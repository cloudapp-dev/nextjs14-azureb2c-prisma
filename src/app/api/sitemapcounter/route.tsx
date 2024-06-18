import { NextRequest, NextResponse } from "next/server";
import { getSitemapEntries } from "@/lib/sitemapcounter";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

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
