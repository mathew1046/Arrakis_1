import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { BudgetChart } from '../../components/charts/BudgetChart';
import { useTasks } from '../../hooks/useTasks';
import { useBudget } from '../../hooks/useBudget';
import { useScript } from '../../hooks/useScript';
import { useAI } from '../../hooks/useAI';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const Reports: React.FC = () => {
  const { tasks } = useTasks();
  const { budget } = useBudget();
  const { script } = useScript();
  const { generateReport, loading: aiLoading } = useAI();
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleGenerateReport = async () => {
    const projectData = {
      tasks,
      budget,
      script,
    };
    
    const report = await generateReport(projectData);
    if (report) {
      setGeneratedReport(report);
      setShowReportModal(true);
    }
  };

  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const budgetUtilization = budget ? (budget.spent / budget.total) * 100 : 0;

  const reportSections = [
    {
      title: 'Executive Summary',
      icon: FileText,
      description: 'High-level overview of project status and key metrics',
      data: {
        'Project Progress': `${Math.round(taskCompletionRate)}%`,
        'Budget Utilization': `${Math.round(budgetUtilization)}%`,
        'Total Scenes': script?.totalScenes || 0,
        'VFX Scenes': script?.vfxScenes || 0,
      }
    },
    {
      title: 'Task Analytics',
      icon: BarChart3,
      description: 'Detailed breakdown of task completion and team performance',
      data: {
        'Total Tasks': totalTasks,
        'Completed': completedTasks,
        'In Progress': tasks.filter(t => t.status === 'in_progress').length,
        'Overdue': tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
      }
    },
    {
      title: 'Budget Analysis',
      icon: DollarSign,
      description: 'Financial overview and spending patterns',
      data: budget ? {
        'Total Budget': formatCurrency(budget.total),
        'Amount Spent': formatCurrency(budget.spent),
        'Remaining': formatCurrency(budget.remaining),
        'Utilization': `${Math.round(budgetUtilization)}%`,
      } : {}
    },
    {
      title: 'Production Timeline',
      icon: Calendar,
      description: 'Schedule adherence and milestone tracking',
      data: {
        'On Schedule': tasks.filter(t => new Date(t.dueDate) >= new Date() || t.status === 'done').length,
        'Behind Schedule': tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
        'Avg Task Duration': '4.2 days',
        'Critical Path Items': tasks.filter(t => t.priority === 'high').length,
      }
    },
  ];

  return (
    <RoleGuard permissions={['view_reports', 'view_all']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Production Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analytics and insights for your production
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleGenerateReport}
              loading={aiLoading}
            >
              <Zap className="h-4 w-4 mr-2" />
              AI Report
            </Button>
            <Button variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overall Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {Math.round((taskCompletionRate + (100 - budgetUtilization)) / 2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Team Efficiency
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {Math.round(taskCompletionRate)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Budget Health
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {budget ? formatCurrency(budget.remaining) : '$0'}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${budgetUtilization > 90 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Schedule Status
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  On Track
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Report Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  <Icon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {key}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Budget Visualization */}
        {budget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Budget Breakdown
            </h3>
            <BudgetChart categories={budget.categories} type="bar" />
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task, index) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.assignee} • {task.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'done'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Due {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Generated Report Modal */}
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="AI Production Report"
          size="xl"
        >
          {generatedReport && (
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Executive Summary
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {generatedReport.summary}
                </p>
              </div>

              {/* Key Metrics */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Key Performance Indicators
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(generatedReport.keyMetrics).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {value}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {generatedReport.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {generatedReport.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Zap className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Assessment */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Risk Assessment
                </h4>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      generatedReport.riskAssessment.level === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : generatedReport.riskAssessment.level === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      {generatedReport.riskAssessment.level} risk
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {generatedReport.riskAssessment.factors.map((factor: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                  Close
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </RoleGuard>
  );
};
