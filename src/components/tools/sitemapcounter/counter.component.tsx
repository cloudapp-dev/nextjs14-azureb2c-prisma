"use client";
import { useState } from "react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { Button } from "@tremor/react";

export default function Sitemapcounter() {
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");
  const [url, setUrl] = useState<string>("");
  const [entries, setEntries] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch(
        `/api/sitemapcounter?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries);
        setError(null);
      } else {
        setError(data.error);
        setEntries(null);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setEntries(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Sitemap Entry Counter</h2>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full h-10 max-w-md border border-gray-200 rounded-md pl-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
        placeholder={t("sitemapcounter.placeholder")}
        spellCheck={false}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button
        size="lg"
        variant="primary"
        className="mt-4 sm:flex sm:max-w-md"
        onClick={fetchEntries}
      >
        Count Entries
      </Button>

      {entries !== null && <p>Number of entries: {entries}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
