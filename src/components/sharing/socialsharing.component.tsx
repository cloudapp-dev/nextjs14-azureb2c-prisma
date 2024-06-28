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
      <TwitterShare
        url={locale + "/" + slug || ""}
        title={title || ""}
        size={44}
      />
      <FacebookShare
        url={locale + "/" + slug || ""}
        quote={title || ""}
        hashtag={"#react-share-kit"}
        size={44}
      />
      <FacebookCount url={locale + "/" + slug || ""} appId="" appSecret="" />
      <LinkedinShare url={locale + "/" + slug || ""} size={44} />
      <WhatsappShare
        url={locale + "/" + slug || ""}
        title={title || ""}
        separator=":: "
        size={44}
      />
    </div>
  );
}
