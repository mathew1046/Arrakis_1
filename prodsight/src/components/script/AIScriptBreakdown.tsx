import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, MessageSquare, Send, Upload, FileText, MapPin, Users,
  Clock, Camera, Palette, Zap, Download, Bot, User, Sparkles
} from 'lucide-react';

interface ScriptElement {
  id: string;
  type: 'scene' | 'character' | 'location' | 'prop' | 'vfx' | 'sound';
  name: string;
  description: string;
  sceneNumbers: string[];
  requirements: string[];
  estimatedCost?: number;
  complexity: 'low' | 'medium' | 'high';
  aiConfidence: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  relatedElements?: string[];
}

interface AIScriptBreakdownProps {
  currentUser: string;
  onBreakdownComplete?: (breakdown: ScriptElement[]) => void;
}

export const AIScriptBreakdown: React.FC<AIScriptBreakdownProps> = ({
  currentUser,
  onBreakdownComplete
}) => {
  const [scriptElements, setScriptElements] = useState<ScriptElement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with demo data and welcome message
  useEffect(() => {
    const demoElements: ScriptElement[] = [
      {
        id: '1',
        type: 'scene',
        name: 'Coffee Shop Interior - Day',
        description: 'Busy coffee shop with 20-30 background actors, modern interior design',
        sceneNumbers: ['1A', '1B'],
        requirements: ['Interior location', 'Background actors', 'Coffee shop props', 'Natural lighting'],
        estimatedCost: 85000,
        complexity: 'medium',
        aiConfidence: 92
      },
      {
        id: '2',
        type: 'location',
        name: 'City Rooftop',
        description: 'High-rise building rooftop with city skyline view for chase sequence',
        sceneNumbers: ['3B', '3C'],
        requirements: ['Safety equipment', 'Permits', 'Helicopter access', 'Stunt coordination'],
        estimatedCost: 150000,
        complexity: 'high',
        aiConfidence: 88
      },
      {
        id: '3',
        type: 'character',
        name: 'Mysterious Stranger',
        description: 'Well-dressed antagonist with distinctive appearance',
        sceneNumbers: ['1A', '2C', '4A'],
        requirements: ['Costume design', 'Makeup', 'Props (briefcase, watch)'],
        estimatedCost: 25000,
        complexity: 'low',
        aiConfidence: 95
      },
      {
        id: '4',
        type: 'vfx',
        name: 'Building Explosion',
        description: 'Large-scale explosion with debris and fire effects',
        sceneNumbers: ['2C'],
        requirements: ['VFX team', 'Simulation software', 'Render farm', 'Compositing'],
        estimatedCost: 200000,
        complexity: 'high',
        aiConfidence: 90
      },
      {
        id: '5',
        type: 'prop',
        name: 'Vintage Briefcase',
        description: 'Leather briefcase containing important documents',
        sceneNumbers: ['1A', '2C', '4A'],
        requirements: ['Period-accurate design', 'Multiple copies', 'Weathering'],
        estimatedCost: 8000,
        complexity: 'low',
        aiConfidence: 98
      }
    ];

    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      message: "Hello! I'm your AI Script Breakdown Assistant. I've analyzed your script and identified key elements. You can ask me questions like:\n\n• 'Which scenes happen in Paris?'\n• 'What VFX work is needed for Scene 3B?'\n• 'How many characters appear in the coffee shop?'\n• 'What's the estimated cost for location shoots?'\n\nHow can I help you today?",
      timestamp: new Date().toISOString(),
      relatedElements: []
    };

    setScriptElements(demoElements);
    setChatMessages([welcomeMessage]);
    onBreakdownComplete?.(demoElements);
  }, [onBreakdownComplete]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getElementIcon = (type: ScriptElement['type']) => {
    switch (type) {
      case 'scene': return <Camera className="h-4 w-4" />;
      case 'character': return <Users className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'prop': return <FileText className="h-4 w-4" />;
      case 'vfx': return <Palette className="h-4 w-4" />;
      case 'sound': return <Zap className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getComplexityColor = (complexity: ScriptElement['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const filteredElements = scriptElements.filter(element => {
    if (selectedCategory === 'all') return true;
    return element.type === selectedCategory;
  });

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Location-based queries
    if (lowerMessage.includes('paris') || lowerMessage.includes('location')) {
      const locations = scriptElements.filter(e => e.type === 'location');
      return `I found ${locations.length} key locations in the script:\n\n${locations.map(l => 
        `• ${l.name} (Scenes: ${l.sceneNumbers.join(', ')})\n  ${l.description}`
      ).join('\n\n')}\n\nTotal estimated cost for locations: ₹${locations.reduce((sum, l) => sum + (l.estimatedCost || 0), 0).toLocaleString()}`;
    }
    
    // VFX queries
    if (lowerMessage.includes('vfx') || lowerMessage.includes('effects')) {
      const vfxElements = scriptElements.filter(e => e.type === 'vfx');
      return `Here are the VFX requirements I identified:\n\n${vfxElements.map(v => 
        `• ${v.name} (Scene ${v.sceneNumbers.join(', ')})\n  ${v.description}\n  Complexity: ${v.complexity} | Cost: ₹${v.estimatedCost?.toLocaleString()}`
      ).join('\n\n')}\n\nTotal VFX budget estimate: ₹${vfxElements.reduce((sum, v) => sum + (v.estimatedCost || 0), 0).toLocaleString()}`;
    }
    
    // Character queries
    if (lowerMessage.includes('character') || lowerMessage.includes('actor')) {
      const characters = scriptElements.filter(e => e.type === 'character');
      return `I found ${characters.length} key characters:\n\n${characters.map(c => 
        `• ${c.name} (Appears in scenes: ${c.sceneNumbers.join(', ')})\n  ${c.description}`
      ).join('\n\n')}`;
    }
    
    // Cost queries
    if (lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      const totalCost = scriptElements.reduce((sum, e) => sum + (e.estimatedCost || 0), 0);
      const breakdown = scriptElements.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + (e.estimatedCost || 0);
        return acc;
      }, {} as Record<string, number>);
      
      return `Here's the cost breakdown by category:\n\n${Object.entries(breakdown).map(([type, cost]) => 
        `• ${type.charAt(0).toUpperCase() + type.slice(1)}: ₹${cost.toLocaleString()}`
      ).join('\n')}\n\n**Total Estimated Cost: ₹${totalCost.toLocaleString()}**`;
    }
    
    // Scene-specific queries
    if (lowerMessage.includes('scene')) {
      const sceneMatch = lowerMessage.match(/scene\s*(\d+[a-z]?)/i);
      if (sceneMatch) {
        const sceneNum = sceneMatch[1].toUpperCase();
        const relatedElements = scriptElements.filter(e => e.sceneNumbers.includes(sceneNum));
        if (relatedElements.length > 0) {
          return `For Scene ${sceneNum}, I found these elements:\n\n${relatedElements.map(e => 
            `• ${e.name} (${e.type})\n  ${e.description}`
          ).join('\n\n')}`;
        }
      }
    }
    
    // Default response
    return `I can help you with information about:\n\n• **Locations** - Ask about shooting locations and permits\n• **Characters** - Character requirements and casting needs\n• **VFX** - Visual effects breakdown and complexity\n• **Props** - Required props and set pieces\n• **Costs** - Budget estimates and breakdowns\n• **Scenes** - Specific scene requirements\n\nTry asking something like "What VFX work is needed?" or "Show me all locations"`;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse = generateAIResponse(newMessage);
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: aiResponse,
      timestamp: new Date().toISOString()
    };

    setIsTyping(false);
    setChatMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const simulateScriptUpload = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    
    const analysisMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      message: "Script analysis complete! I've identified 15 scenes, 8 characters, 5 locations, and 12 VFX sequences. The total estimated budget is ₹468,000. What would you like to know about your script?",
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, analysisMessage]);
  };

  const tabs = [
    { id: 'breakdown', label: 'Script Breakdown', icon: FileText },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare }
  ];

  const categories = [
    { id: 'all', label: 'All Elements', count: scriptElements.length },
    { id: 'scene', label: 'Scenes', count: scriptElements.filter(e => e.type === 'scene').length },
    { id: 'character', label: 'Characters', count: scriptElements.filter(e => e.type === 'character').length },
    { id: 'location', label: 'Locations', count: scriptElements.filter(e => e.type === 'location').length },
    { id: 'vfx', label: 'VFX', count: scriptElements.filter(e => e.type === 'vfx').length },
    { id: 'prop', label: 'Props', count: scriptElements.filter(e => e.type === 'prop').length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Script Breakdown
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent script analysis with AI-powered breakdown and interactive assistant
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={simulateScriptUpload}
            disabled={isAnalyzing}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Script
              </>
            )}
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Breakdown
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'breakdown' && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            {/* Elements Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredElements.map((element) => (
                <motion.div
                  key={element.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 dark:text-blue-400">
                        {getElementIcon(element.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {element.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {element.type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getComplexityColor(element.complexity)}`}>
                        {element.complexity}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {element.aiConfidence}% confidence
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">{element.description}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appears in Scenes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {element.sceneNumbers.map((scene, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {scene}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Requirements:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {element.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                            {req}
                          </li>
                        ))}
                        {element.requirements.length > 3 && (
                          <li className="text-xs text-gray-500 dark:text-gray-400">
                            +{element.requirements.length - 3} more requirements
                          </li>
                        )}
                      </ul>
                    </div>

                    {element.estimatedCost && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estimated Cost:
                          </span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{element.estimatedCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredElements.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No elements found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try selecting a different category or upload a script to analyze.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    AI Script Assistant
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ask me anything about your script breakdown
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about scenes, characters, locations, costs..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
