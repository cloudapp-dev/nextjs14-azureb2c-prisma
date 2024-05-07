import { createTranslation } from "@/app/i18n/server";
import { locales, LocaleTypes } from "@/app/i18n/settings";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import { ArticleTileGrid } from "@/components/contentful/ArticleTileGrid";
import { PageBlogPostOrder } from "@/lib/__generated/sdk";
import { TagPageContent } from "@/components/contentful/ArticleContentTagPage";
import { client } from "@/lib/client";
import { Container } from "@/components/contentful/container/Container";
import { TextHighLight } from "@/components/contentful/TextHighLight";
import { revalidateDuration } from "@/utils/constants";
import { TagCloudSimpleHome } from "@/components/search/tagcloudsimpleHome.component";
import { Article, WithContext } from "schema-dts";
import path from "path";
import Script from "next/script";

export const revalidate = revalidateDuration; // revalidate at most every hour

const apikey = process.env.API_KEY;

interface PageParams {
  tag: string;
  locale: string;
}

interface PageProps {
  params: PageParams;
}

// Tell Next.js about all our blog posts so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<PageParams[]> {
  const dataPerLocale = locales
    ? await Promise.all(
        locales.map((locale) =>
          client.tagPageCollectionSmall({ locale, limit: 100 })
        )
      )
    : [];

  // If const dataPerLocale is empty, return an empty array
  if (!dataPerLocale) {
    return notFound();
  }

  const paths = dataPerLocale
    .flatMap((data, index) =>
      data.tagPageCollection?.items.map((tagPage) =>
        tagPage?.tag
          ? {
              tag: tagPage.tag,
              locale: locales?.[index] || "",
            }
          : undefined
      )
    )
    .filter(Boolean);

  return paths as PageParams[];
}

const generateUrl = (locale: string, tag: string) => {
  if (locale === "en-US") {
    return new URL(
      "/tags/" + tag,
      process.env.NEXT_PUBLIC_BASE_URL!
    ).toString();
  } else {
    return new URL(
      locale + "/tags/" + tag,
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
    client.tagPage({
      locale: params.locale.toString(),
      tag: params.tag.toString(),
      preview: draftMode().isEnabled,
    }),
  ]);

  const tagPage = PagedataSeo.tagPageCollection?.items[0];

  if (!tagPage) {
    // If the tag page data can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const url = generateUrl(params.locale || "", params.tag || "");

  return {
    title: tagPage.seoFields?.pageTitle,
    description: tagPage.seoFields?.pageDescription,
    metadataBase: new URL(WebUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-US": "/tags/" + params.tag,
        "de-DE": "/de-DE/tags/" + params.tag,
        "x-default": "/tags/" + params.tag,
      },
    },
    openGraph: {
      type: "website",
      siteName: "CloudApp.dev - Free Tutorials and Resources for Developers",
      locale: params.locale,
      url: url || "",
      title: tagPage.seoFields?.pageTitle || undefined,
      description: tagPage.seoFields?.pageDescription || undefined,
      images: tagPage.seoFields?.shareImagesCollection?.items.map((item) => ({
        url: item?.url || "",
        width: item?.width || 0,
        height: item?.height || 0,
        alt: item?.description || "",
        type: item?.contentType || "",
      })),
    },
    robots: {
      follow: tagPage.seoFields?.follow || false,
      index: tagPage.seoFields?.index || false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

async function TagPage({ params }: PageProps) {
  const { isEnabled } = draftMode();

  let jsonLd: WithContext<Article> = {} as WithContext<Article>;

  const [PageData, blogPostsData] = await Promise.all([
    client.tagPage({
      tag: params.tag.toString(),
      locale: params.locale.toString(),
      preview: isEnabled,
    }),
    client.pageBlogPostCollection({
      limit: 12,
      locale: params.locale.toString(),
      preview: isEnabled,
      order: PageBlogPostOrder.PublishedDateDesc,
      where: {
        contentfulMetadata: {
          tags: { id_contains_all: [params.tag.toString()] },
        },
      },
    }),
  ]);

  const page = PageData.tagPageCollection?.items[0];

  const posts = blogPostsData.pageBlogPostCollection?.items;
  const selectedPost = blogPostsData.pageBlogPostCollection?.items[0];

  if (!PageData || !page) {
    // If the tag page data can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  const showTagCloud = page?.showTagCloud === "Yes";

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

  const seoItem = page?.seoFields?.shareImagesCollection?.items[0];

  if (!page) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  // Create JSON-LD schema only if blogPost is available
  if (selectedPost) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",

      headline: page.seoFields?.pageTitle || undefined,
      author: {
        "@type": "Person",
        name: selectedPost?.author?.name || undefined,
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
  }

  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  // if (!page?.featuredBlogPost || !posts) return;
  if (!PageData) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }
  const highLightHeadings: any = page.textHighlightCollection?.items[0];

  if (!posts) return;

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
        <div className="md:mx-24 md:my-16 sm:mx-16 sm:my-8">
          <TagPageContent landing={page} />
        </div>
      </Container>

      <Container className="my-8 md:mb-10 lg:mb-16">
        {/* Tag Cloud Integration */}
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
        {posts.length > 0 && (
          <h2 className="mb-4 md:mb-6">{t("tagPage.relatedArticles")}</h2>
        )}
        <ArticleTileGrid
          className="md:grid-cols-2 lg:grid-cols-3"
          articles={posts}
        />
      </Container>
    </>
  );
}

export default TagPage;
