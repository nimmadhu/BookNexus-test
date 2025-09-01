import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { BookOpenIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <BookOpenIcon className="h-24 w-24 mx-auto text-gray-400 dark:text-gray-600" />
            <h1 className="mt-4 text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              404
            </h1>
            <p className="mt-2 text-2xl font-semibold text-gray-700 dark:text-gray-300">
              Page not found
            </p>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              We couldn't find the page you're looking for. The book you're searching for might be in another section of our library.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/" 
              className="btn btn-primary"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <Link 
              to="/books" 
              className="btn btn-outline"
            >
              <BookOpenIcon className="h-5 w-5 mr-2" />
              Browse Books
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;