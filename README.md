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

Check tutorial -> https://www.cloudapp.dev/next-js-14-upstash-redis-adding-a-clap-function-within-minutes

Check example website ->

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
