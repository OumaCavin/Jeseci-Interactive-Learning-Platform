import React, { useState } from 'react';
import Button from './Button';
import Modal from './Modal';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, answers: number[]) => void;
  title?: string;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, title = 'Quiz' }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correct ? 1 : 0);
    }, 0);
    onComplete(score, selectedAnswers);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setShowExplanation(false);
  };

  const currentQ = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== -1;
  const allAnswered = selectedAnswers.every(answer => answer !== -1);
  const score = selectedAnswers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correct ? 1 : 0);
  }, 0);

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={index}
                  checked={selectedAnswers[currentQuestion] === index}
                  onChange={() => handleAnswerSelect(index)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="space-x-3">
            {currentQuestion === questions.length - 1 && allAnswered && (
              <Button
                variant="success"
                onClick={() => setShowExplanation(true)}
              >
                View Results
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <Modal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        title="Quiz Results"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {score}/{questions.length}
            </div>
            <div className="text-gray-600">
              {Math.round((score / questions.length) * 100)}% Correct
            </div>
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;
              
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{question.question}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium">Your answer: </span>
                      <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                        {question.options[userAnswer]}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div>
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-700">
                          {question.options[question.correct]}
                        </span>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-gray-700">
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowExplanation(false)}>
              Close
            </Button>
            <Button onClick={resetQuiz}>
              Retake Quiz
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Quiz;