import React from "react";

export default function ConfidenceHeatmap({ analyzedWords }) {
  if (!analyzedWords || analyzedWords.length === 0) return null;

  const getColor = (label) => {
    switch (label) {
      case "filler":
        return "bg-red-200 text-red-900";
      case "pause":
        return "bg-yellow-200 text-yellow-900";
      case "low-confidence":
        return "bg-purple-200 text-purple-900";
      default:
        return "bg-green-100 text-green-900";
    }
  };

  return (
    <div className="flex flex-wrap mt-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
      {analyzedWords.map((item, index) => (
        <span
          key={index}
          className={`px-2 py-1 m-1 rounded text-sm cursor-help ${getColor(item.label)}`}
          title={item.tooltip || ""}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}
