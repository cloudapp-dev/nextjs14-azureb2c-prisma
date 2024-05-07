import { CtfRichText } from "@/components/contentful/CtfRichText.component";
import { TagPageFieldsFragment } from "@/lib/__generated/sdk";

interface TagPageContentProps {
  landing: TagPageFieldsFragment;
}
export const TagPageContent = ({ landing }: TagPageContentProps) => {
  const { content } = landing;

  return (
    <CtfRichText json={content?.json} links={content?.links} source="article" />
  );
};
