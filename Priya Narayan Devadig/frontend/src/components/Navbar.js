import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (!currentUser) {
        return (
            <nav className="navbar-top">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        Freelance Marketplace
                    </Link>
                    <ul className="navbar-nav-horizontal">
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Top Header */}
            <header className="top-header">
                <div className="header-content">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <Link to="/" className="header-brand">
                        Freelance Marketplace
                    </Link>
                    <div className="header-right">
                        <NotificationBell />
                        <span className="user-welcome">
                            {currentUser.first_name}
                        </span>
                    </div>
                </div>
            </header>

            {/* Vertical Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-content">
                    <nav className="sidebar-nav">
                        <Link
                            to="/dashboard"
                            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Dashboard</span>
                        </Link>

                        <Link
                            to="/projects"
                            className={`nav-item ${isActive('/projects') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">📁</span>
                            <span className="nav-text">Projects</span>
                        </Link>

                        <Link
                            to="/contracts"
                            className={`nav-item ${isActive('/contracts') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">📄</span>
                            <span className="nav-text">Contracts</span>
                        </Link>

                        <Link
                            to="/messages"
                            className={`nav-item ${isActive('/messages') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">💬</span>
                            <span className="nav-text">Messages</span>
                        </Link>

                        <Link
                            to="/reviews"
                            className={`nav-item ${isActive('/reviews') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">⭐</span>
                            <span className="nav-text">Reviews</span>
                        </Link>

                        <Link
                            to="/profile"
                            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
                        >
                            <span className="nav-icon">👤</span>
                            <span className="nav-text">Profile</span>
                        </Link>

                        <button onClick={handleLogout} className="nav-item logout-btn">
                            <span className="nav-icon">🚪</span>
                            <span className="nav-text">Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}
        </>
    );
};

export default Navbar;