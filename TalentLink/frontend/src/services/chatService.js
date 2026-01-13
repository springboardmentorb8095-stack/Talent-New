import api from '../api';

// Conversation API calls
export const conversationAPI = {
  // Get all conversations for the current user
  getConversations: () => api.get('/chat/conversations/'),
  
  // Get a specific conversation
  getConversation: (id) => api.get(`/chat/conversations/${id}/`),
  
  // Create a new conversation for a contract
  createConversation: (contractId) => api.post('/chat/conversations/', { contract_id: contractId }),
  
  // Get messages for a conversation
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}/messages/`),
  
  // Send a message in a conversation
  sendMessage: (conversationId, messageData) => 
    api.post(`/chat/conversations/${conversationId}/send_message/`, messageData),
  
  // Mark all messages in a conversation as read
  markAsRead: (conversationId) => api.post(`/chat/conversations/${conversationId}/mark_as_read/`),
  
  // Long-polling for new messages
  pollMessages: (conversationId, lastMessageId) => 
    api.get(`/chat/conversations/${conversationId}/poll/?last_message_id=${lastMessageId}`),
  
  // Clear all messages in a conversation
  clearChat: (conversationId) => 
    api.post(`/chat/conversations/${conversationId}/clear_chat/`)
};

// Message API calls
export const messageAPI = {
  // Get all messages
  getMessages: () => api.get('/chat/messages/'),
  
  // Get a specific message
  getMessage: (id) => api.get(`/chat/messages/${id}/`),
  
  // Mark a specific message as read
  markAsRead: (id) => api.post(`/chat/messages/${id}/mark_as_read/`),
  
  // Get unread messages for the current user
  getUnreadMessages: () => api.get('/chat/messages/unread/')
};

const chatService = {
  conversationAPI,
  messageAPI
};

export default chatService;