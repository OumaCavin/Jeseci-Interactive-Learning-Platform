// JAC Learning Platform - Quiz Master Agent Chat by Cavin Otieno
// Enhanced with comprehensive quiz and assessment features

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, RotateCcw, Trophy, Clock, Target, 
  Brain, BookOpen, CheckCircle, XCircle, HelpCircle, Star,
  TrendingUp, BarChart3, Users, Lightbulb, Zap, Award,
  Eye, Edit, Trash2, Plus, Settings, Filter, Search,
  Download, Upload, Share2, Book, PenTool, Calculator,
  Globe, Mic, Video, Image, Code, Music, Palette,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Sparkles, Calendar, Flag, Timer, Shield, Rocket,
  Heart, Smile, Meh, Frown, Flame, Crown, Gem
} from 'lucide-react';
import { gamificationService } from '../../services/gamificationService';

// Types and Interfaces
interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay' | 'matching' | 'ordering' | 'hotspot' | 'drag_drop' | 'code_snippet' | 'math_equation';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  tags: string[];
  hints?: string[];
  timeLimit?: number;
  media?: {
    type: 'image' | 'video' | 'audio' | 'code';
    url: string;
    caption?: string;
  };
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  attempts: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'mixed';
  category: string;
  tags: string[];
  createdAt: Date;
  isPublic: boolean;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  passingScore: number;
  estimatedDuration: number;
  prerequisites?: string[];
  learningObjectives: string[];
}

interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, any>;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
  attempt: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  nextSteps: string[];
  performanceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  recommendations: string[];
}

interface PerformanceMetrics {
  totalQuizzes: number;
  totalQuestions: number;
  accuracyRate: number;
  averageScore: number;
  averageTimePerQuestion: number;
  strongestTopics: string[];
  weakestTopics: string[];
  learningVelocity: number;
  consistencyScore: number;
  streakDays: number;
  achievementCount: number;
  skillLevels: Record<string, number>;
  performanceHistory: {
    date: Date;
    score: number;
    accuracy: number;
    timeSpent: number;
  }[];
}

interface KnowledgeGap {
  topic: string;
  difficulty: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyRate: number;
  priority: 'high' | 'medium' | 'low';
  suggestedActions: string[];
}

