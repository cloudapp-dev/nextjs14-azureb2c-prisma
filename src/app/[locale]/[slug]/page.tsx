import { ArticleContent } from "@/components/contentful/ArticleContent.component";
import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { ArticleHero } from "@/components/contentful/ArticleHero";
import { ArticleTileGrid } from "@/components/contentful/ArticleTileGrid";
import { Container } from "@/components/contentful/container/Container";
import { draftMode } from "next/headers";
// Internationalization
import { createTranslation } from "@/app/i18n/server";
import { locales, LocaleTypes } from "@/app/i18n/settings";
//SEO - JSON-LD
import { Article, WithContext } from "schema-dts";
import path from "path";
import Script from "next/script";
import { Metadata, ResolvingMetadata } from "next";
import { TagCloudSimpleHome } from "@/components/search/tagcloudsimpleHome.component";
// Claps
import ClapButton from "@/components/contentful/ClapButton.component";

interface BlogPostPageParams {
  slug: string;
  locale: string;
}

interface BlogPostPageProps {
  params: BlogPostPageParams;
}

// Tell Next.js about all our blog posts so
// they can be statically generated at build time.
export async function generateStaticParams(): Promise<BlogPostPageParams[]> {
  const dataPerLocale = locales
    ? await Promise.all(
        locales.map((locale) => client.pageBlogPostCollection({ limit: 100 }))
      )
    : [];

  // If const dataPerLocale is empty, return an empty array
  if (!dataPerLocale) {
    return notFound();
  }

  const paths = dataPerLocale
    .flatMap((data, index) =>
      data.pageBlogPostCollection?.items.map((blogPost) =>
        blogPost?.slug
          ? {
              slug: blogPost.slug,
              locale: locales?.[index] || "",
            }
          : undefined
      )
    )
    .filter(Boolean);

  return paths as BlogPostPageParams[];
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
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [blogPagedataSeo] = await Promise.all([
    client.pageBlogPost({
      slug: params.slug.toString(),
      locale: params.locale.toString(),
      preview: draftMode().isEnabled,
    }),
  ]);

  const blogPost = blogPagedataSeo.pageBlogPostCollection?.items[0];

  if (!blogPost) {
    return notFound();
  }

  const url = generateUrl(params.locale || "", params.slug);

  return {
    title: blogPost.seoFields?.pageTitle,
    description: blogPost.seoFields?.pageDescription,
    metadataBase: new URL(WebUrl),
    alternates: {
      canonical: url,
      languages: {
        "en-US": `/${params.slug}`,
        "de-DE": `/de-DE/${params.slug}`,
        "x-default": `/${params.slug}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Example.dev - Free Tutorials and Resources for Developers",
      locale: params.locale,
      url: url || "",

      title: blogPost.seoFields?.pageTitle || undefined,
      description: blogPost.seoFields?.pageDescription || undefined,
      images: blogPost.seoFields?.shareImagesCollection?.items.map((item) => ({
        url: item?.url || "",
        width: item?.width || 0,
        height: item?.height || 0,
        alt: item?.description || "",
        type: item?.contentType || "",
      })),
    },
    robots: {
      follow: blogPost.seoFields?.follow || false,
      index: blogPost.seoFields?.index || false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  const { isEnabled } = draftMode(); // Check if draft mode is enabled for Contentful
  let jsonLd: WithContext<Article> = {} as WithContext<Article>;
  const [blogPagedata] = await Promise.all([
    client.pageBlogPost({
      slug: params.slug.toString(),
      locale: params.locale.toString(),
      preview: isEnabled,
    }),
  ]);

  const blogPost = blogPagedata.pageBlogPostCollection?.items[0];

  // Create JSON-LD schema only if blogPost is available
  if (blogPost) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blogPost?.title || undefined,
      author: {
        "@type": "Person",
        name: blogPost.author?.name || undefined,
        // The full URL must be provided, including the website's domain.
        url: new URL(
          path.join(
            params.locale.toString() || "",
            params.slug.toString() || ""
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
      image: blogPost?.featuredImage?.url || undefined,
      datePublished: blogPost.publishedDate,
      dateModified: blogPost.sys.publishedAt,
    };
  }

  if (!blogPost) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

  // Internationalization, get the translation function
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  const relatedPosts = blogPost?.relatedBlogPostsCollection?.items;

  if (!blogPost || !relatedPosts) return null;

  let { datanew, minSize, maxSize } = {
    datanew: [],
    minSize: 0,
    maxSize: 0,
  };

  const searchFacets = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/facets?slug=${blogPost.slug}`,
    {
      // next: { revalidate: 24 * 60 * 60 }, // 24 hours,
    }
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

  return (
    <>
      {blogPost && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      <div className="mt-4" />
      <Container>
        <ArticleHero
          article={blogPost}
          isReversedLayout={true}
          isHomePage={false}
        />
      </Container>
      <Container className="max-w-5xl mt-8">
        {/* Tag Cloud Integration */}
        {searchFacets && datanew.length > 0 && (
          <TagCloudSimpleHome
            datanew={datanew}
            minSize={minSize * 10}
            maxSize={maxSize * 5}
            locale={params.locale}
            source={"blog"}
          />
        )}
        <div className="mt-4" />
        <ArticleContent article={blogPost} />
      </Container>
      {relatedPosts.length > 0 && (
        <Container className="max-w-5xl mt-8">
          {/* Without internationalization: */}
          {/* <h2 className="mb-4 md:mb-6">Related Posts</h2> */}
          {/* With internationalization: */}
          <h2 className="mb-4 md:mb-6">{t("blog.relatedArticles")}</h2>
          <ArticleTileGrid
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            articles={relatedPosts}
            slug=""
            source="relatedposts"
            locale={params.locale.toString()}
          />
        </Container>
      )}
      <Container className="max-w-5xl mt-8">
        <ClapButton slug={blogPost.slug || ""} />
      </Container>
    </>
  );
}

export default BlogPostPage;
