// components/tools/wordcount.component.tsx
"use client";
import React, { useState } from "react";

const WordCount: React.FC = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setText(inputText);
    const count = inputText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = inputText.length;
    const digits = inputText.trim().match(/[^ ]/g); // Exclude spaces
    const digitCount = digits?.length || 0;

    setWordCount(count);
    setCharCount(digitCount);
  };

  return (
    <div className="max-w-md mt-4">
      <h2 className="text-2xl font-bold mb-4">Word Count Service</h2>
      <textarea
        className="w-full p-2 border text-base rounded mb-4"
        rows={10}
        value={text}
        onChange={handleChange}
        placeholder="Type or paste your text here..."
      ></textarea>
      <div className="text-lg">
        Word Count: <span className="font-semibold">{wordCount}</span> - Char
        Count without Spaces: <span className="font-semibold">{charCount}</span>
      </div>
    </div>
  );
};

export default WordCount;
