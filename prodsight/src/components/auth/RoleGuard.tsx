import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Permission } from '../../utils/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  permissions: Permission[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  permissions,
  fallback = null,
  requireAll = false,
}) => {
  const { hasPermission, hasAnyPermission } = useAuth();

  const hasAccess = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : hasAnyPermission(permissions);

  if (!hasAccess) {
    return (
      <>
        {fallback || (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Access Restricted
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You don't have permission to view this content.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};
