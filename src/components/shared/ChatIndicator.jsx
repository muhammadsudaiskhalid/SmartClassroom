import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const ChatIndicator = ({ classId, onOpenChat }) => {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !classId) return;

    const handleNewMessage = () => {
      setHasNewMessages(true);
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, classId]);

  const handleClick = () => {
    setHasNewMessages(false);
    onOpenChat();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-lg transition-colors ${
        hasNewMessages 
          ? 'bg-accent-100 text-accent-600 hover:bg-accent-200' 
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
      }`}
      title="Class Chat"
    >
      <MessageSquare size={20} />
      {hasNewMessages && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
      )}
    </button>
  );
};

export default ChatIndicator;