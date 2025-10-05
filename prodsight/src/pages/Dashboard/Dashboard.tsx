import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { useBudget } from '../../hooks/useBudget';
import { useScript } from '../../hooks/useScript';
import { ProducerDashboard } from './ProducerDashboard';
import { ProductionManagerDashboard } from './ProductionManagerDashboard';
import { DirectorDashboard } from './DirectorDashboard';
import { CrewDashboard } from './CrewDashboard';
import { VFXDashboard } from './VFXDashboard';
import { DistributionManagerDashboard } from './DistributionManagerDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const { budget, loading: budgetLoading } = useBudget();
  const { script, loading: scriptLoading } = useScript();

  if (!user) {
    return null;
  }

  const isLoading = tasksLoading || budgetLoading || scriptLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const dashboardProps = {
    user,
    tasks,
    budget,
    script,
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'Producer':
        return <ProducerDashboard {...dashboardProps} />;
      case 'Director':
        return <DirectorDashboard {...dashboardProps} />;
      case 'Production Manager':
        return <ProductionManagerDashboard {...dashboardProps} />;
      case 'Crew':
        return <CrewDashboard {...dashboardProps} />;
      case 'VFX':
        return <VFXDashboard {...dashboardProps} />;
      case 'Distribution Manager':
        return <DistributionManagerDashboard {...dashboardProps} />;
      default:
        return <ProducerDashboard {...dashboardProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Role: {user.role}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {renderDashboard()}
    </motion.div>
  );
};
