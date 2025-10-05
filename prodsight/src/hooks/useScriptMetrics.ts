import { useState, useEffect } from 'react';
import { scriptApi, ScriptMetrics } from '../api/endpoints';
import { useNotification } from '../providers/NotificationProvider';
import { useWebSocket } from '../providers/WebSocketProvider';
import { ScriptUpdateEvent } from '../services/websocketService';

interface UseScriptMetricsReturn {
  metrics: ScriptMetrics | null;
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
}

export const useScriptMetrics = (): UseScriptMetricsReturn => {
  const [metrics, setMetrics] = useState<ScriptMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useNotification();
  const { subscribe } = useWebSocket();

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scriptApi.getMetrics();
      if (response.success) {
        setMetrics(response.data);
      } else {
        throw new Error('Failed to fetch script metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch script metrics');
      showError('Failed to load script metrics');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    await fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Subscribe to WebSocket script updates to refresh metrics
  useEffect(() => {
    const unsubscribe = subscribe<ScriptUpdateEvent>('script_update', (event) => {
      console.log('Received script update, refreshing metrics:', event);
      
      // Handle different types of script updates
      switch (event.action) {
        case 'updated':
          // Refresh metrics when script is updated
          fetchMetrics();
          break;
        default:
          console.log('Unknown script update action:', event.action);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    metrics,
    loading,
    error,
    refreshMetrics,
  };
};
