import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const searchParams = new URL(request.url).searchParams;
  const url = searchParams.get("url");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath(url || "/");

  return new Response(`Revalidating ${url}`, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// then call your-website-url/revalidatepath?secret=xxxx&tag=tag/that/needs/to/be/invalidated.
