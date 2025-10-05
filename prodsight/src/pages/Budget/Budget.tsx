import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  PieChart,
  Download,
  Plus,
  FileText,
} from 'lucide-react';
import { BudgetChart } from '../../components/charts/BudgetChart';
import { KPICard } from '../../components/dashboard/KPICard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { BudgetTicketingSystem } from '../../components/budget/BudgetTicketingSystem';
import { ManualExpenseEntry } from '../../components/budget/ManualExpenseEntry';
import { AIBudgetAllocation } from '../../components/budget/AIBudgetAllocation';
import { useBudget } from '../../hooks/useBudget';
import { useAI } from '../../hooks/useAI';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const Budget: React.FC = () => {
  const { budget, loading } = useBudget();
  const { forecastBudget, loading: aiLoading } = useAI();
  const { user } = useAuth();
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [showForecast, setShowForecast] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleGenerateForecast = async () => {
    if (budget) {
      const result = await forecastBudget(budget);
      if (result) {
        setForecast(result);
        setShowForecast(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No budget data available</p>
      </div>
    );
  }

  const budgetUtilization = (budget.spent / budget.total) * 100;
  const isOverBudget = budget.spent > budget.total;
  const overBudgetAmount = Math.max(0, budget.spent - budget.total);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ticketing', label: 'Budget Requests', icon: FileText },
    { id: 'expenses', label: 'Manual Entry', icon: Plus },
    { id: 'allocation', label: 'AI Allocation', icon: TrendingUp },
  ];

  return (
    <RoleGuard permissions={['edit_budget', 'view_all']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Budget Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track and manage production budget
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateForecast}
              loading={aiLoading}
              className="flex-1 sm:flex-none"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">AI Forecast</span>
              <span className="sm:hidden">Forecast</span>
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-3 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'overview' ? 'Overview' : 
                     tab.id === 'ticketing' ? 'Requests' :
                     tab.id === 'expenses' ? 'Entry' : 'AI'}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <KPICard
            title="Total Budget"
            value={formatCurrency(budget.total)}
            icon={DollarSign}
            color="blue"
          />
          
          <KPICard
            title="Spent"
            value={formatCurrency(budget.spent)}
            subtitle={`${Math.round(budgetUtilization)}% utilized`}
            icon={TrendingDown}
            color={isOverBudget ? 'red' : budgetUtilization > 80 ? 'yellow' : 'green'}
          />
          
          <KPICard
            title="Remaining"
            value={formatCurrency(budget.remaining)}
            icon={TrendingUp}
            color={budget.remaining > 0 ? 'green' : 'red'}
          />
          
          <KPICard
            title={isOverBudget ? "Over Budget" : "Budget Health"}
            value={isOverBudget ? formatCurrency(overBudgetAmount) : "On Track"}
            icon={AlertTriangle}
            color={isOverBudget ? 'red' : 'green'}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Budget Breakdown
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={chartType === 'bar' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'pie' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('pie')}
                >
                  <PieChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <BudgetChart categories={budget.categories} type={chartType} />
          </motion.div>

          {/* Category Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Category Details
            </h3>
            <div className="space-y-4">
              {budget.categories.map((category) => {
                const utilization = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
                const isOverBudget = category.spent > category.budgeted;
                
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </span>
                      <span className={`text-sm ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isOverBudget
                            ? 'bg-red-500'
                            : utilization > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{Math.round(utilization)}% used</span>
                      <span>{formatCurrency(category.remaining)} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {budget.history.slice(0, 8).map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatDate(entry.date)}
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">
                      {entry.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        {entry.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(entry.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Forecast Modal */}
        <Modal
          isOpen={showForecast}
          onClose={() => setShowForecast(false)}
          title="AI Budget Forecast"
          size="lg"
        >
          {forecast && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(forecast.projectedTotal)}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Projected Total</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(forecast.overBudget)}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">Over Budget</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Risk Factors</h4>
                <ul className="space-y-2">
                  {forecast.riskFactors.map((factor: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {forecast.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>
          </div>
        )}

        {/* Budget Ticketing System Tab */}
        {activeTab === 'ticketing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <BudgetTicketingSystem 
              currentUser={user?.name || 'Unknown User'} 
              currentUserRole={user?.role || 'Unknown Role'} 
            />
          </motion.div>
        )}

        {/* Manual Expense Entry Tab */}
        {activeTab === 'expenses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ManualExpenseEntry currentUser={user?.name || 'Unknown User'} />
          </motion.div>
        )}

        {/* AI Budget Allocation Tab */}
        {activeTab === 'allocation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <AIBudgetAllocation totalBudget={budget?.total || 5000000} />
          </motion.div>
        )}
      </motion.div>
    </RoleGuard>
  );
};
