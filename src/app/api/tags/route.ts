import { NextResponse } from "next/server";
import { fallbackLng, locales } from "@/app/i18n/settings";
import { client } from "@/lib/client";

const apikey = process.env.API_KEY;

export async function GET(request: Request) {
  if (request.headers.get("x-api-key") !== apikey) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not authorized" }),
      { status: 401 }
    );
  }

  const locale = fallbackLng as string;

  const landingPageData = await client.pageLanding({
    locale,
    preview: false,
    slug: "tags",
  });

  const page = landingPageData.pageLandingCollection?.items[0];
  const tags = page?.contentfulMetadata?.tags;

  const data: any = [];

  if (!tags) {
    return NextResponse.json({ data });
  }

  tags.map((tag) => {
    // console.log("tag", tag?.id, tag?.name);
    data.push({
      value: tag?.id,
      count: tag?.name,
    });
  });

  return NextResponse.json({ data });
}
