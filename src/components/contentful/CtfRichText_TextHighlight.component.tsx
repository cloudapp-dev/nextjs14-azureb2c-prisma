import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, Document } from "@contentful/rich-text-types";
import { ArticleRichImage } from "@/components/contentful/ArticleRichImage";
import { ComponentRichImage } from "@/lib/__generated/sdk";
import { twMerge } from "tailwind-merge";

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
  styling?: string;
}

export const EmbeddedEntry = (entry: EmbeddedEntryType) => {
  switch (entry?.__typename) {
    case "ComponentRichImage":
      return <ArticleRichImage image={entry} />;
    default:
      return null;
  }
};

export const contentfulBaseRichTextOptions = ({
  links,
  styling,
}: ContentfulRichTextInterface): Options => ({
  renderMark: {
    [MARKS.BOLD]: (text) => {
      return <b key={`${text}-key`}>{text}</b>;
    },
    [MARKS.CODE]: (text) => {
      return (
        <pre>
          <code key={`${text}-key`}>{text}</code>
        </pre>
      );
    },
    [MARKS.ITALIC]: (text) => {
      return <i key={`${text}-key`}>{text}</i>;
    },
  },
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children: any) => {
      let cssstyling = "";
      if (styling) {
        cssstyling = styling;
      } else {
        cssstyling =
          "text-4xl leading-tight sm:text-5xl sm:font-light sm:leading-[1.50] sm:tracking-widest";
      }
      return (
        <div className={cssstyling}>
          <h1 className="inline-block mb-6 text-3xl align-top md:text-5xl decoration-inherit">
            {children[0]}
            <br className="hidden lg:inline-block" />
          </h1>
        </div>
      );
    },
    [BLOCKS.HEADING_2]: (node, children: any) => {
      let cssstyling = "";
      if (styling) {
        cssstyling = styling;
      } else {
        cssstyling =
          "text-4xl leading-tight sm:text-5xl sm:font-light sm:leading-[1.25] sm:tracking-widest";
      }
      return (
        <div className={cssstyling}>
          <span className="inline-block align-top decoration-inherit">
            {children[0]}
            <br className="hidden lg:inline-block" />
          </span>
        </div>
      );
      // return <ArticleTocItem dynamicId={children[0]} heading={children[0]} />;
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      // const entry = entryBlockMap.get(node.data.target.sys.id);
      const entry = links?.entries?.block?.find(
        (item: EmbeddedEntryType) => item?.sys?.id === node.data.target.sys.id
      );

      if (!entry) return null;

      return <EmbeddedEntry {...entry} />;
    },
  },
});

export const CtfRichText_TextHighlight = ({
  json,
  links,
  styling,
}: ContentfulRichTextInterface) => {
  const baseOptions = contentfulBaseRichTextOptions({ links, json, styling });

  return <>{documentToReactComponents(json, baseOptions)}</>;
};
