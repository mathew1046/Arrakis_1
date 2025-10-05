import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Eye,
  Download,
  DollarSign,
} from 'lucide-react';
import { KPICard } from '../../components/dashboard/KPICard';
import { BudgetTicketingSystem } from '../../components/budget/BudgetTicketingSystem';
import { formatDate, getStatusColor } from '../../utils/formatters';
import { Task, Budget, Script, User } from '../../api/endpoints';

interface VFXDashboardProps {
  user: User;
  tasks: Task[];
  budget: Budget | null;
  script: Script | null;
}

export const VFXDashboard: React.FC<VFXDashboardProps> = ({
  user,
  tasks,
  script,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const vfxTasks = tasks.filter(task => 
    task.category === 'VFX' || task.assigneeId === user.id
  );
  
  const completedShots = vfxTasks.filter(task => task.status === 'done').length;
  const inProgressShots = vfxTasks.filter(task => task.status === 'in_progress').length;
  const reviewShots = vfxTasks.filter(task => task.title.includes('review')).length;

  const tabs = [
    { id: 'overview', label: 'VFX Overview', icon: Zap },
    { id: 'budget-requests', label: 'Budget Requests', icon: DollarSign },
  ];
  
  const vfxScenes = script?.scenes.filter(scene => scene.vfx) || [];
  const approvedVFXScenes = vfxScenes.filter(scene => scene.status === 'approved').length;

  // Mock VFX shots data
  const mockVFXShots = [
    {
      id: '1',
      name: 'VFX_001_CarExplosion',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-10-20',
      complexity: 'medium',
      versions: 2,
    },
    {
      id: '2',
      name: 'VFX_002_HelicopterBG',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-10-25',
      complexity: 'high',
      versions: 0,
    },
    {
      id: '3',
      name: 'VFX_003_MuzzleFlash',
      status: 'done',
      priority: 'medium',
      dueDate: '2024-10-15',
      complexity: 'low',
      versions: 1,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            VFX Dashboard
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
                  {tab.id === 'overview' ? 'VFX' : 'Requests'}
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
          title="VFX Shots"
          value={mockVFXShots.length}
          subtitle={`${completedShots} completed`}
          icon={Zap}
          color="purple"
        />
        
        <KPICard
          title="In Progress"
          value={inProgressShots}
          subtitle="Active shots"
          icon={Clock}
          color="blue"
        />
        
        <KPICard
          title="In Review"
          value={reviewShots}
          subtitle="Awaiting approval"
          icon={Eye}
          color="yellow"
        />
        
        <KPICard
          title="VFX Scenes"
          value={`${approvedVFXScenes}/${vfxScenes.length}`}
          subtitle="Scenes approved"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* VFX Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            VFX Shot Pipeline
          </h3>
          <div className="space-y-3">
            {mockVFXShots.map((shot) => {
              const isOverdue = new Date(shot.dueDate) < new Date() && shot.status !== 'done';
              return (
                <div key={shot.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {shot.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          shot.complexity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          shot.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {shot.complexity} complexity
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          v{shot.versions} versions
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shot.status)}`}>
                      {shot.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      <Clock className="h-3 w-3 mr-1" />
                      Due {formatDate(shot.dueDate)}
                      {isOverdue && ' (Overdue)'}
                    </span>
                    <div className="flex gap-2">
                      {shot.status === 'in_progress' && (
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <Upload className="h-3 w-3" />
                        </button>
                      )}
                      {shot.versions > 0 && (
                        <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                          <Download className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* VFX Scenes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            VFX Scenes
          </h3>
          <div className="space-y-3">
            {vfxScenes.slice(0, 5).map((scene) => (
              <div key={scene.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Scene {scene.number}
                      </span>
                      <Zap className="h-3 w-3 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {scene.description}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scene.status)}`}>
                    {scene.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{scene.location}</span>
                  <span>{scene.estimatedDuration}min</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* VFX Tools & Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          VFX Tools & Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group">
            <Upload className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Upload Version
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload new VFX version
            </p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group">
            <Eye className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Request Review
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Submit for approval
            </p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group">
            <Download className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Download Assets
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get reference materials
            </p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group">
            <AlertTriangle className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Report Issue
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Flag technical problems
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
