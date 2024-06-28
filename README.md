This is a [Next.js](https://nextjs.org/) project bootstrapped with [`npx create-next-app@latest`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install npm packages

```bash
npm i
```

Create .env.local file (use .env.local.example and rename it) and add the needed env-values

```bash
# Contentful API Keys
CONTENTFUL_SPACE_ID=xxxx
CONTENTFUL_ACCESS_TOKEN=xxxx
CONTENTFUL_PREVIEW_ACCESS_TOKEN=xxxx
CONTENTFUL_MANAGEMENT_TOKEN=xxxx
CONTENTFUL_PREVIEW_SECRET=xxxx
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Api Key for Route Auth
API_KEY=xxxxxx
# Api Keys for Algolia
NEXT_PUBLIC_ALGOLIA_API_KEY=xxxx
ALGOLIA_MASTER_KEY=xxxxx
NEXT_PUBLIC_ALGOLIA_APP_ID=xxxxx
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=xxxxx
# Piwik Analytics & CMP
NEXT_PUBLIC_PIWIK_PRO_ID=xxxxxx
NEXT_PUBLIC_PIWIK_CONTAINER_NAME=xxxxx
# Revalidate Secret
CONTENTFUL_REVALIDATE_SECRET=xxxxx

# AD B2C
NEXT_PUBLIC_AZURE_AD_B2C_TENANT_NAME=xxxxx
NEXT_PUBLIC_AZURE_AD_B2C_PRIMARY_USER_FLOW=xxxxx

NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
AZURE_AD_B2C_CLIENT_SECRET=xxxxx
NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID=xxxxx

# Prisma - Postegres neon.tech
DATABASE_URL=xxxx

# Basic Auth
BASIC_AUTH_USER=xxx
BASIC_AUTH_PASSWORD=xxxx

# Getting Data from Azure AD B2C
AZURE_CLIENT_ID=xxxx
AZURE_CLIENT_SECRET=xxxx
AZURE_GRANT_TYPE=client_credentials
AZURE_SCOPE=https://graph.microsoft.com/.default
AZURE_TENANT_ID=xxxx
AZURE_TOKEN_URL=https://login.microsoftonline.com/xxxx/oauth2/v2.0/token
AZURE_B2C_EXTENSION_USER=extension_xxxx_Role

# Redis Upstash
UPSTASH_REDIS_REST_URL="xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxx"
```

import data to your contentful space

Check tutorial for Next.js 14 HTML Sitemap with Contentful -> https://www.cloudapp.dev/nextjs-14-creating-an-html-sitemap-in-5-minutes-with-contentful

Check tutorial for Next.js 14 Server Actions -> https://www.cloudapp.dev/next-js-14-endless-scroll-with-contentful-and-server-actions

Check tutorial for Next.js 14 View Counter for Blog with Serverless Redis -> https://www.cloudapp.dev/nextjs-14-adding-a-view-counter-to-your-nextjs-blog-with-serverless-redis-upstash

Check tutorial for Next.js 14 / Upstash Redis - Adding a Clap Function within Minutes - > https://www.cloudapp.dev/next-js-14-upstash-redis-adding-a-clap-function-within-minutes

Check tutorial Azure AD B2C/Prisma ORM - Data control via REST - Part 2 - https://www.cloudapp.dev/azure-ad-b2cprisma-orm-postgresql-control-your-data-via-rest-api-part2

## SEO Toolbox

Building a Sitemap counter -> https://www.cloudapp.dev/next-js-14-seo-create-a-sitemap-counter-in-5-minutes

Building a Broken Link check based on sitemap.xml -> https://www.cloudapp.dev/nextjs-14-create-a-broken-link-checker-based-on-the-sitemapxml-to-safeguard-your-seo-rankings

Enlarge your SEO Toolbox with a Slugify/Word & Character Count feature with no effort -> https://www.cloudapp.dev/nextjs-14-enlarge-your-seo-toolbox-with-a-slugifyword-and-character-count-feature-with-no-effort

Combine Pagination with Infinite Scroll - > https://www.cloudapp.dev/nextjs-14-seo-combine-pagination-with-infinite-scroll-to-obtain-the-best-of-both-worlds

## Social Share Buttons

Boost Blog Traffic: Reasons to Add Social Share Buttons Now -> https://www.cloudapp.dev/boost-blog-traffic-reasons-to-add-social-share-buttons-now

or simply run this command after the creation of the .env.local file

```bash
npm run cf-import
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Or visit the testblog on vercel https://nextjs14-caching-revalidation.vercel.app

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Test URL

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
