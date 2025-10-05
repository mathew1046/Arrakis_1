import React from 'react';
import { motion } from 'framer-motion';
import { KanbanBoard } from '../../components/kanban/KanbanBoard';
import { useTasks } from '../../hooks/useTasks';
import { RoleGuard } from '../../components/auth/RoleGuard';

export const Tasks: React.FC = () => {
  const { tasks, loading, updateTask } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <RoleGuard permissions={['manage_tasks', 'view_assigned_tasks', 'view_vfx_tasks']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <KanbanBoard tasks={tasks} onTaskUpdate={updateTask} />
      </motion.div>
    </RoleGuard>
  );
};
