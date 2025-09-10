import React from "react";

export default function BookmarkButton({ bookmarked, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove Bookmark" : "Add Bookmark"}
      className={`p-2 rounded-full border transition-colors ${bookmarked ? "bg-yellow-300 text-yellow-900" : "bg-gray-200 text-gray-600 hover:bg-yellow-100"}`}
    >
      {bookmarked ? "★" : "☆"}
    </button>
  );
}
