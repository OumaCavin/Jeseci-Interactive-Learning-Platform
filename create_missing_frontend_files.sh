#!/bin/bash

# Comprehensive Frontend Fix Script
# Creates all missing React components and pages

echo "Creating missing frontend files..."

# Create directories
mkdir -p frontend/src/components/layout
mkdir -p frontend/src/components/ui
mkdir -p frontend/src/pages

# Create Layout Components
echo "Creating layout components..."

# Header Component
cat > frontend/src/components/layout/Header.tsx << 'EOF'
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Jeseci Learning Platform
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome!</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
EOF

# Sidebar Component
cat > frontend/src/components/layout/Sidebar.tsx << 'EOF'
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Learning Paths', path: '/learning-paths' },
    { name: 'Skill Map', path: '/skill-map' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-gray-50 w-64 min-h-screen p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
EOF

# Create UI Components
echo "Creating UI components..."

# LoadingSpinner Component
cat > frontend/src/components/ui/LoadingSpinner.tsx << 'EOF'
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 ${sizeClasses[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
EOF

# Create Pages
echo "Creating page components..."

# LearningPath Page
cat > frontend/src/pages/LearningPath.tsx << 'EOF'
import React from 'react';

const LearningPath: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Frontend Development</h3>
          <p className="text-gray-600 mb-4">Master React, TypeScript, and modern web development.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Start Learning
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Backend Development</h3>
          <p className="text-gray-600 mb-4">Learn Django, APIs, and database management.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Start Learning
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Full Stack Development</h3>
          <p className="text-gray-600 mb-4">Complete full-stack development course.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
EOF

# LessonView Page
cat > frontend/src/pages/LessonView.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LessonView: React.FC = () => {
  const { lessonId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lesson {lessonId}</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4">Introduction to the Topic</h2>
        <p className="text-gray-700 mb-4">
          This is a sample lesson content. In a real application, this would contain
          interactive content, videos, code examples, and exercises.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">Key Concepts:</h3>
          <ul className="list-disc list-inside text-blue-800">
            <li>Concept 1: Understanding the fundamentals</li>
            <li>Concept 2: Practical applications</li>
            <li>Concept 3: Best practices</li>
          </ul>
        </div>
        <div className="flex justify-between">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
            Previous Lesson
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
EOF

# QuizView Page
cat > frontend/src/pages/QuizView.tsx << 'EOF'
import React, { useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
EOF

# SkillMap Page
cat > frontend/src/pages/SkillMap.tsx << 'EOF'
import React from 'react';

const SkillMap: React.FC = () => {
  const skills = [
    {
      category: "Frontend Development",
      items: ["HTML", "CSS", "JavaScript", "React", "TypeScript"]
    },
    {
      category: "Backend Development", 
      items: ["Python", "Django", "API Design", "Database Management"]
    },
    {
      category: "DevOps",
      items: ["Docker", "CI/CD", "Cloud Deployment", "Monitoring"]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Skill Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              {skill.category}
            </h3>
            <div className="space-y-2">
              {skill.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{item}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= 3 ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillMap;
EOF

# Profile Page
cat > frontend/src/pages/Profile.tsx << 'EOF'
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">U</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-600">john.doe@example.com</p>
            <p className="text-sm text-gray-500">Member since December 2025</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Lessons Completed</h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Quizzes Passed</h3>
            <p className="text-2xl font-bold text-green-600">18</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Current Streak</h3>
            <p className="text-2xl font-bold text-purple-600">7 days</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              defaultValue="Passionate learner interested in web development and technology."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
EOF

# Login Page
cat > frontend/src/pages/Login.tsx << 'EOF'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log('Login attempt:', { email, password });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow border p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
EOF

# Create App.css
echo "Creating CSS styles..."
cat > frontend/src/App.css << 'EOF'
/* Custom styles for Jeseci Learning Platform */

/* Tailwind CSS is imported via index.css, these are additional custom styles */

.main-layout {
  display: flex;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  padding: 1.5rem;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Card hover effects */
.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Progress bars */
.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease-in-out;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Button styles */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-success {
  @apply bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
}

/* Form styles */
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

/* Navigation styles */
.nav-link {
  @apply block px-4 py-2 rounded-lg text-sm font-medium transition-colors;
}

.nav-link-active {
  @apply bg-blue-100 text-blue-700;
}

.nav-link-inactive {
  @apply text-gray-700 hover:bg-gray-200;
}

/* Loading styles */
.loading-container {
  @apply flex justify-center items-center min-h-[200px];
}

/* Responsive utilities */
@media (max-width: 768px) {
  .content-area {
    padding: 1rem;
  }
}

/* Dark mode support (future enhancement) */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles would go here */
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}
EOF

echo "✅ All missing frontend files created successfully!"
echo ""
echo "Created files:"
echo "- frontend/src/components/layout/Header.tsx"
echo "- frontend/src/components/layout/Sidebar.tsx"
echo "- frontend/src/components/ui/LoadingSpinner.tsx"
echo "- frontend/src/pages/LearningPath.tsx"
echo "- frontend/src/pages/LessonView.tsx"
echo "- frontend/src/pages/QuizView.tsx"
echo "- frontend/src/pages/SkillMap.tsx"
echo "- frontend/src/pages/Profile.tsx"
echo "- frontend/src/pages/Login.tsx"
echo "- frontend/src/App.css"
echo ""
echo "Now try running: ./start_frontend.sh"