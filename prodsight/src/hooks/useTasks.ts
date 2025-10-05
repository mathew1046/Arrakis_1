import { useState, useEffect } from 'react';
import { tasksApi, Task } from '../api/endpoints';
import { useNotification } from '../providers/NotificationProvider';
import { useAuth } from './useAuth';
import { useWebSocket } from '../providers/WebSocketProvider';
import { TaskUpdateEvent } from '../services/websocketService';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  getTasksByStatus: (status: Task['status']) => Task[];
  getTasksByAssignee: (assigneeId: string) => Task[];
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();
  const { subscribe } = useWebSocket();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      // If user is crew or VFX, only fetch their assigned tasks
      if (user?.role === 'Crew' || user?.role === 'VFX') {
        response = await tasksApi.getTasksByAssignee(user.id);
      } else {
        response = await tasksApi.getTasks();
      }
      
      if (response.success) {
        setTasks(response.data);
      } else {
        throw new Error('Failed to fetch tasks');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      showError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const response = await tasksApi.createTask(taskData);
      if (response.success) {
        setTasks(response.data);
        showSuccess('Task created successfully');
        // Note: WebSocket event will be emitted by backend
      } else {
        throw new Error('Failed to create task');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await tasksApi.updateTask(id, updates);
      if (response.success) {
        setTasks(response.data);
        showSuccess('Task updated successfully');
      } else {
        throw new Error('Failed to update task');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await tasksApi.deleteTask(id);
      if (response.success) {
        setTasks(response.data);
        showSuccess('Task deleted successfully');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  const refreshTasks = async () => {
    await fetchTasks();
  };

  const getTasksByStatus = (status: Task['status']): Task[] => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByAssignee = (assigneeId: string): Task[] => {
    return tasks.filter(task => task.assigneeId === assigneeId);
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Subscribe to WebSocket task updates
  useEffect(() => {
    const unsubscribe = subscribe<TaskUpdateEvent>('task_update', (event) => {
      console.log('Received task update:', event);
      
      // Handle different types of task updates
      switch (event.action) {
        case 'created':
        case 'updated':
        case 'deleted':
          // Refresh tasks to get the latest state
          fetchTasks();
          break;
        default:
          console.log('Unknown task update action:', event.action);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    getTasksByStatus,
    getTasksByAssignee,
  };
};
