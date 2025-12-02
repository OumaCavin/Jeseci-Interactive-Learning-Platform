import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from '../components/search/Search';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SearchDemo: React.FC = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [lastSearch, setLastSearch] = useState<string>('');

  const handleSearch = (query: string) => {
    console.log('Search performed:', query);
    setLastSearch(query);
  };

  const handleResultClick = (result: any) => {
    console.log('Result clicked:', result);
  };

  const handleResult = handleResultClick;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Search Component
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our comprehensive search interface with autocomplete, suggestions, 
            history, and advanced features.
          </p>
        </motion.div>

        {/* Search Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Main Search Interface
            </h2>
            <p className="text-gray-600 mb-6">
              Try typing in the search box below to see autocomplete suggestions, 
              search history, and popular searches.
            </p>
            
            <div className="mb-6">
              <Search 
                placeholder="Search courses, lessons, quizzes..."
                onResultClick={handleResultClick}
                fullWidth={true}
                showResults={true}
              />
            </div>

            {lastSearch && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Last search:</strong> "{lastSearch}"
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              🔍 Search Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Real-time autocomplete suggestions</li>
              <li>• Search history with recent queries</li>
              <li>• Popular and trending searches</li>
              <li>• Debounced search (300ms delay)</li>
              <li>• Keyboard navigation support</li>
              <li>• Search result highlighting</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ⚡ Advanced Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Content type filtering (Course, Lesson, Quiz)</li>
              <li>• Relevance scoring and ranking</li>
              <li>• Analytics and click tracking</li>
              <li>• Accessible design (ARIA labels)</li>
              <li>• Mobile responsive layout</li>
              <li>• Smooth animations with Framer Motion</li>
            </ul>
          </Card>
        </motion.div>

        {/* Different Search Variations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900">
            Search Variations
          </h2>

          {/* Compact Search */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Compact Search (for sidebar or header)
            </h3>
            <div className="max-w-md">
              <Search 
                placeholder="Quick search..."
                className="compact-search"
              />
            </div>
          </Card>

          {/* Search without results */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Search without results display
            </h3>
            <div className="max-w-md">
              <Search 
                placeholder="Suggestions only..."
                showResults={false}
              />
            </div>
          </Card>

          {/* Custom placeholder */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Custom placeholder and styling
            </h3>
            <div className="max-w-md">
              <Search 
                placeholder="Search knowledge base, documentation..."
                className="custom-search"
              />
            </div>
          </Card>
        </motion.div>

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Integration Examples
            </h2>
            <p className="text-gray-600 mb-4">
              The Search component can be used in various ways:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• <code>&lt;Search /&gt;</code> - Basic usage</li>
              <li>• <code>&lt;Search placeholder="Custom placeholder..." /&gt;</code> - Custom placeholder</li>
              <li>• <code>&lt;Search onResultClick=&#123;handleResult&#125; /&gt;</code> - With click handler</li>
              <li>• <code>&lt;Search fullWidth={true} /&gt;</code> - Full width variant</li>
            </ul>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
          >
            ← Back to Demo Hub
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchDemo;