import { CtfRichText } from "@/components/contentful/CtfRichText.component";
import { PageLandingFieldsFragment } from "@/lib/__generated/sdk";

interface LandingContentProps {
  landing: PageLandingFieldsFragment;
}
export const LandingContent = ({ landing }: LandingContentProps) => {
  const { content } = landing;

  return (
    <CtfRichText json={content?.json} links={content?.links} source="landing" />
  );
};
