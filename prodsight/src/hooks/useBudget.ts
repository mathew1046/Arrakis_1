import { useState, useEffect } from 'react';
import { budgetApi, Budget, BudgetCategory, BudgetHistory } from '../api/endpoints';
import { useNotification } from '../providers/NotificationProvider';
import { useWebSocket } from '../providers/WebSocketProvider';
import { BudgetUpdateEvent } from '../services/websocketService';

interface UseBudgetReturn {
  budget: Budget | null;
  loading: boolean;
  error: string | null;
  updateCategory: (categoryName: string, updates: Partial<BudgetCategory>) => Promise<void>;
  addEntry: (entry: Omit<BudgetHistory, 'date'>) => Promise<void>;
  refreshBudget: () => Promise<void>;
  getBudgetUtilization: () => number;
  getCategoryUtilization: (categoryName: string) => number;
  isOverBudget: () => boolean;
  getOverBudgetAmount: () => number;
}

export const useBudget = (): UseBudgetReturn => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();
  const { subscribe } = useWebSocket();

  const fetchBudget = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await budgetApi.getBudget();
      if (response.success) {
        setBudget(response.data);
      } else {
        throw new Error('Failed to fetch budget');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch budget');
      showError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryName: string, updates: Partial<BudgetCategory>) => {
    try {
      const response = await budgetApi.updateBudgetCategory(categoryName, updates);
      if (response.success) {
        setBudget(response.data);
        showSuccess('Budget category updated successfully');
      } else {
        throw new Error('Failed to update budget category');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update budget category');
      throw err;
    }
  };

  const addEntry = async (entry: Omit<BudgetHistory, 'date'>) => {
    try {
      const response = await budgetApi.addBudgetEntry(entry);
      if (response.success) {
        setBudget(response.data);
        showSuccess('Budget entry added successfully');
      } else {
        throw new Error('Failed to add budget entry');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to add budget entry');
      throw err;
    }
  };

  const refreshBudget = async () => {
    await fetchBudget();
  };

  const getBudgetUtilization = (): number => {
    if (!budget || budget.total === 0) return 0;
    return (budget.spent / budget.total) * 100;
  };

  const getCategoryUtilization = (categoryName: string): number => {
    if (!budget) return 0;
    const category = budget.categories.find(cat => cat.name === categoryName);
    if (!category || category.budgeted === 0) return 0;
    return (category.spent / category.budgeted) * 100;
  };

  const isOverBudget = (): boolean => {
    if (!budget) return false;
    return budget.spent > budget.total;
  };

  const getOverBudgetAmount = (): number => {
    if (!budget) return 0;
    return Math.max(0, budget.spent - budget.total);
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  // Subscribe to WebSocket budget updates
  useEffect(() => {
    const unsubscribe = subscribe<BudgetUpdateEvent>('budget_update', (event) => {
      console.log('Received budget update:', event);
      
      // Handle different types of budget updates
      switch (event.action) {
        case 'updated':
          // Refresh budget to get the latest state
          fetchBudget();
          break;
        default:
          console.log('Unknown budget update action:', event.action);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    budget,
    loading,
    error,
    updateCategory,
    addEntry,
    refreshBudget,
    getBudgetUtilization,
    getCategoryUtilization,
    isOverBudget,
    getOverBudgetAmount,
  };
};
