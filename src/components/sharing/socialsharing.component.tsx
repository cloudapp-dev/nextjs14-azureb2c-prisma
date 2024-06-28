"use client";
// Social Sharing
import { TwitterShare } from "react-share-kit";
import { FacebookShare, FacebookCount } from "react-share-kit";
import { LinkedinShare } from "react-share-kit";
import { WhatsappShare } from "react-share-kit";

interface ShareProps {
  title: string;
  slug: string;
  hashtags?: string;
  locale: string;
}

export default function SocialSharing({
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
      <FacebookCount url={locale + "/" + slug || ""} appId="" appSecret="" />
      <LinkedinShare url={locale + "/" + slug || ""} />
      <WhatsappShare
        url={locale + "/" + slug || ""}
        title={title || ""}
        separator=":: "
      />
    </div>
  );
}
