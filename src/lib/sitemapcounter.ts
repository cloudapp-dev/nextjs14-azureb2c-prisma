import { parseStringPromise } from "xml2js";

export async function getSitemapEntries(url: string): Promise<number | null> {
  try {
    const response = await fetch(url);
    const xmlData = await response.text();
    const result = await parseStringPromise(xmlData);
    const entries = result.urlset.url.length;

    return entries;
  } catch (error) {
    console.error("Error fetching or parsing sitemap:", error);
    return null;
  }
}
