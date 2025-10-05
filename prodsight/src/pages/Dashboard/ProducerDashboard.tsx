import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckSquare,
  Clock,
  Settings,
  Bell,
  Receipt,
  FileText,
  BarChart3,
  Zap,
  FolderOpen
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { formatCurrency, getPriorityColor } from '../../utils/formatters';
import { Task, Budget, Script, User } from '../../api/endpoints';

interface ProducerDashboardProps {
  user: User;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

export const ProducerDashboard: React.FC<ProducerDashboardProps> = ({
  user,
  tasks,
  budget,
  script,
}) => {
  const [notifications] = useState<string[]>(['New expense pending approval', 'Call sheet updated']);

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const overdueTasks = tasks.filter(task =>
    new Date(task.dueDate) < new Date() && task.status !== 'done'
  ).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'done').length;
  const budgetUtilization = budget ? (budget.spent / budget.total) * 100 : 0;
  const activeTeamMembers = Array.from(new Set(tasks.map(task => task.assignee))).length;

  const upcomingDeadlines = tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

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
            Production Manager Dashboard
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

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Tasks"
          value={totalTasks}
          subtitle={`${completedTasks} completed`}
          icon={CheckSquare}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />

        <KPICard
          title="Team Members"
          value={activeTeamMembers}
          subtitle="Active crew"
          icon={Users}
          color="green"
        />

        <KPICard
          title="Budget Status"
          value={`${Math.round(budgetUtilization)}%`}
          subtitle="Utilized"
          icon={DollarSign}
          color={budgetUtilization > 90 ? 'red' : budgetUtilization > 75 ? 'yellow' : 'green'}
        />

        <KPICard
          title="Urgent Tasks"
          value={highPriorityTasks + overdueTasks}
          subtitle={`${overdueTasks} overdue`}
          icon={AlertTriangle}
          color={overdueTasks > 0 ? 'red' : 'yellow'}
        />
      </div>

      {/* Task Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date();
              const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assigned to {task.assignee}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center ${
                      isOverdue ? 'text-red-600 dark:text-red-400' :
                      daysUntilDue <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-gray-500 dark:text-gray-400'
                    }`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` :
                       daysUntilDue === 0 ? 'Due today' :
                       daysUntilDue === 1 ? 'Due tomorrow' :
                       `Due in ${daysUntilDue} days`}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {task.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Workload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Team Workload
          </h3>
          <div className="space-y-4">
            {Array.from(new Set(tasks.map(task => task.assignee))).slice(0, 6).map((assignee) => {
              const assigneeTasks = tasks.filter(task => task.assignee === assignee);
              const completedByAssignee = assigneeTasks.filter(task => task.status === 'done').length;
              const activeByAssignee = assigneeTasks.filter(task => task.status !== 'done').length;
              const completionRate = assigneeTasks.length > 0 ? (completedByAssignee / assigneeTasks.length) * 100 : 0;

              return (
                <div key={assignee} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {assignee}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {activeByAssignee} active, {completedByAssignee} done
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionRate}%` }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className={`h-2 rounded-full ${
                        completionRate >= 80 ? 'bg-green-500' :
                        completionRate >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Budget and Resource Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Resource Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Budget Overview */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget Overview
            </h4>
            {budget && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Budget</span>
                  <span className="font-medium">{formatCurrency(budget.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Spent</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(budget.spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(budget.remaining)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      budgetUtilization > 100 ? 'bg-red-500' :
                      budgetUtilization > 80 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Schedule Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Status
            </h4>
            <div className="space-y-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {tasks.filter(t => t.status === 'done').length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Completed</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">In Progress</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {overdueTasks}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Overdue</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Quick Actions
            </h4>
            <div className="space-y-2">
              <button className="w-full p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Assign New Task
              </button>
              <button className="w-full p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Update Schedule
              </button>
              <button className="w-full p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Review Budget
              </button>
              <button className="w-full p-2 text-left text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
