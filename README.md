This is a [Next.js](https://nextjs.org/) project bootstrapped with [`npx create-next-app@13.5.6`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install npm packages

```bash
npm i
```

Create .env.local file (use .env.local.example and rename it) and add the needed env-values

```bash
ONTENTFUL_SPACE_ID=xxxx
CONTENTFUL_ACCESS_TOKEN=xxxx
CONTENTFUL_PREVIEW_ACCESS_TOKEN=xxxx
CONTENTFUL_MANAGEMENT_TOKEN=xxxx
CONTENTFUL_PREVIEW_SECRET=xxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Api Key for Route Auth
API_KEY=xxxx
# Api Keys for Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=xxxx
ALGOLIA_MASTER_KEY=xxxx
NEXT_PUBLIC_ALGOLIA_APP_ID=xxxx
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=xxxx
```

import data to your contentful space

Check tutorial -> https://medium.com/@cloudapp_dev/contentful-and-next-js-14-easy-creation-integration-of-new-content-types-for-landing-pages-38905692e2a8

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

Or visit the testblog on vercel https://nextjs14-seo.vercel.app/

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Test URL

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
