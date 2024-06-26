"use server";
import { PageBlogPostOrder } from "@/lib/__generated/sdk";
import { client } from "@/lib/client";

export const getPosts = async (
  offset: number,
  limit: number,
  locale: string,
  isEnabled: boolean,
  source: string,
  slug_not: string
) => {
  try {
    // Getting BlogPosts

    let blogPostsData: any = "";

    if (source === "tag") {
      //tagpages
      blogPostsData = await client.pageBlogPostCollection({
        limit: limit,
        locale: locale,
        skip: offset,
        preview: isEnabled,
        order: PageBlogPostOrder.PublishedDateDesc,
        where: {
          contentfulMetadata: {
            tags: { id_contains_all: [slug_not] },
          },
        },
      });
    } else if (source === "loadmoretags") {
      //tagoverviewpage
      blogPostsData = await client.pageBlogPostCollection({
        limit: limit,
        locale: locale,
        skip: offset,
        preview: isEnabled,
        order: PageBlogPostOrder.PublishedDateDesc,
      });
    } else {
      // loadmore -> Homepage
      blogPostsData = await client.pageBlogPostCollection({
        limit: limit,
        locale: locale,
        skip: offset,
        preview: isEnabled,
        order: PageBlogPostOrder.PublishedDateDesc,
        where: {
          slug_not: slug_not,
        },
      });
    }

    const posts: any = blogPostsData.pageBlogPostCollection?.items;
    const pageCount = blogPostsData.pageBlogPostCollection?.total;

    return { posts: posts, pageCount: pageCount };
  } catch (error: unknown) {
    console.log(error);
    throw new Error(`An error happened: ${error}`);
  }
};
