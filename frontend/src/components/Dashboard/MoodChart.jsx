import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const MoodChart = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No mood data available yet</p>
          <p className="text-sm">Start chatting to see your mood trends!</p>
        </div>
      </div>
    );
  }

  // Filter sessions with mood scores and prepare data
  const chartData = sessions
    .filter(session => session.moodScore)
    .reverse() // Show oldest to newest
    .map(session => ({
      date: format(parseISO(session.createdAt), 'MMM dd'),
      mood: session.moodScore,
      fullDate: format(parseISO(session.createdAt), 'MMM dd, yyyy'),
      summary: session.summary
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p>No mood scores recorded yet</p>
          <p className="text-sm">Your mood will be tracked automatically during conversations</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.fullDate}</p>
          <p className="text-blue-600">
            Mood Score: <span className="font-bold">{data.mood.toFixed(1)}/10</span>
          </p>
          {data.summary && (
            <p className="text-sm text-gray-600 mt-1 max-w-xs">
              {data.summary.length > 100 ? `${data.summary.substring(0, 100)}...` : data.summary}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getMoodColor = (mood) => {
    if (mood >= 7) return '#10B981'; // green
    if (mood >= 5) return '#F59E0B'; // yellow
    if (mood >= 3) return '#EF4444'; // red
    return '#6B7280'; // gray
  };

  // Calculate average mood for the line color
  const averageMood = chartData.reduce((sum, item) => sum + item.mood, 0) / chartData.length;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Average: <span className="font-bold" style={{ color: getMoodColor(averageMood) }}>
              {averageMood.toFixed(1)}/10
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Sessions: <span className="font-bold">{chartData.length}</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 10]}
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke={getMoodColor(averageMood)}
            strokeWidth={3}
            dot={{ fill: getMoodColor(averageMood), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: getMoodColor(averageMood), strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Mood Scale Reference */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 mb-2">Mood Scale Reference:</div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="text-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-1"></div>
            <div>0-2</div>
            <div className="text-gray-500">Very Low</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <div>3-4</div>
            <div className="text-gray-500">Low</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <div>5-6</div>
            <div className="text-gray-500">Moderate</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <div>7-8</div>
            <div className="text-gray-500">Good</div>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mx-auto mb-1"></div>
            <div>9-10</div>
            <div className="text-gray-500">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;