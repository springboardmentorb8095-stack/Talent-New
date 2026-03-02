import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Messages.css';

const Messages = () => {
    const { currentUser: user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showStartConversation, setShowStartConversation] = useState(false);
    const [users, setUsers] = useState([]);
    const [newConversation, setNewConversation] = useState({
        recipient_id: '',
        message: ''
    });
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const messagesEndRef = useRef(null);
    const pollingRef = useRef(null);

    useEffect(() => {
        if (user) {
            fetchConversations();
            fetchUsers();
        }

        // Set up polling for new messages
        const interval = setInterval(() => {
            if (user) fetchConversations();
        }, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
            startLongPolling(selectedConversation.id);
        }

        return () => {
            if (pollingRef.current) {
                clearTimeout(pollingRef.current);
            }
        };
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('access_token'); // Changed from 'token' to 'access_token'
            const response = await fetch('http://127.0.0.1:8000/api/messages/conversations/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            } else {
                setError('Failed to fetch conversations');
            }
        } catch (err) {
            setError('Error loading conversations');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('access_token'); // Changed from 'token' to 'access_token'
            const response = await fetch('http://127.0.0.1:8000/api/auth/users/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Filter out current user
                setUsers(data.results?.filter(u => u.id !== user.id) || []);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const token = localStorage.getItem('access_token'); // Changed from 'token' to 'access_token'
            const response = await fetch(`http://127.0.0.1:8000/api/messages/conversations/${conversationId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || data);

                // Mark conversation as read
                await fetch(`http://127.0.0.1:8000/api/messages/conversations/${conversationId}/read/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Refresh conversations to update unread counts
                fetchConversations();
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const startLongPolling = (conversationId) => {
        const poll = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const lastMessage = messages[messages.length - 1];
                const lastMessageTime = lastMessage ? lastMessage.sent_at : new Date().toISOString();

                const response = await fetch(
                    `http://127.0.0.1:8000/api/messages/long-poll/${conversationId}/?last_message_time=${encodeURIComponent(lastMessageTime)}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.has_new_messages && data.messages.length > 0) {
                        setMessages(prev => {
                            // Filter out messages that already exist
                            const existingIds = new Set(prev.map(msg => msg.id));
                            const newMessages = data.messages.filter(msg => !existingIds.has(msg.id));

                            if (newMessages.length > 0) {
                                return [...prev, ...newMessages];
                            }
                            return prev;
                        });
                        fetchConversations(); // Update conversation list
                    }
                }
            } catch (err) {
                console.error('Long polling error:', err);
            }

            // Continue polling
            pollingRef.current = setTimeout(poll, 1000);
        };

        poll();
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        setNewMessage(''); // Clear input immediately

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/messages/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversation_id: selectedConversation.id,
                    content: messageContent
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Only add message if it's not already in the list
                setMessages(prev => {
                    const messageExists = prev.some(msg => msg.id === data.id);
                    if (!messageExists) {
                        return [...prev, data];
                    }
                    return prev;
                });
                fetchConversations(); // Update conversation list
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to send message');
                setNewMessage(messageContent); // Restore message on error
            }
        } catch (err) {
            setError('Error sending message');
            setNewMessage(messageContent); // Restore message on error
        }
    };

    const handleStartConversation = async (e) => {
        e.preventDefault();
        if (!newConversation.recipient_id || !newConversation.message.trim()) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/messages/start-conversation/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newConversation),
            });

            if (response.ok) {
                const data = await response.json();
                setShowStartConversation(false);
                setNewConversation({ recipient_id: '', message: '' });
                fetchConversations();

                // Select the new conversation
                setTimeout(() => {
                    const newConv = conversations.find(c => c.id === data.conversation_id);
                    if (newConv) setSelectedConversation(newConv);
                }, 500);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to start conversation');
            }
        } catch (err) {
            setError('Error starting conversation');
        }
    };

    const handleClearChat = async () => {
        if (!selectedConversation) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`http://127.0.0.1:8000/api/messages/conversations/${selectedConversation.id}/clear/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setMessages([]);
                setShowClearConfirm(false);
                fetchConversations();
            } else {
                setError('Failed to clear chat');
            }
        } catch (err) {
            setError('Error clearing chat');
        }
    };

    if (loading) return <div className="messages-loading">Loading conversations...</div>;
    if (!user) return <div className="messages-loading">Please log in to view messages.</div>;

    return (
        <div className="messages-page">
            <div className="messages-header">
                <h1>Messages</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowStartConversation(true)}
                >
                    ✉️ New
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="messages-container">
                {/* Conversations List */}
                <div className="conversations-sidebar">
                    <div className="conversations-header">
                        <h3>Conversations</h3>
                    </div>

                    <div className="conversations-list">
                        {conversations.length === 0 ? (
                            <div className="no-conversations">
                                <p>💬</p>
                                <p>No conversations yet</p>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setShowStartConversation(true)}
                                >
                                    Start a conversation
                                </button>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => setSelectedConversation(conv)}
                                >
                                    <div className="conversation-info">
                                        <div className="conversation-header">
                                            <h4>{conv.other_user_name}</h4>
                                            {conv.unread_count > 0 && (
                                                <span className="unread-badge">{conv.unread_count}</span>
                                            )}
                                        </div>
                                        <p className="conversation-preview">{conv.last_message_preview}</p>
                                        <div className="conversation-meta">
                                            <span className="user-type">{conv.other_user_type}</span>
                                            {conv.project_title && (
                                                <span className="project-title">• {conv.project_title}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="messages-main">
                    {selectedConversation ? (
                        <>
                            {/* Messages Header */}
                            <div className="messages-header-bar">
                                <div className="conversation-details">
                                    <h3>{selectedConversation.other_user_name}</h3>
                                    <p>{selectedConversation.other_user_type}</p>
                                    {selectedConversation.project_title && (
                                        <p className="project-context">Project: {selectedConversation.project_title}</p>
                                    )}
                                </div>
                                <button
                                    className="clear-chat-btn"
                                    onClick={() => setShowClearConfirm(true)}
                                    title="Clear chat history"
                                >
                                    🗑️ Clear Chat
                                </button>
                            </div>

                            {/* Messages List */}
                            <div className="messages-list">
                                {messages.length === 0 ? (
                                    <div className="no-messages">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`message ${message.sender === user.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-content">
                                                <p>{message.content}</p>
                                                <div className="message-meta">
                                                    <span className="message-time">
                                                        {new Date(message.sent_at).toLocaleString()}
                                                    </span>
                                                    {message.sender === user.id && (
                                                        <span className={`read-status ${message.is_read ? 'read' : 'unread'}`}>
                                                            {message.is_read ? '✓✓' : '✓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Send Message Form */}
                            <form onSubmit={handleSendMessage} className="send-message-form">
                                <div className="message-input-container">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        rows="2"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                    <button type="submit" className="send-button">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="no-conversation-selected">
                            <div className="placeholder-content">
                                <p>💬</p>
                                <h3>Select a conversation</h3>
                                <p>Choose a conversation from the sidebar to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Start Conversation Modal */}
            {showStartConversation && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Start New Conversation</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowStartConversation(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleStartConversation} className="start-conversation-form">
                            <div className="form-group">
                                <label>Send message to:</label>
                                <select
                                    value={newConversation.recipient_id}
                                    onChange={(e) => setNewConversation({ ...newConversation, recipient_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.last_name} ({user.user_type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Message:</label>
                                <textarea
                                    value={newConversation.message}
                                    onChange={(e) => setNewConversation({ ...newConversation, message: e.target.value })}
                                    placeholder="Type your message..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowStartConversation(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Start Conversation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Clear Chat Confirmation Modal */}
            {showClearConfirm && (
                <div className="modal-overlay">
                    <div className="modal confirm-modal">
                        <div className="modal-header">
                            <h3>Clear Chat History?</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <p>Are you sure you want to clear all messages in this conversation? This action cannot be undone.</p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleClearChat}
                            >
                                Clear Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;