import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("secret");
  const document = await request.json();
  const url_en = "/en-US/" + document.slug;
  const url_de = "/de-DE/" + document.slug;

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidatePath(url_en || "/");
  revalidatePath(url_de || "/");

  // This will revalidate any URL that matches the provided page file on the next page visit.
  // This will not invalidate pages beneath the specific page.
  // For example, /blog/[slug] won't invalidate /blog/[slug]/[author].

  // revalidatePath("/blog/[slug]", "page");
  // // or with route groups
  // revalidatePath("/(main)/post/[slug]", "page");

  // This will revalidate any URL that matches the provided layout file on the next page visit.
  // This will cause pages beneath with the same layout to revalidate on the next visit.
  // For example, in the above case, /blog/[slug]/[another] would also revalidate on the next visit.

  // revalidatePath("/blog/[slug]", "layout");
  // // or with route groups
  // revalidatePath("/(main)/post/[slug]", "layout");

  return new Response(`Revalidating ${url_en} and ${url_de}`, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// then call your-website-url/api/revalidatepath
