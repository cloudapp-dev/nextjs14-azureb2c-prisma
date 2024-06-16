import { client } from "@/lib/client";
import { draftMode } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import { LandingContent } from "@/components/contentful/ArticleContentLanding";
import { notFound } from "next/navigation";
import { Container } from "@/components/contentful/container/Container";
import { TextHighLight } from "@/components/contentful/TextHighLight";
// Internationalization
import { LocaleTypes } from "@/app/i18n/settings";
import { createTranslation } from "@/app/i18n/server";
//SEO - JSON-LD
import { Article, WithContext } from "schema-dts";
import Script from "next/script";
import path from "path";
import Link from "next/link";
//GraphQL Types
import { PageLandingFieldsFragment } from "@/lib/__generated/sdk";
import { PageBlogPostFieldsFragment } from "@/lib/__generated/sdk";
import { TagPageFieldsFragment } from "@/lib/__generated/sdk";
import { TextHighlightFieldsFragment } from "@/lib/__generated/sdk";

interface PageParams {
  slug: string;
  locale: string;
}

interface PageProps {
  params: PageParams;
}

const generateUrl = (locale: string, slug: string) => {
  if (locale === "en-US") {
    return new URL(slug, process.env.NEXT_PUBLIC_BASE_URL!).toString();
  } else {
    return new URL(
      locale + "/" + slug,
      process.env.NEXT_PUBLIC_BASE_URL!
    ).toString();
  }
};

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [PagedataSeo] = await Promise.all([
    client.pageLanding({
      slug: "sitemap-html",
      locale: params.locale.toString(),
      preview: draftMode().isEnabled,
    }),
  ]);

  const landingPage = PagedataSeo.pageLandingCollection?.items[0];

  if (!landingPage) {
    return notFound();
  }

  const url = generateUrl(params.locale || "", params.slug || "");

  const WebUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  return {
    title: landingPage.seoFields?.pageTitle,
    description: landingPage.seoFields?.pageDescription,
    metadataBase: new URL(WebUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-US": "/",
        "de-DE": "/de-DE",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Example.dev - Free Tutorials and Resources for Developers",
      locale: params.locale,
      url: url || "",

      title: landingPage.seoFields?.pageTitle || undefined,
      description: landingPage.seoFields?.pageDescription || undefined,
      images: landingPage.seoFields?.shareImagesCollection?.items.map(
        (item) => ({
          url: item?.url || "",
          width: item?.width || 0,
          height: item?.height || 0,
          alt: item?.description || "",
          type: item?.contentType || "",
        })
      ),
    },
    robots: {
      follow: landingPage.seoFields?.follow || false,
      index: landingPage.seoFields?.index || false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

async function Sitemap_html({ params }: PageProps) {
  const { isEnabled } = draftMode();
  //declare JSON-LD schema
  let jsonLd: WithContext<Article> = {} as WithContext<Article>;
  const [landingPageData, PagesSitemapHtml] = await Promise.all([
    client.pageLanding({
      slug: "sitemap-html",
      locale: params.locale.toString(),
      preview: isEnabled,
    }),
    client.sitemapPages({
      locale: params.locale.toString(),
    }),
  ]);

  const page = landingPageData.pageLandingCollection?.items[0];

  const seoItem = page?.seoFields?.shareImagesCollection?.items[0];

  if (!page) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  // Create JSON-LD schema only if blogPost is available
  if (page) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page?.seoFields?.pageTitle || undefined,
      author: {
        "@type": "Person",
        name: page?.featuredBlogPost?.author?.name || undefined,
        // The full URL must be provided, including the website's domain.
        url: new URL(
          path.join(
            params.locale.toString() || "",
            params.slug?.toString() || ""
          ),
          process.env.NEXT_PUBLIC_BASE_URL!
        ).toString(),
      },
      publisher: {
        "@type": "Organization",
        name: "Example.dev - Free Tutorials and Resources for Developers",
        logo: {
          "@type": "ImageObject",
          url: "https://www.example.dev/favicons/icon-192x192.png",
        },
      },
      image: seoItem?.url || undefined,
      datePublished: page.sys.firstPublishedAt,
      dateModified: page.sys.publishedAt,
    };
  }

  const highLightHeadings: TextHighlightFieldsFragment | undefined | null =
    page.textHighlightCollection?.items[0];
  const sitemapPageLandingUrls: PageLandingFieldsFragment | any =
    PagesSitemapHtml?.pageLandingCollection?.items;
  const sitemapPageTagpageUrls: TagPageFieldsFragment | any =
    PagesSitemapHtml?.tagPageCollection?.items;
  const sitemapPageBlogPostUrls: PageBlogPostFieldsFragment | any =
    PagesSitemapHtml?.pageBlogPostCollection?.items;

  // Internationalization, get the translation function
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  return (
    <>
      {page && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      <Container className="mt-5">
        {highLightHeadings && <TextHighLight headings={highLightHeadings} />}
        <LandingContent landing={page} />
        <div className="mx-auto max-w-8xl  mt-5 text-base">
          <div className="text-2xl font-bold mb-2">
            {" "}
            {t("sitemaphtml.landingpages")}
          </div>
          {sitemapPageLandingUrls.map((field: any, index: number) => {
            return field ? (
              <div key={index}>
                <Link href={field.slug}>{field.internalName}</Link>
              </div>
            ) : null;
          })}
          <div className="text-2xl font-bold mb-2">
            {t("sitemaphtml.tagpages")}
          </div>
          {sitemapPageTagpageUrls.map((field: any, index: number) => {
            return field ? (
              <div key={index}>
                <Link href={`tags/${field.tag}`}>{field.internalName}</Link>
              </div>
            ) : null;
          })}
          <div className="text-2xl font-bold mb-2">
            {" "}
            {t("sitemaphtml.blogpostpages")}
          </div>
          {sitemapPageBlogPostUrls.map((field: any, index: number) => {
            return field ? (
              <div key={index}>
                <Link href={field.slug}>{field.title}</Link>
              </div>
            ) : null;
          })}
        </div>
      </Container>
    </>
  );
}

export default Sitemap_html;
