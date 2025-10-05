import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { KanbanCard } from './KanbanCard';
import { Task } from '../../api/endpoints';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  taskCount: number;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  taskCount,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'border-gray-300 dark:border-gray-600';
      case 'in_progress':
        return 'border-blue-300 dark:border-blue-600';
      case 'done':
        return 'border-green-300 dark:border-green-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  const getHeaderColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'in_progress':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
      case 'done':
        return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border-2 transition-colors ${
        isOver ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : getColumnColor(id)
      }`}
    >
      {/* Column Header */}
      <div className={`p-4 rounded-t-lg ${getHeaderColor(id)}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            {title}
          </h3>
          <span className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs font-medium">
            {taskCount}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <KanbanCard task={task} />
              </motion.div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <p className="text-sm">No tasks</p>
                <p className="text-xs mt-1">Drag tasks here</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
