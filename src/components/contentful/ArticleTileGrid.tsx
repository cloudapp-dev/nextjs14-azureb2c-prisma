"use client";
import { HTMLProps } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@tremor/react";

import { ArticleTile } from "@/components/contentful/ArticleTile";
import { PageBlogPostFieldsFragment } from "@/lib/__generated/sdk";

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { getPosts } from "@/actions/getPosts";

interface ArticleTileGridProps extends HTMLProps<HTMLDivElement> {
  articles?: Array<PageBlogPostFieldsFragment | null>;
  slug: string | null | undefined;
  locale: string;
}

const NUMBER_OF_USERS_TO_FETCH = 10;

export const ArticleTileGrid = ({
  articles,
  className,
  slug,
  locale,
  ...props
}: ArticleTileGridProps) => {
  const [offset, setOffset] = useState(NUMBER_OF_USERS_TO_FETCH);
  const [posts, setPosts] = useState<any>(articles);
  const { ref, inView } = useInView();

  const loadMoreUsers = async () => {
    const apiPosts = await getPosts(
      offset,
      NUMBER_OF_USERS_TO_FETCH,
      locale || "",
      false,
      slug || ""
    );

    setPosts([...posts, ...apiPosts]);
    setOffset(offset + NUMBER_OF_USERS_TO_FETCH);
  };

  //Infinte scroll

  // useEffect(() => {
  //   if (inView) {
  //     loadMoreUsers();
  //   }
  // }, [inView]);

  return posts && posts.length > 0 ? (
    <>
      <div
        className={twMerge(
          "grid grid-cols-1 gap-y-4 gap-x-5 md:grid-cols-4 lg:gap-x-12 lg:gap-y-12",
          className
        )}
        {...props}
      >
        {posts.map((article: any, index: number) => {
          return article ? <ArticleTile key={index} article={article} /> : null;
        })}
      </div>
      {/* Infinite Scroll */}
      {/* <div ref={ref}>Loading...</div> */}
      <div className="flex flex-col items-center">
        <Button
          onClick={loadMoreUsers}
          size="lg"
          className="mt-4 sm:flex sm:max-w-md"
        >
          Load more
        </Button>
      </div>
    </>
  ) : null;
};
