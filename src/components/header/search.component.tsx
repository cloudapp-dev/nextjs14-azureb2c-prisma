"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";

export default function SearchBar({
  searchCta,
  searchPlaceholder,
}: {
  searchCta: string;
  searchPlaceholder: string;
}) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const path = usePathname();
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const pathWithoutQuery = path.split("?")[0];
  let pathArray = pathWithoutQuery.split("/");
  pathArray.shift();
  pathArray = pathArray.filter((path) => path !== "");

  // console.log("path", pathArray[0]);

  // if the path is searchalgolia, don't show the search bar
  if (pathArray[0] === "searchalgolia") {
    return null;
  }

  function handleSubmit(e: any) {
    e.preventDefault(); // prevent page refresh
    if (!search) return; //
    router.push(`/${locale}/search/${search}`); // push to the search page
  }

  return (
    <div className="mb-1 bg-gray-100 rounded-sm shadow-md dark:bg-gray-800">
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          {t("search.button")}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            //   type="text"
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-base text-gray-900 border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("search.searchPlaceholder")}
            // {searchPlaceholder ? searchPlaceholder : "Search keywords..."}
            required
          />
          <button
            disabled={!search} // disable the button if there is no search
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {t("search.button")}
            {/* {searchCta ? searchCta : Search} */}
          </button>
        </div>
      </form>
    </div>
  );
}
