import { createTranslation } from "@/app/i18n/server";
import { locales, LocaleTypes } from "@/app/i18n/settings";
import { client } from "@/lib/client";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Metadata, ResolvingMetadata } from "next";
import { LandingContent } from "@/components/contentful/ArticleContentLanding";
import { Container } from "@/components/contentful/container/Container";
import { TextHighLight } from "@/components/contentful/TextHighLight";
//SEO - JSON-LD
import { Article, WithContext } from "schema-dts";
import path from "path";
import Script from "next/script";

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
      slug: "about",
      preview: draftMode().isEnabled,
    }),
  ]);

  const landingPage = PagedataSeo.pageLandingCollection?.items[0];

  if (!landingPage) {
    return notFound();
  }

  const url = generateUrl(params.locale || "", params.slug || "");

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

async function AboutPage({ params }: PageProps) {
  // Make sure to use the correct namespace here.
  const { t } = await createTranslation(params.locale as LocaleTypes, "about");
  const { isEnabled } = draftMode();
  //declare JSON-LD schema
  let jsonLd: WithContext<Article> = {} as WithContext<Article>;
  const landingPageData = await client.pageLanding({
    locale: params.locale.toString(),
    preview: isEnabled,
    slug: "about",
  });

  const page = landingPageData?.pageLandingCollection?.items[0];

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

  const highLightHeadings: any = page.textHighlightCollection?.items[0];

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
      </Container>
    </>
  );
}

export default AboutPage;
