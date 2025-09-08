import React, { useState } from 'react';
import { AlertTriangle, Phone, MessageSquare, X, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../utils/constants';
import Button from '../Common/Button';

const CrisisAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [country] = useState('US'); // This would come from user profile

  if (!isVisible) return null;

  const contacts = EMERGENCY_CONTACTS[country] || EMERGENCY_CONTACTS['US'];

  return (
    <div className="bg-red-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <AlertTriangle className="w-6 h-6 text-white mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                Crisis Support Available - You're Not Alone
              </h3>
              <p className="text-red-100 mb-4">
                We've detected you might be going through a difficult time. 
                Please reach out for immediate professional help:
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {contacts.map((contact, index) => (
                  <div key={index} className="bg-red-700 bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{contact.name}</h4>
                      <span className="text-xs text-red-200">{contact.available}</span>
                    </div>
                    <div className="space-y-2">
                      {contact.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-white text-red-600 hover:bg-red-50 border-white"
                          onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {contact.phone}
                        </Button>
                      )}
                      {contact.text && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-white text-red-600 hover:bg-red-50 border-white"
                          onClick={() => window.open(`sms:${contact.text.split(' to ')[1]}`, '_self')}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Text {contact.text}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-red-700 bg-opacity-50 rounded-lg">
                <p className="text-sm text-red-100 mb-2">
                  <strong>Additional Resources:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="https://suicidepreventionlifeline.org"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-red-100 hover:text-white underline"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Crisis Resources
                  </a>
                  <a
                    href="https://www.crisistextline.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-red-100 hover:text-white underline"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Crisis Text Line
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-red-200 hover:text-white ml-4 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;