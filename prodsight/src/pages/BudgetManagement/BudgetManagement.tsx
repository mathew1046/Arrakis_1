import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Bot,
  Plus,
  Edit,
  Save,
  Calculator,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  type: 'fixed' | 'variable' | 'ai_estimated';
  subcategories?: BudgetSubcategory[];
}

interface BudgetSubcategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  description: string;
}

interface AIBudgetSuggestion {
  category: string;
  estimatedAmount: number;
  reasoning: string;
  confidence: number;
}

export const BudgetManagement: React.FC = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIBudgetSuggestion[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    // Initialize demo budget data
    const demoBudget: BudgetCategory[] = [
      {
        id: '1',
        name: 'Actor Remuneration',
        allocated: 500000,
        spent: 450000,
        type: 'fixed',
        subcategories: [
          { id: '1a', name: 'Lead Actors', allocated: 300000, spent: 300000, description: 'Main cast payment' },
          { id: '1b', name: 'Supporting Cast', allocated: 200000, spent: 150000, description: 'Supporting roles' }
        ]
      },
      {
        id: '2',
        name: 'Crew Wages',
        allocated: 300000,
        spent: 280000,
        type: 'fixed',
        subcategories: [
          { id: '2a', name: 'Director & DOP', allocated: 150000, spent: 150000, description: 'Key crew members' },
          { id: '2b', name: 'Technical Crew', allocated: 150000, spent: 130000, description: 'Sound, lighting, etc.' }
        ]
      },
      {
        id: '3',
        name: 'Location & Travel',
        allocated: 200000,
        spent: 180000,
        type: 'ai_estimated',
        subcategories: [
          { id: '3a', name: 'Location Rental', allocated: 120000, spent: 110000, description: 'Shooting locations' },
          { id: '3b', name: 'Travel & Logistics', allocated: 80000, spent: 70000, description: 'Transportation costs' }
        ]
      },
      {
        id: '4',
        name: 'Production Expenses',
        allocated: 150000,
        spent: 120000,
        type: 'variable',
        subcategories: [
          { id: '4a', name: 'Food & Catering', allocated: 80000, spent: 65000, description: 'Daily meals for cast & crew' },
          { id: '4b', name: 'Props & Costumes', allocated: 70000, spent: 55000, description: 'Art department expenses' }
        ]
      },
      {
        id: '5',
        name: 'Post-Production',
        allocated: 250000,
        spent: 50000,
        type: 'fixed',
        subcategories: [
          { id: '5a', name: 'Editing & Color', allocated: 100000, spent: 30000, description: 'Post-production work' },
          { id: '5b', name: 'VFX & Sound', allocated: 150000, spent: 20000, description: 'Visual effects and sound design' }
        ]
      }
    ];

    setBudgetCategories(demoBudget);
    setTotalBudget(demoBudget.reduce((total, cat) => total + cat.allocated, 0));
  }, []);

  const generateAISuggestions = async () => {
    setIsGeneratingAI(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const suggestions: AIBudgetSuggestion[] = [
      {
        category: 'Junior Artists',
        estimatedAmount: 45000,
        reasoning: 'Based on 15 shooting days with average 10 junior artists per day at ₹300/day',
        confidence: 85
      },
      {
        category: 'Equipment Rental',
        estimatedAmount: 80000,
        reasoning: 'Camera, lighting, and sound equipment for 15 days at ₹5,333/day average',
        confidence: 90
      },
      {
        category: 'Makeup & Hair',
        estimatedAmount: 35000,
        reasoning: 'Professional makeup artist for lead actors across shooting schedule',
        confidence: 80
      },
      {
        category: 'Insurance & Permits',
        estimatedAmount: 25000,
        reasoning: 'Production insurance and location shooting permits',
        confidence: 95
      }
    ];

    setAiSuggestions(suggestions);
    setIsGeneratingAI(false);
  };

  const getBudgetStatus = (allocated: number, spent: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage > 100) return { status: 'over', color: 'red', percentage };
    if (percentage > 90) return { status: 'warning', color: 'yellow', percentage };
    return { status: 'good', color: 'green', percentage };
  };

  const getTotalSpent = () => {
    return budgetCategories.reduce((total, cat) => total + cat.spent, 0);
  };

  const getTotalAllocated = () => {
    return budgetCategories.reduce((total, cat) => total + cat.allocated, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Budget Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered budget allocation and expense tracking
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              generateAISuggestions();
              setShowAIModal(true);
            }}
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Suggestions
          </Button>
          <Button onClick={() => setShowAddCategoryModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{getTotalAllocated().toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{getTotalSpent().toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{(getTotalAllocated() - getTotalSpent()).toLocaleString()}
              </p>
            </div>
            <Calculator className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {((getTotalSpent() / getTotalAllocated()) * 100).toFixed(1)}%
              </p>
            </div>
            <PieChart className="h-8 w-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Budget Categories
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {budgetCategories.map((category, index) => {
            const status = getBudgetStatus(category.allocated, category.spent);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.type === 'ai_estimated' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : category.type === 'variable'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {category.type === 'ai_estimated' ? 'AI Estimated' : 
                       category.type === 'variable' ? 'Variable' : 'Fixed'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{category.spent.toLocaleString()} / ₹{category.allocated.toLocaleString()}
                      </p>
                      <p className={`text-sm font-medium ${
                        status.status === 'over' ? 'text-red-600 dark:text-red-400' :
                        status.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {status.percentage.toFixed(1)}% used
                      </p>
                    </div>
                    {status.status === 'over' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    {status.status === 'good' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      status.status === 'over' ? 'bg-red-500' :
                      status.status === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(status.percentage, 100)}%` }}
                  />
                </div>

                {/* Subcategories */}
                {category.subcategories && (
                  <div className="space-y-2">
                    {category.subcategories.map(sub => {
                      const subStatus = getBudgetStatus(sub.allocated, sub.spent);
                      return (
                        <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sub.name}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {sub.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ₹{sub.spent.toLocaleString()} / ₹{sub.allocated.toLocaleString()}
                            </p>
                            <p className={`text-xs ${
                              subStatus.status === 'over' ? 'text-red-600 dark:text-red-400' :
                              'text-gray-500 dark:text-gray-400'
                            }`}>
                              {subStatus.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Suggestions Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI Budget Suggestions"
        size="lg"
      >
        <div className="space-y-6">
          {isGeneratingAI ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600 dark:text-gray-400">
                Analyzing your production requirements...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <Bot className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  AI-Generated Budget Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on your script analysis and production schedule
                </p>
              </div>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.category}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          ₹{suggestion.estimatedAmount.toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          suggestion.confidence >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          suggestion.confidence >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {suggestion.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {suggestion.reasoning}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowAIModal(false)}>
                  Close
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Selected Categories
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
