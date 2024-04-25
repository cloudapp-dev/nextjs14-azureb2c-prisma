"use client";

import { useState } from "react";
import type { LocaleTypes } from "@/app/i18n/settings";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const locale = useParams()?.locale as LocaleTypes;
  const { t } = useTranslation(locale, "common");

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  };

  return (
    <div className="float-right px-2 py-1 text-base bg-gray-600 rounded">
      <button disabled={isCopied} onClick={copy}>
        {isCopied ? t("copybutton.afterclick")! : t("copybutton.beforeclick")}
      </button>
    </div>
  );
};
