import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authApi, User } from '../api/endpoints';
import { logger } from '../utils/logger';
import { Role, ROLE_PERMISSIONS } from '../utils/permissions';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('prodsight_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        localStorage.removeItem('prodsight_user');
      } catch (error) {
        // Handle parsing error
      }
    }
  }, []);

  const demoUsers = [
    { username: 'director', password: 'password123', role: 'Director', name: 'John Director' },
    { username: 'producer', password: 'password123', role: 'Producer', name: 'Jane Producer' },
    { username: 'prodmanager', password: 'password123', role: 'Production Manager', name: 'Production Manager' },
    { username: 'distmanager', password: 'password123', role: 'Distribution Manager', name: 'Distribution Manager' },
    { username: 'crew', password: 'password123', role: 'Crew', name: 'Crew Member' },
    { username: 'vfx', password: 'password123', role: 'VFX', name: 'VFX Artist' },
  ];

  const login = async (username: string, password: string): Promise<void> => {
    logger.info('Login attempt started', 'AuthProvider', { username });
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await authApi.login(username, password);
      
      if (response.success && response.data) {
        const demoUser = demoUsers.find(user => user.username === username && user.password === password);
        if (demoUser) {
          const userWithPermissions = {
            ...demoUser,
            id: demoUser.username,
            email: `${demoUser.username}@prodsight.com`,
            avatar: '',
            permissions: ROLE_PERMISSIONS[demoUser.role as Role] || []
          };
          
          localStorage.setItem('prodsight_user', JSON.stringify(userWithPermissions));
          logger.info('Login successful', 'AuthProvider', { 
            username, 
            role: userWithPermissions.role 
          });
          dispatch({ type: 'LOGIN_SUCCESS', payload: userWithPermissions });
        } else {
          logger.warn('Login failed - invalid credentials', 'AuthProvider', { username });
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials' });
        }
      } else {
        logger.warn('Login failed - API response error', 'AuthProvider', { username });
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed' });
      }
    } catch (error: any) {
      logger.error('Login error', 'AuthProvider', { username, error: error.message }, error);
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.message || 'An error occurred during login' 
      });
    }
  };

  const logout = (): void => {
    localStorage.removeItem('prodsight_user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!state.user?.permissions) return false;
    return permissions.some(permission => state.user!.permissions.includes(permission));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
    hasPermission,
    hasAnyPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
