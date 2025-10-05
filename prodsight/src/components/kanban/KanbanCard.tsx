import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, User, Clock } from 'lucide-react';
import { Task } from '../../api/endpoints';
import { formatDate, getPriorityColor } from '../../utils/formatters';

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      whileHover={{ scale: 1.02 }}
      className={`p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
          {task.title}
        </h4>
        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Task Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {task.description}
      </p>

      {/* Task Meta */}
      <div className="space-y-2">
        {/* Assignee */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <User className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{task.assignee}</span>
        </div>

        {/* Due Date */}
        <div className={`flex items-center text-xs ${
          isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>Due {formatDate(task.dueDate)}</span>
          {isOverdue && <span className="ml-1 font-medium">(Overdue)</span>}
        </div>

        {/* Estimated Hours */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>{task.estimatedHours}h estimated</span>
        </div>
      </div>

      {/* Category Tag */}
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
        <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded">
          {task.category}
        </span>
      </div>
    </motion.div>
  );
};
