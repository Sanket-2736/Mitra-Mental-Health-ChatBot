import React, { useEffect, useRef } from 'react';
import { MessageCircle, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Button from '../Common/Button';

const ChatBox = () => {
  const { messages, loading, connected, endSession, startNewChat } = useChat();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (window.confirm('Start a new conversation? Your current session will be ended.')) {
        endSession();
        startNewChat();
      }
    } else {
      startNewChat();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Chat with Mitra</h1>
            <div className="flex items-center text-sm">
              {connected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="flex items-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Mitra
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                I'm here to listen and provide support. Share what's on your mind, 
                and I'll do my best to help. Your conversations are private and secure.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm">
                <div className="bg-white p-3 rounded-lg border text-left">
                  <p className="text-gray-600">"I'm feeling anxious about work"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-left">
                  <p className="text-gray-600">"I need someone to talk to"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-left">
                  <p className="text-gray-600">"How can I manage stress?"</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.messageId}
                  message={message}
                />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg px-4 py-2 shadow-sm border max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">Mitra is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <MessageInput disabled={!connected} />
          
          {/* Disclaimer */}
          <div className="mt-3 text-xs text-gray-500 text-center">
            Mitra is an AI assistant. In case of emergency, please contact emergency services immediately.
            <br />
            <strong>Crisis Support:</strong> US: 988 | Emergency: 911
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;