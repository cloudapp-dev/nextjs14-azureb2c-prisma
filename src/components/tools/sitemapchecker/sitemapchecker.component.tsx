"use client";
import { useState } from "react";
import { Button } from "@tremor/react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

const SitemapChecker: React.FC = () => {
  const [brokenLinks, setBrokenLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string>("");

  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const checkLinks = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/sitemaplinkcheck?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      if (res.ok) {
        setBrokenLinks(data.entries);
      } else {
        setBrokenLinks(data.error);
      }
    } catch (err) {
      console.error("An unexpected error occurred", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-md mt-4">
      <h2 className="text-2xl font-bold mb-4">Broken Link Checker</h2>
      <input
        type="text"
        value={url}
        name="search"
        id="search"
        className="block w-full h-10 max-w-md border border-gray-200 rounded-md pl-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
        placeholder={t("sitemapcounter.placeholder")}
        spellCheck={false}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        size="lg"
        className="mt-4 sm:flex sm:max-w-md"
        onClick={checkLinks}
        disabled={!url}
      >
        {loading ? "Checking..." : "Check Links"}
      </Button>
      {brokenLinks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Broken Links:</h3>
          <ul className="list-disc list-inside">
            {brokenLinks.map((link, index) => (
              <li key={index} className="text-red-500">
                {link}
              </li>
            ))}
          </ul>
        </div>
      )}

      {brokenLinks.length === 0 && url !== "" && !loading && (
        <p className="mt-4 text-green-500">No broken links found!</p>
      )}
    </div>
  );
};

export default SitemapChecker;
