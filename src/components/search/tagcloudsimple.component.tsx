"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Tag {
  value: string;
  count: number;
  class: string;
}

interface TagParams {
  datanew: any;
  minSize: number;
  maxSize: number;
  locale: string;
}

const colors = [
  { bg: "bg-blue-600", text: "text-blue-800", dark: "dark:bg-blue-200" },
  { bg: "bg-yellow-600", text: "text-yellow-800", dark: "dark:bg-yellow-200" },
  {
    bg: "bg-emerald-600",
    text: "text-emerald-800",
    dark: "dark:bg-emerald-200",
  },
  { bg: "bg-indigo-600", text: "text-indigo-800", dark: "dark:bg-indigo-200" },
  { bg: "bg-purple-600", text: "text-purple-800", dark: "dark:bg-purple-200" },
  { bg: "bg-orange-600", text: "text-orange-800", dark: "dark:bg-orange-200" },
  { bg: "bg-pink-600", text: "text-pink-800", dark: "dark:bg-pink-200" },
];

const TagCloudSimple = ({ datanew, minSize, maxSize, locale }: TagParams) => {
  const [tagcomplete, setTagcomplete] = useState<Tag[]>([]);

  const randomColor = () => {
    let randomData = "";
    let randomNr = Math.floor(Math.random() * colors.length);
    // console.log("randomNr", randomNr);
    randomData = twMerge(
      `px-3 py-2 transition rounded-full bg-opacity-50 hover:bg-opacity-30 hover:underline`,
      colors[randomNr].bg,
      colors[randomNr].text,
      colors[randomNr].dark
    );

    return randomData;
  };

  useEffect(() => {
    let ignore = false;
    const tagcompletenew: any = [];

    const createTagArray = () => {
      datanew.forEach((datatag: Tag) => {
        tagcompletenew.push({
          value: datatag.value,
          count: datatag.count,
          class: randomColor(),
        });
      });

      if (process.env.NEXTAUTH_URL === "http://localhost:3000") {
        if (!ignore) setTagcomplete(tagcompletenew);
      } else {
        setTagcomplete(tagcompletenew);
      }
    };

    createTagArray();

    // Since React 18 and with reactStrictMode: true, useEffect will be called twice. reactStrictMode: false will call useEffect once.
    // reactStrictMode: true is the default setting and the setting is done in the next.config.js file.
    // On production, reactStrictMode: false will not be used.
  }, [datanew]);

  // used on search page

  return (
    <>
      <h2 className="flex items-center justify-center mb-4">TagCloud</h2>

      <div className="flex flex-wrap justify-center max-w-2xl gap-2 mx-auto">
        {tagcomplete.map((tag: Tag, index: number) => (
          <Link
            key={index}
            className={tag.class}
            href={`/${locale}/search/${tag.value}`}
          >
            <span className="font-medium capitalize">
              {tag.value}
              <span className="p-1 ml-2 text-white bg-gray-400 rounded-2xl">
                {tag.count}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default TagCloudSimple;
