import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  FileText,
  FolderOpen,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
  Calendar,
  ClipboardList,
  ShoppingCart,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Package,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../utils/permissions';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permissions: string[];
  allowedRoles: Role[];
}

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  onClose?: () => void;
  id?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['view_all', 'view_tasks', 'view_assigned_tasks', 'view_vfx_tasks'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'Crew', 'VFX', 'Distribution Manager'],
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
    permissions: ['manage_tasks', 'view_assigned_tasks', 'view_vfx_tasks'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'Crew', 'VFX'],
  },
  {
    name: 'Script',
    href: '/script',
    icon: FileText,
    permissions: ['manage_script', 'ai_breakdown'],
    allowedRoles: ['Producer', 'Production Manager', 'Director'],
  },
  {
    name: 'Scheduling',
    href: '/scheduling',
    icon: Calendar,
    permissions: ['manage_production', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager'],
  },
  {
    name: 'Budget Management',
    href: '/budget-management',
    icon: DollarSign,
    permissions: ['manage_budget', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager'],
  },
  {
    name: 'Call Sheets',
    href: '/call-sheets',
    icon: ClipboardList,
    permissions: ['manage_production', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager'],
  },
  {
    name: 'Expense Tracking',
    href: '/expense-tracking',
    icon: TrendingUp,
    permissions: ['manage_budget', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager'],
  },
  {
    name: 'Budget Reports',
    href: '/budget-reports',
    icon: FileSpreadsheet,
    permissions: ['view_reports', 'manage_budget', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager'],
  },
  {
    name: 'Props Marketplace',
    href: '/props-marketplace',
    icon: ShoppingCart,
    permissions: ['manage_props', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'Crew', 'VFX', 'Distribution Manager'],
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: FolderOpen,
    permissions: ['upload_assets', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'Crew', 'VFX'],
  },
  {
    name: 'VFX',
    href: '/vfx',
    icon: Zap,
    permissions: ['view_vfx_tasks', 'upload_versions', 'request_review'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'VFX'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    permissions: ['view_reports', 'view_all'],
    allowedRoles: ['Producer', 'Production Manager', 'Director', 'Distribution Manager'],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  isMobileOpen, // Kept for compatibility but not used
  onClose,      // Kept for compatibility but not used
  id 
}) => {
  const { user, logout, hasAnyPermission } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const filteredNavItems = navigationItems.filter(item => {
    // First check permissions
    const hasPermission = hasAnyPermission(item.permissions);
    
    // Then check if this item should be visible for the user's role
    const isAllowedForRole = user && item.allowedRoles && 
      item.allowedRoles.includes(user.role as Role);
    
    return hasPermission && isAllowedForRole;
  });

  return (
    <motion.div
      id={id}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full w-64 md:w-auto"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-3"
            >
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                ProdSight
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-Powered Production
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="ml-3 text-sm font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {/* Back to Dashboard - only show when not on dashboard */}
        {location.pathname !== '/dashboard' && (
          <NavLink
            to="/dashboard"
            className="sidebar-link bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <ArrowLeft className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-sm font-medium"
              >
                Back to Dashboard
              </motion.span>
            )}
          </NavLink>
        )}

        {/* Settings */}
        <NavLink
          to="/settings"
          className="sidebar-link"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-3 text-sm font-medium"
            >
              Settings
            </motion.span>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-3 text-sm font-medium"
            >
              Logout
            </motion.span>
          )}
        </button>

        {/* User Info */}
        {!isCollapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
