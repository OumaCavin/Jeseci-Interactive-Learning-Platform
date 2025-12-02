import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Components
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import LessonView from './pages/LessonView';
import QuizView from './pages/QuizView';
import SkillMap from './pages/SkillMap';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LoadingSpinner from './components/ui/LoadingSpinner';
import AuthLayoutDemo from './pages/AuthLayoutDemo';
import UIComponentsDemo from './pages/UIComponentsDemo';
import MainLayoutDemo from './pages/MainLayoutDemo';
import SearchDemo from './pages/SearchDemo';

// Styles
import './App.css';
import './index.css';

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/learning-path" element={<LearningPath />} />
              <Route path="/lesson/:lessonId" element={<LessonView />} />
              <Route path="/quiz/:quizId" element={<QuizView />} />
              <Route path="/skill-map" element={<SkillMap />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Demo routes - remove in production */}
              <Route path="/auth-demo" element={<AuthLayoutDemo />} />
              <Route path="/ui-demo" element={<UIComponentsDemo />} />
              <Route path="/mainlayout-demo" element={<MainLayoutDemo />} />
              <Route path="/search-demo" element={<SearchDemo />} />
            </Routes>
          </MainLayout>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
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