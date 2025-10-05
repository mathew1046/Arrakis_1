import { useState, useEffect } from 'react';
import { scriptApi, Script, Scene } from '../api/endpoints';
import { useNotification } from '../providers/NotificationProvider';
import { useWebSocket } from '../providers/WebSocketProvider';
import { ScriptUpdateEvent } from '../services/websocketService';

interface UseScriptReturn {
  script: Script | null;
  loading: boolean;
  error: string | null;
  updateScript: (updates: Partial<Script>) => Promise<void>;
  updateScene: (sceneId: string, updates: Partial<Scene>) => Promise<void>;
  addScene: (scene: Omit<Scene, 'id'>) => Promise<void>;
  refreshScript: () => Promise<void>;
  getScenesByStatus: (status: string) => Scene[];
  getVFXScenes: () => Scene[];
  getTotalDuration: () => number;
}

export const useScript = (): UseScriptReturn => {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();
  const { subscribe } = useWebSocket();

  const fetchScript = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await scriptApi.getScript();
      if (response.success) {
        setScript(response.data);
      } else {
        throw new Error('Failed to fetch script');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch script');
      showError('Failed to load script data');
    } finally {
      setLoading(false);
    }
  };

  const updateScript = async (updates: Partial<Script>) => {
    try {
      const response = await scriptApi.updateScript(updates);
      if (response.success) {
        setScript(response.data);
        showSuccess('Script updated successfully');
      } else {
        throw new Error('Failed to update script');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update script');
      throw err;
    }
  };

  const updateScene = async (sceneId: string, updates: Partial<Scene>) => {
    try {
      const response = await scriptApi.updateScene(sceneId, updates);
      if (response.success) {
        setScript(response.data);
        showSuccess('Scene updated successfully');
      } else {
        throw new Error('Failed to update scene');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to update scene');
      throw err;
    }
  };

  const addScene = async (sceneData: Omit<Scene, 'id'>) => {
    try {
      const response = await scriptApi.addScene(sceneData);
      if (response.success) {
        setScript(response.data);
        showSuccess('Scene added successfully');
      } else {
        throw new Error('Failed to add scene');
      }
    } catch (err: any) {
      showError(err.message || 'Failed to add scene');
      throw err;
    }
  };

  const refreshScript = async () => {
    await fetchScript();
  };

  const getScenesByStatus = (status: string): Scene[] => {
    if (!script) return [];
    return script.scenes.filter(scene => scene.status === status);
  };

  const getVFXScenes = (): Scene[] => {
    if (!script) return [];
    return script.scenes.filter(scene => scene.vfx);
  };

  const getTotalDuration = (): number => {
    if (!script) return 0;
    return script.scenes.reduce((total, scene) => total + scene.estimatedDuration, 0);
  };

  useEffect(() => {
    fetchScript();
  }, []);

  // Subscribe to WebSocket script updates
  useEffect(() => {
    const unsubscribe = subscribe<ScriptUpdateEvent>('script_update', (event) => {
      console.log('Received script update:', event);
      
      // Handle different types of script updates
      switch (event.action) {
        case 'updated':
          // Refresh script to get the latest state
          fetchScript();
          break;
        default:
          console.log('Unknown script update action:', event.action);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return {
    script,
    loading,
    error,
    updateScript,
    updateScene,
    addScene,
    refreshScript,
    getScenesByStatus,
    getVFXScenes,
    getTotalDuration,
  };
};
