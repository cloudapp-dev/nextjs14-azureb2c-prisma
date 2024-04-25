import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, Document, INLINES } from "@contentful/rich-text-types";
import { ArticleImage } from "@/components/contentful/ArticleImage.component";
import { ComponentRichImage } from "@/lib/__generated/sdk";
import { CopyButton } from "@/components/contentful/ArticleCodeCopy";
import { Toc } from "@/components/contentful/ArticleToc";
import { ArticleTocItem } from "@/components/contentful/ArticleTocItem";
import { CtfPicture } from "@/components/contentful/CtfPicture.component";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export type EmbeddedEntryType = ComponentRichImage | null;

export interface ContentfulRichTextInterface {
  json: Document;
  links?:
    | {
        entries: {
          block: Array<EmbeddedEntryType>;
        };
      }
    | any;
  source: string;
}

function getFileName(text: string) {
  return text.split("#");
}

export const EmbeddedEntry = (entry: EmbeddedEntryType) => {
  switch (entry?.__typename) {
    case "ComponentRichImage":
      return <ArticleImage image={entry} />;
    default:
      return null;
  }
};

export const contentfulBaseRichTextOptions = ({
  links,
}: ContentfulRichTextInterface): Options => ({
  renderMark: {
    [MARKS.BOLD]: (text) => {
      return <b key={`${text}-key`}>{text}</b>;
    },
    [MARKS.CODE]: (text: any) => {
      let markedfilename = undefined;
      let showCodeText = text.toString() || "";
      const filename = getFileName(text.toString())[1];
      if (filename) {
        markedfilename = "#" + filename + "#";
        showCodeText = text.toString().replace(markedfilename, "");
        showCodeText = showCodeText.replace("##", "");
      }
      return (
        <pre>
          <div className="mb-3">
            {" "}
            <CopyButton text={text} />
          </div>
          <code key={`${text}-key`}>
            {markedfilename && (
              <span className="inline-block px-1 py-1 text-base text-white bg-[#3c4f6a] rounded-lg">
                {markedfilename}
              </span>
            )}
            {showCodeText}
            {/* {text.toString().replace(markedfilename, "")} */}
          </code>
        </pre>
      );
    },
    [MARKS.ITALIC]: (text) => {
      return <i key={`${text}-key`}>{text}</i>;
    },
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      if (node.data.uri.includes("https://")) {
        return (
          <a
            className="text-blue-500 underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
            href={node.data.uri}
          >
            {children}
          </a>
        );
      }

      return <Link href={node.data.uri}>{children}</Link>;
    },
    [BLOCKS.HEADING_2]: (node, children: any) => {
      return <ArticleTocItem dynamicId={children[0]} heading={children[0]} />;
    },

    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const entry = links?.entries?.block?.find(
        (item: EmbeddedEntryType) => item?.sys?.id === node.data.target.sys.id
      );

      if (!entry) return null;

      return <EmbeddedEntry {...entry} />;
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = links?.assets?.block?.find(
        (item: any) => item?.sys?.id === node.data.target.sys.id
      );
      if (!asset) return null;
      return (
        <>
          <figure>
            <div className="flex justify-center">
              <CtfPicture
                nextImageProps={{
                  className: twMerge(
                    "mt-0 mb-0 ",
                    "rounded-2xl border border-gray-300 shadow-lg"
                  ),
                }}
                {...asset}
              />
              ;
            </div>
          </figure>
        </>
      );
    },
  },
});

export const CtfRichText = ({
  json,
  links,
  source,
}: ContentfulRichTextInterface) => {
  const baseOptions = contentfulBaseRichTextOptions({ links, json, source });
  if (!json) return null; // IF there is no content, return null
  const jsoncontent: any = json.content;
  const headings: string[] = [];

  jsoncontent.map((item: any) => {
    if (item.nodeType === "heading-2") {
      const headingvalue: any = item.content[0].value;
      headings.push(headingvalue);
    }
  });
  return (
    <article className="prose prose-lg max-w-none">
      {source === "article" && <Toc headings={headings} />}
      {documentToReactComponents(json, baseOptions)}
    </article>
  );
};
