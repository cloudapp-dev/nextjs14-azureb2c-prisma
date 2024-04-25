"use client";

import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js";
import Link from "next/link";
import {
  Hits,
  Highlight,
  SearchBox,
  RefinementList,
  DynamicWidgets,
  Snippet,
} from "react-instantsearch";
import NextImage, { ImageProps as NextImageProps } from "next/image";
import { PageBlogPostFieldsFragment } from "@/lib/__generated/sdk";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Panel } from "@/components/search/panel.component";
import { useParams } from "next/navigation";
import type { LocaleTypes } from "@/app/i18n/settings";

interface ArticleAuthorProps {
  article: PageBlogPostFieldsFragment;
}

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
);

type HitProps = {
  hit: AlgoliaHit<{
    intName: string;
    title_de: string;
    title_en: string;
    shortDescription_de: string;
    shortDescription_en: string;
    image: string;
    pubdate: string;
    width: number;
    height: number;
    slug: string;
    lang: {
      "de-DE": { content: string; shortDescription: string; title: string };
      "en-US": { content: string; shortDescription: string; title: string };
    };
  }>;
};

let locale: LocaleTypes;
let shortDesc: string;

function Hit({ hit }: HitProps) {
  const blurURL = new URL(hit.image);
  blurURL.searchParams.set("w", "10");

  shortDesc = hit.lang[locale].title;

  return (
    <article>
      <Link href={`/${locale}/${hit.slug}`}>
        <h2>
          <Highlight
            attribute="intName"
            hit={hit}
            className="Hit-label text-black"
          />
        </h2>
        {hit?.image && (
          <NextImage
            src={hit.image}
            width={300}
            height={300}
            alt={hit.intName || ""}
            sizes="(max-width: 1200px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blurURL.toString()}
          />
        )}

        <span className="text-sm text-gray-500 mr-2">{shortDesc}</span>
        <Snippet hit={hit} attribute="pubdate" />
      </Link>
    </article>
  );
}

export default function Search() {
  locale = useParams()?.locale as LocaleTypes;
  return (
    <InstantSearchNext
      searchClient={client}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      routing={{
        router: {
          cleanUrlOnDispose: false,
          windowTitle(routeState) {
            const indexState = routeState.indexName || {};
            return indexState.query
              ? `MyWebsite - Results for: ${indexState.query}`
              : "MyWebsite - Results page";
          },
        },
      }}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="Container mx-4">
        <div>
          <DynamicWidgets fallbackComponent={FallbackComponent} />
        </div>
        <div>
          <SearchBox />
          <Hits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearchNext>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}
