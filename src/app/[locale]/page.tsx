import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/contentful/ArticleHero";
import { ArticleTileGrid } from "@/components/contentful/ArticleTileGrid";
import { Container } from "@/components/contentful/container/Container";
import { draftMode } from "next/headers";
// Internationalization
import { locales, LocaleTypes } from "@/app/i18n/settings";
import { createTranslation } from "@/app/i18n/server";
//SEO - JSON-LD
import { Article, WithContext } from "schema-dts";
import path from "path";
import Script from "next/script";
import { Metadata, ResolvingMetadata } from "next";
// New Fields Part 9 of tutorial
import { PageBlogPostOrder } from "@/lib/__generated/sdk";
import { TextHighLight } from "@/components/contentful/TextHighLight";
import { revalidateDuration } from "@/utils/constants";
import { TagCloudSimpleHome } from "@/components/search/tagcloudsimpleHome.component";
import Link from "next/link";
import { LandingContent } from "@/components/contentful/ArticleContentLanding";

export const revalidate = revalidateDuration; // revalidate at most every hour

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
    return new URL(locale, process.env.NEXT_PUBLIC_BASE_URL!).toString();
  }
};

const WebUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [PagedataSeo] = await Promise.all([
    client.pageLanding({
      slug: "/",
      locale: params.locale.toString(),
      preview: draftMode().isEnabled,
    }),
  ]);

  const landingPage = PagedataSeo.pageLandingCollection?.items[0];

  if (!landingPage) {
    return notFound();
  }

  const url = generateUrl(params.locale || "", "");

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

async function Home({ params }: PageProps) {
  const { isEnabled } = draftMode();
  //declare JSON-LD schema
  let jsonLd: WithContext<Article> = {} as WithContext<Article>;
  const [landingPageData] = await Promise.all([
    client.pageLanding({
      slug: "/",
      locale: params.locale.toString(),
      preview: isEnabled,
    }),
  ]);

  const page = landingPageData.pageLandingCollection?.items[0];

  if (!page) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  // TagCloud
  const showTagCloud = page.showTagCloud === "Yes";

  let { datanew, minSize, maxSize } = {
    datanew: [],
    minSize: 0,
    maxSize: 0,
  };

  if (showTagCloud) {
    const searchFacets = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/facets`,
      {}
    )
      .then((res) => res.json())
      .catch((error) => {
        console.log("No data found");
      });

    if (searchFacets) {
      maxSize = searchFacets.maxSize;
      minSize = searchFacets.minSize;
      datanew = searchFacets.datanew;
    }
  }

  // Getting BlogPosts
  const blogPostsData = await client.pageBlogPostCollection({
    limit: 10,
    locale: params.locale.toString(),
    skip: 0,
    preview: isEnabled,
    order: PageBlogPostOrder.PublishedDateDesc,
    where: {
      slug_not: page?.featuredBlogPost?.slug,
    },
  });
  const posts = blogPostsData.pageBlogPostCollection?.items;

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
      image: page?.featuredBlogPost?.featuredImage?.url || undefined,
      datePublished: page.sys.firstPublishedAt,
      dateModified: page.sys.publishedAt,
    };
  }

  // Internationalization, get the translation function
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  const highLightHeadings: any = page.textHighlightCollection?.items[0];

  if (!page?.featuredBlogPost || !posts) return;

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

        {showTagCloud && datanew.length > 0 && (
          <TagCloudSimpleHome
            datanew={datanew}
            minSize={minSize * 10}
            maxSize={maxSize * 5}
            locale={params.locale.toString()}
            source={"homepage"}
          />
        )}

        <Link
          href={`/${params.locale.toString()}/${page.featuredBlogPost.slug}`}
        >
          <ArticleHero article={page.featuredBlogPost} isHomePage={true} />
        </Link>
        <div className="md:mx-24 md:my-24 sm:mx-16 sm:my-16">
          <LandingContent landing={page} />
        </div>
      </Container>

      <Container className="my-8 md:mb-10 lg:mb-16">
        {posts.length > 0 && (
          <h2 className="mb-4 md:mb-6">{t("landingPage.latestArticles")}</h2>
        )}
        <ArticleTileGrid
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          articles={posts}
          slug={page.featuredBlogPost.slug}
          source="loadmore"
          locale={params.locale.toString()}
        />
      </Container>
    </>
  );
}

export default Home;
