// components/slugify/slugify.component.tsx
"use client";
import React, { useState } from "react";

// Utility function to slugify a string
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

const Slugify: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [slugifiedText, setSlugifiedText] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);
    setSlugifiedText(slugify(text));
    setCopySuccess(""); // Reset copy success message on input change
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(slugifiedText);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Slugify String</h2>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        className="block w-full  max-w-md h-10 border border-gray-200 rounded-md pl-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
        placeholder="Enter text to slugify"
      />
      <div className="p-4 border border-gray-300 rounded w-full max-w-md mb-6">
        <p className="text-lg font-semibold">Slugified Text:</p>
        <p className="text-black">{slugifiedText}</p>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy
        </button>
        {copySuccess && <p className="text-green-500 mt-2">{copySuccess}</p>}
      </div>
    </div>
  );
};

export default Slugify;
