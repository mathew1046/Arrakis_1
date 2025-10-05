import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  Shield,
  Receipt,
  BarChart3,
  Zap,
  FolderOpen,
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { ExpenseTracker } from '../../components/expense/ExpenseTracker';
import { AdminControlPanel } from '../../components/admin/AdminControlPanel';
import { AISchedulingSystem } from '../../components/scheduling/AISchedulingSystem';
import { CrewCoordination } from '../../components/crew/CrewCoordination';
import { EnhancedVFXPipeline } from '../../components/vfx/EnhancedVFXPipeline';
import { BudgetTicketingSystem } from '../../components/budget/BudgetTicketingSystem';
import { ManualExpenseEntry } from '../../components/budget/ManualExpenseEntry';
import { AIScriptBreakdown } from '../../components/script/AIScriptBreakdown';
import { AIBudgetAllocation } from '../../components/budget/AIBudgetAllocation';
import { AILocationVFXSuggestions } from '../../components/ai/AILocationVFXSuggestions';
import { GoogleCalendarIntegration } from '../../components/scheduling/GoogleCalendarIntegration';
import { AICallSheets } from '../../components/scheduling/AICallSheets';
import { AssetsManager } from '../../components/assets/AssetsManager';
import { formatCurrency } from '../../utils/formatters';
import { Task, Budget, Script, User } from '../../api/endpoints';

interface ProductionManagerDashboardProps {
  user: User;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

export const ProductionManagerDashboard: React.FC<ProductionManagerDashboardProps> = ({
  user,
  tasks,
  budget,
  script,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState<string[]>(['New expense pending approval', 'Call sheet updated']);

  // Calculations for overview
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const budgetUtilization = budget ? (budget.spent / budget.total) * 100 : 0;
  const isOverBudget = budget ? budget.spent > budget.total : false;

  const vfxScenes = script?.vfxScenes || 0;
  const totalScenes = script?.totalScenes || 0;

  const overdueTasks = tasks.filter(task =>
    new Date(task.dueDate) < new Date() && task.status !== 'done'
  ).length;

  const activeTeamMembers = Array.from(new Set(tasks.map(task => task.assignee))).length;

  // Tab navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'admin', label: 'Admin Control', icon: Shield },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'crew', label: 'Crew Coordination', icon: Users },
    { id: 'assets', label: 'Assets Management', icon: FolderOpen },
    { id: 'vfx', label: 'VFX Pipeline', icon: Zap },
    { id: 'script', label: 'Script Breakdown', icon: FileText },
    { id: 'budget', label: 'Budget Management', icon: DollarSign },
    { id: 'expenses', label: 'Expense Tracking', icon: Receipt },
    { id: 'ai-suggestions', label: 'AI Suggestions', icon: Zap },
    { id: 'calendar', label: 'Calendar Sync', icon: Calendar },
    { id: 'callsheets', label: 'Call Sheets', icon: FileText },
    { id: 'reports', label: 'Final Reports', icon: FileText }
  ];

  // AI-powered insights
  const generateAIInsights = () => {
    const insights = [];
    if (budgetUtilization > 80) {
      insights.push(`⚠️ Budget utilization at ${Math.round(budgetUtilization)}% - monitor spending`);
    }
    if (overdueTasks > 0) {
      insights.push(`📅 ${overdueTasks} overdue tasks require attention`);
    }
    if (activeTeamMembers < 10) {
      insights.push('👥 Consider expanding crew for upcoming scenes');
    }
    return insights;
  };

  const aiInsights = generateAIInsights();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Notifications */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Producer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* AI Insights Alert */}
      {aiInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-start">
            <Zap className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                AI Production Insights
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                {aiInsights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

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
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Task Completion"
                value={`${completedTasks}/${totalTasks}`}
                subtitle={`${Math.round(taskCompletionRate)}% complete`}
                icon={CheckSquare}
                color="green"
                trend={{ value: 12, isPositive: true }}
              />

              <KPICard
                title="Budget Status"
                value={budget ? formatCurrency(budget.remaining) : '$0'}
                subtitle={`${Math.round(budgetUtilization)}% utilized`}
                icon={DollarSign}
                color={isOverBudget ? 'red' : budgetUtilization > 80 ? 'yellow' : 'green'}
                trend={{ value: -5, isPositive: false }}
              />

              <KPICard
                title="Script Progress"
                value={`${totalScenes} scenes`}
                subtitle={`${vfxScenes} VFX scenes`}
                icon={FileText}
                color="blue"
              />

              <KPICard
                title="Overall Progress"
                value={`${Math.round((taskCompletionRate + (100 - budgetUtilization)) / 2)}%`}
                subtitle="Project completion"
                icon={TrendingUp}
                color="purple"
                trend={{ value: 8, isPositive: true }}
              />
            </div>

            {/* Charts and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Budget Breakdown
                </h3>
                {budget && (
                  <div className="space-y-4">
                    {budget.categories.map((category, index) => {
                      const utilization = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
                      return (
                        <div key={category.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {category.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(utilization, 100)}%` }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                              className={`h-2 rounded-full ${
                                utilization > 100
                                  ? 'bg-red-500'
                                  : utilization > 80
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Recent Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Recent Tasks
                </h3>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {task.assignee} • Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === 'done'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Team Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Team Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {tasks.filter(t => t.status === 'in_progress').length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Tasks</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {tasks.filter(t => new Date(t.dueDate) < new Date()).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overdue Tasks</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {Math.round(taskCompletionRate)}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Expense Tracking Tab */}
        {activeTab === 'expenses' && (
          <motion.div
            key="expenses"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <ExpenseTracker budget={budget || undefined} />
          </motion.div>
        )}

        {/* Administrative Control Panel Tab */}
        {activeTab === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AdminControlPanel />
          </motion.div>
        )}

        {activeTab === 'scheduling' && (
          <motion.div
            key="scheduling"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AISchedulingSystem script={script} />
          </motion.div>
        )}

        {activeTab === 'crew' && (
          <motion.div
            key="crew"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <CrewCoordination currentUser={user.name} />
          </motion.div>
        )}

        {activeTab === 'assets' && (
          <motion.div
            key="assets"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AssetsManager currentUser={user.name} />
          </motion.div>
        )}

        {activeTab === 'vfx' && (
          <motion.div
            key="vfx"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <EnhancedVFXPipeline />
          </motion.div>
        )}

        {activeTab === 'script' && (
          <motion.div
            key="script"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AIScriptBreakdown currentUser={user.name} />
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Budget Requests & Ticketing
                </h3>
                <BudgetTicketingSystem
                  currentUser={user.name}
                  currentUserRole="Producer"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Manual Expense Entry
                </h3>
                <ManualExpenseEntry currentUser={user.name} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                AI Budget Allocation Assistant
              </h3>
              <AIBudgetAllocation totalBudget={budget?.total || 5000000} />
            </div>
          </motion.div>
        )}

        {activeTab === 'ai-suggestions' && (
          <motion.div
            key="ai-suggestions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AILocationVFXSuggestions />
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <GoogleCalendarIntegration />
          </motion.div>
        )}

        {activeTab === 'callsheets' && (
          <motion.div
            key="callsheets"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <AICallSheets />
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div
            key="reports"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Final Production Cost Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered reporting features coming soon...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
