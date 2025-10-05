export type Permission = 
  | 'view_all'
  | 'edit_budget'
  | 'manage_tasks'
  | 'view_reports'
  | 'manage_crew'
  | 'manage_script'
  | 'approve_scenes'
  | 'view_tasks'
  | 'ai_breakdown'
  | 'view_assigned_tasks'
  | 'update_task_status'
  | 'upload_assets'
  | 'view_vfx_tasks'
  | 'upload_versions'
  | 'request_review'
  | 'view_schedule'
  | 'manage_distribution'
  | 'manage_platforms'
  | 'view_analytics'
  | 'manage_marketing'
  | 'manage_releases';

export type Role = 'Producer' | 'Production Manager' | 'Director' | 'Crew' | 'VFX' | 'Distribution Manager';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'Producer': [
    'view_all',
    'edit_budget', 
    'manage_tasks',
    'view_reports',
    'manage_crew',
    'view_schedule'
  ],
  'Production Manager': [
    'manage_tasks',
    'edit_budget',
    'manage_crew',
    'view_schedule',
    'view_reports'
  ],
  'Director': [
    'manage_script',
    'approve_scenes',
    'view_tasks',
    'ai_breakdown',
    'view_reports'
  ],
  'Crew': [
    'view_assigned_tasks',
    'update_task_status',
    'upload_assets'
  ],
  'VFX': [
    'view_vfx_tasks',
    'upload_versions',
    'request_review',
    'view_assigned_tasks',
    'update_task_status'
  ],
  'Distribution Manager': [
    'manage_distribution',
    'manage_platforms',
    'view_analytics',
    'manage_marketing',
    'manage_releases',
    'view_reports',
    'view_all'
  ]
};

export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const canAccessRoute = (userRole: Role, route: string): boolean => {
  const routePermissions: Record<string, Permission[]> = {
    '/dashboard': ['view_all', 'view_tasks', 'view_assigned_tasks', 'view_vfx_tasks'],
    '/tasks': ['manage_tasks', 'view_assigned_tasks', 'view_vfx_tasks'],
    '/budget': ['edit_budget', 'view_all'],
    '/script': ['manage_script', 'ai_breakdown'],
    '/assets': ['upload_assets', 'view_all'],
    '/vfx': ['view_vfx_tasks', 'upload_versions', 'request_review'],
    '/reports': ['view_reports', 'view_all']
  };

  const userPermissions = ROLE_PERMISSIONS[userRole];
  const requiredPermissions = routePermissions[route];

  if (!requiredPermissions) return true;
  
  return hasAnyPermission(userPermissions, requiredPermissions);
};
