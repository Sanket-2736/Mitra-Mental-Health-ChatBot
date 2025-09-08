import React from 'react';
import { Heart } from 'lucide-react';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <Heart className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-blue-600 rounded-full animate-spin border-t-transparent mx-auto"></div>
        </div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Loading;