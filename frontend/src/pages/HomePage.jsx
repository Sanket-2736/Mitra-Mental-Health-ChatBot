import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Shield, Users } from 'lucide-react';
import Button from '../components/Common/Button';

const HomePage = () => {
  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "24/7 AI Support",
      description: "Get immediate support whenever you need it with our AI-powered chatbot trained in mental health support."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Crisis Detection",
      description: "Advanced algorithms detect crisis situations and provide immediate resources and professional intervention."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Personalized Care",
      description: "Tailored responses based on your conversation history and emotional patterns for better support."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Professional Network",
      description: "Connect with licensed mental health professionals when you need human support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Mitra</span>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Mental Health
            <span className="text-blue-600 block">Companion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Mitra provides 24/7 AI-powered mental health support with crisis detection, 
            personalized care, and connections to professional help when you need it most.
          </p>
          <div className="space-x-4">
            <Link to="/login">
              <Button size="lg" className="px-8 py-3">
                Start Chatting Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Mitra?
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI technology meets compassionate care
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who have found support through Mitra
          </p>
          <Link to="/login">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-blue-400 mr-2" />
            <span className="text-xl font-bold">Mitra</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Mitra. Supporting mental health, one conversation at a time.</p>
            <p className="mt-2 text-sm">
              If you're experiencing a mental health emergency, please contact emergency services immediately.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;