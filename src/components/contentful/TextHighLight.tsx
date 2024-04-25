import { CtfRichText_TextHighlight } from "@/components/contentful/CtfRichText_TextHighlight.component";
import { TextHighlightFieldsFragment } from "@/lib/__generated/sdk";

interface TextHighlightContentProps {
  headings: TextHighlightFieldsFragment;
}

export const TextHighLight = ({ headings }: TextHighlightContentProps) => {
  if (!headings) return null;
  const { content, styling } = headings;

  return (
    <CtfRichText_TextHighlight
      json={content?.json}
      links={content?.links}
      styling={styling || ""}
    />
  );
};
