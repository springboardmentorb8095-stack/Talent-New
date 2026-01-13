import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
  Squares2X2Icon,
  BanknotesIcon,
  CreditCardIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { menuItemVariants, sidebarVariants } from '../utils/animations';

const Sidebar = ({ onLinkClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: Squares2X2Icon, path: '/dashboard' },
  ];

  // For clients: Show Freelancers (candidates) and My Projects
  if (user?.role === 'client') {
    menuItems.push({ name: 'Freelancers', icon: UsersIcon, path: '/freelancers' });
    menuItems.push({ name: 'My Projects', icon: BriefcaseIcon, path: '/my-projects' });
  } else {
    // For freelancers: Show Projects Feed
    menuItems.push({ name: 'Projects', icon: BriefcaseIcon, path: '/projects' });
  }

  menuItems.push(
    { name: 'Proposals', icon: DocumentTextIcon, path: '/proposals' },
    { name: 'Contracts', icon: ClipboardDocumentCheckIcon, path: '/contracts' },
    { name: 'Chats', icon: ChatBubbleLeftRightIcon, path: '/chats' },
    { name: 'Calendar', icon: CalendarIcon, path: '/calendar' },
    { name: 'Reviews', icon: StarIcon, path: '/reviews' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
  );

  // Add Clients menu only for non-client users (freelancers might want to see clients)
  if (user?.role !== 'client') {
    // Insert before Settings (last item)
    menuItems.splice(menuItems.length - 2, 0, { name: 'Clients', icon: UsersIcon, path: '/clients' });
  }

  return (
    <motion.div 
      className={`h-full w-full ${darkMode ? 'bg-gray-900' : 'bg-[#0B1120]'} text-gray-400 flex flex-col overflow-y-auto transition-colors duration-200 pb-safe shadow-lg`}
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
    >
      {/* Logo Section */}
      <motion.div 
        className="p-6 md:p-4 flex items-center gap-3 md:gap-2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div 
          className="h-10 w-10 md:h-8 md:w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl md:text-sm"
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ duration: 0.2 }}
        >
          TL
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-white font-bold text-lg md:text-sm leading-tight">Talent Link</h1>
          <p className="text-xs md:text-[10px] text-gray-500 font-medium tracking-wider">
            {user?.role === 'client' ? 'CLIENT PORTAL' : 'FREELANCER PORTAL'}
          </p>
        </motion.div>
      </motion.div>

      {/* Menu Items */}
      <motion.div 
        className="flex-1 px-3 md:px-3 py-4 space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className="px-3 mb-3 text-xs md:text-[10px] font-semibold text-gray-500 uppercase tracking-wider"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Menu
        </motion.div>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.name}
            variants={menuItemVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 + (index * 0.1) }}
            whileHover="hover"
            whileTap="tap"
          >
            <NavLink
              to={item.path}
              onClick={() => {
                // Small delay to ensure navigation starts before closing
                setTimeout(() => {
                  onLinkClick && onLinkClick();
                }, 50);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 md:gap-2 px-3 md:px-2 py-3 md:py-2.5 rounded-lg text-sm md:text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5 md:h-4 md:w-4" />
              {item.name}
            </NavLink>
          </motion.div>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div 
        className="p-3 md:p-3 border-t border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-3 md:gap-2 w-full px-3 md:px-2 py-3 md:py-2.5 rounded-lg text-sm md:text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 md:h-4 md:w-4" />
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;