import path from "path";

import { locales } from "@/app/i18n/settings";
import { LocaleTypes, fallbackLng } from "@/app/i18n/settings";
import { MetadataRoute } from "next";

import { SitemapPagesFieldsFragment } from "@/lib/__generated/sdk";
import { client } from "@/lib/client";

type SitemapFieldsWithoutTypename = Omit<
  SitemapPagesFieldsFragment,
  "__typename"
>;

type SitemapPageCollection =
  SitemapFieldsWithoutTypename[keyof SitemapFieldsWithoutTypename];

async function sitemapgenerator() {
  const promiseArr =
    locales
      ?.map((locale: LocaleTypes) => client.sitemapPages({ locale }))
      .filter(Boolean) || [];
  const dataPerLocale: SitemapFieldsWithoutTypename[] = await Promise.all(
    promiseArr
  );

  const fields = dataPerLocale
    .map((localeData, index) =>
      Object.values(localeData).flatMap(
        (pageCollection: SitemapPageCollection) =>
          pageCollection?.items.map((item: any) => {
            const localeForUrl =
              locales?.[index] === fallbackLng ? undefined : locales?.[index];
            let urlSegment = "";
            urlSegment = item?.slug === "/" ? "" : item?.slug || "";
            const url = new URL(
              path.join(localeForUrl || "", urlSegment || ""),
              process.env.NEXT_PUBLIC_BASE_URL!
            ).toString();
            return item && !item.seoFields?.excludeFromSitemap
              ? {
                  url: url,
                  lastModified: item.sys.publishedAt,
                  changeFrequency: "weekly",
                  priority: 0.7,
                }
              : undefined;
          })
      )
    )
    .flat()
    .filter(Boolean);

  return fields;
}

export const revalidate = 24 * 60 * 60; // revalidate at most every hour

export default function sitemap(): MetadataRoute.Sitemap {
  const fields: any = sitemapgenerator();

  return fields;
}
