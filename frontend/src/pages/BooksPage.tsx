import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../services/bookService';
import MainLayout from '../components/layout/MainLayout';
import BookCard from '../components/books/BookCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Book } from '../types/books';

const BooksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [researchArea, setResearchArea] = useState(searchParams.get('area') || '');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>(searchParams.get('available') || 'all');

  const { data: books, isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  // Get unique subjects and research areas for filters
  const subjects = books ? [...new Set(books.map((book: Book) => book.subject))].filter(Boolean) : [];
  const researchAreas = books ? [...new Set(books.map((book: Book) => book.researchArea))].filter(Boolean) : [];

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.q = searchTerm;
    if (subject) params.subject = subject;
    if (researchArea) params.area = researchArea;
    if (availabilityFilter !== 'all') params.available = availabilityFilter;

    setSearchParams(params);
  }, [searchTerm, subject, researchArea, availabilityFilter, setSearchParams]);

  // Filter books based on search criteria
  const filteredBooks = books?.filter((book: Book) => {
    // Text search
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Subject filter
    const matchesSubject = !subject || book.subject === subject;
    
    // Research area filter
    const matchesResearchArea = !researchArea || book.researchArea === researchArea;
    
    // Availability filter
    const matchesAvailability = 
      availabilityFilter === 'all' || 
      (availabilityFilter === 'available' && book.availableCopies > 0) ||
      (availabilityFilter === 'unavailable' && book.availableCopies === 0);
    
    return matchesSearch && matchesSubject && matchesResearchArea && matchesAvailability;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSubject('');
    setResearchArea('');
    setAvailabilityFilter('all');
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-md">
          Failed to load books. Please try again.
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Library Collection</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of books and research materials.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
              
              <div className="mb-4">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Title, author, or ISBN"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="researchArea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Research Area
                </label>
                <select
                  id="researchArea"
                  value={researchArea}
                  onChange={(e) => setResearchArea(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Research Areas</option>
                  {researchAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availabilityFilter === 'all'}
                      onChange={() => setAvailabilityFilter('all')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">All</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availabilityFilter === 'available'}
                      onChange={() => setAvailabilityFilter('available')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Available</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={availabilityFilter === 'unavailable'}
                      onChange={() => setAvailabilityFilter('unavailable')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Unavailable</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleClearFilters}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>
          
          {/* Book grid */}
          <div className="lg:w-3/4">
            {filteredBooks && filteredBooks.length > 0 ? (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Showing {filteredBooks.length} books
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book: Book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or clearing filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BooksPage;