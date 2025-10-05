/**
 * WebSocket Service for ProdSight
 * Handles real-time communication with the backend
 */

import { io, Socket } from 'socket.io-client';

export interface WebSocketEventData {
  action: 'created' | 'updated' | 'deleted';
  timestamp: number;
}

export interface TaskUpdateEvent extends WebSocketEventData {
  task: any;
}

export interface BudgetUpdateEvent extends WebSocketEventData {
  budget: any;
}

export interface ScriptUpdateEvent extends WebSocketEventData {
  script: any;
}

export interface VFXUpdateEvent extends WebSocketEventData {
  vfx: any;
}

export interface AssetUpdateEvent extends WebSocketEventData {
  asset: any;
}

export type WebSocketEventHandler<T = any> = (data: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isConnecting = false;
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * Connect to WebSocket server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve();
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;

      try {
        this.socket = io('http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling'],
          upgrade: true,
          rememberUpgrade: true,
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnecting = false;
          this.handleReconnect(token);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('WebSocket disconnected:', reason);
          this.isConnecting = false;
          
          // Auto-reconnect unless it was a manual disconnect
          if (reason !== 'io client disconnect') {
            this.handleReconnect(token);
          }
        });

        this.setupSocketEventHandlers();

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (!this.socket?.connected) {
        this.connect(token).catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  /**
   * Setup socket event handlers
   */
  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    // Connection status events
    this.socket.on('connection_status', (data) => {
      console.log('Connection status:', data);
      this.emit('connection_status', data);
    });

    // Ping/Pong for connection health
    this.socket.on('pong', (data) => {
      this.emit('pong', data);
    });

    // Business logic events
    this.socket.on('task_update', (data: TaskUpdateEvent) => {
      console.log('Task update received:', data);
      this.emit('task_update', data);
    });

    this.socket.on('budget_update', (data: BudgetUpdateEvent) => {
      console.log('Budget update received:', data);
      this.emit('budget_update', data);
    });

    this.socket.on('script_update', (data: ScriptUpdateEvent) => {
      console.log('Script update received:', data);
      this.emit('script_update', data);
    });

    this.socket.on('vfx_update', (data: VFXUpdateEvent) => {
      console.log('VFX update received:', data);
      this.emit('vfx_update', data);
    });

    this.socket.on('asset_update', (data: AssetUpdateEvent) => {
      console.log('Asset update received:', data);
      this.emit('asset_update', data);
    });

    // Room management events
    this.socket.on('room_joined', (data) => {
      console.log('Joined room:', data);
      this.emit('room_joined', data);
    });

    this.socket.on('room_left', (data) => {
      console.log('Left room:', data);
      this.emit('room_left', data);
    });
  }

  /**
   * Setup internal event handling system
   */
  private setupEventHandlers(): void {
    // Initialize event handler map
    this.eventHandlers = new Map();
  }

  /**
   * Subscribe to WebSocket events
   */
  on<T = any>(event: string, handler: WebSocketEventHandler<T>): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    
    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(event);
        }
      }
    };
  }

  /**
   * Emit event to all registered handlers
   */
  private emit<T = any>(event: string, data: T): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Send ping to server
   */
  ping(): void {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  /**
   * Join a project room for project-specific updates
   */
  joinProjectRoom(projectId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_project_room', { project_id: projectId });
    }
  }

  /**
   * Leave a project room
   */
  leaveProjectRoom(projectId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_project_room', { project_id: projectId });
    }
  }

  /**
   * Get connection statistics
   */
  getConnectionStats(): {
    connected: boolean;
    reconnectAttempts: number;
    isConnecting: boolean;
  } {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      isConnecting: this.isConnecting,
    };
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

// Export types for external use
export type {
  WebSocketEventHandler,
  TaskUpdateEvent,
  BudgetUpdateEvent,
  ScriptUpdateEvent,
  VFXUpdateEvent,
  AssetUpdateEvent,
  WebSocketEventData,
};
