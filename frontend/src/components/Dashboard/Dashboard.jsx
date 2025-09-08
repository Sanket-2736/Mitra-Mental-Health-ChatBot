import React, { useState, useEffect } from 'react';
import { BarChart3, MessageCircle, TrendingUp, Calendar, Heart, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/api';
import MoodChart from './MoodChart';
import SessionHistory from './SessionHistory';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import { formatDate, formatDuration } from '../../utils/formatters';
import { getMoodColor, getMoodLabel, getTrendIcon } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await userService.getDashboard();
      if (response.success) {
        setDashboard(response);
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  const { summary, recentSessions, analytics } = dashboard || {};

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your mental health journey with Mitra.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/chat">
            <Button className="w-full h-16 text-left flex items-center justify-start">
              <MessageCircle className="w-6 h-6 mr-3" />
              <div>
                <div className="font-medium">Start New Chat</div>
                <div className="text-sm opacity-90">Continue your conversation</div>
              </div>
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full h-16 text-left flex items-center justify-start"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          >
            <BarChart3 className="w-6 h-6 mr-3" />
            <div>
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-gray-600">See your progress</div>
            </div>
          </Button>
          
          <Link to="/profile">
            <Button 
              variant="outline" 
              className="w-full h-16 text-left flex items-center justify-start"
            >
              <Heart className="w-6 h-6 mr-3" />
              <div>
                <div className="font-medium">Update Profile</div>
                <div className="text-sm text-gray-600">Manage preferences</div>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics?.totalSessions || 0}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold" style={{ color: getMoodColor(analytics?.averageMood) }}>
                {analytics?.averageMood ? analytics.averageMood.toFixed(1) : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {analytics?.averageMood ? getMoodLabel(analytics.averageMood) : 'No data'}
              </p>
            </div>
            <Heart className="w-8 h-8" style={{ color: getMoodColor(analytics?.averageMood) }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mood Trend</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTrendIcon(analytics?.moodTrend)}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {analytics?.moodTrend || 'Stable'}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${
              analytics?.moodTrend === 'improving' ? 'text-green-600' :
              analytics?.moodTrend === 'declining' ? 'text-red-600' :
              'text-gray-600'
            }`} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Session</p>
              <p className="text-sm font-medium text-gray-900">
                {recentSessions?.[0] ? formatDate(recentSessions[0].createdAt) : 'Never'}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mood Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Mood Over Time</h2>
            </div>
            <div className="p-6">
              <MoodChart sessions={recentSessions} />
            </div>
          </div>

          {/* Top Topics */}
          {analytics?.topTopics && analytics.topTopics.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Most Discussed Topics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.topTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-900 capitalize">{topic.topic}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(topic.count / analytics.topTopics[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{topic.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Session History & Summary */}
        <div className="space-y-8">
          {/* User Summary */}
          {summary && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Your Journey Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {summary.overallSummary && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Overall Progress</h4>
                      <p className="text-sm text-gray-600">{summary.overallSummary}</p>
                    </div>
                  )}
                  
                  {summary.recentContext && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recent Context</h4>
                      <p className="text-sm text-gray-600">{summary.recentContext}</p>
                    </div>
                  )}

                  {summary.importantNotes && summary.importantNotes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
                      <div className="space-y-2">
                        {summary.importantNotes.map((note, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${
                            note.priority === 'high' ? 'bg-red-50 text-red-800 border-l-4 border-red-400' :
                            note.priority === 'medium' ? 'bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400' :
                            'bg-blue-50 text-blue-800 border-l-4 border-blue-400'
                          }`}>
                            {note.note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
            </div>
            <div className="p-6">
              <SessionHistory sessions={recentSessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;