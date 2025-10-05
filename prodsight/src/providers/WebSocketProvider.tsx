import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { websocketService, WebSocketEventHandler } from '../services/websocketService';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from './NotificationProvider';

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: <T = any>(event: string, handler: WebSocketEventHandler<T>) => () => void;
  ping: () => void;
  joinProjectRoom: (projectId: string) => void;
  leaveProjectRoom: (projectId: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, token } = useAuth();
  const { showError, showSuccess } = useNotification();

  // Update connection status based on websocket service
  const updateConnectionStatus = useCallback(() => {
    const stats = websocketService.getConnectionStats();
    setIsConnected(stats.connected);
    setIsConnecting(stats.isConnecting);
    setReconnectAttempts(stats.reconnectAttempts);
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!token || !user) {
      console.log('No token or user available for WebSocket connection');
      return;
    }

    try {
      setIsConnecting(true);
      await websocketService.connect(token);
      setIsConnected(true);
      setIsConnecting(false);
      showSuccess('Connected to real-time updates');
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
      setIsConnecting(false);
      showError('Failed to connect to real-time updates');
    }
  }, [token, user, showError, showSuccess]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
    setReconnectAttempts(0);
  }, []);

  // Subscribe to WebSocket events
  const subscribe = useCallback(<T = any>(event: string, handler: WebSocketEventHandler<T>) => {
    return websocketService.on(event, handler);
  }, []);

  // Ping server
  const ping = useCallback(() => {
    websocketService.ping();
  }, []);

  // Join project room
  const joinProjectRoom = useCallback((projectId: string) => {
    websocketService.joinProjectRoom(projectId);
  }, []);

  // Leave project room
  const leaveProjectRoom = useCallback((projectId: string) => {
    websocketService.leaveProjectRoom(projectId);
  }, []);

  // Auto-connect when user and token are available
  useEffect(() => {
    if (user && token && !isConnected && !isConnecting) {
      connect();
    }
  }, [user, token, isConnected, isConnecting, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Setup global WebSocket event handlers
  useEffect(() => {
    const unsubscribeConnectionStatus = subscribe('connection_status', (data) => {
      console.log('WebSocket connection status:', data);
      updateConnectionStatus();
    });

    const unsubscribePong = subscribe('pong', (data) => {
      console.log('WebSocket pong received:', data);
    });

    // Periodic connection status update
    const statusInterval = setInterval(updateConnectionStatus, 5000);

    return () => {
      unsubscribeConnectionStatus();
      unsubscribePong();
      clearInterval(statusInterval);
    };
  }, [subscribe, updateConnectionStatus]);

  // Periodic ping to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (websocketService.isConnected()) {
        ping();
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected, ping]);

  const contextValue: WebSocketContextType = {
    isConnected,
    isConnecting,
    reconnectAttempts,
    connect,
    disconnect,
    subscribe,
    ping,
    joinProjectRoom,
    leaveProjectRoom,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

// Connection status indicator component
export const WebSocketStatus: React.FC = () => {
  const { isConnected, isConnecting, reconnectAttempts } = useWebSocket();

  if (isConnecting) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm">
          Disconnected {reconnectAttempts > 0 && `(${reconnectAttempts} attempts)`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm">Connected</span>
    </div>
  );
};
