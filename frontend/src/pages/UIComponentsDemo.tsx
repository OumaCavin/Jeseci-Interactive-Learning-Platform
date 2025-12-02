import React, { useState } from 'react';
import { Quiz, Button, Card, Badge, Progress, Modal } from '../components/ui';

const UIComponentsDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const sampleQuestions = [
    {
      id: 1,
      question: "What is React?",
      options: [
        "A JavaScript library for building user interfaces",
        "A database management system",
        "A CSS framework",
        "A programming language"
      ],
      correct: 0,
      explanation: "React is indeed a JavaScript library created by Facebook for building user interfaces, particularly for web applications."
    },
    {
      id: 2,
      question: "What is TypeScript?",
      options: [
        "A CSS preprocessor",
        "A JavaScript superset that adds static typing",
        "A database query language",
        "A version of Java"
      ],
      correct: 1,
      explanation: "TypeScript is a strongly typed programming language that builds on JavaScript, adding static type definitions."
    },
    {
      id: 3,
      question: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Styling System",
        "Cascaded Script Sheets"
      ],
      correct: 1,
      explanation: "CSS stands for Cascading Style Sheets, used for describing the presentation of HTML documents."
    }
  ];

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizScore(score);
    console.log('Quiz completed!', { score, total: sampleQuestions.length, answers });
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">UI Components Demo</h1>
        <p className="text-gray-600">Demonstration of the essential UI components for your learning platform</p>
      </div>

      {/* Buttons Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button isLoading>Loading Button</Button>
        </div>
      </Card>

      {/* Badges Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </Card>

      {/* Progress Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Progress</h2>
        <div className="space-y-4">
          <Progress value={65} showLabel />
          <Progress value={30} variant="warning" />
          <Progress value={90} variant="success" size="lg" />
        </div>
      </Card>

      {/* Modal Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Modal</h2>
        <Button onClick={() => setShowModal(true)}>Open Modal</Button>
        
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Modal Example"
        >
          <p className="mb-4">This is a modal dialog. You can put any content here.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </Card>

      {/* Quiz Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Quiz Component</h2>
        {quizScore !== null ? (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              Final Score: {quizScore}/{sampleQuestions.length}
            </div>
            <Button onClick={() => setQuizScore(null)}>Retake Quiz</Button>
          </div>
        ) : (
          <Quiz
            questions={sampleQuestions}
            onComplete={handleQuizComplete}
            title="Sample Quiz"
          />
        )}
      </Card>
    </div>
  );
};

export default UIComponentsDemo;