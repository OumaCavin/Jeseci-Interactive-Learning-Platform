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