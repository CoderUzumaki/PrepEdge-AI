import React from "react";

export default function Leaderboard({ users = [] }) {
  if (!users.length) return null;
  return (
    <div className="my-4" aria-label="Leaderboard">
      <h3 className="font-bold text-lg mb-2">🏆 Leaderboard</h3>
      <ol className="list-decimal pl-5">
        {users.map((user, idx) => (
          <li key={user.id || idx} className="mb-1 flex items-center gap-2">
            <span className="font-semibold">{user.name}</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{user.leaderboardPoints} pts</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
