import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const allowedOrigins = ["https://app.contentful.com", "http://localhost:3000"];

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: "Missing tags" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json(
    { revalidated: true, date: Date.now() },
    { status: 200 }
  );
}

export async function OPTIONS(request: NextRequest) {
  let origin: string = "*";
  if (process.env.NODE_ENV === "production") {
    origin = request.headers.get("Origin") || "";
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// then call your-website-url/api/revalidatetag?secret=xxxxx&url=tag/that/needs/to/be/invalidated.
