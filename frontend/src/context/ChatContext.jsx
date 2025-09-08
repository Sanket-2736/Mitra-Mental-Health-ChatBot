import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/api';
import { websocketService } from '../services/websocket';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export const ChatContext = createContext({});

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (user) {
      // Initialize WebSocket connection
      websocketService.connect();
      websocketService.joinChat(user.userId);
      
      websocketService.onConnect(() => {
        setConnected(true);
      });
      
      websocketService.onDisconnect(() => {
        setConnected(false);
      });

      return () => {
        websocketService.disconnect();
      };
    }
  }, [user]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      
      // Add user message immediately
      const userMessage = {
        messageId: Date.now().toString(),
        sender: 'user',
        message: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Send to backend
      const response = await chatService.sendMessage({
        message,
        sessionId: currentSession?.sessionId
      });

      if (response.success) {
        // Add bot response
        const botMessage = {
          messageId: Date.now().toString() + '_bot',
          sender: 'bot',
          message: response.message,
          timestamp: new Date(),
          metadata: response.metadata
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Update session ID if new session
        if (response.sessionId && !currentSession) {
          setCurrentSession({ sessionId: response.sessionId });
        }
        
        // Handle crisis detection
        if (response.metadata?.crisis) {
          toast.error('Crisis detected - Resources provided');
        }
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      await chatService.endSession({ sessionId: currentSession.sessionId });
      setMessages([]);
      setCurrentSession(null);
      toast.success('Session ended');
    } catch (error) {
      toast.error('Failed to end session');
      console.error('End session error:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentSession(null);
  };

  const value = {
    messages,
    currentSession,
    loading,
    connected,
    sendMessage,
    endSession,
    startNewChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};