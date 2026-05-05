import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { LoginPayload } from '../types/Post';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import toast from 'react-hot-toast';
import Spinner from './Spinner';

interface LoginProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>();
  const dispatch = useDispatch();

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      dispatch(login(data));
      toast.success('Logged in successfully!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Login failed');
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    await loginMutation.mutateAsync(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 mb-4"
          >
            {loginMutation.isPending ? (
              <>
                <Spinner size="sm" />
                <span>Logging in...</span>
              </>
            ) : (
              'Login'
            )}
          </button>

          <button
            type="button"
            onClick={onSwitchToRegister}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Don't have an account? Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;