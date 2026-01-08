import { useState, useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Calendar, Users, DollarSign, Heart, Sparkles, Send, Loader, Bot, User as UserIcon, Check } from 'lucide-react';

export function NewTrip({ onNavigate, onTripCreate }) {
    const [conversationMode, setConversationMode] = useState(true);
    const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: "Hi! 👋 I'm your AI travel assistant. I'll help you plan the perfect trip! To get started, where would you like to go?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const [tripData, setTripData] = useState({
    destination: '',
    dates: '',
    travelers: 1,
    budget: '',
    interests: [],
    pace: 'moderate',
    travelStyle: '',
    accommodation: '',
  });

  const interests = [
    { name: 'Beach & Relaxation', emoji: '🏖️' },
    { name: 'Culture & History', emoji: '🏛️' },
    { name: 'Food & Dining', emoji: '🍽️' },
    { name: 'Adventure', emoji: '⛰️' },
    { name: 'Nightlife', emoji: '🎉' },
    { name: 'Shopping', emoji: '🛍️' },
    { name: 'Nature', emoji: '🌲' },
    { name: 'Art & Museums', emoji: '🎨' },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (userInput, messageCount) => {
    
    // Destination (first response)
    if (messageCount === 1) {
      setTripData(prev => ({ ...prev, destination: userInput }));
      return `${userInput} - what an amazing choice! 🌍 When are you planning to visit? You can tell me specific dates like "March 15-22" or something like "next summer for 10 days".`;
    }
    
    // Dates (second response)
    if (messageCount === 3) {
      setTripData(prev => ({ ...prev, dates: userInput }));
      return `Perfect timing! 📅 How many people will be traveling? Just you, or are you bringing friends/family?`;
    }
    
    // Travelers (third response)
    if (messageCount === 5) {
      const travelers = parseInt(userInput) || 1;
      setTripData(prev => ({ ...prev, travelers }));
      
      if (travelers === 1) {
        return `Solo adventure - I love it! 🎒 What's your approximate budget per person? You can say something like "$2000", "budget-friendly", "mid-range", or "luxury".`;
      } else {
        return `Great! A group of ${travelers} travelers. 👥 What's your approximate budget per person? You can say something like "$2000", "budget-friendly", "mid-range", or "luxury".`;
      }
    }
    
    // Budget (fourth response)
    if (messageCount === 7) {
      setTripData(prev => ({ ...prev, budget: userInput }));
      return `Got it! 💰 Last question: What's your travel style? Are you more of a "luxury resort", "boutique hotels", "hostels & budget stays", or "mix of everything" traveler?`;
    }
    
    // Travel style (fifth response)
    if (messageCount === 9) {
      setTripData(prev => ({ ...prev, travelStyle: userInput }));
      return `Excellent! 🎯 Now let me show you some activity categories to help me understand what kind of experiences you're looking for. Select all that interest you!`;
    }
    
    // Default response
    return "Thanks for that! Let me process this information. 🤔";
  };

  const handleSendMessage = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const response = getAIResponse(input, messages.length);
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
      setIsTyping(false);

      // After travel style question, show interests selection
      if (messages.length === 9) {
        setTimeout(() => {
          setConversationMode(false);
        }, 1000);
      }
    }, 800 + Math.random() * 400);
  };

  const handleGenerateTrip = () => {
    const trip = {
      id: Date.now(),
      destination: tripData.destination || 'Barcelona',
      dates: tripData.dates || 'Mar 15 - Mar 22, 2026',
      travelers: tripData.travelers || 1,
      budget: tripData.budget || '$2500',
      interests: tripData.interests,
      pace: tripData.pace,
      travelStyle: tripData.travelStyle || 'Mix of everything',
      status: 'planning',
    };
    onTripCreate(trip);
    onNavigate('trip-summary');
  };

  const quickResponses = [
    { text: 'Paris, France', show: messages.length === 1 },
    { text: 'Tokyo, Japan', show: messages.length === 1 },
    { text: 'Bali, Indonesia', show: messages.length === 1 },
    { text: 'Next month for a week', show: messages.length === 3 },
    { text: 'June 10-20', show: messages.length === 3 },
    { text: 'Just me (1)', show: messages.length === 5 },
    { text: '2 people', show: messages.length === 5 },
    { text: '4 people', show: messages.length === 5 },
    { text: '$2000', show: messages.length === 7 },
    { text: 'Budget-friendly', show: messages.length === 7 },
    { text: 'Mid-range', show: messages.length === 7 },
    { text: 'Luxury', show: messages.length === 7 },
    { text: 'Boutique hotels', show: messages.length === 9 },
    { text: 'Mix of everything', show: messages.length === 9 },
  ];

  const visibleQuickResponses = quickResponses.filter(qr => qr.show);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-orange-50 to-yellow-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h1 className="text-gray-900 mb-2">Start Planning Your Trip</h1>
          <p className="text-gray-600">
            Tell me about your dream trip and I'll create a personalized itinerary just for you
          </p>
        </div>

        {conversationMode ? (
          /* Conversational Chat Mode */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Response Buttons */}
              {visibleQuickResponses.length > 0 && !isTyping && (
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {visibleQuickResponses.map((response, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInput(response.text);
                        }}
                        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-300 hover:bg-orange-50 transition-all"
                      >
                        {response.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your answer..."
                    disabled={isTyping}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send or click a suggestion above
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Preferences Selection */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-gray-900 mb-2">Perfect! Now let's personalize your trip</h2>
              <p className="text-gray-600">
                Select the activities and experiences that interest you most
              </p>
            </div>
            
            <div className="space-y-8">
              {/* Trip Summary */}
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-orange-500" />
                  Your Trip Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Destination</div>
                    <div className="text-gray-900">{tripData.destination || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Dates</div>
                    <div className="text-gray-900">{tripData.dates || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Travelers</div>
                    <div className="text-gray-900">{tripData.travelers || 1} {tripData.travelers === 1 ? 'person' : 'people'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">Budget</div>
                    <div className="text-gray-900">{tripData.budget || 'Not set'}</div>
                  </div>
                </div>
              </div>

              {/* Interests Selection */}
              <div>
                <label className="block text-gray-900 mb-4">
                  What are you interested in? <span className="text-orange-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.name}
                      onClick={() => {
                        setTripData({
                          ...tripData,
                          interests: tripData.interests.includes(interest.name)
                            ? tripData.interests.filter((i) => i !== interest.name)
                            : [...tripData.interests, interest.name],
                        });
                      }}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        tripData.interests.includes(interest.name)
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{interest.emoji}</div>
                      <div className={`text-sm text-center ${
                        tripData.interests.includes(interest.name) 
                          ? 'text-orange-700' 
                          : 'text-gray-700'
                      }`}>
                        {interest.name}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Select at least one interest
                </p>
              </div>

              {/* Travel Pace */}
              <div>
                <label className="block text-gray-900 mb-4">
                  What's your preferred travel pace?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'relaxed', label: 'Relaxed', desc: '1-2 activities/day' },
                    { value: 'moderate', label: 'Moderate', desc: '2-3 activities/day' },
                    { value: 'fast-paced', label: 'Fast-paced', desc: '4+ activities/day' }
                  ].map((pace) => (
                    <button
                      key={pace.value}
                      onClick={() => setTripData({ ...tripData, pace: pace.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        tripData.pace === pace.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`mb-1 ${
                        tripData.pace === pace.value 
                          ? 'text-orange-700' 
                          : 'text-gray-900'
                      }`}>
                        {pace.label}
                      </div>
                      <div className="text-xs text-gray-500">{pace.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setConversationMode(true);
                    setMessages([
                      {
                        type: 'assistant',
                        content: "Hi! 👋 I'm your AI travel assistant. I'll help you plan the perfect trip! To get started, where would you like to go?",
                      },
                    ]);
                    setTripData({
                      destination: '',
                      dates: '',
                      travelers: 1,
                      budget: '',
                      interests: [],
                      pace: 'moderate',
                      travelStyle: '',
                      accommodation: '',
                    });
                  }}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Start Over
                </button>
                <button
                  onClick={handleGenerateTrip}
                  disabled={tripData.interests.length === 0}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate My Itinerary
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}