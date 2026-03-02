import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Notifications.css';

const Notifications = () => {
    const { currentUser: user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user, filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            let url = 'http://127.0.0.1:8000/api/auth/notifications/';

            if (filter === 'unread') {
                url += '?is_read=false';
            } else if (filter === 'read') {
                url += '?is_read=true';
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const notificationList = data.results || data;
                setNotifications(Array.isArray(notificationList) ? notificationList : []);
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
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
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

    if (!user) return <div>Please log in to view notifications.</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <h1>All Notifications</h1>
                <div className="notifications-actions">
                    <div className="filter-buttons">
                        <button
                            className={filter === 'all' ? 'active' : ''}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={filter === 'unread' ? 'active' : ''}
                            onClick={() => setFilter('unread')}
                        >
                            Unread
                        </button>
                        <button
                            className={filter === 'read' ? 'active' : ''}
                            onClick={() => setFilter('read')}
                        >
                            Read
                        </button>
                    </div>
                    <button className="mark-all-read-btn" onClick={markAllAsRead}>
                        Mark All Read
                    </button>
                </div>
            </div>

            <div className="notifications-content">
                {loading ? (
                    <div className="loading">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="no-notifications">
                        <p>No notifications found.</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
                                onClick={() => {
                                    if (!notification.is_read) {
                                        markAsRead(notification.id);
                                    }
                                }}
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
                                    <div className="notification-meta">
                                        <span className="notification-time">
                                            {formatTimeAgo(notification.created_at)}
                                        </span>
                                        <span className="notification-type">
                                            {notification.notification_type.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                                {!notification.is_read && (
                                    <div className="unread-indicator"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;