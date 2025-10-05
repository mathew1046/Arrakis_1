import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, DollarSign, PieChart, TrendingUp, AlertCircle, CheckCircle,
  Edit3, Save, RotateCcw, MessageSquare, Zap, Target, BarChart3
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCategory {
  id: string;
  name: string;
  aiSuggested: number;
  userAdjusted?: number;
  percentage: number;
  description: string;
  reasoning: string;
  confidence: number;
  subcategories: {
    name: string;
    amount: number;
    description: string;
  }[];
}

interface AIBudgetAllocationProps {
  totalBudget: number;
  onAllocationUpdate?: (allocation: BudgetCategory[]) => void;
}

export const AIBudgetAllocation: React.FC<AIBudgetAllocationProps> = ({
  totalBudget = 5000000,
  onAllocationUpdate
}) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize AI-suggested budget allocation
  useEffect(() => {
    const aiSuggestedCategories: BudgetCategory[] = [
      {
        id: '1',
        name: 'Above-the-Line',
        aiSuggested: 1500000,
        percentage: 30,
        description: 'Director, Producer, Key Cast salaries and fees',
        reasoning: 'Based on industry standards for mid-budget productions and star power requirements',
        confidence: 92,
        subcategories: [
          { name: 'Director Fee', amount: 500000, description: 'Director compensation' },
          { name: 'Producer Fee', amount: 300000, description: 'Producer compensation' },
          { name: 'Lead Cast', amount: 700000, description: 'Main actors salaries' }
        ]
      },
      {
        id: '2',
        name: 'Below-the-Line',
        aiSuggested: 2000000,
        percentage: 40,
        description: 'Crew, equipment, locations, and production costs',
        reasoning: 'Largest allocation due to extensive crew requirements and equipment needs for action sequences',
        confidence: 88,
        subcategories: [
          { name: 'Crew Salaries', amount: 800000, description: 'All crew compensation' },
          { name: 'Equipment Rental', amount: 600000, description: 'Cameras, lighting, sound equipment' },
          { name: 'Location Costs', amount: 400000, description: 'Location fees and permits' },
          { name: 'Transportation', amount: 200000, description: 'Vehicle rentals and logistics' }
        ]
      },
      {
        id: '3',
        name: 'Post-Production',
        aiSuggested: 750000,
        percentage: 15,
        description: 'Editing, VFX, sound design, and color correction',
        reasoning: 'Significant VFX requirements for explosion and chase sequences require substantial post budget',
        confidence: 90,
        subcategories: [
          { name: 'VFX', amount: 400000, description: 'Visual effects and compositing' },
          { name: 'Editing', amount: 150000, description: 'Picture and sound editing' },
          { name: 'Sound Design', amount: 100000, description: 'Audio post-production' },
          { name: 'Color Grading', amount: 100000, description: 'Final color correction' }
        ]
      },
      {
        id: '4',
        name: 'Marketing & Distribution',
        aiSuggested: 500000,
        percentage: 10,
        description: 'Promotional campaigns and distribution costs',
        reasoning: 'Moderate marketing budget suitable for targeted release strategy',
        confidence: 85,
        subcategories: [
          { name: 'Digital Marketing', amount: 200000, description: 'Online advertising and social media' },
          { name: 'Traditional Marketing', amount: 150000, description: 'TV, radio, print advertising' },
          { name: 'PR & Events', amount: 100000, description: 'Public relations and premiere events' },
          { name: 'Distribution', amount: 50000, description: 'Distribution and delivery costs' }
        ]
      },
      {
        id: '5',
        name: 'Contingency',
        aiSuggested: 250000,
        percentage: 5,
        description: 'Emergency fund for unexpected costs',
        reasoning: 'Standard 5% contingency recommended for productions with moderate risk factors',
        confidence: 95,
        subcategories: [
          { name: 'Production Contingency', amount: 150000, description: 'Production overruns and emergencies' },
          { name: 'Post Contingency', amount: 100000, description: 'Post-production contingency' }
        ]
      }
    ];

    setCategories(aiSuggestedCategories);
    onAllocationUpdate?.(aiSuggestedCategories);
  }, [totalBudget, onAllocationUpdate]);

  const handleCategoryUpdate = (categoryId: string, newAmount: number) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const percentage = (newAmount / totalBudget) * 100;
        return {
          ...category,
          userAdjusted: newAmount,
          percentage
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    onAllocationUpdate?.(updatedCategories);
  };

  const resetToAISuggestions = () => {
    const resetCategories = categories.map(category => ({
      ...category,
      userAdjusted: undefined,
      percentage: (category.aiSuggested / totalBudget) * 100
    }));
    setCategories(resetCategories);
    onAllocationUpdate?.(resetCategories);
  };

  const getCurrentAmount = (category: BudgetCategory) => {
    return category.userAdjusted || category.aiSuggested;
  };

  const getTotalAllocated = () => {
    return categories.reduce((sum, category) => sum + getCurrentAmount(category), 0);
  };

  const getRemainingBudget = () => {
    return totalBudget - getTotalAllocated();
  };

  const generateChatbotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('why') && lowerQuery.includes('30%')) {
      return "The 30% allocation to Above-the-Line is based on industry standards for mid-budget productions. This covers director fees (₹5L), producer compensation (₹3L), and lead cast salaries (₹7L). For a film of this scale, securing quality talent is crucial for both creative success and marketability.";
    }
    
    if (lowerQuery.includes('vfx') || lowerQuery.includes('visual effects')) {
      return "VFX gets ₹4L (8% of total budget) because your script includes complex sequences like building explosions and helicopter chases. Based on similar productions, explosion simulations typically cost ₹2-3L, while helicopter VFX requires ₹1-2L. This allocation ensures quality effects without overspending.";
    }
    
    if (lowerQuery.includes('contingency')) {
      return "The 5% contingency (₹2.5L) is industry standard for moderate-risk productions. It's split between production (₹1.5L) for on-set emergencies and post-production (₹1L) for potential VFX overruns. This percentage balances financial safety with efficient budget utilization.";
    }
    
    if (lowerQuery.includes('marketing')) {
      return "Marketing gets 10% (₹5L) which is appropriate for a targeted release. Digital marketing (₹2L) focuses on social media and online ads, traditional marketing (₹1.5L) covers TV/radio, PR events (₹1L) for premieres, and distribution (₹50K) for delivery costs.";
    }
    
    if (lowerQuery.includes('reduce') || lowerQuery.includes('cut')) {
      return "To reduce costs, consider: 1) Negotiate cast fees (potential ₹2L savings), 2) Use more practical effects vs VFX (₹1L savings), 3) Reduce marketing spend for digital-first release (₹2L savings), 4) Optimize shooting schedule to reduce crew days (₹3L savings). However, maintain quality in key areas.";
    }
    
    if (lowerQuery.includes('increase') || lowerQuery.includes('more')) {
      return "If you have additional budget, prioritize: 1) VFX quality for action sequences (+₹2L), 2) Marketing for wider reach (+₹3L), 3) Additional shooting days for better coverage (+₹2L), 4) Higher-profile cast for marketability (+₹5L). Focus on areas that directly impact audience experience.";
    }
    
    return "I can help explain budget allocations, suggest optimizations, or answer questions about specific categories. Try asking: 'Why is VFX allocated ₹4L?' or 'How can I reduce the marketing budget?' or 'What if I increase the total budget?'";
  };

  const handleChatQuery = async () => {
    if (!chatQuery.trim()) return;
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const response = generateChatbotResponse(chatQuery);
    setChatResponse(response);
    setIsAnalyzing(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            AI Budget Allocation Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent budget distribution based on script analysis and industry standards
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
              showChatbot
                ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </button>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
              isEditing
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Allocation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Allocated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(getTotalAllocated())}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
              <p className={`text-2xl font-bold ${
                getRemainingBudget() >= 0 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(getRemainingBudget())}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <PieChart className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Budget Allocation Assistant
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={chatQuery}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask about budget allocations... e.g., 'Why is 30% allocated to VFX?'"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                onKeyPress={(e) => e.key === 'Enter' && handleChatQuery()}
              />
              <button
                onClick={handleChatQuery}
                disabled={isAnalyzing || !chatQuery.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
              >
                {isAnalyzing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Ask AI'
                )}
              </button>
            </div>
            
            {chatResponse && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{chatResponse}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Budget Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const currentAmount = getCurrentAmount(category);
          const isModified = category.userAdjusted !== undefined;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                    {isModified && (
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                        Modified
                      </span>
                    )}
                    <div className={`flex items-center text-sm ${getConfidenceColor(category.confidence)}`}>
                      <Brain className="h-4 w-4 mr-1" />
                      {category.confidence}% confidence
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{category.description}</p>
                  
                  {/* AI Reasoning */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>AI Reasoning:</strong> {category.reasoning}
                    </p>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => handleCategoryUpdate(category.id, parseFloat(e.target.value) || 0)}
                        className="w-32 px-3 py-2 text-right border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {((currentAmount / totalBudget) * 100).toFixed(1)}%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(currentAmount)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.percentage.toFixed(1)}% of total
                      </p>
                      {isModified && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          AI suggested: {formatCurrency(category.aiSuggested)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isModified ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(category.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Subcategories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.subcategories.map((sub, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {sub.name}
                    </h4>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {formatCurrency(sub.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={resetToAISuggestions}
            className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to AI Suggestions
          </button>
          
          {getRemainingBudget() !== 0 && (
            <div className={`flex items-center px-3 py-2 rounded-lg ${
              getRemainingBudget() > 0
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {getRemainingBudget() > 0 ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              {getRemainingBudget() > 0 ? 'Under budget' : 'Over budget'} by {formatCurrency(Math.abs(getRemainingBudget()))}
            </div>
          )}
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            AI-powered allocation based on script analysis
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Recommendations updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};
