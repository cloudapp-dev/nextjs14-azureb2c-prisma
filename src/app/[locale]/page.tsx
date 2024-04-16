import { ArticleContent } from "@/components/contentful/ArticleContent.component";
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
  const [blogPagedataSeo] = await Promise.all([
    client.pageBlogPost({
      slug: "/",
      locale: params.locale.toString(),
      preview: draftMode().isEnabled,
    }),
  ]);

  const blogPost = blogPagedataSeo.pageBlogPostCollection?.items[0];

  if (!blogPost) {
    return notFound();
  }

  const url = generateUrl(params.locale || "", "");

  return {
    title: blogPost.seoFields?.pageTitle,
    description: blogPost.seoFields?.pageDescription,
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

async function BlogPostPage({ params }: PageProps) {
  const { isEnabled } = draftMode();
  //declare JSON-LD schema
  let jsonLd: WithContext<Article> = {} as WithContext<Article>;
  const [blogPagedata] = await Promise.all([
    client.pageBlogPost({
      slug: "/",
      locale: params.locale.toString(),
      preview: isEnabled,
    }),
  ]);

  const blogPost = blogPagedata.pageBlogPostCollection?.items[0];

  if (!blogPost) {
    // If a blog post can't be found,
    // tell Next.js to render a 404 page.
    return notFound();
  }

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
      image: blogPost?.featuredImage?.url || undefined,
      datePublished: blogPost.publishedDate,
      dateModified: blogPost.sys.publishedAt,
    };
  }

  // Internationalization, get the translation function
  const { t } = await createTranslation(params.locale as LocaleTypes, "common");

  const relatedPosts = blogPost?.relatedBlogPostsCollection?.items;

  if (!blogPost || !relatedPosts) return null;

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
      <Container className="max-w-4xl mt-8">
        <ArticleContent article={blogPost} />
      </Container>
      {relatedPosts.length > 0 && (
        <Container className="max-w-5xl mt-8">
          {/* Without internationalization: */}
          {/* <h2 className="mb-4 md:mb-6">Related Posts</h2> */}
          {/* With internationalization: */}
          <h2 className="mb-4 md:mb-6">{t("blog.relatedArticles")}</h2>
          <ArticleTileGrid className="md:grid-cols-2" articles={relatedPosts} />
        </Container>
      )}
    </>
  );
}

export default BlogPostPage;
