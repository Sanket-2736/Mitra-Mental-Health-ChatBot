import React from 'react';
import ChatBox from '../components/Chat/ChatBox';
import CrisisAlert from '../components/Crisis/CrisisAlert';
import { useChat } from '../hooks/useChat';

const ChatPage = () => {
  const { messages } = useChat();
  
  // Check if there are any crisis messages
  const hasCrisisMessage = messages.some(msg => msg.metadata?.crisis);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {hasCrisisMessage && <CrisisAlert />}
      <div className="flex-1 flex flex-col">
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatPage;