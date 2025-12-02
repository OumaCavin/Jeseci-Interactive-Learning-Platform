import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from '../search/Search';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Jeseci Learning Platform
            </h1>
          </div>
          
          {/* Search Input */}
          <div className="flex-1 max-w-md mx-8">
            <Search 
              placeholder="Search learning content..."
              navigateToResults={true}
              onResultClick={(result) => {
                if (result.type === 'search') {
                  handleSearchSubmit(result.query);
                }
              }}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Welcome!</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;