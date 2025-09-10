import React from "react";

export default function TagFilter({ tags = [], selected = [], onChange }) {
  return (
    <div className="flex flex-wrap gap-2 my-2" aria-label="Tag Filter">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${selected.includes(tag) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
          onClick={() => onChange(tag)}
          aria-pressed={selected.includes(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
