import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationBell = () => {
    const { currentUser: user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/auth/notifications/unread-count/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUnreadCount(data.unread_count);
            }
        } catch (err) {
            console.error('Error fetching unread count:', err);
        }
    };

    const fetchNotifications = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/auth/notifications/?page_size=20', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Notifications response:', data); // Debug log
                // Handle both paginated and non-paginated responses
                const notificationList = data.results || data;
                setNotifications(Array.isArray(notificationList) ? notificationList : []);
            } else {
                console.error('Failed to fetch notifications:', response.status);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('access_token');
            await fetch(`http://127.0.0.1:8000/api/auth/notifications/${notificationId}/read/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Update local state
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, is_read: true }
                        : notif
                )
            );

            // Update unread count
            if (unreadCount > 0) {
                setUnreadCount(prev => prev - 1);
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await fetch('http://127.0.0.1:8000/api/auth/notifications/mark-all-read/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Update local state
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, is_read: true }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown && notifications.length === 0) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        // Navigate to action URL if available
        if (notification.action_url) {
            // Use React Router navigation instead of window.location
            navigate(notification.action_url);
        }

        setShowDropdown(false);
    };

    const getNotificationIcon = (type) => {
        const icons = {
            'message': '💬',
            'proposal_received': '📝',
            'proposal_accepted': '✅',
            'proposal_rejected': '❌',
            'contract_created': '📋',
            'contract_completed': '🎉',
            'review_received': '⭐',
            'system': '🔔'
        };
        return icons[type] || '🔔';
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (!user) return null;

    return (
        <div className="notification-bell">
            <button
                className="bell-button"
                onClick={handleBellClick}
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                className="mark-all-read"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="no-notifications">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.notification_type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                        </div>
                                        <div className="notification-message">
                                            {notification.message}
                                        </div>
                                        <div className="notification-time">
                                            {formatTimeAgo(notification.created_at)}
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <div className="unread-dot"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="notification-footer">
                        <button
                            onClick={() => {
                                navigate('/notifications');
                                setShowDropdown(false);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4f46e5',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                            }}
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;