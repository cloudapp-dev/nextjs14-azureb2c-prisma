import { NextRequest, NextResponse } from "next/server";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { client } from "@/lib/client";
import { fallbackLng, locales } from "@/app/i18n/settings";

const apikey = process.env.API_KEY;

export async function POST(request: NextRequest) {
  const document = await request.json();
  let json_de: string = "";
  let json_en: string = "";

  if (request.headers.get("x-api-key") !== apikey) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not authorized" }),
      { status: 401 }
    );
  }

  const locale = fallbackLng as string;

  const blogPagedata = await client.pageBlogPost({
    locale,
    preview: false,
    slug: document.slug,
  });

  const blogPost = blogPagedata.pageBlogPostCollection?.items[0];

  if (!blogPost) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "Blog post not found" }),
      { status: 404 }
    );
  }

  json_en = documentToPlainTextString(blogPost.content?.json);
  const tags = blogPost.contentfulMetadata?.tags;
  const tagsnew: any = [];

  tags.map((tag) => {
    // console.log("tag", tag.id, tag.name);
    if (tag) tagsnew.push(tag.id);
  });

  // console.log("tagsnew", tagsnew);

  const blogPagedata_de = await client.pageBlogPost({
    locale: "de-DE",
    preview: false,
    slug: document.slug,
  });

  const blogPost_de = blogPagedata_de.pageBlogPostCollection?.items[0];

  if (!blogPost_de) {
    return new NextResponse(
      JSON.stringify({
        status: "fail",
        message: "Blog post for language de-DE not found",
      }),
      { status: 404 }
    );
  }
  json_de = documentToPlainTextString(blogPost_de.content?.json);

  // console.log("blogPost", blogPost.content?.json);

  const AlgoliaUrl =
    "https://" +
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID +
    ".algolia.net/1/indexes/" +
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME +
    "/" +
    document.entityId;

  const date = blogPost.publishedDate;
  const formatDate = new Date(date).toISOString().substring(0, 10);
  const timeStamp = new Date(date).getTime() / 1000;

  const jsonData: any = {
    entityId: document.entityId,
    height: blogPost?.featuredImage?.height?.toString() || "0",
    width: blogPost?.featuredImage?.width?.toString() || "0",
    image: blogPost?.featuredImage?.url,
    intName: document.intName,
    lang: {
      "de-DE": {
        content: json_de,
        shortDescription: document.shortDescription_de,
        title: document.title_de,
      },
      "en-US": {
        content: json_en,
        shortDescription: document.shortDescription_en,
        title: document.title_en,
      },
    },
    pubdate: formatDate,
    pubdatetimestamp: timeStamp,
    slug: document.slug,
    spaceId: document.spaceId,
    tags: tagsnew,
  };

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-Algolia-API-Key": process.env.ALGOLIA_MASTER_KEY || "",
    "X-Algolia-Application-Id": process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  };

  const res = await fetch(AlgoliaUrl, {
    method: "PUT",
    body: JSON.stringify(jsonData),
    headers: headers,
  });

  if (!res.ok) {
    const text = await res.text(); // get the response body for more information

    throw new Error(`
      Failed to fetch data
      Status: ${res.status}
      Response: ${text}
    `);
  }

  const result: any = await res.json();
  // console.log("result", result);

  return NextResponse.json(
    { transformed: true, date: Date.now() },
    { status: 200 }
  );
}
