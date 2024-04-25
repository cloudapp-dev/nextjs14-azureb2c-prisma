"use client";

// import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useParams } from "next/navigation";
import Link from "next/link";

interface TocProps {
  headings: string[];
}

export const Toc = ({ headings }: TocProps) => {
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");
  // const [isOpen, setIsOpen] = useState(false);

  // const toggleToc = () => {
  //   setIsOpen(!isOpen);
  // };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div>
      {/* <button
        onClick={toggleToc}
        className="px-4 py-2 text-white bg-blue-500 rounded focus:outline-none"
      >
        {t("article.toc")}
      </button> */}
      {/* {isOpen && ( */}
      {/* <div className="mt-4"> */}
      <details className="mb-10 rounded-xl bg-emerald-700/10 dark:bg-white/3">
        <summary className="flex dark:text-[#FAFAFA] text-gray700 items-center px-6 py-3 text-sm tracking-wide uppercase list-none select-none opacity-60">
          {t("article.toc")}
        </summary>
        <div className="p-6 pt-0">
          <ul className="space-y-2 list-disc list-inside">
            {headings.map((heading: string, index: number) => (
              <li key={index}>
                <Link
                  className="text-base no-underline text-emerald-600 dark:text-emerald-400"
                  href={`#${heading}`}
                >
                  {heading}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </details>
      {/* )} */}
    </div>
  );
};
