import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fallbackLng, locales } from "@/app/i18n/settings";

const apikey = process.env.API_KEY;

async function sendToPrisma(message: any) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/tracking`, {
    method: "POST",
    body: JSON.stringify(message),
    headers: new Headers({
      "Content-Type": "application/json" || "",
      "x-api-key": apikey || "",
    }),
  });
}

export function middleware(request: NextRequest) {
  //Middleware to track user data
  const { ip } = request;

  const message = {
    country: request.geo?.country,
    city: request.geo?.city,
    region: request.geo?.region,
    url: request.url,
    ip: ip,
    mobile: request.headers.get("sec-ch-ua-mobile"),
    platform: request.headers.get("sec-ch-ua-platform"),
    useragent: request.headers.get("user-agent"),
    referer: request.headers.get("referer"),
  };
  // console.log("message", message);

  sendToPrisma(message);

  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;

  // Check if the default locale is in the pathname
  if (
    pathname.startsWith(`/${fallbackLng}/`) ||
    pathname === `/${fallbackLng}`
  ) {
    return NextResponse.redirect(
      new URL(
        pathname.replace(
          `/${fallbackLng}`,
          pathname === `/${fallbackLng}` ? "/" : ""
        ),
        request.url
      ),
      301
    );
  }

  // Check if the pathname is missing any locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const RewriteUrl = request.nextUrl;
    RewriteUrl.pathname = `/${fallbackLng}${pathname}`;

    return NextResponse.rewrite(new URL(RewriteUrl, request.url));
  }
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: [
    "/((?!api|sitemap.xml|robots.txt|_next/static|_next/image|favicons|images|favicon.ico).*)",
  ],
};
