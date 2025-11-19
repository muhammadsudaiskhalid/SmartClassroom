import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';
import chatService from '../../services/chat.service';
import ChatMessage from './ChatMessage';
import Button from '../shared/Button';

const ClassChat = ({ classId, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { socket, connected, joinClassChat, leaveClassChat, sendMessage } = useSocket();
  const { currentUser } = useAuthContext();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat messages
  const loadMessages = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const response = await chatService.getChatMessages(classId, pageNum, 50);
      
      if (shouldAppend) {
        setMessages(prev => [...response.messages, ...prev]);
      } else {
        setMessages(response.messages);
        setTimeout(scrollToBottom, 100);
      }

      setHasMore(response.pagination.page < response.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;
    await loadMessages(page + 1, true);
  };

  // Handle sending new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage || !connected) return;

    setSendingMessage(true);
    try {
      sendMessage(classId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle new message from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket]);

  // Join/leave chat room and load messages
  useEffect(() => {
    if (isOpen && classId && connected) {
      joinClassChat(classId);
      loadMessages();
    }

    return () => {
      if (classId && connected) {
        leaveClassChat(classId);
      }
    };
  }, [isOpen, classId, connected, joinClassChat, leaveClassChat, loadMessages]);

  // Handle scroll to load more messages
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMore && !loading) {
      loadMoreMessages();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggle}
          variant="primary"
          size="lg"
          icon={MessageSquare}
          className="rounded-full shadow-lg"
        >
          Chat
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-neutral-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 bg-neutral-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-accent-600" />
          <span className="font-medium text-sm text-neutral-900">Class Chat</span>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-neutral-500 hover:text-neutral-700"
        >
          ✕
        </Button>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        onScroll={handleScroll}
      >
        {loading && page === 1 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-600"></div>
          </div>
        )}

        {hasMore && page > 1 && (
          <div className="flex justify-center">
            <Button
              onClick={loadMoreMessages}
              variant="ghost"
              size="sm"
              disabled={loading}
              className="text-xs text-neutral-500"
            >
              {loading ? 'Loading...' : 'Load more messages'}
            </Button>
          </div>
        )}

        {messages.length === 0 && !loading && (
          <div className="text-center text-neutral-500 text-sm py-8">
            <MessageSquare size={32} className="mx-auto mb-2 text-neutral-300" />
            <p>No messages yet.</p>
            <p>Start the conversation!</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message._id}
            message={message}
            isOwn={message.sender.id === currentUser?.id}
            currentUser={currentUser}
          />
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={connected ? "Type a message..." : "Connecting..."}
            disabled={!connected || sendingMessage}
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:bg-neutral-100"
            maxLength={1000}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || !connected || sendingMessage}
            variant="primary"
            size="sm"
            icon={Send}
            className="px-3"
          />
        </div>
        
        {!connected && (
          <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Connecting to chat...
          </div>
        )}
      </form>
    </div>
  );
};

export default ClassChat;