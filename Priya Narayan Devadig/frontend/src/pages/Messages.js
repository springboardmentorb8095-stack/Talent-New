import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
    const { currentUser } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ subject: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
        // Poll for new messages every 30 seconds
        const interval = setInterval(fetchConversations, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedPartner) {
            fetchMessages(selectedPartner.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPartner]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/messages/conversations/');
            setConversations(response.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/messages/?partner=${partnerId}`);
            setMessages(response.data.results || response.data);

            // Mark conversation as read
            await axios.post(`http://127.0.0.1:8000/api/messages/conversation/${partnerId}/read/`);
            fetchConversations(); // Refresh to update unread counts
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.content.trim()) return;

        try {
            await axios.post('http://127.0.0.1:8000/api/messages/', {
                recipient: selectedPartner.id,
                subject: newMessage.subject || 'No Subject',
                content: newMessage.content
            });

            setNewMessage({ subject: '', content: '' });
            fetchMessages(selectedPartner.id);
        } catch (error) {
            alert('Error sending message: ' + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>Messages</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: '600px' }}>
                {/* Conversations List */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    overflow: 'auto'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                        <h3 style={{ margin: 0 }}>Conversations</h3>
                    </div>
                    {conversations.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#666' }}>
                            <p style={{ fontSize: '36px', margin: '0 0 10px 0' }}>💬</p>
                            <p>No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedPartner(conv)}
                                style={{
                                    padding: '15px 20px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPartner?.id === conv.id ? '#f8f9ff' : 'white',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (selectedPartner?.id !== conv.id) {
                                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (selectedPartner?.id !== conv.id) {
                                        e.currentTarget.style.backgroundColor = 'white';
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{conv.name}</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {conv.last_message_preview}
                                        </p>
                                    </div>
                                    {conv.unread_count > 0 && (
                                        <span style={{
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {conv.unread_count}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Thread */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {selectedPartner ? (
                        <>
                            {/* Header */}
                            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                                <h3 style={{ margin: 0 }}>{selectedPartner.name}</h3>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                                    {selectedPartner.user_type}
                                </p>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {messages.slice().reverse().map(msg => (
                                            <div
                                                key={msg.id}
                                                style={{
                                                    alignSelf: msg.sender === currentUser?.id ? 'flex-end' : 'flex-start',
                                                    maxWidth: '70%'
                                                }}
                                            >
                                                <div style={{
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    backgroundColor: msg.sender === currentUser?.id ? '#667eea' : '#f0f0f0',
                                                    color: msg.sender === currentUser?.id ? 'white' : '#333'
                                                }}>
                                                    {msg.subject !== 'No Subject' && (
                                                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px' }}>
                                                            {msg.subject}
                                                        </p>
                                                    )}
                                                    <p style={{ margin: 0 }}>{msg.content}</p>
                                                    <p style={{
                                                        margin: '8px 0 0 0',
                                                        fontSize: '12px',
                                                        opacity: 0.7
                                                    }}>
                                                        {new Date(msg.sent_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Send Message Form */}
                            <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
                                <input
                                    type="text"
                                    placeholder="Subject (optional)"
                                    value={newMessage.subject}
                                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginBottom: '10px'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <textarea
                                        placeholder="Type your message..."
                                        value={newMessage.content}
                                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                        required
                                        rows="3"
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            resize: 'none'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            color: '#666'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '48px', margin: '0 0 10px 0' }}>💬</p>
                                <p>Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;