"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import NameInput from '../../components/NameInput'

function Game() {

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [userName, setUserName] = useState(null);

  const pointsByDifficulty = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const easyResponse = await axios.get(
          'https://opentdb.com/api.php?amount=4&difficulty=easy&type=multiple&encode=base64'
        );
        const easyQuestions = easyResponse.data.results.map(decodeQuestions);

        const mediumResponse = await axios.get(
          'https://opentdb.com/api.php?amount=4&difficulty=medium&type=multiple&encode=base64'
        );
        const mediumQuestions = mediumResponse.data.results.map(decodeQuestions);

        const hardResponse = await axios.get(
          'https://opentdb.com/api.php?amount=2&difficulty=hard&type=multiple&encode=base64'
        );
        const hardQuestions = hardResponse.data.results.map(decodeQuestions);

        const allQuestions = easyQuestions.concat(mediumQuestions, hardQuestions);
        setQuestions(allQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    fetchQuestions();
  }, []);

  const decodeQuestions = (question) => {
    return {
      ...question,
      category: atob(question.category),
      type: atob(question.type),
      difficulty: atob(question.difficulty),
      question: atob(question.question),
      incorrect_answers: question.incorrect_answers.map((answer) => atob(answer)),
      correct_answer: atob(question.correct_answer),
    };
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (selectedAnswer) => {
    if (userAnswer !== null) {
      return;
    }

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const difficulty = questions[currentIndex].difficulty;

    setUserAnswer(selectedAnswer);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      setPoints((prevPoints) => prevPoints + pointsByDifficulty[difficulty]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setUserAnswer(null);
      setIsAnswerCorrect(null);
      setShuffledAnswers(
        shuffleArray([
          ...questions[currentIndex + 1].incorrect_answers,
          questions[currentIndex + 1].correct_answer,
        ])
      );
    } else {
      setIsGameOver(true);
    }
  };

  const handleKeyPress = (event) => {
    if (!isGameOver && event.key >= '1' && event.key <= '4') {
      const selectedAnswer = shuffledAnswers[Number(event.key) - 1];
      handleAnswer(selectedAnswer);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledAnswers(
        shuffleArray([
          ...questions[currentIndex].incorrect_answers,
          questions[currentIndex].correct_answer,
        ])
      );
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, shuffledAnswers]);

  const saveUserData = () => {
    const userData = {
      name: userName,
      points,
      date: new Date().toLocaleDateString(),
    };

    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardData.push(userData);

    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
  };

  useEffect(() => {
    if (isGameOver) {
      saveUserData();
    }
  }, [isGameOver]);

  const handleStartGame = (name) => {
    setUserName(name);
  };


  return (
    <div className="h-screen bg-indigo-900 flex items-center justify-center">
      {userName ? (
      
      <div>
        {isLoading ? (
          <CircularProgress color="primary" size={80} />
        ) : (
          <div className="max-w-lg w-full p-8 bg-white rounded shadow-md">
            {isGameOver ? (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">Game Over!</h1>
                <p className="text-lg text-gray-600">Your final score: {points}</p>
                <Link href="/leaderboard">
                  <button className="m-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Leaderboard
                  </button>
                </Link>
                <Link href="/">
                  <button className="m-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Back to Menu
                  </button>
                </Link>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Your points: {points}</h1>
                <h2 className="text-lg text-gray-600 mb-2">Difficulty: {questions[currentIndex].difficulty}</h2>
                <p className="text-lg text-gray-800 mb-4">{questions[currentIndex].question}</p>
                <div className="grid grid-cols-2 gap-4">
                  {shuffledAnswers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(answer)}
                      className={`${
                        userAnswer !== null
                          ? answer === questions[currentIndex].correct_answer
                            ? 'bg-green-500'
                            : 'bg-red-500'
                          : 'bg-blue-500'
                      } text-white px-4 py-2 rounded`}
                      disabled={userAnswer !== null}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
                {userAnswer && (
                  <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      ) : (
        // Render the NameInput component when userName is not set
        <NameInput onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default Game;