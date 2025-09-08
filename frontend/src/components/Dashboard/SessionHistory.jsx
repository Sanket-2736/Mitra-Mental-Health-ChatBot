import React from 'react';
import { MessageCircle, Calendar, Hash } from 'lucide-react';
import { formatSessionDate } from '../../utils/formatters';
import { getMoodColor, getMoodLabel, truncateText } from '../../utils/helpers';

const SessionHistory = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No sessions yet</p>
        <p className="text-xs">Start your first conversation to see history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div key={session.sessionId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          {/* Session Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              {formatSessionDate(session.createdAt)}
            </div>
            {session.moodScore && (
              <div 
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getMoodColor(session.moodScore) }}
              >
                {session.moodScore.toFixed(1)}/10
              </div>
            )}
          </div>

          {/* Session Summary */}
          {session.summary && (
            <div className="mb-3">
              <p className="text-sm text-gray-800 mb-2">
                {truncateText(session.summary, 120)}
              </p>
            </div>
          )}

          {/* Session Details */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Hash className="w-3 h-3 mr-1" />
                {session.sessionId.split('-')[0]}
              </div>
              {session.moodScore && (
                <span className="capitalize">
                  {getMoodLabel(session.moodScore)}
                </span>
              )}
            </div>
          </div>

          {/* Key Topics */}
          {session.keyTopics && session.keyTopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {session.keyTopics.slice(0, 3).map((topic, topicIndex) => (
                <span
                  key={topicIndex}
                  className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                >
                  {topic}
                </span>
              ))}
              {session.keyTopics.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  +{session.keyTopics.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      ))}

      {/* View All Link */}
      {sessions.length >= 5 && (
        <div className="text-center pt-4">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Sessions →
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;