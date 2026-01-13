import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { 
  mobileMenuVariants, 
  overlayVariants,
  pageVariants 
} from '../utils/animations';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isChatsPage = location.pathname === '/chats';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AnimatePresence>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {/* Sidebar */}
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-y-0 left-0 z-50 w-64 md:w-56 lg:w-60 md:relative md:translate-x-0"
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="h-full pt-16 md:pt-0">
              <Sidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar for desktop (always visible) */}
      <div className="hidden md:block md:relative md:w-56 lg:w-60">
        <div className="h-full pt-16 md:pt-0">
          <Sidebar onLinkClick={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <motion.div 
          className="sticky top-0 z-40 bg-gray-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </motion.div>
        <motion.main
          className={`flex-1 bg-gray-50 ${
            isChatsPage
              ? 'p-0 overflow-hidden'
              : 'p-4 md:p-6 lg:p-8 overflow-y-auto'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div 
            className="w-full h-full flex flex-col min-h-0"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
