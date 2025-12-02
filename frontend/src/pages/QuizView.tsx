import React, { useState } from 'react';

const QuizView: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is React?",
      options: [
        "A JavaScript library for building user interfaces",
        "A database management system",
        "A CSS framework",
        "A programming language"
      ],
      correct: 0
    }
  ];

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        {questions.map((q, index) => (
          <div key={q.id} className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Question {index + 1}: {q.question}
            </h2>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                    selectedAnswer === optionIndex.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={optionIndex}
                    checked={selectedAnswer === optionIndex.toString()}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Quiz Completed!</h3>
            <p className="text-green-800">
              {selectedAnswer === "0" ? "Correct! React is a JavaScript library for building user interfaces." : 
               "That's not quite right. The correct answer is: React is a JavaScript library for building user interfaces."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;