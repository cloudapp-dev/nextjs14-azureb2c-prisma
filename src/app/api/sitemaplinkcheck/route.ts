import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const broken: string[] = [];

  try {
    const response = await fetch(url as string);
    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);
    const urls = result.urlset.url.map((url: any) => url.loc[0]);

    let data: Response;

    for (const url of urls) {
      try {
        data = await fetch(url);
        // If needed you can check the status code of the response

        // if (data.status !== 200) {
        //   broken.push(url as string);
        // }
      } catch (error) {
        console.error("Error fetching the sitemap:", error);
        broken.push(url as string);
      }
    }
  } catch (error) {
    console.error("Error fetching the sitemap:", error);
  } finally {
  }

  if (broken !== null) {
    return NextResponse.json({ entries: broken || 0 });
  } else {
    return NextResponse.json(
      { error: "Failed to fetch or parse sitemap" },
      { status: 500 }
    );
  }

  // Alternatively, you could return a 202 Accepted status code

  return new NextResponse(null, { status: 202 });
}
