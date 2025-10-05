import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Film, Users, Camera, Palette, Globe, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';

interface LoginForm {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    await login(data.username, data.password);
  };

  const demoAccounts = [
    { username: 'director', password: 'password123', role: 'Director', icon: Camera, color: 'from-purple-500 to-indigo-600' },
    { username: 'producer', password: 'password123', role: 'Production Manager', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { username: 'prodmanager', password: 'password123', role: 'Producer', icon: Zap, color: 'from-green-500 to-emerald-600' },
    { username: 'distmanager', password: 'password123', role: 'Distribution Manager', icon: Globe, color: 'from-orange-500 to-red-600' },
    { username: 'crew', password: 'password123', role: 'Crew Member', icon: Users, color: 'from-gray-500 to-slate-600' },
    { username: 'vfx', password: 'password123', role: 'VFX Artist', icon: Palette, color: 'from-pink-500 to-rose-600' },
  ];

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setValue('username', account.username);
    setValue('password', account.password);
    login(account.username, account.password);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <Film className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">ProdSight</h1>
                <p className="text-purple-200">AI-Powered Production Management</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">
              Streamline Your Film Production
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Comprehensive production management with AI-driven insights, real-time collaboration, 
              and intelligent workflow automation for modern filmmaking.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                <span>AI-powered script breakdown and scheduling</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                <span>Real-time budget tracking and analytics</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                <span>Integrated VFX pipeline management</span>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
                <span>Distribution and marketing coordination</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/10 rounded-full animate-bounce" />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-pink-500/10 rounded-full animate-ping" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 lg:hidden"
            >
              <Film className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300">
              Sign in to your ProdSight account
            </p>
          </div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                  Username
                </label>
                <input
                  {...register('username')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-300">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-300">Quick Demo Access:</p>
                <button
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
                >
                  {showDemoAccounts ? 'Hide' : 'Show All'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {demoAccounts.slice(0, showDemoAccounts ? demoAccounts.length : 4).map((account) => {
                  const IconComponent = account.icon;
                  return (
                    <button
                      key={account.username}
                      onClick={() => handleDemoLogin(account)}
                      className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 group"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${account.color} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">{account.role}</p>
                        <p className="text-xs text-gray-400">{account.username}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!showDemoAccounts && demoAccounts.length > 4 && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  +{demoAccounts.length - 4} more roles available
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
