"""
Frontend Component Tests
"""

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../../src/pages/Dashboard';
import authReducer from '../../src/stores/authStore';
import learningReducer from '../../src/stores/learningStore';

// Mock the API service
jest.mock('../../src/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock react-redux hooks
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Test wrapper component
const TestWrapper = ({ children, store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      learning: learningReducer,
    },
    preloadedState: initialState,
  });
};

describe('Dashboard Component', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      auth: {
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
        isAuthenticated: true,
      },
      learning: {
        currentLesson: null,
        currentQuiz: null,
        progress: {},
        loading: false,
        error: null,
      },
    });

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders dashboard header', () => {
    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText(/Welcome to Jeseci/i)).toBeInTheDocument();
  });

  test('displays user information', () => {
    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  test('shows loading state when data is loading', () => {
    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
      learning: {
        loading: true,
        error: null,
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
      learning: {
        loading: false,
        error: 'Test error message',
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText(/Test error message/i)).toBeInTheDocument();
  });

  test('renders lesson section when lesson data is available', () => {
    const lessonData = {
      id: 1,
      title: 'Test Lesson',
      content: 'This is test lesson content',
    };

    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
      learning: {
        currentLesson: lessonData,
        loading: false,
        error: null,
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
    expect(screen.getByText('This is test lesson content')).toBeInTheDocument();
  });

  test('renders quiz section when quiz data is available', () => {
    const quizData = {
      id: 1,
      title: 'Test Quiz',
      questions: [
        {
          id: 'q1',
          question: 'What is a variable?',
          type: 'multiple_choice',
          options: ['A', 'B', 'C', 'D'],
        },
      ],
    };

    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
      learning: {
        currentQuiz: quizData,
        loading: false,
        error: null,
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('What is a variable?')).toBeInTheDocument();
  });

  test('handles lesson navigation', async () => {
    const mockApi = require('../../src/services/api').api;
    mockApi.get.mockResolvedValue({
      data: {
        id: 2,
        title: 'Next Lesson',
        content: 'Next lesson content',
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    const nextButton = screen.getByText(/Next Lesson/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith('/api/get_lesson/2/');
    });
  });

  test('handles quiz answer submission', async () => {
    const mockApi = require('../../src/services/api').api;
    const quizData = {
      id: 1,
      title: 'Test Quiz',
      questions: [
        {
          id: 'q1',
          question: 'What is a variable?',
          type: 'multiple_choice',
          options: ['A', 'B', 'C', 'D'],
        },
      ],
    };

    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
      learning: {
        currentQuiz: quizData,
        loading: false,
        error: null,
      },
    });

    mockApi.post.mockResolvedValue({
      data: {
        correct: true,
        feedback: 'Correct answer!',
        next_question: null,
      },
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    const answerButton = screen.getByText('A');
    fireEvent.click(answerButton);

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/submit_answer/', {
        question_id: 'q1',
        answer: 'A',
        question_type: 'multiple_choice',
      });
    });
  });

  test('shows skill map when requested', async () => {
    const mockApi = require('../../src/services/api').api;
    
    const skillMapData = {
      concepts: [
        { id: 1, name: 'Variables', mastery_score: 0.8 },
        { id: 2, name: 'Functions', mastery_score: 0.6 },
      ],
      progress: {
        overall_completion: 0.7,
        total_time_spent: 120,
      },
      recommendations: [
        'Focus on improving Functions mastery',
      ],
    };

    mockApi.get.mockResolvedValue({
      data: skillMapData,
    });

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    const skillMapButton = screen.getByText(/Skill Map/i);
    fireEvent.click(skillMapButton);

    await waitFor(() => {
      expect(screen.getByText('Variables')).toBeInTheDocument();
      expect(screen.getByText('Functions')).toBeInTheDocument();
      expect(screen.getByText(/Focus on improving Functions mastery/)).toBeInTheDocument();
    });
  });

  test('handles logout', async () => {
    const mockDispatch = jest.fn();
    require('react-redux').useDispatch.mockReturnValue(mockDispatch);

    render(
      <TestWrapper store={store}>
        <Dashboard />
      </TestWrapper>
    );

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
  });
});

describe('Authentication Store', () => {
  test('should handle login success', () => {
    const store = createTestStore();
    
    const initialState = store.getState().auth;
    expect(initialState.isAuthenticated).toBe(false);
    expect(initialState.user).toBeNull();
  });

  test('should handle login action', () => {
    const store = createTestStore();
    
    store.dispatch({
      type: 'auth/login',
      payload: {
        user: { id: 1, username: 'testuser' },
      },
    });

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.username).toBe('testuser');
  });

  test('should handle logout action', () => {
    store = createTestStore({
      auth: {
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true,
      },
    });

    store.dispatch({ type: 'auth/logout' });

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('Learning Store', () => {
  test('should handle lesson loading', () => {
    const store = createTestStore();
    
    store.dispatch({
      type: 'learning/setCurrentLesson',
      payload: {
        id: 1,
        title: 'Test Lesson',
        content: 'Test content',
      },
    });

    const state = store.getState().learning;
    expect(state.currentLesson.title).toBe('Test Lesson');
  });

  test('should handle quiz loading', () => {
    const store = createTestStore();
    
    store.dispatch({
      type: 'learning/setCurrentQuiz',
      payload: {
        id: 1,
        title: 'Test Quiz',
        questions: [],
      },
    });

    const state = store.getState().learning;
    expect(state.currentQuiz.title).toBe('Test Quiz');
  });

  test('should handle loading state', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'learning/setLoading', payload: true });

    const state = store.getState().learning;
    expect(state.loading).toBe(true);
  });

  test('should handle error state', () => {
    const store = createTestStore();
    
    store.dispatch({ type: 'learning/setError', payload: 'Test error' });

    const state = store.getState().learning;
    expect(state.error).toBe('Test error');
  });
});