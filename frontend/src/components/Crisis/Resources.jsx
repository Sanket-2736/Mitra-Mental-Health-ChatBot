import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ExternalLink, Heart, MapPin } from 'lucide-react';
import { crisisService } from '../../services/api';
import Button from '../Common/Button';
import Loading from '../Common/Loading';
import toast from 'react-hot-toast';

const Resources = ({ country = 'US' }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, [country]);

  const loadResources = async () => {
    try {
      const response = await crisisService.getResources(country);
      if (response.success) {
        setResources(response.resources);
      }
    } catch (error) {
      toast.error('Failed to load crisis resources');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading crisis resources..." />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-red-600 mr-3" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Crisis Support Resources</h2>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            {country === 'US' ? 'United States' : country === 'IN' ? 'India' : country}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {resource.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${resource.phone}`, '_self')}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call {resource.phone}
                    </Button>
                  )}
                  
                  {resource.text && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const textParts = resource.text.split(' to ');
                        if (textParts.length === 2) {
                          window.open(`sms:${textParts[1]}`, '_self');
                        }
                      }}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text {resource.text}
                    </Button>
                  )}
                  
                  {resource.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resource.website, '_blank')}
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Reminder</h4>
        <p className="text-yellow-700 text-sm">
          If you are experiencing a mental health emergency or having thoughts of self-harm, 
          please contact emergency services immediately or go to your nearest emergency room.
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Resources are available 24/7. You are not alone, and help is always available.
        </p>
      </div>
    </div>
  );
};

export default Resources;