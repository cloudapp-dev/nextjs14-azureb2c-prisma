"use client";
import { useState, useEffect } from "react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface ClapButtonProps {
  slug: string | undefined;
}

export default function ClapButton({ slug }: ClapButtonProps) {
  const [claps, setClaps] = useState<number>(0);

  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const { data: session } = useSession();
  const disabled = !session;

  useEffect(() => {
    const fetchClaps = async () => {
      const res = await fetch(`/api/claps?slug=${slug}`);
      const data = await res.json();
      setClaps(data.claps);
    };

    fetchClaps();
  }, [slug]);

  const handleClap = async () => {
    const res = await fetch("/api/claps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    setClaps(data.claps);
  };

  return (
    <div>
      {(session && (
        <div className="pb-4 text-base">{t("claps.clapText")}</div>
      )) || <div className="pb-4 text-base">{t("claps.clapLogin")}</div>}
      {/* <div className="pb-4 text-base">{t("clapButton")}</div> */}
      <button
        disabled={disabled}
        className="text-2xl p-2 dark:bg-gray-500 rounded-lg dark:text-white bg-gray-200 text-gray-600 w-20"
        onClick={handleClap}
      >
        👏 {claps}
      </button>
    </div>
  );
}
