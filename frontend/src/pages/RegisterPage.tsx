import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { BookOpenIcon } from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-emerald-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg border-2 border-emerald-100 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 rounded-full -ml-20 -mb-20 z-0"></div>
        
        <div className="relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6 p-3 bg-emerald-100 rounded-full"
            >
              <BookOpenIcon className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h2 className="mt-2 text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
              Join BookNexus
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Create your account to get started
            </p>
          </div>
          
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;