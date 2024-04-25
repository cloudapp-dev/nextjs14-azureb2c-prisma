import { NextResponse } from "next/server";
import algoliasearch from "algoliasearch/lite";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let slug: string = "*";
  if (searchParams.has("slug")) {
    slug = searchParams.get("slug") || "*";
  }

  const index = client.initIndex(
    `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}`
  );
  const datanew: any = [];
  const datanew2: any = [];
  let minSize = 0;
  let maxSize = 0;

  await index
    .search(slug, {
      facets: ["*"],
      hitsPerPage: 50,
    })
    .then(({ facets }) => {
      if (!facets) {
        return NextResponse.json([]);
      }

      const tags = facets["tags"];

      for (let x in tags) {
        datanew.push({
          value: x,
          count: tags[x],
        });
        datanew2.push(tags[x]);
      }
      datanew2.sort();
      minSize = datanew2[0];
      maxSize = datanew2[datanew2.length - 1];
      // console.log("datanew", datanew);
      //   return NextResponse.json(datanew);
    });

  return NextResponse.json({ datanew, minSize, maxSize });
}
