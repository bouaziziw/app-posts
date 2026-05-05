import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { RegisterPayload } from '../types/Post';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import toast from 'react-hot-toast';
import Spinner from './Spinner';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterPayload>();
  const dispatch = useDispatch();

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      dispatch(login(data));
      toast.success('Registration successful!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Registration failed');
    },
  });

  const onSubmit = async (data: RegisterPayload) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <span className="text-red-500 text-sm mt-1">{errors.username.message}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 mb-4"
          >
            {registerMutation.isPending ? (
              <>
                <Spinner size="sm" />
                <span>Registering...</span>
              </>
            ) : (
              'Register'
            )}
          </button>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;