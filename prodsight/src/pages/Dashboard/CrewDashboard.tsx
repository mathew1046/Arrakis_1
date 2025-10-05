import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  Upload,
  User,
  DollarSign,
  FileText,
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { BudgetTicketingSystem } from '../../components/budget/BudgetTicketingSystem';
import { formatDate, getStatusColor, getPriorityColor } from '../../utils/formatters';
import { Task, Budget, Script, User as UserType } from '../../api/endpoints';

interface CrewDashboardProps {
  user: UserType;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

export const CrewDashboard: React.FC<CrewDashboardProps> = ({
  user,
  tasks,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const myTasks = tasks.filter(task => task.assigneeId === user.id);
  const completedTasks = myTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = myTasks.filter(task => task.status === 'in_progress').length;
  const overdueTasks = myTasks.filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'done'
  ).length;

  const upcomingTasks = myTasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CheckSquare },
    { id: 'budget-requests', label: 'Budget Requests', icon: DollarSign },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Crew Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}
          </p>
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
                  {tab.id === 'overview' ? 'Overview' : 'Requests'}
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
          title="My Tasks"
          value={myTasks.length}
          subtitle={`${completedTasks} completed`}
          icon={CheckSquare}
          color="blue"
        />
        
        <KPICard
          title="In Progress"
          value={inProgressTasks}
          subtitle="Active tasks"
          icon={Clock}
          color="yellow"
        />
        
        <KPICard
          title="Overdue"
          value={overdueTasks}
          subtitle="Need attention"
          icon={AlertCircle}
          color={overdueTasks > 0 ? 'red' : 'green'}
        />
        
        <KPICard
          title="Completion Rate"
          value={`${myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0}%`}
          subtitle="This week"
          icon={User}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* My Tasks Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date();
                return (
                  <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {task.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`flex items-center ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        Due {formatDate(task.dueDate)}
                        {isOverdue && ' (Overdue)'}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Great job staying on top of your work!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Task Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Task Categories
          </h3>
          <div className="space-y-4">
            {Array.from(new Set(myTasks.map(task => task.category))).map((category) => {
              const categoryTasks = myTasks.filter(task => task.category === category);
              const completedInCategory = categoryTasks.filter(task => task.status === 'done').length;
              const percentage = categoryTasks.length > 0 ? (completedInCategory / categoryTasks.length) * 100 : 0;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {completedInCategory}/{categoryTasks.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="h-2 rounded-full bg-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <Upload className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Upload Asset
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload files for current tasks
            </p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <CheckSquare className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              Update Status
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mark tasks as complete
            </p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors group">
            <Calendar className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              View Schedule
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Check upcoming deadlines
            </p>
          </button>
        </div>
      </motion.div>
        </div>
      )}

      {/* Budget Requests Tab */}
      {activeTab === 'budget-requests' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <BudgetTicketingSystem 
            currentUser={user.name} 
            currentUserRole={user.role} 
          />
        </motion.div>
      )}
    </div>
  );
};
