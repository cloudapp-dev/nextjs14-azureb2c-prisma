export const dynamic = "force-dynamic";

import Results from "@/components/search/results.component";
import { Container } from "@/components/contentful/container/Container";
import { createTranslation } from "@/app/i18n/server";
import { LocaleTypes } from "@/app/i18n/settings";
import TagCloudSimple from "@/components/search/tagcloudsimple.component";

interface SearchPageParams {
  searchTerm: string;
  locale: string;
}

interface SearchPageProps {
  params: SearchPageParams;
}

async function SearchPage({ params }: SearchPageProps) {
  const res = await fetch(
    `https://${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}?query=${params.searchTerm}&attributesToHighlight=[]&attributesToRetrieve=lang.${params.locale},intName,tags,height,width,image,pubdate,slug`,
    {
      headers: new Headers({
        "X-Algolia-API-Key": process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "",
        "X-Algolia-Application-Id":
          process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const searchFacets = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/facets`,
    {
      next: { revalidate: 0 }, // No cache
    }
  ).then((res) => res.json());

  const { datanew, minSize, maxSize } = searchFacets;
  const data = await res.json();
  const results = data.hits;
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  return (
    <Container className="my-8 md:mb-10 lg:mb-16">
      <h1 className="flex items-center justify-center mb-4">
        {params.searchTerm}
      </h1>

      {/* Tag Cloud Integration */}
      <TagCloudSimple
        datanew={datanew}
        minSize={minSize * 10}
        maxSize={maxSize * 5}
        locale={params.locale}
      />

      <div className="mt-8"></div>

      {results && results.length === 0 && (
        <h2 className="pt-6 text-center">No results found</h2>
      )}
      {results && <Results results={results} />}
    </Container>
  );
}

export default SearchPage;