const QuizMasterChat: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard' | 'quiz_manager' | 'analytics' | 'performance' | 'predictions'>('chat');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [knowledgeGaps, setKnowledgeGaps] = useState<KnowledgeGap[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizFilter, setQuizFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'difficulty'>('date');
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showQuizSettings, setShowQuizSettings] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');
  const [userStreak, setUserStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample quiz data
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Test your basic JavaScript knowledge including variables, functions, and DOM manipulation.',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'Which of the following is NOT a primitive data type in JavaScript?',
          options: ['String', 'Number', 'Boolean', 'Object'],
          correct_answer: 'Object',
          explanation: 'Object is a reference data type, not a primitive. The primitive types are String, Number, Boolean, Null, Undefined, Symbol, and BigInt.',
          difficulty: 'easy',
          points: 10,
          tags: ['javascript', 'basics', 'data-types']
        },
        {
          id: 'q2',
          type: 'fill_blank',
          question: 'Fill in the blank: The ______ method adds elements to the end of an array.',
          correct_answer: 'push',
          explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
          difficulty: 'easy',
          points: 15,
          tags: ['javascript', 'arrays', 'methods']
        },
        {
          id: 'q3',
          type: 'true_false',
          question: 'JavaScript is a compiled programming language.',
          correct_answer: 'false',
          explanation: 'JavaScript is an interpreted (just-in-time compiled) language, not a traditionally compiled language.',
          difficulty: 'medium',
          points: 20,
          tags: ['javascript', 'fundamentals', 'concepts']
        }
      ],
      timeLimit: 300,
      attempts: 3,
      difficulty: 'mixed',
      category: 'Programming',
      tags: ['javascript', 'web-development', 'programming'],
      createdAt: new Date('2025-12-01'),
      isPublic: true,
      allowReview: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      passingScore: 70,
      estimatedDuration: 10,
      learningObjectives: ['Understand JavaScript fundamentals', 'Identify primitive data types', 'Work with array methods']
    },
    {
      id: '2',
      title: 'React Component Lifecycle',
      description: 'Advanced React concepts including hooks, lifecycle methods, and state management.',
      questions: [
        {
          id: 'q4',
          type: 'multiple_choice',
          question: 'Which hook is used for managing state in React functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct_answer: 'useState',
          explanation: 'useState is the primary hook for adding state to functional components. It returns an array with the current state and a function to update it.',
          difficulty: 'medium',
          points: 25,
          tags: ['react', 'hooks', 'state-management']
        }
      ],
      timeLimit: 600,
      attempts: 2,
      difficulty: 'hard',
      category: 'Frontend Development',
      tags: ['react', 'frontend', 'hooks'],
      createdAt: new Date('2025-11-30'),
      isPublic: true,
      allowReview: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      passingScore: 80,
      estimatedDuration: 15,
      learningObjectives: ['Master React hooks', 'Understand component lifecycle', 'Implement state management']
    }
  ];

  // Sample performance data
  const samplePerformanceMetrics: PerformanceMetrics = {
    totalQuizzes: 24,
    totalQuestions: 156,
    accuracyRate: 78.5,
    averageScore: 82.3,
    averageTimePerQuestion: 45,
    strongestTopics: ['JavaScript Basics', 'CSS Grid', 'HTML5 Semantic'],
    weakestTopics: ['React Hooks', 'Async/Await', 'TypeScript Generics'],
    learningVelocity: 12.5,
    consistencyScore: 85,
    streakDays: 7,
    achievementCount: 18,
    skillLevels: {
      'JavaScript': 78,
      'React': 65,
      'TypeScript': 72,
      'CSS': 85,
      'HTML': 92,
      'Node.js': 58
    },
    performanceHistory: [
      { date: new Date('2025-11-25'), score: 75, accuracy: 72, timeSpent: 25 },
      { date: new Date('2025-11-27'), score: 82, accuracy: 78, timeSpent: 30 },
      { date: new Date('2025-11-29'), score: 88, accuracy: 85, timeSpent: 35 },
      { date: new Date('2025-12-01'), score: 79, accuracy: 76, timeSpent: 28 },
      { date: new Date('2025-12-03'), score: 85, accuracy: 82, timeSpent: 32 }
    ]
  };

  const sampleKnowledgeGaps: KnowledgeGap[] = [
    {
      topic: 'React Hooks',
      difficulty: 7.2,
      questionsAttempted: 15,
      questionsCorrect: 8,
      accuracyRate: 53.3,
      priority: 'high',
      suggestedActions: [
        'Review useEffect documentation',
        'Practice building custom hooks',
        'Complete advanced React exercises',
        'Study hook dependency arrays'
      ]
    },
    {
      topic: 'Async/Await Patterns',
      difficulty: 6.8,
      questionsAttempted: 12,
      questionsCorrect: 7,
      accuracyRate: 58.3,
      priority: 'medium',
      suggestedActions: [
        'Practice error handling in async code',
        'Review promise chaining vs async/await',
        'Implement retry mechanisms',
        'Study async iteration patterns'
      ]
    }
  ];

  useEffect(() => {
    // Initialize data
    setPerformanceMetrics(samplePerformanceMetrics);
    setKnowledgeGaps(sampleKnowledgeGaps);
  }, []);

  useEffect(() => {
    // Award points for viewing analytics
    if (activeView === 'analytics') {
      gamificationService.awardPoints(5, 'quiz_analytics_view', {
        view_type: 'analytics_dashboard'
      }).catch(console.warn);
    }
  }, [activeView]);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Quiz management functions
  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsQuizActive(true);
    setTimeRemaining(quiz.timeLimit || 0);
    setShowResults(false);
    
    gamificationService.awardPoints(15, 'quiz_started', {
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      difficulty: quiz.difficulty
    }).catch(console.warn);
  };

  const submitAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    gamificationService.awardPoints(5, 'answer_submitted', {
      question_id: questionId,
      quiz_id: currentQuiz?.id
    }).catch(console.warn);
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    if (!currentQuiz) return;
    
    // Calculate score and generate results
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvements: string[] = [];
    
    currentQuiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correct_answer);
      
      totalPoints += question.points;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
        
        // Add to strengths
        question.tags.forEach(tag => {
          if (!strengths.includes(tag)) strengths.push(tag);
        });
      } else {
        // Add to weaknesses
        question.tags.forEach(tag => {
          if (!weaknesses.includes(tag)) weaknesses.push(tag);
        });
      }
    });
    
    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= currentQuiz.passingScore;
    
    const result: QuizResult = {
      id: Date.now().toString(),
      quizId: currentQuiz.id,
      userId: 'current_user',
      answers: userAnswers,
      score: earnedPoints,
      maxScore: totalPoints,
      percentage,
      timeSpent: (currentQuiz.timeLimit || 0) - timeRemaining,
      completedAt: new Date(),
      attempt: 1,
      strengths,
      weaknesses,
      improvements: [
        'Focus on understanding core concepts before advanced topics',
        'Practice more questions in weak areas',
        'Review explanations for incorrect answers'
      ],
      nextSteps: [
        'Continue with similar difficulty quizzes',
        'Review incorrect answers and explanations',
        'Practice questions in weak topic areas'
      ],
      performanceLevel: percentage >= 90 ? 'expert' : percentage >= 75 ? 'advanced' : percentage >= 60 ? 'intermediate' : 'beginner',
      recommendations: [
        passed ? 'Great job! Consider trying more challenging quizzes.' : 'Focus on understanding the concepts better before retaking.',
        'Review the explanations for questions you missed.',
        'Practice more questions in your weak areas.'
      ]
    };
    
    setQuizResults(prev => [result, ...prev]);
    setIsQuizActive(false);
    setShowResults(true);
    
    // Award points based on performance
    const pointsToAward = passed ? Math.max(50, earnedPoints) : Math.max(20, earnedPoints / 2);
    gamificationService.awardPoints(pointsToAward, 'quiz_completed', {
      quiz_id: currentQuiz.id,
      score: percentage,
      passed,
      performance_level: result.performanceLevel
    }).catch(console.warn);
    
    // Check for achievements
    checkAchievements(result);
  };

  const checkAchievements = (result: QuizResult) => {
    const newAchievements: string[] = [];
    
    // Perfect score achievement
    if (result.percentage === 100) {
      newAchievements.push('Perfect Score');
    }
    
    // Speed completion achievement
    if (result.timeSpent < (currentQuiz?.estimatedDuration || 10) * 60 * 0.7) {
      newAchievements.push('Speed Demon');
    }
    
    // First quiz achievement
    if (quizResults.length === 0) {
      newAchievements.push('First Steps');
    }
    
    // Streak achievement
    if (result.percentage >= 70 && userStreak >= 5) {
      newAchievements.push('On Fire');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      newAchievements.forEach(achievement => {
        gamificationService.awardPoints(25, 'achievement_unlocked', {
          achievement_name: achievement
        }).catch(console.warn);
      });
    }
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = userAnswers[question.id];
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => submitAnswer(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'true_false':
        return (
          <div className="flex space-x-4">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => submitAnswer(question.id, e.target.value === 'True')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
        
      case 'fill_blank':
        return (
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => submitAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
        
      case 'essay':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => submitAnswer(question.id, e.target.value)}
            placeholder="Write your detailed answer here..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
        
      default:
        return <div className="text-gray-500">Question type not supported yet.</div>;
    }
  };

  const renderQuizResults = () => {
    if (!showResults || quizResults.length === 0) return null;
    
    const latestResult = quizResults[0];
    const passed = latestResult.percentage >= (currentQuiz?.passingScore || 70);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              {passed ? <Trophy className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-600">
              {passed 
                ? 'You have successfully completed this quiz!' 
                : 'Don\'t give up! Review the material and try again.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{latestResult.percentage}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{latestResult.score}/{latestResult.maxScore}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {latestResult.strengths.map((strength, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
            
            {latestResult.weaknesses.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h3>
                <div className="flex flex-wrap gap-2">
                  {latestResult.weaknesses.map((weakness, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuiz(null);
              }}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                if (currentQuiz) {
                  startQuiz(currentQuiz);
                  setShowResults(false);
                }
              }}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderChatView = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-blue-900">Quiz Master Assistant</h3>
          </div>
          <p className="text-blue-800">
            Welcome to your personal Quiz Master! I'm here to help you create custom quizzes, 
            assess your knowledge, and track your learning progress. How can I assist you today?
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveView('quiz_manager')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Play className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Take a Quiz</span>
            </div>
            <p className="text-gray-600 text-sm">Browse and take available quizzes</p>
          </button>
          
          <button
            onClick={() => setActiveView('analytics')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">View Analytics</span>
            </div>
            <p className="text-gray-600 text-sm">Track your quiz performance and progress</p>
          </button>
          
          <button
            onClick={() => setActiveView('performance')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Performance Insights</span>
            </div>
            <p className="text-gray-600 text-sm">Detailed analysis of your learning patterns</p>
          </button>
          
          <button
            onClick={() => setActiveView('predictions')}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-900">Learning Predictions</span>
            </div>
            <p className="text-gray-600 text-sm">AI-powered learning recommendations</p>
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ask me about quiz creation, difficulty levels, or learning strategies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quiz Master Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('quiz_manager')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Take Quiz</span>
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {performanceMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalQuizzes}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.accuracyRate}%</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.averageScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{performanceMetrics.streakDays} days</p>
                </div>
                <Flame className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strongest Topics</h3>
              <div className="space-y-3">
                {performanceMetrics.strongestTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{topic}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">90%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Needing Work</h3>
              <div className="space-y-3">
                {performanceMetrics.weakestTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{topic}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm text-red-600 font-medium">45%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance</h3>
            <div className="space-y-4">
              {performanceMetrics.performanceHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{record.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Score</div>
                      <div className="font-semibold text-gray-900">{record.score}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Accuracy</div>
                      <div className="font-semibold text-gray-900">{record.accuracy}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Time</div>
                      <div className="font-semibold text-gray-900">{record.timeSpent}min</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderQuizManager = () => {
    const filteredQuizzes = sampleQuizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
      const matchesTopic = selectedTopic === 'all' || quiz.category === selectedTopic;
      
      return matchesSearch && matchesDifficulty && matchesTopic;
    });

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Quiz Library</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
            
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Topics</option>
              <option value="Programming">Programming</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Backend Development">Backend Development</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <HelpCircle className="w-4 h-4" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{quiz.estimatedDuration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{quiz.passingScore}% to pass</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {quiz.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    quiz.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => startQuiz(quiz)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Quiz</span>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quiz Analytics</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {performanceMetrics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Performance chart visualization would be here</p>
                  <p className="text-sm">Showing {performanceMetrics.performanceHistory.length} data points</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-semibold">{performanceMetrics.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time/Question</span>
                    <span className="font-semibold">{performanceMetrics.averageTimePerQuestion}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Learning Velocity</span>
                    <span className="font-semibold">{performanceMetrics.learningVelocity}/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consistency</span>
                    <span className="font-semibold">{performanceMetrics.consistencyScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="text-center">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold text-gray-900">{performanceMetrics.achievementCount}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Level Distribution</h3>
            <div className="space-y-4">
              {Object.entries(performanceMetrics.skillLevels).map(([skill, level]) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{skill}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-12">{level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Performance Insights</h2>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Detailed Report
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Share Results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Velocity</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12.5</div>
            <div className="text-sm text-gray-600 mb-4">skills per week</div>
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+15% vs last week</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consistency Score</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
            <div className="text-sm text-gray-600 mb-4">daily practice streak</div>
            <div className="flex items-center justify-center space-x-1 text-orange-600">
              <Flame className="w-4 h-4" />
              <span className="text-sm">7 day streak</span>
            </div>
          </div>
        </div>
      </div>

      {knowledgeGaps.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Gap Analysis</h3>
          <div className="space-y-4">
            {knowledgeGaps.map((gap, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">{gap.topic}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      gap.priority === 'high' ? 'bg-red-100 text-red-800' :
                      gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {gap.priority} priority
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {gap.questionsCorrect}/{gap.questionsAttempted} correct ({gap.accuracyRate}%)
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Accuracy</span>
                    <span>{gap.accuracyRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${gap.accuracyRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Suggested Actions:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {gap.suggestedActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start space-x-2">
                        <ChevronRight className="w-3 h-3 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPredictions = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Learning Predictions</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Refresh Predictions
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Week Performance</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
            <div className="text-sm text-gray-600 mb-4">Predicted accuracy</div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+8.5% improvement expected</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Based on your recent performance trends and learning velocity, you're likely to see 
              significant improvement in the next week.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mastery Timeline</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2.3</div>
            <div className="text-sm text-gray-600 mb-4">weeks to reach 90% in React</div>
            <div className="flex items-center justify-center space-x-1 text-orange-600">
              <Rocket className="w-4 h-4" />
              <span className="text-sm">On track for mastery</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {['JavaScript (2 weeks)', 'TypeScript (3 weeks)', 'Node.js (4 weeks)'].map((timeline, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{timeline.split(' (')[0]}</span>
                <span className="font-medium">{timeline.split(' (')[1].replace(')', '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Optimal Study Time</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">Your peak performance is:</p>
            <div className="text-lg font-semibold text-blue-600">2:00 - 4:00 PM</div>
            <div className="text-xs text-gray-500">91% efficiency rating</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Learning Style</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">You learn best with:</p>
            <div className="text-lg font-semibold text-green-600">Interactive Quizzes</div>
            <div className="text-xs text-gray-500">85% retention rate</div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Next Challenge</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">Recommended next step:</p>
            <div className="text-lg font-semibold text-purple-600">React Hooks Mastery</div>
            <div className="text-xs text-gray-500">78% readiness score</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Plan Optimization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Monday</h4>
              <p className="text-sm text-gray-600">React Hooks Practice (45 min)</p>
            </div>
            <div className="text-sm text-green-600 font-medium">High Priority</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Tuesday</h4>
              <p className="text-sm text-gray-600">JavaScript Algorithms Quiz (30 min)</p>
            </div>
            <div className="text-sm text-blue-600 font-medium">Medium Priority</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Wednesday</h4>
              <p className="text-sm text-gray-600">TypeScript Advanced Concepts (60 min)</p>
            </div>
            <div className="text-sm text-orange-600 font-medium">Review Session</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuizTaking = () => {
    if (!currentQuiz || !isQuizActive) return null;
    
    const question = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{currentQuiz.title}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  question.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty}
                </span>
                <span className="text-sm text-gray-500">{question.points} points</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{question.question}</h3>
              
              {question.media && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    {question.media.type === 'image' && (
                      <img 
                        src={question.media.url} 
                        alt={question.media.caption || 'Question media'} 
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                    {question.media.caption && (
                      <p className="text-sm text-gray-600 mt-2">{question.media.caption}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {renderQuestion(question)}
          </div>
        </div>
        
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-2">
              {currentQuiz.questions.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex 
                      ? 'bg-blue-600 text-white' 
                      : index < currentQuestionIndex || userAnswers[currentQuiz.questions[index].id]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex space-x-8">
        {[
          { id: 'chat', label: 'Chat', icon: Brain },
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'quiz_manager', label: 'Quiz Manager', icon: BookOpen },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          { id: 'performance', label: 'Performance', icon: Target },
          { id: 'predictions', label: 'Predictions', icon: Lightbulb }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              activeView === id 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quiz Master</h1>
                <p className="text-sm text-gray-600">Your AI-powered assessment companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {achievements.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">{achievements.length} Achievements</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">{userStreak} day streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {!isQuizActive && renderNavigation()}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isQuizActive ? (
            renderQuizTaking()
          ) : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto"
            >
              {activeView === 'chat' && renderChatView()}
              {activeView === 'dashboard' && renderDashboard()}
              {activeView === 'quiz_manager' && renderQuizManager()}
              {activeView === 'analytics' && renderAnalytics()}
              {activeView === 'performance' && renderPerformance()}
              {activeView === 'predictions' && renderPredictions()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz Results Modal */}
      {renderQuizResults()}
      
      <div ref={chatEndRef} />
    </div>
  );
};

export default QuizMasterChat;