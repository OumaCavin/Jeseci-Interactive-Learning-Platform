import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { QueryClientProvider } from './components/providers/QueryClientProvider';

// Components
import { MainLayout } from './components/layout/MainLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { PageTransition, PageLoadingFallback } from './components/ui/PageTransition';

// Styles
import './App.css';
import './index.css';

// Lazy-loaded Pages for code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const LearningPath = React.lazy(() => import('./pages/LearningPath'));
const LessonView = React.lazy(() => import('./pages/LessonView'));
const QuizView = React.lazy(() => import('./pages/QuizView'));
const SkillMap = React.lazy(() => import('./pages/SkillMap'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));

// Demo Pages
const AuthLayoutDemo = React.lazy(() => import('./pages/AuthLayoutDemo'));
const UIComponentsDemo = React.lazy(() => import('./pages/UIComponentsDemo'));
const MainLayoutDemo = React.lazy(() => import('./pages/MainLayoutDemo'));
const SearchDemo = React.lazy(() => import('./pages/SearchDemo'));

// Search Pages
const SearchResultsPage = React.lazy(() => import('./pages/search/SearchResultsPage'));

// Settings Page
const Settings = React.lazy(() => import('./pages/Settings'));

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <Routes>
              {/* Public Routes (Login, Signup) */}
              <Route path="/login" element={
                <PublicRoute>
                  <AuthLayout>
                    <PageTransition pageKey="login">
                      <Suspense fallback={<PageLoadingFallback text="Loading login..." />}>
                        <Login />
                      </Suspense>
                    </PageTransition>
                  </AuthLayout>
                </PublicRoute>
              } />
              
              <Route path="/signup" element={
                <PublicRoute>
                  <AuthLayout>
                    <PageTransition pageKey="signup">
                      <Suspense fallback={<PageLoadingFallback text="Loading signup..." />}>
                        <SignUp />
                      </Suspense>
                    </PageTransition>
                  </AuthLayout>
                </PublicRoute>
              } />

              {/* Protected Routes (Main Application) */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      {/* Root redirect to dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* Core Application Routes */}
                      <Route path="/dashboard" element={
                        <PageTransition pageKey="dashboard">
                          <Suspense fallback={<PageLoadingFallback text="Loading dashboard..." />}>
                            <Dashboard />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/learning-path" element={
                        <PageTransition pageKey="learning-path">
                          <Suspense fallback={<PageLoadingFallback text="Loading learning path..." />}>
                            <LearningPath />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/lesson/:lessonId" element={
                        <PageTransition pageKey="lesson-view">
                          <Suspense fallback={<PageLoadingFallback text="Loading lesson..." />}>
                            <LessonView />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/quiz/:quizId" element={
                        <PageTransition pageKey="quiz-view">
                          <Suspense fallback={<PageLoadingFallback text="Loading quiz..." />}>
                            <QuizView />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/skill-map" element={
                        <PageTransition pageKey="skill-map">
                          <Suspense fallback={<PageLoadingFallback text="Loading skill map..." />}>
                            <SkillMap />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/profile" element={
                        <PageTransition pageKey="profile">
                          <Suspense fallback={<PageLoadingFallback text="Loading profile..." />}>
                            <Profile />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/settings" element={
                        <PageTransition pageKey="settings">
                          <Suspense fallback={<PageLoadingFallback text="Loading settings..." />}>
                            <Settings />
                          </Suspense>
                        </PageTransition>
                      } />

                      {/* Demo Routes - Remove in production */}
                      <Route path="/auth-demo" element={
                        <PageTransition pageKey="auth-demo">
                          <Suspense fallback={<PageLoadingFallback text="Loading demo..." />}>
                            <AuthLayoutDemo />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/ui-demo" element={
                        <PageTransition pageKey="ui-demo">
                          <Suspense fallback={<PageLoadingFallback text="Loading demo..." />}>
                            <UIComponentsDemo />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/mainlayout-demo" element={
                        <PageTransition pageKey="mainlayout-demo">
                          <Suspense fallback={<PageLoadingFallback text="Loading demo..." />}>
                            <MainLayoutDemo />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/search-demo" element={
                        <PageTransition pageKey="search-demo">
                          <Suspense fallback={<PageLoadingFallback text="Loading search..." />}>
                            <SearchDemo />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/search" element={
                        <PageTransition pageKey="search-results">
                          <Suspense fallback={<PageLoadingFallback text="Loading search results..." />}>
                            <SearchResultsPage />
                          </Suspense>
                        </PageTransition>
                      } />

                      {/* Catch-all route - redirect to dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '8px',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
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
                loading: {
                  duration: Infinity,
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;