import React from "react";

export default function Badges({ badges = [] }) {
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-2 my-2" aria-label="User Badges">
      {badges.map((badge, idx) => (
        <span key={idx} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold" role="img" aria-label={badge}>
          {badge}
        </span>
      ))}
    </div>
  );
}
