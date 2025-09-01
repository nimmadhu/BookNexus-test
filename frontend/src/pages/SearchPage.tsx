import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { searchBooks, searchBooksWithAI } from '../services/bookService';
import { MagnifyingGlassIcon, SparklesIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock subjects - in a real app, these would come from your API
  const subjects = [
    'All Subjects',
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Technology',
    'Arts',
    'Business',
  ];

  const {
    data: searchResults,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['searchBooks', searchTerm, selectedSubject, isAiSearch],
    queryFn: () => {
      if (isAiSearch) {
        return searchBooksWithAI(searchTerm);
      } else {
        return searchBooks({ 
          query: searchTerm, 
          subject: selectedSubject === 'All Subjects' ? undefined : selectedSubject 
        });
      }
    },
    enabled: false, // Don't run the query automatically
  });

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setHasSearched(true);
    refetch();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSearchMode = () => {
    setIsAiSearch(!isAiSearch);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with decorative elements */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl opacity-50"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 py-8 px-6 sm:px-8 rounded-2xl mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Search Our <span className="text-blue-600 dark:text-blue-400">Collection</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
              Discover your next favorite book using our powerful search tools—from traditional filters to AI-powered natural language search.
            </p>
          </motion.div>
        </div>

        {/* Search Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* AI Toggle Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-0">
              {isAiSearch ? 'AI-Powered Search' : 'Standard Search'}
            </h2>
            <button
              onClick={toggleSearchMode}
              className={`flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                isAiSearch
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <SparklesIcon className={`h-5 w-5 mr-2 ${isAiSearch ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              {isAiSearch ? 'Using AI Search' : 'Switch to AI Search'}
            </button>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {isAiSearch ? (
                <motion.div
                  key="ai-search"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-purple-700 dark:text-purple-400">AI-powered search:</span> Use natural language to find exactly what you're looking for. Try phrases like "science fiction with robots published after 2010" or "historical novels about World War II with female protagonists"
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Describe the books you're looking for..."
                      className="w-full py-3 pl-12 pr-28 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-500/30 focus:border-purple-400 dark:focus:border-purple-700 transition-all duration-200 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <SparklesIcon className="h-5 w-5 text-purple-500" />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={isLoading || !searchTerm.trim()}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 py-1.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Searching</span>
                        </div>
                      ) : (
                        <span>Search</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="standard-search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by title, author, ISBN..."
                      className="w-full py-3 pl-12 pr-28 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-700 transition-all duration-200 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={isLoading || !searchTerm.trim()}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 py-1.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Searching</span>
                        </div>
                      ) : (
                        <span>Search</span>
                      )}
                    </button>
                  </div>

                  {/* Subject Filters */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1.5" />
                        Filter by subject
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {subjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => setSelectedSubject(subject)}
                          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedSubject === subject
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Results section */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? (
                <div className="flex flex-col justify-center items-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <LoadingSpinner size="large" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">Searching our collection...</p>
                </div>
              ) : isError ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-800/30">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Search Error
                  </h3>
                  <p>We encountered an issue while searching. Please try again or refine your search terms.</p>
                  <button 
                    onClick={() => refetch()}
                    className="mt-3 text-sm bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                      Search Results 
                      {searchResults?.length ? (
                        <span className="ml-2 text-blue-600 dark:text-blue-400">{searchResults.length} books found</span>
                      ) : null}
                    </h2>
                    
                    {searchResults?.length ? (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing results for "{searchTerm}"
                        {selectedSubject !== 'All Subjects' ? ` in ${selectedSubject}` : ''}
                      </p>
                    ) : null}
                  </div>
                  
                  {searchResults?.length ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
                      {searchResults.map((book) => (
                        <motion.div
                          key={book.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <BookCard book={book} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                        <MagnifyingGlassIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find any books matching your search criteria. Try different keywords or browse our categories.
                      </p>
                      {isAiSearch && (
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                          <p>When using AI search, try being more specific or using different terminology.</p>
                        </div>
                      )}
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default SearchPage;