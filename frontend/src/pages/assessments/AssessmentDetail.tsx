import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assessmentStore } from '../../stores/assessmentStore';
import { assessmentService } from '../../services/assessmentService';

// Types
interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'code_completion' | 'jac_specific';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
  jac_concept?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  learning_path?: string;
  module?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit?: number; // in minutes
  max_attempts: number;
  passing_score: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

interface QuizResult {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTaken: number; // in minutes
  answers: { [questionId: string]: string | string[] };
  feedback: string;
  detailedResults: {
    questionId: string;
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    points: number;
    explanation?: string;
  }[];
}

const AssessmentDetail: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: Set<number> }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<any>(null);

  // Store integration
  const { quizzes, loading: storeLoading, fetchQuizzes } = assessmentStore();

  useEffect(() => {
    // Initialize store data if needed
    if (!quizzes.length) {
      fetchQuizzes();
    }
    
    // Load assessment data
    if (quizId) {
      loadAssessmentData();
    }
  }, [quizId]);

  const loadAssessmentData = async () => {
    if (!quizId) {
      setError('Quiz ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get quiz data from our assessmentService
      const quizData = await assessmentService.getQuizzes();
      const foundQuiz = quizData.find(q => q.id === quizId);
      
      if (!foundQuiz) {
        throw new Error('Quiz not found');
      }

      // Generate mock questions for demonstration
      const questions = generateMockQuestions(quizId);
      
      const transformedQuiz: Quiz = {
        id: foundQuiz.id,
        title: foundQuiz.title,
        description: foundQuiz.description,
        learning_path: foundQuiz.learning_path,
        module: foundQuiz.module,
        difficulty: foundQuiz.difficulty,
        time_limit: foundQuiz.duration <= 60 ? Math.ceil(foundQuiz.duration / 10) : undefined, // Convert to reasonable time limit
        max_attempts: foundQuiz.max_attempts,
        passing_score: foundQuiz.passing_score,
        created_at: foundQuiz.created_at,
        updated_at: foundQuiz.created_at,
        questions
      };

      setQuiz(transformedQuiz);

      // Initialize timer if quiz has time limit
      if (transformedQuiz.time_limit && !showResults) {
        setTimeRemaining(transformedQuiz.time_limit * 60); // Convert to seconds
        setIsTimerActive(true);
      }

      // Start a new attempt
      try {
        const attemptData = await assessmentService.startQuizAttempt(quizId);
        setCurrentAttempt(attemptData);
      } catch (attemptError) {
        console.warn('Failed to start attempt:', attemptError);
        // Continue without attempt for now
      }
      
    } catch (error: any) {
      console.error('Failed to load assessment:', error);
      setError(error.message || 'Failed to load assessment');
      toast.error('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (quizId: string): Question[] => {
    const questionTemplates = {
      'q1': [
        {
          id: 'q1-1',
          type: 'multiple_choice' as const,
          question: 'What is the main purpose of the JAC (JavaScript Advanced Concepts) programming language?',
          options: [
            'Backend server development',
            'Frontend web development', 
            'Mobile app development',
            'Desktop application development'
          ],
          correct_answer: 'Backend server development',
          explanation: 'JAC is specifically designed for backend server development with enhanced JavaScript features.',
          jac_concept: 'jac_introduction',
          difficulty: 2 as const,
          points: 5
        },
        {
          id: 'q1-2',
          type: 'short_answer' as const,
          question: 'Briefly explain what makes JAC different from regular JavaScript.',
          correct_answer: 'Enhanced server-side features with advanced async/await patterns',
          explanation: 'JAC extends JavaScript with enhanced server-side capabilities and improved async patterns.',
          jac_concept: 'jac_differences',
          difficulty: 3 as const,
          points: 10
        },
        {
          id: 'q1-3',
          type: 'code_completion' as const,
          question: 'Complete this JAC function to handle async database operations:',
          correct_answer: `async function getUser(id) {
  return await database.query('SELECT * FROM users WHERE id = ?', [id]);
}`,
          explanation: 'JAC uses enhanced async/await syntax for database operations.',
          jac_concept: 'async_patterns',
          difficulty: 4 as const,
          points: 15
        }
      ],
      'q2': [
        {
          id: 'q2-1',
          type: 'multiple_choice' as const,
          question: 'Which HTTP status code indicates a successful request in JAC?',
          options: ['200', '404', '500', '301'],
          correct_answer: '200',
          explanation: 'HTTP 200 is the standard success response code.',
          jac_concept: 'http_status',
          difficulty: 1 as const,
          points: 3
        },
        {
          id: 'q2-2',
          type: 'true_false' as const,
          question: 'JAC automatically handles CORS issues without additional configuration.',
          correct_answer: 'true',
          explanation: 'JAC has built-in CORS handling for seamless frontend integration.',
          jac_concept: 'cors_handling',
          difficulty: 2 as const,
          points: 5
        }
      ],
      'default': [
        {
          id: 'def-1',
          type: 'multiple_choice' as const,
          question: 'What is the primary benefit of using JAC for web development?',
          options: [
            'Faster development cycles',
            'Better performance',
            'Easier debugging',
            'All of the above'
          ],
          correct_answer: 'All of the above',
          explanation: 'JAC provides comprehensive benefits across all aspects of web development.',
          jac_concept: 'jac_benefits',
          difficulty: 2 as const,
          points: 8
        }
      ]
    };

    return questionTemplates[quizId as keyof typeof questionTemplates] || questionTemplates.default;
  };

  useEffect(() => {
    // Timer countdown
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            setIsTimerActive(false);
            if (currentAttempt) {
              handleSubmitQuiz();
            }
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, currentAttempt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const handleAnswerChange = useCallback((questionId: string, value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const handleMultipleChoiceChange = useCallback((questionId: string, optionIndex: number) => {
    setSelectedOptions(prev => {
      const current = prev[questionId] || new Set<number>();
      const newSet = new Set(current);
      
      if (newSet.has(optionIndex)) {
        newSet.delete(optionIndex);
      } else {
        newSet.add(optionIndex);
      }
      
      return {
        ...prev,
        [questionId]: newSet
      };
    });

    // Convert Set to Array for storage
    const selected = selectedOptions[questionId] || new Set<number>();
    const values = Array.from(selected).map(i => quiz?.questions.find(q => q.id === questionId)?.options?.[i] || '');
    handleAnswerChange(questionId, values);
  }, [selectedOptions, quiz?.questions, handleAnswerChange]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, quiz?.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleSubmitQuiz = async () => {
    if (!currentAttempt || !quiz) {
      toast.error('No active attempt found');
      return;
    }

    setIsSubmitting(true);
    setIsTimerActive(false);

    try {
      // Calculate mock results
      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      let earnedPoints = 0;

      quiz.questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer) {
          // Simple scoring logic for demo
          if (Array.isArray(userAnswer) && Array.isArray(question.correct_answer)) {
            const correctCount = userAnswer.filter(ans => question.correct_answer.includes(ans)).length;
            earnedPoints += (correctCount / question.correct_answer.length) * question.points;
          } else if (userAnswer === question.correct_answer) {
            earnedPoints += question.points;
          } else if (typeof question.correct_answer === 'string' && typeof userAnswer === 'string') {
            // Partial credit for short answers
            const similarity = calculateStringSimilarity(userAnswer.toLowerCase(), question.correct_answer.toLowerCase());
            earnedPoints += similarity * question.points;
          }
        }
      });

      const percentage = Math.round((earnedPoints / totalPoints) * 100);
      const passed = percentage >= quiz.passing_score;

      // Generate detailed results
      const detailedResults = quiz.questions.map(question => {
        const userAnswer = answers[question.id];
        let isCorrect = false;
        let points = 0;

        if (userAnswer) {
          if (Array.isArray(userAnswer) && Array.isArray(question.correct_answer)) {
            const correctCount = userAnswer.filter(ans => question.correct_answer.includes(ans)).length;
            isCorrect = correctCount === question.correct_answer.length;
            points = (correctCount / question.correct_answer.length) * question.points;
          } else if (userAnswer === question.correct_answer) {
            isCorrect = true;
            points = question.points;
          } else if (typeof question.correct_answer === 'string' && typeof userAnswer === 'string') {
            const similarity = calculateStringSimilarity(userAnswer.toLowerCase(), question.correct_answer.toLowerCase());
            points = similarity * question.points;
            isCorrect = similarity > 0.8;
          }
        }

        return {
          questionId: question.id,
          userAnswer: userAnswer || '',
          correctAnswer: question.correct_answer,
          isCorrect,
          points: Math.round(points),
          explanation: question.explanation
        };
      });

      const timeTaken = timeRemaining ? (quiz.time_limit! * 60 - timeRemaining) / 60 : 0;
      
      const quizResult: QuizResult = {
        id: currentAttempt.attempt_id || 'temp-' + Date.now(),
        score: Math.round(earnedPoints),
        maxScore: totalPoints,
        percentage,
        passed,
        timeTaken: Math.round(timeTaken),
        answers,
        feedback: passed ? 
          `🎉 Excellent work! You scored ${percentage}% and passed this assessment.` :
          `You scored ${percentage}%. You need ${quiz.passing_score}% to pass. Keep studying and try again!`,
        detailedResults
      };

      setQuizResult(quizResult);
      setShowResults(true);
      
      if (quizResult.passed) {
        toast.success('🎉 Congratulations! You passed the assessment!');
      } else {
        toast.error(`You scored ${quizResult.percentage}%. You can retake this assessment.`);
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateStringSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOptions({});
    setTimeRemaining(quiz?.time_limit ? quiz.time_limit * 60 : undefined);
    setIsTimerActive(!!quiz?.time_limit);
    setShowResults(false);
    setQuizResult(null);
    loadAssessmentData();
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const getUnansweredCount = () => (quiz?.questions.length || 0) - getAnsweredCount();

  // Loading state
  if (loading || storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading assessment...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Assessment Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested assessment could not be found.'}</p>
          <button
            onClick={() => navigate('/assessments')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            ← Back to Assessments
          </button>
        </motion.div>
      </div>
    );
  }

  const renderQuestion = (question: Question, index: number) => {
    const userAnswer = answers[question.id];
    const selected = selectedOptions[question.id] || new Set<number>();

    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
        role="article"
        aria-label={`Question ${index + 1} of ${quiz.questions.length}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Question {index + 1} of {quiz.questions.length}
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600" aria-label={`Question worth ${question.points} points`}>
              {question.points} points
            </span>
            <span className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
              question.difficulty <= 2 ? 'from-green-400 to-green-600' :
              question.difficulty <= 3 ? 'from-yellow-400 to-yellow-600' :
              'from-red-400 to-red-600'
            } text-white`}
                  aria-label={`Difficulty level: ${question.difficulty} out of 5`}>
              Difficulty: {question.difficulty}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-line">{question.question}</p>

        <div className="space-y-3">
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/20 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="text-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'true_false' && (
            <div className="space-y-2">
              {['true', 'false'].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/20 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="text-blue-500"
                  />
                  <span className="text-gray-700 capitalize">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'short_answer' && (
            <textarea
              value={userAnswer as string || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-32 bg-white/10 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 placeholder-gray-500"
            />
          )}

          {question.type === 'code_completion' && (
            <div className="space-y-2">
              <textarea
                value={userAnswer as string || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Write your JAC code here..."
                className="w-full h-40 bg-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-green-400 font-mono placeholder-gray-500"
              />
              <p className="text-sm text-gray-600">
                Write complete JAC code for this problem.
              </p>
            </div>
          )}

          {question.type === 'jac_specific' && question.options && (
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/20 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={userAnswer === option}
                    onChange={() => handleAnswerChange(question.id, option)}
                    className="text-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {question.jac_concept && (
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>JAC Concept:</strong> {question.jac_concept.replace('_', ' ')}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderResults = () => {
    if (!quizResult) return null;

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
        >
          <div className="text-6xl mb-4">
            {quizResult.passed ? '🎉' : '📝'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {quizResult.passed ? 'Congratulations!' : 'Assessment Complete'}
          </h2>
          <p className="text-gray-600 mb-4">{quizResult.feedback}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800">{quizResult.percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800">{quizResult.score}/{quizResult.maxScore}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(quizResult.timeTaken)} min
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className={`text-2xl font-bold ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {quizResult.passed ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-sm text-gray-600">Result</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetakeQuiz}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Retake Assessment
            </button>
            <button
              onClick={() => navigate('/assessments')}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Back to Assessments
            </button>
          </div>
        </motion.div>

        {/* Detailed Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Detailed Results</h3>
          
          {quizResult.detailedResults.map((result, index) => {
            const question = quiz.questions.find(q => q.id === result.questionId);
            if (!question) return null;

            return (
              <motion.div
                key={result.questionId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 ${
                  result.isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-800 font-medium">
                    Question {index + 1}: {question.question.substring(0, 100)}...
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isCorrect ? '✅' : '❌'}
                    </span>
                    <span className="text-gray-600 text-sm">
                      {result.points}/{question.points} points
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Your answer: </span>
                    <span className={`${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {Array.isArray(result.userAnswer) 
                        ? result.userAnswer.join(', ') 
                        : result.userAnswer || 'No answer'}
                    </span>
                  </div>
                  
                  {!result.isCorrect && (
                    <div>
                      <span className="text-gray-600">Correct answer: </span>
                      <span className="text-green-600">
                        {Array.isArray(result.correctAnswer) 
                          ? result.correctAnswer.join(', ') 
                          : result.correctAnswer}
                      </span>
                    </div>
                  )}
                  
                  {result.explanation && (
                    <div className="mt-3 p-3 bg-blue-500/20 rounded-lg">
                      <span className="text-blue-700 font-medium">Explanation: </span>
                      <span className="text-blue-600">{result.explanation}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Assessment Results</h1>
              <p className="text-gray-600">{quiz.title}</p>
            </div>
            {renderResults()}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8" role="main" aria-label="Assessment detail page">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <span className="text-gray-600" aria-label={`Total questions: ${quiz.questions.length}`}>
              {quiz.questions.length} questions
            </span>
            <span className="text-gray-600" aria-label={`Total points: ${quiz.questions.reduce((sum, q) => sum + q.points, 0)}`}>
              {quiz.questions.reduce((sum, q) => sum + q.points, 0)} total points
            </span>
            {quiz.time_limit && (
              <span className={`font-medium ${timeRemaining && timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`} 
                    aria-label={`Time remaining: ${timeRemaining ? formatTime(timeRemaining) : formatTime(quiz.time_limit * 60)}`}>
                ⏱️ {timeRemaining ? formatTime(timeRemaining) : formatTime(quiz.time_limit * 60)}
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${quiz.difficulty === 'easy' ? 'from-green-400 to-green-600' : quiz.difficulty === 'medium' ? 'from-yellow-400 to-yellow-600' : 'from-red-400 to-red-600'} text-white`}
                  aria-label={`Difficulty level: ${quiz.difficulty}`}>
              {quiz.difficulty.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentQuestionIndex + 1} of {quiz.questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{getAnsweredCount()} answered</span>
            <span>{getUnansweredCount()} remaining</span>
          </div>
        </motion.div>

        {/* Question */}
        {currentQuestion && renderQuestion(currentQuestion, currentQuestionIndex)}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-8"
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white/10 hover:bg-white/20 text-gray-700'
            }`}
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-4">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </motion.div>

        {/* Question Overview (Mini Navigation) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6"
        >
          <h3 className="text-gray-800 font-medium mb-4">Question Overview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : answers[quiz.questions[index].id]
                    ? 'bg-green-500/20 text-green-600 border border-green-500/50'
                    : 'bg-white/10 text-gray-600 hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Submit Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Submitting your assessment...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetail;