import React from 'react';
import { Heart, AlertTriangle, ExternalLink } from 'lucide-react';
import { formatMessageTime } from '../../utils/formatters';
import Button from '../Common/Button';

const MessageBubble = ({ message }) => {
  const { sender, message: content, timestamp, metadata } = message;
  const isUser = sender === 'user';
  const isCrisis = metadata?.crisis;

  // Function to format text with markdown-like styling
  const formatText = (text) => {
    if (!text || typeof text !== 'string') return text;

    // Replace **bold** with <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace _underline_ with <u>
    text = text.replace(/_(.*?)_/g, '<u>$1</u>');
    
    // Replace `code` with <code>
    text = text.replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
    
    // Replace line breaks with <br>
    text = text.replace(/\n/g, '<br>');
    
    // Format numbered lists (1. item)
    text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex items-start my-1"><span class="font-semibold text-blue-600 mr-2 min-w-[20px]">$1.</span><span>$2</span></div>');
    
    // Format bullet points (- item or • item)
    text = text.replace(/^[-•]\s+(.+)$/gm, '<div class="flex items-start my-1"><span class="text-blue-600 mr-2 min-w-[16px]">•</span><span>$1</span></div>');
    
    // Format headers (## Header)
    text = text.replace(/^##\s+(.+)$/gm, '<h3 class="font-semibold text-base mt-2 mb-1">$1</h3>');
    text = text.replace(/^#\s+(.+)$/gm, '<h2 class="font-bold text-lg mt-2 mb-1">$1</h2>');
    
    // Format quotes (> quote)
    text = text.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-3 border-blue-400 pl-3 my-2 italic opacity-90">$1</blockquote>');
    
    // Format links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>');
    
    // Format phone numbers for crisis resources
    text = text.replace(/(\d{3}[-.]?\d{3}[-.]?\d{4})/g, '<a href="tel:$1" class="font-semibold text-blue-600 underline hover:text-blue-800">$1</a>');
    text = text.replace(/(988|911)/g, '<a href="tel:$1" class="font-bold text-red-600 bg-red-100 px-2 py-1 rounded hover:bg-red-200">$1</a>');
    
    return text;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-blue-600' 
              : isCrisis 
                ? 'bg-red-600' 
                : 'bg-gray-600'
          }`}>
            {isUser ? (
              <span className="text-white text-sm font-medium">
                {message.sender.charAt(0).toUpperCase()}
              </span>
            ) : isCrisis ? (
              <AlertTriangle className="w-4 h-4 text-white" />
            ) : (
              <Heart className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex flex-col">
            <div className={`px-4 py-2 rounded-lg ${
              isUser
                ? 'bg-blue-600 text-white'
                : isCrisis
                  ? 'bg-red-50 border border-red-200 text-gray-900'
                  : 'bg-white text-gray-900 shadow-sm border'
            }`}>
              {/* Formatted Message Content */}
              <div 
                className="text-sm whitespace-pre-wrap formatted-message"
                dangerouslySetInnerHTML={{ __html: formatText(content) }}
              />
              
              {/* Crisis Resources */}
              {isCrisis && metadata.resources && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-medium text-red-800 mb-2">
                    Immediate Help Available:
                  </p>
                  <div className="space-y-2">
                    {metadata.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span 
                          className="text-red-700"
                          dangerouslySetInnerHTML={{ __html: formatText(resource.description || resource) }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 px-2 border-red-300 text-red-700 hover:bg-red-100"
                          onClick={() => {
                            const contact = resource.contact || resource;
                            if (resource.type === 'phone' || /^\d+$/.test(contact)) {
                              window.open(`tel:${contact}`, '_self');
                            } else if (resource.type === 'website' || contact.startsWith('http')) {
                              window.open(contact, '_blank');
                            } else if (contact.includes('988') || contact.includes('911')) {
                              const phoneNum = contact.match(/\d{3}/)?.[0];
                              if (phoneNum) window.open(`tel:${phoneNum}`, '_self');
                            }
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {resource.contact || resource}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mood and Emotion Tags */}
              {metadata?.emotionTags && metadata.emotionTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {metadata.emotionTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className={`text-xs text-gray-500 mt-1 ${
              isUser ? 'text-right' : 'text-left'
            }`}>
              {formatMessageTime(timestamp)}
              {metadata?.moodScore && (
                <span className="ml-2">
                  Mood: {metadata.moodScore.toFixed(1)}/10
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles for formatted content */}
      <style jsx>{`
        .formatted-message strong {
          font-weight: 700;
        }
        
        .formatted-message em {
          font-style: italic;
        }
        
        .formatted-message u {
          text-decoration: underline;
        }
        
        .formatted-message code {
          font-family: 'Courier New', monospace;
        }
        
        .formatted-message h2,
        .formatted-message h3 {
          line-height: 1.3;
        }
        
        .formatted-message blockquote {
          border-left-width: 3px;
        }
        
        /* Override colors for user messages (white background) */
        .bg-blue-600 .formatted-message code {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .bg-blue-600 .formatted-message a {
          color: rgba(255, 255, 255, 0.9);
        }
        
        .bg-blue-600 .formatted-message a:hover {
          color: white;
        }
        
        .bg-blue-600 .formatted-message blockquote {
          border-left-color: rgba(255, 255, 255, 0.5);
        }
        
        .bg-blue-600 .formatted-message .text-blue-600 {
          color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;