import React from "react";

export default function StreakCounter({ streak = 0 }) {
  return (
    <div className="flex items-center space-x-2" aria-label="Practice Streak">
      <span className="text-2xl" role="img" aria-label="fire">🔥</span>
      <span className="font-bold text-lg">{streak} day streak</span>
    </div>
  );
}
