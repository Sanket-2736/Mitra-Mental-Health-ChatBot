import React, { useState, useRef } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { detectCrisisKeywords, sanitizeInput } from '../../utils/helpers';
import Button from '../Common/Button';

const MessageInput = ({ disabled = false }) => {
  const [message, setMessage] = useState('');
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const textareaRef = useRef(null);
  const { sendMessage, loading } = useChat();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
    
    // Check for crisis keywords
    const hasCrisisKeywords = detectCrisisKeywords(value);
    setShowCrisisWarning(hasCrisisKeywords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || loading || disabled) {
      return;
    }

    const sanitizedMessage = sanitizeInput(message);
    await sendMessage(sanitizedMessage);
    setMessage('');
    setShowCrisisWarning(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Crisis Warning */}
      {showCrisisWarning && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-red-800 font-medium mb-1">
                Crisis Support Available
              </p>
              <p className="text-red-700">
                If you're having thoughts of self-harm, please reach out for immediate help:
              </p>
              <div className="mt-2 space-y-1 text-red-600">
                <div>• <strong>Emergency:</strong> 911</div>
                <div>• <strong>Crisis Line:</strong> 988 (US)</div>
                <div>• <strong>Text:</strong> HOME to 741741</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "Connecting..." : "Share what's on your mind..."}
            disabled={disabled || loading}
            rows={1}
            className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              disabled || loading 
                ? 'bg-gray-100 cursor-not-allowed' 
                : 'bg-white'
            } ${
              showCrisisWarning ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ minHeight: '50px', maxHeight: '120px' }}
          />
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || loading || disabled}
          className="flex items-center justify-center w-12 h-12 rounded-lg"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Character Limit */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {message.length > 0 && (
            <span className={message.length > 500 ? 'text-red-500' : ''}>
              {message.length}/500
            </span>
          )}
        </div>
        <div>
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </form>
  );
};

export default MessageInput;