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