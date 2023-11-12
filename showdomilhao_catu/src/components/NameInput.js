import React, { useState } from 'react';

function NameInput({ onStartGame }) {
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleStartGame = () => {
    if (name.trim() === '') {
      alert('Please enter your name before starting the game.');
    } else {
      onStartGame(name);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleStartGame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-900 text-white">
      <label htmlFor="name" className="mb-4 text-2xl">
        Enter Your Name:
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} 
        className="mb-4 px-4 py-2 border border-white rounded focus:outline-none focus:border-blue-500 text-black"
      />
      <button
        onClick={handleStartGame}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Start Game
      </button>
    </div>
  );
}

export default NameInput;
