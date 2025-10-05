import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { taskSchema } from '../../utils/validators';
import { Task } from '../../api/endpoints';
import { usersApi } from '../../api/endpoints';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedHours: number;
}

const categories = [
  'Pre-production',
  'Production',
  'Post-production',
  'Equipment',
  'Script',
  'VFX',
  'Wardrobe',
  'Budget',
  'Marketing',
  'Other',
];

// Mock users for assignee dropdown
const mockUsers = [
  { id: '1', name: 'Sarah Johnson', role: 'Producer' },
  { id: '2', name: 'Michael Chen', role: 'Production Manager' },
  { id: '3', name: 'Emma Rodriguez', role: 'Director' },
  { id: '4', name: 'James Wilson', role: 'Crew' },
  { id: '5', name: 'Lisa Park', role: 'VFX' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      estimatedHours: task.estimatedHours,
    } : {
      priority: 'medium',
      estimatedHours: 4,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    const assignee = mockUsers.find(user => user.id === data.assigneeId);
    
    onSubmit({
      ...data,
      assignee: assignee?.name || 'Unknown',
      status: 'todo',
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Title *
        </label>
        <input
          {...register('title')}
          type="text"
          className="input-field"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="input-field resize-none"
          placeholder="Describe the task in detail"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Assignee and Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assignee *
          </label>
          <select
            {...register('assigneeId')}
            className="input-field"
          >
            <option value="">Select assignee</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
          {errors.assigneeId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.assigneeId.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date *
          </label>
          <input
            {...register('dueDate')}
            type="date"
            className="input-field"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Priority and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority *
          </label>
          <select
            {...register('priority')}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.priority.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            className="input-field"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Estimated Hours */}
      <div>
        <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated Hours *
        </label>
        <input
          {...register('estimatedHours', { valueAsNumber: true })}
          type="number"
          min="0.5"
          max="100"
          step="0.5"
          className="input-field"
          placeholder="4"
        />
        {errors.estimatedHours && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.estimatedHours.message}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  );
};
