// Code Editor Page - Main page for code editing and execution
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import CodeEditor from '../pages/CodeEditor';

const CodeEditorPage: React.FC = () => {
  return (
    <MainLayout>
      <CodeEditor />
    </MainLayout>
  );
};

export default CodeEditorPage;