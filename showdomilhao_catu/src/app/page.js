import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-row items-center justify-center space-x-32 h-screen bg-indigo-900">
      <div className="flex flex-col items-center justify-center space-y-8">
        <Image src="/logo.png" width="200" height="97" alt="Logo" />

        <Link href="/game">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300">
            NEW GAME
          </button>
        </Link>

        <Link href="/leaderboard">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 mt-4">
            LEADERBOARD
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
