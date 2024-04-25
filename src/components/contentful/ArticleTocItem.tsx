interface ArticleTocItemProps {
  dynamicId: string;
  heading: string;
}

export const ArticleTocItem: React.FC<ArticleTocItemProps> = ({
  dynamicId,
  heading,
}) => {
  return (
    <h2 id={dynamicId} className="text-2xl font-semibold dark:text-white">
      {heading}
    </h2>
  );
};
