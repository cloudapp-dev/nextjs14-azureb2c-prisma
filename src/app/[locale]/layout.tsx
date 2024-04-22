import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { draftMode } from "next/headers";
import "instantsearch.css/themes/satellite-min.css";
import "@/app/globals.css";
import Header from "@/components/header/header.component";
import Footer from "@/components/footer/footer.component";
import { Providers } from "@/components/header/providers";
import getAllNavitemsForHome from "@/components/header/navbar.menuitems.component";
import getAllFooteritemsForHome from "@/components/footer/footer.menuitems.component";
import ExitDraftModeLink from "@/components/header/draftmode/ExitDraftModeLink.component";
import { locales } from "@/app/i18n/settings";
import { client } from "@/lib/client";

const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export async function generateStaticParams() {
  return locales.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Example Blog",
  description: "Your Example Blog Description",
  icons: {
    icon: [
      { rel: "icon", url: "/favicons/favicon-16x16.png", sizes: "16x16" },
      new URL("/favicons/favicon-16x16.png", process.env.NEXT_PUBLIC_BASE_URL),
      { rel: "icon", url: "/favicons/favicon-32x32.png", sizes: "32x32" },
      new URL("/favicons/favicon-32x32.png", process.env.NEXT_PUBLIC_BASE_URL),
    ],
    shortcut: [{ rel: "shortcut icon", url: "/favicons/favicon.ico" }],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = params.locale;
  const htmlLang = locale === "en-US" ? "en" : "de";
  const headerdata = await getAllNavitemsForHome(locale);
  const footerdata = await getAllFooteritemsForHome(locale);

  // Get the landing page data for the logo
  const { isEnabled } = draftMode();
  const landingPageData = await client.pageLanding({
    locale,
    preview: isEnabled,
    slug: "/",
  });
  const page = landingPageData.pageLandingCollection?.items[0];

  const logourl = page?.logo?.url || "";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head></head>
      <body>
        <main className={`${urbanist.variable} font-sans dark:bg-gray-900`}>
          <Providers>
            <Header showBar={true} menuItems={headerdata} logourl={logourl} />
            {draftMode().isEnabled && (
              <p className="bg-emerald-400 py-4 px-[6vw]">
                Draft mode is on! <ExitDraftModeLink className="underline" />
              </p>
            )}
            {children}
            <Footer footerItems={footerdata} />
          </Providers>
        </main>
      </body>
    </html>
  );
}
