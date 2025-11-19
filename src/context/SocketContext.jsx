import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import authService from '../services/api-auth.service';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    
    if (token) {
      // Create socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setConnected(false);
      };
    }
  }, []);

  const value = {
    socket,
    connected,
    joinClassChat: (classId) => {
      if (socket && connected) {
        socket.emit('join-class-chat', classId);
      }
    },
    leaveClassChat: (classId) => {
      if (socket && connected) {
        socket.emit('leave-class-chat', classId);
      }
    },
    sendMessage: (classId, message) => {
      if (socket && connected) {
        socket.emit('send-message', { classId, message });
      }
    },
    markAsRead: (messageId) => {
      if (socket && connected) {
        socket.emit('mark-as-read', { messageId });
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;