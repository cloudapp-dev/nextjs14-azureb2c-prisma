import { createClient } from "contentful-management";
const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env;

//Wird für das Update der Entry verwendet
export const contentfulCMAClient = createClient({
  space: CONTENTFUL_SPACE_ID || "",
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN || "",
});
