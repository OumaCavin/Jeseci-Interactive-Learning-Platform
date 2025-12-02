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
const LearningPaths = React.lazy(() => import('./pages/learning/LearningPaths'));
const LearningPathDetail = React.lazy(() => import('./pages/learning/LearningPathDetail'));
const ModuleContent = React.lazy(() => import('./pages/learning/ModuleContent'));
const Assessments = React.lazy(() => import('./pages/assessments/Assessments'));
const AssessmentDetail = React.lazy(() => import('./pages/assessments/AssessmentDetail'));
const LessonView = React.lazy(() => import('./pages/LessonView'));
const QuizView = React.lazy(() => import('./pages/QuizView'));
const SkillMap = React.lazy(() => import('./pages/SkillMap'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Login = React.lazy(() => import('./pages/Login'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const PasswordReset = React.lazy(() => import('./pages/auth/PasswordReset'));

// Demo Pages
const AuthLayoutDemo = React.lazy(() => import('./pages/AuthLayoutDemo'));
const UIComponentsDemo = React.lazy(() => import('./pages/UIComponentsDemo'));
const MainLayoutDemo = React.lazy(() => import('./pages/MainLayoutDemo'));
const SearchDemo = React.lazy(() => import('./pages/SearchDemo'));

// Search Pages
const SearchResultsPage = React.lazy(() => import('./pages/search/SearchResultsPage'));

// Settings Page
const Settings = React.lazy(() => import('./pages/Settings'));

// Progress Page
const Progress = React.lazy(() => import('./pages/Progress'));

// Achievements Page
const Achievements = React.lazy(() => import('./pages/Achievements'));

// KnowledgeGraph Page
const KnowledgeGraph = React.lazy(() => import('./pages/KnowledgeGraph'));

// Collaboration Page
const Collaboration = React.lazy(() => import('./pages/Collaboration'));

// Code Editor Page
const CodeEditor = React.lazy(() => import('./pages/CodeEditorPage'));

// Chat Page
const Chat = React.lazy(() => import('./pages/Chat'));

// Admin Dashboard Page
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

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
                        <LoginPage />
                      </Suspense>
                    </PageTransition>
                  </AuthLayout>
                </PublicRoute>
              } />
              
              <Route path="/signup" element={
                <PublicRoute>
                  <AuthLayout>
                    <PageTransition pageKey="signup">
                      <Suspense fallback={<PageLoadingFallback text="Loading registration..." />}>
                        <RegisterPage />
                      </Suspense>
                    </PageTransition>
                  </AuthLayout>
                </PublicRoute>
              } />

              <Route path="/forgot-password" element={
                <PublicRoute>
                  <AuthLayout>
                    <PageTransition pageKey="password-reset">
                      <Suspense fallback={<PageLoadingFallback text="Loading password reset..." />}>
                        <PasswordReset />
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
                      
                      <Route path="/learning-paths" element={
                        <PageTransition pageKey="learning-paths">
                          <Suspense fallback={<PageLoadingFallback text="Loading learning paths..." />}>
                            <LearningPaths />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/learning-paths/:pathId" element={
                        <PageTransition pageKey="learning-path-detail">
                          <Suspense fallback={<PageLoadingFallback text="Loading learning path details..." />}>
                            <LearningPathDetail />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/learning-paths/:pathId/modules/:moduleId" element={
                        <PageTransition pageKey="module-content">
                          <Suspense fallback={<PageLoadingFallback text="Loading module content..." />}>
                            <ModuleContent />
                          </Suspense>
                        </PageTransition>
                      } />
                      
                      <Route path="/assessments" element={
                        <PageTransition pageKey="assessments">
                          <Suspense fallback={<PageLoadingFallback text="Loading assessments..." />}>
                            <Assessments />
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
                        <PageTransition pageKey="assessment-detail">
                          <Suspense fallback={<PageLoadingFallback text="Loading assessment..." />}>
                            <AssessmentDetail />
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
                      
                      <Route path="/progress" element={
                        <PageTransition pageKey="progress">
                          <Suspense fallback={<PageLoadingFallback text="Loading progress..." />}>
                            <Progress />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/achievements" element={
                        <PageTransition pageKey="achievements">
                          <Suspense fallback={<PageLoadingFallback text="Loading achievements..." />}>
                            <Achievements />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/knowledge-graph" element={
                        <PageTransition pageKey="knowledge-graph">
                          <Suspense fallback={<PageLoadingFallback text="Loading knowledge graph..." />}>
                            <KnowledgeGraph />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/collaboration/*" element={
                        <PageTransition pageKey="collaboration">
                          <Suspense fallback={<PageLoadingFallback text="Loading collaboration..." />}>
                            <Collaboration />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/code-editor" element={
                        <PageTransition pageKey="code-editor">
                          <Suspense fallback={<PageLoadingFallback text="Loading code editor..." />}>
                            <CodeEditor />
                          </Suspense>
                        </PageTransition>
                      } />

                      <Route path="/chat" element={
                        <PageTransition pageKey="chat">
                          <Suspense fallback={<PageLoadingFallback text="Loading chat..." />}>
                            <Chat />
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

                      <Route path="/admin" element={
                        <PageTransition pageKey="admin">
                          <Suspense fallback={<PageLoadingFallback text="Loading admin dashboard..." />}>
                            <AdminDashboard />
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