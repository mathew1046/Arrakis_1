import { apiClient } from './client';

// Type definitions
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  username: string;
  permissions: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assignee: string;
  assigneeId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedHours: number;
}

export interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  remaining: number;
}

export interface BudgetHistory {
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface Budget {
  total: number;
  spent: number;
  remaining: number;
  categories: BudgetCategory[];
  history: BudgetHistory[];
  forecast: {
    projectedTotal: number;
    overBudget: number;
    riskFactors: string[];
  };
}

export interface Scene {
  id: string;
  scene_number: number;
  title: string;
  int_ext: 'INT' | 'EXT';
  day_night: 'DAY' | 'NIGHT' | 'DAWN' | 'DUSK';
  location: string;
  estimated_runtime_minutes: number;
  scene_description: string;
  characters: string[];
  extras: string[];
  props: string[];
  wardrobe: string[];
  makeup_hair: string[];
  vehicles_animals_fx: string[];
  set_dressing: string[];
  special_equipment: string[];
  stunts_vfx: string[];
  sound_requirements: string[];
  mood_tone: string;
  scene_complexity: 'Low' | 'Medium' | 'High';
  vfx_required: boolean;
  vfx_details: string;
  scene_status: 'Not Shot' | 'In Progress' | 'Completed' | 'In Review' | 'Approved';
  notes?: string;
  // Legacy fields for backward compatibility
  number: string;
  description: string;
  timeOfDay: string;
  estimatedDuration: number;
  vfx: boolean;
  status: string;
}

export interface Script {
  title: string;
  version: string;
  lastModified: string;
  scenes: Scene[];
  totalEstimatedDuration: number;
  totalScenes: number;
  vfxScenes: number;
  locations: string[];
  characters: string[];
}

export interface VFXVersion {
  version: string;
  date: string;
  status: string;
  notes: string;
  fileSize: string;
}

export interface VFXShot {
  id: string;
  shotName: string;
  sceneId: string;
  description: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  versions: VFXVersion[];
  estimatedHours: number;
  complexity: 'low' | 'medium' | 'high';
}

// API endpoints
export const authApi = {
  login: (username: string, password: string) => 
    apiClient.authenticate(username, password),
};

export const usersApi = {
  getUsers: () => apiClient.get<User[]>('/users'),
  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),
};

export const tasksApi = {
  getTasks: () => apiClient.get<Task[]>('/tasks'),
  createTask: (task: Omit<Task, 'id'>) => apiClient.post('/tasks', task),
  updateTask: (id: string, task: Partial<Task>) => apiClient.put(`/tasks/${id}`, task),
  deleteTask: (id: string) => apiClient.delete(`/tasks/${id}`),
  getTasksByAssignee: (assigneeId: string) => apiClient.get<Task[]>(`/tasks/assignee/${assigneeId}`),
};

export const budgetApi = {
  getBudget: () => apiClient.get<Budget>('/budget'),
  updateBudgetCategory: (categoryName: string, updates: Partial<BudgetCategory>) =>
    apiClient.put(`/budget/category/${categoryName}`, updates),
  addBudgetEntry: (entry: Omit<BudgetHistory, 'date'>) =>
    apiClient.post('/budget/history', { ...entry, date: new Date().toISOString() }),
};

export const scriptApi = {
  getScript: () => apiClient.get<Script>('/script'),
  updateScript: (script: Partial<Script>) => apiClient.put('/script', script),
  updateScene: (sceneId: string, scene: Partial<Scene>) => apiClient.put(`/script/scene/${sceneId}`, scene),
  addScene: (scene: Omit<Scene, 'id'>) => apiClient.post('/script/scenes', scene),
  getScenes: () => apiClient.get<Scene[]>('/script/scenes'),
  getScene: (sceneId: string) => apiClient.get<Scene>(`/script/scene/${sceneId}`),
  getScriptText: () => apiClient.get<{content: string}>('/script/text'),
  updateScriptText: (content: string) => apiClient.put('/script/text', { content }),
};

export const vfxApi = {
  getVFXShots: () => apiClient.get<VFXShot[]>('/vfx'),
  createVFXShot: (shot: Omit<VFXShot, 'id' | 'versions'>) =>
    apiClient.post('/vfx', { ...shot, versions: [] }),
  updateVFXShot: (id: string, shot: Partial<VFXShot>) => apiClient.put(`/vfx/${id}`, shot),
  addVFXVersion: (shotId: string, version: Omit<VFXVersion, 'date'>) =>
    apiClient.put(`/vfx/version/${shotId}`, { 
      ...version, 
      date: new Date().toISOString() 
    }),
};

