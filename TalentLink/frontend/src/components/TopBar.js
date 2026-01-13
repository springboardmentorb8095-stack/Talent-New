import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { MagnifyingGlassIcon, MoonIcon, SunIcon, Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from './NotificationDropdown';
import { useScrollAnimation } from '../hooks/useAnimations';

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [profileRef, isProfileVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <motion.div 
      className="h-16 md:h-18 bg-blue-600 flex items-center justify-between px-4 md:px-6 lg:px-8 transition-colors duration-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Left section - Menu button and logo/brand */}
      <motion.div 
        className="flex items-center gap-4"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      >
        {/* Mobile menu button */}
        <motion.button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-blue-500/60 transition-colors"
          title="Open menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Bars3Icon className="h-6 w-6 text-white" />
        </motion.button>
        
        {/* App title/brand - hidden on mobile, shown on desktop */}
        <motion.div 
          className="hidden md:block"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl font-bold text-white">Talent Link</h1>
        </motion.div>
      </motion.div>
      
      {/* Center section - Search or other content (optional) */}
      <motion.div 
        className="flex-1 max-w-2xl mx-8 hidden lg:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* You can add a search bar or other content here if needed */}
      </motion.div>
      
      {/* Right section - Profile, notifications, dark mode toggle */}
      <motion.div 
        className="flex items-center gap-4 md:gap-6 lg:gap-8"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <motion.button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-blue-500/60 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-white" />
          ) : (
            <MoonIcon className="h-5 w-5 text-white" />
          )}
        </motion.button>

        {/* Desktop notification dropdown - hidden on mobile */}
        <motion.div 
          className="hidden md:block relative"
          whileHover={{ scale: 1.05 }}
        >
            <NotificationDropdown />
        </motion.div>

        {/* Mobile notification button - hidden on desktop */}
        <motion.div 
          className="md:hidden"
          whileHover={{ scale: 1.05 }}
        >
          <Link 
            to="/notifications" 
            className="relative p-2 text-white hover:text-gray-100 transition-colors"
            title="Notifications"
          >
            <BellIcon className="h-6 w-6" />
            {/* You can add unread count badge here if needed */}
          </Link>
        </motion.div>

        <div className="h-8 w-px bg-blue-400/60"></div>

        <Link 
          to="/profile" 
          className="flex items-center gap-2 md:gap-3 hover:bg-blue-500/60 rounded-lg px-2 md:px-3 py-2 transition-colors group"
          ref={profileRef}
        >
          <motion.div 
            className="text-right"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: isProfileVisible ? 0 : 20, opacity: isProfileVisible ? 1 : 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-sm font-semibold text-white group-hover:text-white">{user?.first_name || user?.username || 'User'}</div>
            <div className="text-xs text-blue-100 uppercase hidden sm:block">{user?.role || 'USER'}</div>
          </motion.div>
          <motion.div 
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden group-hover:ring-2 group-hover:ring-blue-300 transition-all"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
             {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
             ) : (
                <span>{(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}</span>
             )}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default TopBar;
