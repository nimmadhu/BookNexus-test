import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getBooks } from '../services/bookService';
import api from '../services/api';
import {
  BookOpenIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  totalUsers: number;
  checkedOutBooks: number;
}

interface RecentActivity {
  id: number;
  action: string;
  user: string;
  book: string;
  date: string;
}

const AdminDashboardPage: React.FC = () => {
  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // In a real app, you'd have a dedicated API endpoint for this
      // For now, we'll mock this data
      const response = await api.get('/admin/stats');
      return response.data;
    },
    // Fallback mock data if the endpoint doesn't exist
    placeholderData: {
      totalBooks: books?.length || 0,
      availableBooks: books?.filter(b => b.availableCopies > 0).length || 0,
      totalUsers: 42,
      checkedOutBooks: books ? (books.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0)) : 0
    }
  });

  // Mock recent activity data
  const recentActivity: RecentActivity[] = [
    { id: 1, action: 'Checked out', user: 'John Doe', book: 'The Great Gatsby', date: '2025-08-30' },
    { id: 2, action: 'Returned', user: 'Jane Smith', book: 'To Kill a Mockingbird', date: '2025-08-29' },
    { id: 3, action: 'Added new book', user: 'Admin', book: 'Dune', date: '2025-08-28' },
    { id: 4, action: 'Checked out', user: 'Alice Johnson', book: '1984', date: '2025-08-27' },
    { id: 5, action: 'Updated book', user: 'Admin', book: 'The Hobbit', date: '2025-08-26' },
  ];

  const isLoading = isBooksLoading || isStatsLoading;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your library system
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/admin/books/new" className="btn btn-primary">
                Add New Book
              </Link>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <BookOpenIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Books</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalBooks}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <DocumentDuplicateIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Books</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.availableBooks}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalUsers}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checked Out</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.checkedOutBooks}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8"
            >
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action} <span className="font-semibold">{activity.book}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.user}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                <Link to="/admin/activity" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View all activity
                </Link>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/books"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <BookOpenIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  <span className="ml-3 font-medium text-gray-900 dark:text-white">Manage Books</span>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <UsersIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  <span className="ml-3 font-medium text-gray-900 dark:text-white">Manage Users</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <DocumentDuplicateIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  <span className="ml-3 font-medium text-gray-900 dark:text-white">Reports</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;