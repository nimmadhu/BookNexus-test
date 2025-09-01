import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/authService';
import api from '../services/api';
import MainLayout from '../components/layout/MainLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { type ProfileFormData, profileSchema } from '../types/auth';

const ProfilePage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profileData?.name || user?.name || '',
      email: profileData?.email || user?.email || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: profileData?.name || user?.name || '',
      email: profileData?.email || user?.email || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (authLoading || profileLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">User Profile</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your account information
            </p>
          </div>
          
          <div className="px-6 py-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className={`input ${errors.name ? 'border-red-500' : ''}`}
                    {...register('name')}
                  />
                  {errors.name && <p className="error-text">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className="input bg-gray-100 dark:bg-gray-700"
                    {...register('email')}
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="label">Current Password</label>
                      <input
                        id="currentPassword"
                        type="password"
                        className={`input ${errors.currentPassword ? 'border-red-500' : ''}`}
                        {...register('currentPassword')}
                      />
                      {errors.currentPassword && <p className="error-text">{errors.currentPassword.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="label">New Password</label>
                      <input
                        id="newPassword"
                        type="password"
                        className={`input ${errors.newPassword ? 'border-red-500' : ''}`}
                        {...register('newPassword')}
                      />
                      {errors.newPassword && <p className="error-text">{errors.newPassword.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        {...register('confirmPassword')}
                      />
                      {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <LoadingSpinner size="small" color="white" className="mr-2" />
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</h4>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white capitalize">{user?.role}</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={handleEdit}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ProfilePage;