export const analysisApi = {
  analyzeScript: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/analysis/script', formData);
  },
  analyzeScriptText: (text: string) => {
    return apiClient.post('/analysis/script/text', { text });
  },
};

export const assetsApi = {
  uploadAsset: async (file: File): Promise<{ success: boolean; url: string; message: string }> => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      url: `https://assets.prodsight.com/${file.name}`,
      message: 'Asset uploaded successfully'
    };
  },
  
  getAssets: async (): Promise<Array<{ id: string; name: string; size: number; type: string; uploadDate: string; url: string }>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock assets from localStorage or default
    const stored = localStorage.getItem('prodsight_assets');
    return stored ? JSON.parse(stored) : [
      {
        id: '1',
        name: 'script_v1.pdf',
        size: 2048000,
        type: 'application/pdf',
        uploadDate: '2024-10-01T10:00:00Z',
        url: 'https://assets.prodsight.com/script_v1.pdf'
      },
      {
        id: '2',
        name: 'storyboard_scene1.jpg',
        size: 1024000,
        type: 'image/jpeg',
        uploadDate: '2024-10-02T14:30:00Z',
        url: 'https://assets.prodsight.com/storyboard_scene1.jpg'
      }
    ];
  }
};

// AI Scheduling API Types
export interface ScheduleConstraints {
  actor_constraints?: {
    [actorName: string]: {
      available_days?: string[];
      max_consecutive_days?: number;
      preferred_call_times?: string[];
    };
  };
  location_preferences?: {
    [locationName: string]: {
      setup_time_hours?: number;
      weather_dependent?: boolean;
      equipment_requirements?: string[];
    };
  };
}

export interface OptimizedSchedule {
  scheduling_strategy: string;
  total_shooting_days: number;
  daily_schedules: Array<{
    day: number;
    date: string;
    location_focus: string;
    scenes: Array<{
      scene_number: number;
      scene_title: string;
      location: string;
      time_of_day: string;
      estimated_duration_minutes: number;
      actors_needed: string[];
      extras_needed: string[];
      call_time: string;
      estimated_wrap: string;
      setup_notes: string;
    }>;
    daily_summary: {
      total_scenes: number;
      total_duration_minutes: number;
      primary_actors: string[];
      location_changes: number;
      special_requirements: string[];
    };
  }>;
  actor_schedules: {
    [actorName: string]: {
      total_working_days: number;
      scenes: number[];
      schedule_notes: string;
    };
  };
  location_schedule: {
    [locationName: string]: {
      days_needed: number[];
      total_scenes: number;
      setup_requirements: string;
    };
  };
  optimization_benefits: string[];
  potential_risks: string[];
}

export interface ScheduleGenerationResponse {
  status: 'success' | 'warning' | 'error';
  message: string;
  schedule_data?: OptimizedSchedule;
  generation_info?: {
    generated_at: string;
    ai_model: string;
    input_scenes: number;
    prompt_length?: number;
  };
  saved_file?: string;
  total_shooting_days?: number;
  is_mock?: boolean;
}

export interface ScheduleAnalysis {
  total_scenes: number;
  unique_locations: number;
  location_clusters_identified: number;
  time_distribution: {
    DAY: number;
    DUSK: number;
    NIGHT: number;
  };
  busiest_actors: { [actorName: string]: number };
  locations_breakdown: { [locationName: string]: number };
  optimization_potential: {
    can_group_locations: boolean;
    location_savings: number;
  };
  data_source: string;
}

// AI Scheduling API endpoints
export const aiSchedulingApi = {
  // Generate AI-powered schedule using Gemini
  generateGeminiSchedule: (constraints?: ScheduleConstraints) => 
    apiClient.post<ScheduleGenerationResponse>('/ai/generate_gemini_schedule', constraints || {}),
  
  // Get schedule preview (top 5 scenes)
  getSchedulePreview: () => 
    apiClient.get<{ status: string; preview_scenes: any[]; total_scenes_available: number }>('/ai/preview_schedule'),
  
  // Analyze current schedule
  analyzeSchedule: () => 
    apiClient.get<{ status: string; analysis: ScheduleAnalysis }>('/ai/schedule_analysis'),
  
  // Legacy endpoint for backward compatibility
  sortSchedule: () => 
    apiClient.post<any>('/ai/sort_schedule', {}),
};
