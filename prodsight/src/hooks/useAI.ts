import { useState } from 'react';
import { analysisApi } from '../api/endpoints';
import { useNotification } from '../providers/NotificationProvider';
import { ScriptBreakdownResult } from '../api/aiMock';

type BudgetForecast = any;
type TaskAssignmentSuggestion = any;
type ConflictResolution = any;
type ProductionReport = any;


interface UseAIReturn {
  loading: boolean;
  error: string | null;
  breakdownScript: (scriptText: string) => Promise<ScriptBreakdownResult | null>;
  forecastBudget: (budgetData: any) => Promise<BudgetForecast | null>;
  suggestTaskAssignments: (tasks: any[], users: any[]) => Promise<TaskAssignmentSuggestion[] | null>;
  detectConflicts: (tasks: any[], schedule: any) => Promise<ConflictResolution | null>;
  generateReport: (projectData: any) => Promise<ProductionReport | null>;
  clearError: () => void;
}

export const useAI = (): UseAIReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading, dismiss } = useNotification();

  const handleAIOperation = async <T>(
    operation: () => Promise<{ success: boolean, data: T, message?: string }>,
    loadingMessage: string,
    successMessage: string
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const toastId = showLoading(loadingMessage);
      
      const result = await operation();
      
      dismiss(toastId);
      
      if (result.success) {
        showSuccess(successMessage);
        return result.data;
      } else {
        throw new Error(result.message || 'AI operation failed');
      }
      
    } catch (err: any) {
      setError(err.message || 'AI operation failed');
      showError(err.message || 'AI operation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const breakdownScript = async (scriptText: string): Promise<ScriptBreakdownResult | null> => {
    return handleAIOperation(
      () => analysisApi.analyzeScriptText(scriptText),
      'Analyzing script with AI...',
      'Script breakdown completed successfully'
    );
  };

  const forecastBudget = async (budgetData: any): Promise<BudgetForecast | null> => {
    // This is a placeholder, it should be implemented if needed
    return Promise.resolve(null);
  };

  const suggestTaskAssignments = async (
    tasks: any[], 
    users: any[]
  ): Promise<TaskAssignmentSuggestion[] | null> => {
    // This is a placeholder, it should be implemented if needed
    return Promise.resolve(null);
  };

  const detectConflicts = async (
    tasks: any[], 
    schedule: any
  ): Promise<ConflictResolution | null> => {
    // This is a placeholder, it should be implemented if needed
    return Promise.resolve(null);
  };

  const generateReport = async (projectData: any): Promise<ProductionReport | null> => {
    // This is a placeholder, it should be implemented if needed
    return Promise.resolve(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    breakdownScript,
    forecastBudget,
    suggestTaskAssignments,
    detectConflicts,
    generateReport,
    clearError,
  };
};