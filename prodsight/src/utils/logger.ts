interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  component?: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs
  private isDevelopment = import.meta.env?.DEV || false;

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    component?: string,
    data?: any,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      component,
      data,
      stack: error?.stack
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('prodsight_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to store logs in localStorage:', e);
    }

    // Console output in development
    if (this.isDevelopment) {
      const consoleMethod = entry.level === 'error' ? 'error' : entry.level === 'warn' ? 'warn' : 'log';
      const prefix = entry.component ? `[${entry.component}]` : '';
      console[consoleMethod](`${prefix} ${entry.message}`, entry.data || '');
      if (entry.stack) {
        console.error(entry.stack);
      }
    }
  }

  info(message: string, component?: string, data?: any) {
    this.addLog(this.createLogEntry('info', message, component, data));
  }

  warn(message: string, component?: string, data?: any) {
    this.addLog(this.createLogEntry('warn', message, component, data));
  }

  error(message: string, component?: string, data?: any, error?: Error) {
    this.addLog(this.createLogEntry('error', message, component, data, error));
  }

  debug(message: string, component?: string, data?: any) {
    if (this.isDevelopment) {
      this.addLog(this.createLogEntry('debug', message, component, data));
    }
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs by level
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Get logs by component
  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('prodsight_logs');
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Download logs as file
  downloadLogs() {
    const logsJson = this.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodsight-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Load logs from localStorage on initialization
  loadStoredLogs() {
    try {
      const storedLogs = localStorage.getItem('prodsight_logs');
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (e) {
      console.warn('Failed to load stored logs:', e);
    }
  }

  // Get system info for debugging
  getSystemInfo() {
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      localStorage: {
        available: typeof Storage !== 'undefined',
        used: this.getLocalStorageUsage()
      }
    };
  }

  private getLocalStorageUsage(): string {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return `${(total / 1024).toFixed(2)} KB`;
    } catch (e) {
      return 'Unknown';
    }
  }
}

// Create singleton instance
export const logger = new Logger();

// Load stored logs on initialization
logger.loadStoredLogs();

// Global error handler
window.addEventListener('error', (event) => {
  logger.error(
    'Uncaught Error',
    'Global',
    {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    },
    event.error
  );
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error(
    'Unhandled Promise Rejection',
    'Global',
    {
      reason: event.reason
    }
  );
});

// Export types for use in components
export type { LogEntry };
