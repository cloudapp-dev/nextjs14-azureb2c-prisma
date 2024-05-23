"use client";

import Image from "next/image";
import Link from "next/link";
import { FormatDate } from "@/components/contentful/format-date/FormatDate";
import { useParams } from "next/navigation";
import type { LocaleTypes } from "@/app/i18n/settings";
import { twMerge } from "tailwind-merge";
import { ArticleLabel } from "@/components/contentful/ArticleLabel";

interface CardProps {
  result: {
    intName: string;
    image: string;
    pubdate: Date;
    slug: string;
    width: number;
    height: number;
    tags: string[];
    lang: {
      title: string;
      content: string;
      shortDescription: string;
    };
  };
}

interface LangProps {
  title: string;
  content: string;
  shortDescription: string;
}

export default function Card({ result }: CardProps) {
  // cursor-pointer = when you hover over the image, it will show a pointer
  const locale = useParams()?.locale as LocaleTypes;
  // const resultarray:Array<> = Object.entries(result.lang);
  const langresult = JSON.parse(
    JSON.stringify(Object.entries(result.lang)[0][1])
  ) as LangProps;

  const className = "md:grid-cols-2 lg:grid-cols-3";
  const classNameImage = "object-cover aspect-[16/10] w-full";

  const blurURL = new URL(result.image);
  blurURL.searchParams.set("w", "10");

  return (
    // {/* group - wird benötigt damit man unten im Classname darauf verweisen kann mit group-hover:.... */}
    <div className="flex flex-col">
      <div
        className={twMerge(
          "flex flex-1 flex-col overflow-hidden dark:shadow-white shadow-lg dark:shadow-sm-light",
          className
        )}
      >
        <Link href={`/${locale}/${result.slug}`}>
          <Image
            src={result.image}
            width={result.width || 722}
            height={result.height || 590}
            sizes="(max-width: 1200px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blurURL.toString()}
            alt={langresult.title || ""}
            className={twMerge(classNameImage, "transition-all")}
          ></Image>
        </Link>
        <div className="flex flex-col flex-1 px-4 py-3 dark:bg-gray-800 md:px-5 md:py-4 lg:px-7 lg:py-5">
          {/* <div className="flex flex-col flex-1 px-4 py-3 md:px-5 md:py-4 lg:px-7 lg:py-5"> */}
          {langresult.title && (
            <Link href={`/${locale}/${result.slug}`}>
              <p className="mb-2 h3 line-clamp-2 text-gray-800 dark:text-[#AEC1CC] md:mb-3">
                {/* <p className="mb-2 line-clamp-2 h3 text-gray-800 md:mb-3"> */}
                {langresult.title}
              </p>
            </Link>
          )}
          {langresult.shortDescription && (
            <p className="mt-2 text-base line-clamp-2">
              {langresult.shortDescription}
            </p>
          )}

          {/* <div className="grid sgrid-cols-1 gap-y-1 gap-x-1 md:grid-cols-2 lg:gap-x-1 lg:gap-y-1"> */}
          {/* <div className="flex mt-auto items-center"> */}
          <div className="flex flex-wrap max-w-2xl gap-2 mr-auto">
            {/* <div className="flex mt-2 mr-auto"> */}
            {result.tags.map((tag: string, index) => (
              <Link href={`/${locale}/search/${tag}`} key={index}>
                <ArticleLabel className="flex items-center ml-1">
                  {tag}
                </ArticleLabel>
              </Link>
            ))}
            <div className={twMerge("ml-auto pl-2 text-xs text-gray-600")}>
              <FormatDate date={result.pubdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
