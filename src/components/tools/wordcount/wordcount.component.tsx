// components/tools/wordcount.component.tsx
"use client";
import React, { useState } from "react";

const WordCount: React.FC = () => {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setText(inputText);
    const count = inputText.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);
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
        Word Count: <span className="font-semibold">{wordCount}</span>
      </div>
    </div>
  );
};

export default WordCount;
