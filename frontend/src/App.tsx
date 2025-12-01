import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useLearningStore } from './stores/learningStore';

// Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import SkillMap from './pages/SkillMap';
import Profile from './pages/Profile';
import Login from './pages/Login';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Styles
import './App.css';
import './index.css';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { sidebarOpen } = useLearningStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main content */}
            <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
              sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
            }`}>
              {/* Header */}
              <Header />
              
              {/* Main content area */}
              <main className="flex-1 overflow-y-auto focus:outline-none">
                <div className="py-6">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/learning-path" element={<LearningPath />} />
                      <Route path="/lesson/:lessonId" element={<LessonView />} />
                      <Route path="/quiz/:quizId" element={<QuizView />} />
                      <Route path="/skill-map" element={<SkillMap />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </div>
                </div>
              </main>
            </div>
          </div>
        )}
        
        {!isAuthenticated && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;