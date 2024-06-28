"use client";
// Social Sharing
import { TwitterShare } from "react-share-lite";
import { FacebookShare } from "react-share-lite";
import { LinkedinShare } from "react-share-lite";
import { WhatsappShare } from "react-share-lite";

interface ShareProps {
  title: string;
  slug: string;
  hashtags?: string;
  locale: string;
}

export default function SocialSharingLite({
  title,
  slug,
  hashtags,
  locale,
}: ShareProps) {
  return (
    <div className="flex justify-center">
      <TwitterShare url={locale + "/" + slug || ""} title={title || ""} />
      <FacebookShare
        url={locale + "/" + slug || ""}
        quote={title || ""}
        hashtag={"#react-share-kit"}
      />
      <LinkedinShare url={locale + "/" + slug || ""} />
      <WhatsappShare
        url={locale + "/" + slug || ""}
        title={title || ""}
        separator=":: "
      />
    </div>
  );
}
