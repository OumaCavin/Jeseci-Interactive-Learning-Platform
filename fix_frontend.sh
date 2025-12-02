#!/bin/bash

# Frontend Fix Script
# Recreates missing React frontend files

echo "🔧 Fixing Frontend Structure..."
echo "==============================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found!"
    echo "Make sure you're running this from the project root directory."
    exit 1
fi

cd frontend

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    echo "📁 Creating public directory..."
    mkdir -p public
fi

# Create index.html if it doesn't exist
if [ ! -f "public/index.html" ]; then
    echo "📄 Creating index.html..."
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Jeseci Interactive Learning Platform - Adaptive Multi-Agent Learning System"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Jeseci Learning Platform</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
fi

# Create basic src directory structure if it doesn't exist
if [ ! -d "src" ]; then
    echo "📁 Creating src directory structure..."
    mkdir -p src/{components,pages,services,stores,utils,types}
fi

# Create basic React files if they don't exist
if [ ! -f "src/index.tsx" ]; then
    echo "📄 Creating index.tsx..."
    cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
fi

if [ ! -f "src/App.tsx" ]; then
    echo "📄 Creating App.tsx..."
    cat > src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
EOF
fi

# Create basic CSS file
if [ ! -f "src/index.css" ]; then
    echo "📄 Creating index.css..."
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF
fi

echo "✅ Frontend structure fixed!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: ./start_frontend.sh"
echo ""
echo "Frontend will be available at: http://localhost:3000"