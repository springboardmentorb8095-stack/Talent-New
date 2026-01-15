import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useResponsiveAnimation, useReducedMotion } from '../hooks/useAnimations';
import { cardVariants, buttonVariants, fadeIn, staggerContainer, staggerItem } from '../utils/animations';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const responsiveCardVariants = useResponsiveAnimation('card');
  const responsiveButtonVariants = useResponsiveAnimation('button');
  const prefersReducedMotion = useReducedMotion();
  
  const finalCardVariants = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  } : (Object.keys(responsiveCardVariants).length > 0 ? responsiveCardVariants : cardVariants);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start relative pt-20 sm:pt-24">
      <motion.div 
        className="fixed top-0 left-0 w-full z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                TL
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                TalentLink
              </span>
            </Link>
          </motion.div>

          <motion.div 
            className="flex items-center gap-2 sm:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              variants={responsiveButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/" className="text-xs sm:text-sm font-medium text-gray-200 hover:text-white hover:underline transition-colors">Home</Link>
            </motion.div>
            <motion.div
              variants={responsiveButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/login" className="text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-colors">Log In</Link>
            </motion.div>
            <motion.div
              variants={responsiveButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/register" className="text-xs sm:text-sm font-medium bg-blue-600 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm hover:shadow-md">
                Sign Up
              </Link>
            </motion.div>
          </motion.div>
        </nav>
      </motion.div>

      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img 
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80" 
            alt="City Background" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </motion.div>

      <motion.div 
        className="relative z-10 max-w-xl w-full mx-2 sm:mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        variants={finalCardVariants}
      >
        <motion.div 
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
            <motion.div 
              className="text-center mb-6 sm:mb-8"
              variants={staggerItem}
            >
                <motion.h2 
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Create an Account
                </motion.h2>
                <motion.p 
                  className="text-blue-100 opacity-80 text-xs sm:text-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                    Join TalentLink today
                </motion.p>
            </motion.div>
        
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-500/20 border border-red-500/50 p-3 sm:p-4 text-red-100 rounded-lg mb-4 sm:mb-6 backdrop-blur-sm"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <p className="font-medium text-sm text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
                <motion.div variants={staggerItem}>
                    <motion.label 
                      className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >First Name</motion.label>
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        <input
                        name="first_name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-sm backdrop-blur-sm"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        />
                    </motion.div>
                </motion.div>
                <motion.div variants={staggerItem}>
                    <motion.label 
                      className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >Last Name</motion.label>
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        <input
                        name="last_name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-sm backdrop-blur-sm"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
                <motion.label 
                  className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >Email</motion.label>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                        name="email"
                        type="email"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-sm backdrop-blur-sm"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
                <motion.label 
                  className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                >Username</motion.label>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 }}
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                        name="username"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-sm backdrop-blur-sm"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </motion.div>
            </motion.div>

             <motion.div variants={staggerItem}>
                <motion.label 
                  className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                >I want to...</motion.label>
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BriefcaseIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-sm backdrop-blur-sm [&>option]:text-gray-900"
                    >
                        <option value="client">Hire Talent (Client)</option>
                        <option value="freelancer">Find Work (Freelancer)</option>
                    </select>
                </motion.div>
             </motion.div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <motion.div variants={staggerItem}>
                    <motion.label 
                        className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.6 }}
                    >Password</motion.label>
                    <motion.div 
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.7 }}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="block w-full pl-10 pr-12 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-sm backdrop-blur-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                        <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-200" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-200" />
                        )}
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div variants={staggerItem}>
                    <motion.label 
                        className="block text-sm font-medium text-blue-50 mb-1 ml-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.8 }}
                    >Confirm Password</motion.label>
                    <motion.div 
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.9 }}
                    >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-300" />
                        </div>
                        <input
                        name="password_confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="block w-full pl-10 pr-12 py-2.5 sm:py-3 bg-white/20 border border-white/10 rounded-lg placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-sm backdrop-blur-sm"
                        placeholder="Confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        />
                        <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                        {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-200" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-200" />
                        )}
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div 
                variants={staggerItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.0 }}
            >
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 flex justify-center py-2.5 sm:py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform transition-all active:scale-[0.98]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Sign Up'}
                </motion.button>
            </motion.div>
            </form>

            <motion.div 
                className="text-center mt-4 sm:mt-6"
                variants={staggerItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.1 }}
            >
                <p className="text-xs sm:text-sm text-blue-100 opacity-80">
                    Already have an account?{' '}
                    <motion.span
                        variants={responsiveButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Link to="/login" className="font-bold text-white hover:text-blue-200 transition-colors underline">
                            Log In
                        </Link>
                    </motion.span>
                </p>
            </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;