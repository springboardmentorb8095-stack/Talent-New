import React, { useState, useEffect } from 'react';
import { conversationAPI } from '../services/chatService';
import Chat from './Chat';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Chats = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedContractId, setSelectedContractId] = useState(location.state?.contractId || null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (location.state?.contractId) {
      setSelectedContractId(location.state.contractId);
    }
  }, [location.state]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const response = await conversationAPI.getConversations();
        setConversations(response.data);
        if (response.data.length > 0 && !selectedContractId) {
          setSelectedContractId(response.data[0].contract);
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredConversations = conversations.filter(conv => 
    conv.contract_details?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants_names?.some(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white md:rounded-none md:shadow-none md:border-0 overflow-hidden m-0 md:px-4 lg:px-6">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-60 bg-gray-50 md:border-r md:border-gray-200 flex flex-col ${selectedContractId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg md:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-6 w-6 md:h-5 md:w-5 text-blue-600" />
            Messages
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 md:h-4 md:w-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedContractId(conv.contract)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white ${
                  selectedContractId === conv.contract ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3 md:gap-2">
                    <div className="w-9 h-9 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm md:text-xs">
                      {conv.contract_details?.title?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-xs text-gray-900 truncate">
                      {conv.contract_details?.title || 'Contract Discussion'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                      {conv.participants_names?.filter(name => name !== user.name).join(', ') || 'Participants'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 min-h-0 flex flex-col bg-gray-50 ${selectedContractId ? 'flex' : 'hidden md:flex'}`}>
        {selectedContractId ? (
          <div className="h-full min-h-0">
            <Chat 
              key={selectedContractId} 
              contractId={selectedContractId} 
              isWidget={false} 
              onBackClick={() => setSelectedContractId(null)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <ChatBubbleLeftRightIcon className="h-24 w-24 mb-4 opacity-20" />
            <p className="text-lg">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
