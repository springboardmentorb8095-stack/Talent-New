import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                TL
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                TalentLink
              </span>
            </Link>
            
            {user && (
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                    <Link to="/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
                    <Link to="/projects" className="hover:text-brand-600 transition-colors">Browse Projects</Link>
                </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NotificationDropdown />
                
                <div className="relative ml-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-900">{user.first_name || user.username}</div>
                            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold border border-brand-200">
                            {(user.first_name?.[0] || user.username?.[0]).toUpperCase()}
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-100 scale-100 transition-all duration-100 ease-out origin-top-right">
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <UserCircleIcon className="h-4 w-4" /> Your Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <ArrowRightOnRectangleIcon className="h-4 w-4" /> Sign out
                            </button>
                        </div>
                    )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">Sign in</Link>
                <Link to="/register" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition shadow-sm hover:shadow">
                    Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;