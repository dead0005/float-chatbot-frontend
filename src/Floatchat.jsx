import React, { useState, useRef, useEffect } from 'react';
import Map from './Map'; 
import ArgoChart from './ArgoChart';
import { Send, Map as MapIcon, BarChart3, Settings, Menu, X, Download, Filter, Info, Moon, Sun, Trash2 } from 'lucide-react';

const Floatchat = () => {
  const initialMessage = {
    id: 1,
    type: 'bot',
    content: "Hello! I'm Floatchat, your AI assistant for exploring ARGO oceanographic data. You can ask me about temperature profiles, salinity data, BGC parameters, or any ocean-related queries. How can I help you today?",
    timestamp: new Date()
  };

  const [selectedFloatId, setSelectedFloatId] = useState(null);
  const [messages, setMessages] = useState([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample data for demo purposes
  const [mapData, setMapData] = useState({
    floats: [
      { id: 'F001', lat: 20.5, lon: 65.8, temp: 28.5, salinity: 36.2, status: 'active' },
      { id: 'F002', lat: 15.2, lon: 68.9, temp: 29.1, salinity: 35.8, status: 'active' },
      { id: 'F003', lat: 12.8, lon: 72.1, temp: 30.2, salinity: 35.4, status: 'inactive' }
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInputValue = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInputValue })
      });
      const data = await response.json();
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      const errorResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting to the server. Please ensure the backend is running.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleClearChat = () => {
    setMessages([initialMessage]);
  };

  // Handler for "View Analytics" in map popup
  const handleViewAnalytics = (floatId) => {
    setSelectedFloatId(floatId);
    setActiveView('charts');
  };

  const OceanWavesLogo = ({ size = 32, className = "" }) => (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-lg">
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#60a5fa" /><stop offset="50%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1e40af" /></radialGradient>
          <radialGradient id="oceanGradientDark" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="50%" stopColor="#5b21b6" /><stop offset="100%" stopColor="#3730a3" /></radialGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill={darkMode ? "url(#oceanGradientDark)" : "url(#oceanGradient)"} stroke={darkMode ? "#3b82f6" : "#1e40af"} strokeWidth="2" />
        <path d="M8 32 Q16 28, 24 32 T40 32 T56 32" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.9" />
        <path d="M8 38 Q16 34, 24 38 T40 38 T56 38" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M8 26 Q16 22, 24 26 T40 26 T56 26" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" />
      </svg>
    </div>
  );

  const exampleQueries = [
    "Show me salinity profiles near the equator in March 2023",
    "Compare BGC parameters in the Arabian Sea for the last 6 months",
    "What are the nearest ARGO floats to coordinates 20°N, 65°E?",
    "Display temperature anomalies in the Indian Ocean"
  ];

  const SettingsView = () => (
    <div className={`h-full p-6 overflow-auto ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Settings</h3>
        <div className="space-y-6">
          <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className="text-lg font-semibold mb-4">Appearance</h4>
            <div className="flex items-center justify-between">
              <label htmlFor="darkModeToggle" className="text-md">Dark Mode</label>
              <button
                id="darkModeToggle"
                onClick={() => setDarkMode(!darkMode)}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-700"
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </div>
          </div>
          <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h4 className="text-lg font-semibold mb-4">Chat</h4>
            <div className="flex items-center justify-between">
              <p className="text-md">Clear chat history</p>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This will permanently delete all messages from the current session.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-blue-900 text-white'} transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div title="Floatchat - Ocean Data Explorer">
              <OceanWavesLogo size={32} />
            </div>
            {sidebarOpen && <h1 className="text-xl font-bold">Floatchat</h1>}
          </div>
        </div>
        <nav className="mt-8">
          <button onClick={() => setActiveView('chat')} title="Chat" className={`w-full flex items-center gap-3 px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} transition-colors ${activeView === 'chat' ? (darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300') : ''}`}>
            <Send className="w-5 h-5" />
            {sidebarOpen && <span>Chat</span>}
          </button>
          <button onClick={() => setActiveView('map')} title="Map View" className={`w-full flex items-center gap-3 px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} transition-colors ${activeView === 'map' ? (darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300') : ''}`}>
            <MapIcon className="w-5 h-5" />
            {sidebarOpen && <span>Map View</span>}
          </button>
          <button onClick={() => setActiveView('charts')} title="Analytics" className={`w-full flex items-center gap-3 px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} transition-colors ${activeView === 'charts' ? (darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300') : ''}`}>
            <BarChart3 className="w-5 h-5" />
            {sidebarOpen && <span>Analytics</span>}
          </button>
          <button onClick={() => setActiveView('settings')} title="Settings" className={`w-full flex items-center gap-3 px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} transition-colors ${activeView === 'settings' ? (darkMode ? 'bg-gray-700 border-r-2 border-blue-400' : 'bg-blue-800 border-r-2 border-blue-300') : ''}`}>
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>
        <div className="absolute bottom-16 left-0 right-0 px-4">
          <button onClick={() => setDarkMode(!darkMode)} title={`Switch to ${darkMode ? 'light' : 'dark'} mode`} className={`w-full flex items-center gap-3 px-4 py-3 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} rounded transition-colors`} >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} title={`${sidebarOpen ? 'Collapse' : 'Expand'} sidebar`} className={`absolute bottom-4 left-4 p-2 hover:${darkMode ? 'bg-gray-700' : 'bg-blue-800'} rounded transition-colors`}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className={`border-b transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {activeView === 'chat' && 'Float-chat'}
                {activeView === 'map' && 'ARGO Float Map'}
                {activeView === 'charts' && 'Data Analytics'}
                {activeView === 'settings' && 'Application Settings'}
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeView === 'chat' && 'Ask questions about oceanographic data'}
                {activeView === 'map' && 'Real-time float positions and status'}
                {activeView === 'charts' && 'Visualize and analyze ocean data'}
                {activeView === 'settings' && 'Manage your preferences'}
              </p>
            </div>
          </div>
        </header>
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl p-4 rounded-lg ${message.type === 'user' ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') : (darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-800')}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-xs mt-2 ${message.type === 'user' ? (darkMode ? 'text-blue-200' : 'text-blue-100') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {messages.length === 1 && (
                <div className={`px-4 py-2 border-t transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQueries.slice(0, 2).map((query, index) => (
                      <button key={index} onClick={() => setInputValue(query)} className={`text-xs px-3 py-1 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className={`border-t p-4 transition-colors ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about oceanographic data..."
                      className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'}`}
                      rows="1"
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    title="Send"
                    className={`px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeView === 'map' && (
            <Map
              darkMode={darkMode}
              mapData={mapData}
              onViewAnalytics={handleViewAnalytics}
            />
          )}
          {activeView === 'charts' && (
            <ArgoChart
  darkMode={darkMode}
  floats={selectedFloatId
    ? mapData.floats.filter(f => f.id === selectedFloatId).map(f => ({
        name: f.id,
        temperature: f.temp,
        salinity: f.salinity
      }))
    : mapData.floats.map(f => ({
        name: f.id,
        temperature: f.temp,
        salinity: f.salinity
      }))
  }
/>
          )}

          {activeView === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
};

export default Floatchat;