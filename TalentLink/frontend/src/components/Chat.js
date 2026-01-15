import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { conversationAPI } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { messageVariants, chatContainerVariants, typingIndicatorVariants } from '../utils/animations';
import { useScrollAnimation, useResponsiveAnimation, useReducedMotion } from '../hooks/useAnimations';

const ChatStyles = () => (
  <style jsx>{`
    .bg-chat-bg {
      background-color: #e5ddd5;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d1d1' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .dark .bg-chat-bg {
      background-color: #1a1a1a;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23404040' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .typing-indicator {
      font-style: italic;
      opacity: 0.7;
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0, -5px, 0);
      }
      70% {
        transform: translate3d(0, -3px, 0);
      }
      90% {
        transform: translate3d(0, -1px, 0);
      }
    }
    
    .animate-bounce {
      animation: bounce 1.4s infinite;
    }
  `}</style>
);

const Chat = ({ contractId, isWidget = true, onBackClick }) => {
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]); // eslint-disable-line no-unused-vars
  const [messageStatus, setMessageStatus] = useState({}); // Track message delivery status
  const [isSending, setIsSending] = useState(false); // Track if a message is currently being sent (for UI)
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const responsiveMessageVariants = useResponsiveAnimation('message');
  const responsiveButtonVariants = useResponsiveAnimation('button');
  const prefersReducedMotion = useReducedMotion();
  
  const finalMessageVariants = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  } : (Object.keys(responsiveMessageVariants).length > 0 ? responsiveMessageVariants : messageVariants);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesRef = useRef(messages);
  const isMountedRef = useRef(false);
  const isSendingRef = useRef(false);
  const lastSendTimeRef = useRef(0);
  const submitCountRef = useRef(0);
  const isPollingRequestRef = useRef(false);

  useEffect(() => {
    stopPolling();
    setSelectedConversation(null);
    setMessages([]);
    setError(null);
    loadConversations();
  }, [contractId]);

  useEffect(() => {
    scrollToBottom(false);
  }, [messages.length]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      isMountedRef.current = true;
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const pollingDelay = setTimeout(() => {
        startPolling();
      }, 1000);
      
      return () => {
        clearTimeout(pollingDelay);
        stopPolling();
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationAPI.getConversations();
      setConversations(response.data);
      
      if (contractId) {
        const contractConversation = response.data.find(
          conv => conv.contract === contractId
        );
        if (contractConversation) {
          setSelectedConversation(contractConversation);
          loadMessages(contractConversation.id);
        }
      }
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await conversationAPI.getMessages(conversationId);
      
      const sortedMessages = response.data.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
      
      const messagesWithStatus = sortedMessages.map(msg => ({
        ...msg,
        status: messageStatus[msg.id] || (msg.is_read ? 'read' : 'delivered')
      }));
      
      setMessages(prevMessages => {
        if (prevMessages.length === messagesWithStatus.length) {
          const areMessagesDifferent = messagesWithStatus.some((msg, index) => {
            const prevMsg = prevMessages[index];
            return !prevMsg || prevMsg.id !== msg.id || prevMsg.text !== msg.text;
          });
          
          if (!areMessagesDifferent) {
            return prevMessages;
          }
        }
        
        return messagesWithStatus;
      });
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const createConversation = async () => {
    try {
      const response = await conversationAPI.createConversation(contractId);
      setSelectedConversation(response.data);
      setConversations([...conversations, response.data]);
      loadMessages(response.data.id);
    } catch (err) {
      setError('Failed to create conversation');

    }
  };

  const sendMessage = async (e, voiceNote = null) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      setError('You must be logged in to send messages');
      return;
    }
    
    if (!isMountedRef.current) {
      return;
    }
    
    if (isSendingRef.current) {
      return;
    }
    
    const now = Date.now();
    if (now - lastSendTimeRef.current < 2000) {
      return;
    }
    lastSendTimeRef.current = now;
    
    const messageText = voiceNote ? voiceNote.text : newMessage.trim();
    if (!messageText || !selectedConversation || messageText.length === 0) {
      return;
    }
    
    const recentDuplicate = messagesRef.current.find(msg => 
      msg.text === messageText && 
      msg.is_mine && 
      (Date.now() - new Date(msg.created_at).getTime()) < 5000
    );
    
    if (recentDuplicate) {
      return;
    }
    
    isSendingRef.current = true;
    setIsSending(true);
    
    const safetyTimeout = setTimeout(() => {
      if (isSendingRef.current) {

        isSendingRef.current = false;
        setIsSending(false);
      }
    }, 10000);
    
    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      sender: user.id,
      sender_name: user.name || user.username,
      sender_avatar: user.avatar || '',
      conversation: selectedConversation.id,
      created_at: new Date().toISOString(),
      is_mine: true,
      message_type: 'text',
      status: 'sending',
      is_read: false,
      replying_to: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender_name: replyingTo.sender_name
      } : null
    };

    setMessages(prev => {
      const allMessages = [...prev, tempMessage];
      return allMessages.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
    });
    setNewMessage('');
    if (replyingTo) {
      setReplyingTo(null);
    }

    try {
      const response = await conversationAPI.sendMessage(selectedConversation.id, {
        text: messageText,
        message_type: 'text'
      });
      
      clearTimeout(safetyTimeout);
      
      isSendingRef.current = false;
      setIsSending(false);
      
      setMessages(prev => {
        const alreadyExists = prev.some(msg => msg.id === response.data.id);
        
        if (alreadyExists) {
          const filteredMessages = prev.filter(msg => msg.id !== tempMessage.id);
          return filteredMessages.sort((a, b) => 
            new Date(a.created_at) - new Date(b.created_at)
          );
        }

        const updatedMessages = prev.map(msg => 
          msg.id === tempMessage.id ? { ...response.data, status: 'sent' } : msg
        );
        
        return updatedMessages.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
      });
      
      if (selectedConversation) {
        setTimeout(() => {
          loadMessages(selectedConversation.id);
        }, 500); // Small delay to allow backend processing
      }
      
      // Update message status
      setMessageStatus(prev => ({
        ...prev,
        [response.data.id]: 'sent'
      }));
      
    } catch (err) {
      // Clear safety timeout
      clearTimeout(safetyTimeout);
      
      // Reset sending flag even on error
      isSendingRef.current = false;
      setIsSending(false); // Update UI state
      
      let errorMessage = 'Failed to send message';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data?.detail || err.response.data?.error || 'Server error';
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Network error - please check your connection';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = 'Message send failed';
      }
      
      setError(errorMessage);
      
      // Update temporary message to show error and sort chronologically
      setMessages(prev => {
        const updatedMessages = prev.map(msg => 
          msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
        );
        return updatedMessages.sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
      });
    }
  };

  const startPolling = () => {
    if (pollingIntervalRef.current) {
      return;
    }
    
    stopPolling();
    
    const poll = async () => {
      if (!selectedConversation) return;
      if (isPollingRequestRef.current) {
        return;
      }
      isPollingRequestRef.current = true;
      
      try {
        await loadMessages(selectedConversation.id);
      } catch (err) {
        // Silent fail for polling errors
      } finally {
        isPollingRequestRef.current = false;
      }
    };
    
    pollingIntervalRef.current = setInterval(poll, 1000); // Poll every 1 second for faster updates
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;
    if (!force && (!isUserAtBottom || !autoScrollEnabled)) return;
    messagesEndRef.current.scrollIntoView({ behavior: force ? 'auto' : 'smooth' });
  };

  const handleInputChange = (e) => {

    setNewMessage(e.target.value);
    
    // Implement typing indicator
    if (!isTyping && !isSending) {
      setIsTyping(true);
      // Here you would typically send a typing indicator to the server
      // For now, we'll just manage local state
    }
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new typing timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const threshold = 10;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom <= threshold;
    setIsUserAtBottom(atBottom);
    if (!atBottom) {
      setAutoScrollEnabled(false);
    } else {
      setAutoScrollEnabled(true);
    }
  };

  const handleFormSubmit = (e) => {
    submitCountRef.current += 1;
    
    // Always prevent default form submission
    if (e.preventDefault) {
      e.preventDefault();
    }
    if (e.stopPropagation) {
      e.stopPropagation(); // Stop event propagation
    }
    
    // Aggressive protection against multiple submissions
    if (isSendingRef.current) {
      return;
    }
    
    // Check if too soon since last submission (1 second minimum)
    const now = Date.now();
    if (now - lastSendTimeRef.current < 1000) {
      return;
    }
    
    // Only proceed with sendMessage if component is fully mounted
    if (isMountedRef.current) {
      sendMessage(e);
    }
  };

  const handleButtonClick = (e) => {

    // Prevent default button behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Call the main form submit handler
    handleFormSubmit(e);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleClearChat = async () => {
    if (!selectedConversation) return;
    
    if (window.confirm('Are you sure you want to clear all messages in this conversation?')) {
      try {
        await conversationAPI.clearChat(selectedConversation.id);
        setMessages([]);
        // Reload messages after clearing
        await loadMessages(selectedConversation.id);
      } catch (err) {
        setError('Failed to clear chat');

      }
    }
  };



  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    // Sort messages within each date group chronologically
    Object.keys(groups).forEach(date => {
      groups[date].sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      );
    });
    
    return groups;
  };

  const getMessageStatusIcon = (message) => {
    if (message.is_mine) {
      if (message.status === 'sending') {
        return <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>;
      } else if (message.status === 'sent') {
        return (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      } else if (message.status === 'delivered') {
        return (
          <>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-gray-400 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        );
      } else if (message.status === 'read') {
        return (
          <>
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <svg className="w-3 h-3 text-blue-500 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        );
      } else if (message.status === 'failed') {
        return <span className="text-red-500 text-xs font-bold">!</span>;
      }
    }
    return null;
  };

  const retryMessage = async (message) => {
    if (message.status !== 'failed') return;
    
    // Remove failed message
    setMessages(prev => prev.filter(msg => msg.id !== message.id));
    
    // Set the message text back to input
    setNewMessage(message.text);
    
    // Focus the input
    const input = document.querySelector('input[placeholder="Type a message"]');
    if (input) {
      input.focus();
    }
  };

  if (loading) {
    return (
      <>
        <ChatStyles />
        <div className={`flex items-center justify-center h-64 ${
          darkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            darkMode ? 'border-blue-500' : 'border-blue-600'
          }`}></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ChatStyles />
        <div className={`border px-4 py-3 rounded ${
          darkMode 
            ? 'bg-red-900 border-red-700 text-red-300'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {error}
        </div>
      </>
    );
  }

  if (!selectedConversation && contractId) {
    return (
      <div className={`text-center py-8 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <p className={`mb-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>No conversation found for this contract.</p>
        <button
          onClick={createConversation}
          className={`px-4 py-2 rounded ${
            darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Start Conversation
        </button>
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className={`text-center py-8 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Select a conversation to start messaging.
        </p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);
  
  return (
      <>
        <ChatStyles />
    <motion.div 
      className={`flex flex-col ${isWidget ? 'h-[380px] sm:h-[420px] md:h-[520px]' : 'h-full min-h-0'} ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${isWidget ? 'rounded-lg shadow-lg' : 'md:rounded-none md:shadow-none'} overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header - WhatsApp Style */}
      <motion.div 
        className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'} px-4 py-3 md:px-6 md:py-4 border-t border-b border-t-white ${darkMode ? 'border-b-gray-700' : 'border-b-blue-700'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onBackClick}
              className={`md:hidden p-1 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-blue-500'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <span className="text-base md:text-lg font-semibold">
                {selectedConversation.contract_details?.title?.charAt(0) || 'C'}
              </span>
            </motion.div>
            <div>
              <motion.h3 
                className="font-semibold text-base md:text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {selectedConversation.contract_details?.title || 'Contract Discussion'}
              </motion.h3>
              <motion.p 
                className={`text-xs sm:text-sm ${
                  darkMode ? 'text-gray-300' : 'text-blue-100'
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {typingUsers.length > 0 ? (
                  <motion.span 
                    className="typing-indicator"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    typing...
                  </motion.span>
                ) : (
                  selectedConversation.participants_names?.join(', ')
                )}
              </motion.p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleClearChat}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700'
              }`}
              title="Clear chat"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div 
          className={`px-4 py-2 border-l-4 ${
            darkMode 
              ? 'bg-red-900 border-red-500 text-red-200' 
              : 'bg-red-50 border-red-400 text-red-700'
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}

      {/* Messages Container */}
      <motion.div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className={`flex-1 overflow-y-auto px-2 sm:px-3 md:px-6 lg:px-8 py-4 ${darkMode ? 'bg-gray-900' : 'bg-chat-bg'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className={`${isWidget ? 'max-w-2xl mx-auto' : 'w-full'}`}>
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div 
                className="flex justify-start mb-2 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className={`rounded-2xl rounded-bl-none px-3 py-2 shadow-sm ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  }`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex space-x-1">
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-gray-300' : 'bg-gray-400'
                      }`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-gray-300' : 'bg-gray-400'
                      }`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-gray-300' : 'bg-gray-400'
                      }`}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <motion.div 
              key={date} 
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="flex justify-center my-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className={`text-xs px-3 py-1 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                  {formatDate(dateMessages[0].created_at)}
                </div>
              </motion.div>
              
              {dateMessages.map((message, index) => {
              const isFirstInSequence = index === 0 || 
                dateMessages[index - 1].sender !== message.sender;
              const isLastInSequence = index === dateMessages.length - 1 || 
                dateMessages[index + 1].sender !== message.sender;
              
                return (
                  <motion.div
                  key={message.id}
                  className={`${message.is_mine ? 'flex justify-end' : 'flex justify-start'} ${
                    isFirstInSequence ? 'mt-2' : ''
                  }`}
                  variants={finalMessageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  transition={{ delay: index * 0.05 }}
                >
                    <div className={`flex items-end space-x-1 max-w-full ${
                      message.is_mine ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                    {!message.is_mine && isFirstInSequence && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        <span className={`text-xs font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {message.sender_name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    
                    {!message.is_mine && !isFirstInSequence && (
                      <div className="w-8 h-8 flex-shrink-0"></div>
                    )}
                    
                    <motion.div
                      className={`relative rounded-2xl ${
                        isWidget
                          ? 'px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-3 md:py-2 max-w-[78%] md:max-w-[68%] lg:max-w-[60%]'
                          : 'px-3 py-1.5 sm:px-3.5 sm:py-1.5 md:px-4 md:py-1 max-w-[82%] md:max-w-[78%] lg:max-w-[72%]'
                      } ${
                        message.is_mine
                          ? darkMode 
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-blue-500 text-white rounded-br-none'
                          : darkMode
                            ? 'bg-gray-700 text-white rounded-bl-none shadow-sm'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                      } ${
                        !message.is_mine && !isFirstInSequence ? 'rounded-tl-lg' : ''
                      } ${
                        message.is_mine && !isFirstInSequence ? 'rounded-tr-lg' : ''
                      } ${
                        !isLastInSequence ? 'mb-1' : ''
                      } ${
                        message.status === 'failed' 
                          ? darkMode 
                            ? 'border-2 border-red-500 hover:bg-red-900'
                            : 'border-2 border-red-300 hover:bg-red-50'
                          : ''
                      } group`}
                      onClick={() => message.status === 'failed' && retryMessage(message)}
                      style={{ cursor: message.status === 'failed' ? 'pointer' : 'default' }}
                      title={message.status === 'failed' ? 'Click to retry sending this message' : ''}
                      whileHover={{ scale: message.status === 'failed' ? 1.02 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* System Message */}
                      {message.message_type === 'system' && (
                        <div className="text-xs opacity-75 mb-1 border-b border-current pb-1">
                          System
                        </div>
                      )}
                      
                      {/* Reply To */}
                      {message.replying_to && (
                        <div className={`mb-2 p-2 rounded border-l-2 text-xs ${
                          message.is_mine 
                            ? darkMode
                              ? 'border-blue-400 bg-blue-600 bg-opacity-30'
                              : 'border-blue-200 bg-blue-400 bg-opacity-20'
                            : darkMode
                              ? 'border-gray-600 bg-gray-800'
                              : 'border-gray-300 bg-gray-50'
                        }`}>
                          <div className={`font-medium ${
                            message.is_mine 
                              ? darkMode ? 'text-blue-200' : 'text-blue-100'
                              : darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {message.replying_to.sender_name}
                          </div>
                          <div className={`truncate ${
                            message.is_mine 
                              ? darkMode ? 'text-blue-200' : 'text-blue-100'
                              : darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {message.replying_to.text}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-end gap-2 mt-0.5">
                        <p className="flex-1 text-xs sm:text-[14px] md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        <div className={`flex items-center justify-end space-x-1 ${
                          message.is_mine 
                            ? darkMode ? 'text-blue-200' : 'text-blue-100'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <span className="text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap">
                            {formatTime(message.created_at)}
                          </span>
                          
                          {message.is_mine && (
                            <div className="flex items-center">
                              {getMessageStatusIcon(message)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        message.is_mine ? 'mr-2' : 'ml-2'
                      }`}>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(message);
                          }}
                          className={`p-1 rounded-full text-xs ${
                            message.is_mine 
                              ? darkMode ? 'text-blue-200 hover:text-white' : 'text-blue-100 hover:text-white'
                              : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title="Reply to this message"
                          variants={responsiveButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              className="flex justify-start mb-2 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className={`rounded-2xl rounded-bl-none px-3 py-2 shadow-sm ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex space-x-1">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-300' : 'bg-gray-400'
                    }`}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-300' : 'bg-gray-400'
                    }`}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  />
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      darkMode ? 'bg-gray-300' : 'bg-gray-400'
                    }`}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Message Input - WhatsApp Style */}
        <motion.div 
          className={`px-4 py-3 border-t ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {/* Reply Preview */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div 
                className={`mb-3 p-3 rounded-lg border-l-4 ${
                  darkMode ? 'bg-gray-700 border-blue-600' : 'bg-gray-50 border-blue-500'
                }`}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`text-xs mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Replying to {replyingTo.sender_name}
                    </div>
                    <div className={`text-xs sm:text-sm truncate ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {replyingTo.text}
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={cancelReply}
                    className={`ml-2 ${
                      darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    variants={responsiveButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={`flex items-center space-x-3 ${isWidget ? 'px-2 md:px-0' : 'px-4 md:px-6'}`}>
          
          <div className="flex-1 relative">
            <motion.input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSending && newMessage.trim()) {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFormSubmit(e);
                }
              }}
              placeholder={isSending ? "Sending..." : "Type a message"}
              disabled={isSending}
              className={`w-full border-none rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600'
                  : 'bg-gray-100 text-gray-900 focus:bg-white'
              } ${
                isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <motion.button
            type="button"
            onClick={handleButtonClick}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() && !isSending
                ? darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                : darkMode
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            variants={responsiveButtonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={{ rotate: isSending ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default Chat;
