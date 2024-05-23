// Purpose: Results component for displaying the results of the search
import { twMerge } from "tailwind-merge";
import Card from "@/components/search/card.component";

interface ResultsProps {
  results: any[];
}

export default function Results({ results }: ResultsProps) {
  const className = "md:grid-cols-3 lg:grid-cols-4";

  return (
    <div
      className={twMerge(
        "grid grid-cols-1 gap-y-4 gap-x-5 lg:gap-x-12 lg:gap-y-12",
        className
      )}
    >
      {results.map((result: any) => (
        <div key={result.objectID}>
          <Card key={result.objectID} result={result} />
        </div>
      ))}
    </div>
  );
}
