import Link from "next/link";
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
  source: string;
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

export const TagCloudSimpleHome = ({
  datanew,
  minSize,
  maxSize,
  locale,
  source,
}: TagParams) => {
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

  const tagcompletenew: any = [];

  const createTagArray = () => {
    datanew.forEach((datatag: Tag, index: number) => {
      if (index >= 10) {
        return;
      }
      tagcompletenew.push({
        value: datatag.value,
        count: datatag.count,
        class: randomColor(),
      });
    });
  };

  createTagArray();

  const urlsegment = source === "tags" ? "tags" : "search";

  return (
    <>
      <div className="flex flex-wrap justify-center max-w-2xl gap-2 mx-auto">
        {tagcompletenew.map((tag: Tag, index: number) => (
          <Link
            key={index}
            className={tag.class}
            href={`/${locale}/${urlsegment}/${tag.value}`}
          >
            {source === "tags" && (
              <span className="font-medium capitalize">{tag.count}</span>
            )}

            {source !== "tags" && (
              <span className="font-medium capitalize">{tag.value}</span>
            )}
          </Link>
        ))}
      </div>
    </>
  );
};
