//actions/getUsers.ts

"use server";
import type { UserAPIResponse } from "@/types/userScroll";
import { PageBlogPostOrder } from "@/lib/__generated/sdk";
import { client } from "@/lib/client";

export const getPosts = async (
  offset: number,
  limit: number,
  locale: string,
  isEnabled: boolean,
  slug_not: string
) => {
  try {
    // Getting BlogPosts
    const blogPostsData = await client.pageBlogPostCollection({
      limit: limit,
      locale: locale,
      skip: offset,
      preview: isEnabled,
      order: PageBlogPostOrder.PublishedDateDesc,
      where: {
        slug_not: slug_not,
      },
    });
    const posts: any = blogPostsData.pageBlogPostCollection?.items;

    // const url = `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${limit}`;
    // const response = await fetch(url);
    // const data = (await response.json()) as UserAPIResponse;
    return posts;
  } catch (error: unknown) {
    console.log(error);
    throw new Error(`An error happened: ${error}`);
  }
};
