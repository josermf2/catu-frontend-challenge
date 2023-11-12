"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState();

  useEffect(() => {
    const dataFromLocalStorage = JSON.parse(localStorage.getItem('leaderboard'));

    if (dataFromLocalStorage) {
      const sortedData = dataFromLocalStorage.sort((a, b) => {
        if (a.points !== b.points) {
          return b.points - a.points; // Sort by points in descending order
        }
        return new Date(a.date) - new Date(b.date);
      });

      setLeaderboardData(sortedData);
    }
  }, []);

  return (
    <div className="h-screen bg-indigo-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>
      <ul className="list-none p-0">
        {leaderboardData &&
          leaderboardData.map((user, index) => (
            <li key={index} className="text-lg mb-2">
              {user.name} - {user.points} points - {user.date}
            </li>
          ))}
      </ul>
      <Link href="/">
        <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
          Go Back to Menu
        </button>
      </Link>
    </div>
  );
}

export default Leaderboard;
