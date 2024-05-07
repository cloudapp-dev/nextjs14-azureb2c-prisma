import { createTranslation } from "@/app/i18n/server";
import { notFound } from "next/navigation";
import { locales, LocaleTypes } from "@/app/i18n/settings";
import { client } from "@/lib/client";
import { PageBlogPostOrder } from "@/lib/__generated/sdk";
import { draftMode } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import { ArticleTileGrid } from "@/components/contentful/ArticleTileGrid";
import { LandingContent } from "@/components/contentful/ArticleContentLanding";
import { Container } from "@/components/contentful/container/Container";
import { TextHighLight } from "@/components/contentful/TextHighLight";
import { TagCloudSimpleHome } from "@/components/search/tagcloudsimpleHome.component";
import { revalidateDuration } from "@/utils/constants";
// Json Schema
import { Article, WithContext } from "schema-dts";
import path from "path";
import Script from "next/script";

export const revalidate = revalidateDuration; // revalidate at most every hour

const apikey = process.env.API_KEY;

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

const WebUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [PagedataSeo] = await Promise.all([
    client.pageLanding({
      locale: params.locale.toString(),
      slug: "tags",
      preview: draftMode().isEnabled,
    }),
  ]);

  const landingPage = PagedataSeo.pageLandingCollection?.items[0];

  const url = generateUrl(params.locale || "", params.slug || "");

  return {
    title: landingPage?.seoFields?.pageTitle,
    description: landingPage?.seoFields?.pageDescription,
    metadataBase: new URL(WebUrl),
    alternates: {
      canonical: url + landingPage?.slug,
      languages: {
        "en-US": "/" + landingPage?.slug,
        "de-DE": "/de-DE/" + landingPage?.slug,
        "x-default": "/" + landingPage?.slug,
      },
    },
    openGraph: {
      type: "website",
      siteName: "CloudApp.dev - Free Tutorials and Resources for Developers",
      locale: params.locale,
      url: url + landingPage?.slug || "",
      title: landingPage?.seoFields?.pageTitle || undefined,
      description: landingPage?.seoFields?.pageDescription || undefined,
      images: landingPage?.seoFields?.shareImagesCollection?.items.map(
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
      follow: landingPage?.seoFields?.follow || false,
      index: landingPage?.seoFields?.index || false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

async function TagHomePage({ params }: PageProps) {
  // Make sure to use the correct namespace here.
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");
  const { isEnabled } = draftMode();
  const landingPageData = await client.pageLanding({
    locale: params.locale.toString(),
    preview: isEnabled,
    slug: "tags",
  });
  const page = landingPageData.pageLandingCollection?.items[0];

  const blogPostsData = await client.pageBlogPostCollection({
    limit: 12,
    locale: params.locale.toString(),
    preview: isEnabled,
    order: PageBlogPostOrder.PublishedDateDesc,
  });

  const posts = blogPostsData.pageBlogPostCollection?.items;

  const seoItem = page?.seoFields?.shareImagesCollection?.items[0];

  const showTagCloud = page?.showTagCloud === "Yes";

  if (!page) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",

    headline: page?.seoFields?.pageTitle || undefined,
    author: {
      "@type": "Person",
      name: "E.G.",
      // The full URL must be provided, including the website's domain.
      url: new URL(
        path.join(params.locale.toString() || ""),
        process.env.NEXT_PUBLIC_BASE_URL!
      ).toString(),
    },
    publisher: {
      "@type": "Organization",
      name: "CloudApp.dev - Free Tutorials and Resources for Developers",
      logo: {
        "@type": "ImageObject",
        url: "https://www.cloudapp.dev/favicons/icon-192x192.png",
      },
    },
    image: seoItem?.url || undefined,
    datePublished: page.sys.firstPublishedAt,
    dateModified: page.sys.publishedAt,
  };

  let { datanew } = {
    datanew: [],
  };

  if (showTagCloud) {
    const searchTags = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/tags`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json" || "",
          "x-api-key": apikey || "",
        }),
        next: { revalidate: 3600 }, // 1 h cache,
      }
    ).then((res) => res.json());

    datanew = searchTags.data;
  }
  if (!page) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const highLightHeadings: any = page.textHighlightCollection?.items[0];

  if (!posts) return;

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <Container className="my-8 md:mb-10 lg:mb-16">
        {highLightHeadings && <TextHighLight headings={highLightHeadings} />}
        {showTagCloud && datanew.length > 0 && (
          <TagCloudSimpleHome
            datanew={datanew}
            minSize={10}
            maxSize={5}
            locale={params.locale}
            source={"tags"}
          />
        )}
      </Container>
      <Container className="mt-5">
        <div className="md:mx-24 md:my-16 sm:mx-16 sm:my-8">
          <LandingContent landing={page} />
        </div>
      </Container>
      <Container className="my-8 md:mb-10 lg:mb-16">
        {posts.length > 0 && (
          <h2 className="mb-4 md:mb-6">{t("landingPage.latestArticles")}</h2>
        )}
        <ArticleTileGrid
          className="md:grid-cols-2 lg:grid-cols-3"
          articles={posts}
        />
      </Container>
    </>
  );
}

export default TagHomePage;
