import { z } from 'zod';

// Task validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  category: z.string().min(1, 'Category is required'),
  estimatedHours: z.number().min(0.5, 'Estimated hours must be at least 0.5').max(100, 'Estimated hours must be less than 100'),
});

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Budget item validation schema
export const budgetItemSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
});

// Scene validation schema
export const sceneSchema = z.object({
  number: z.string().min(1, 'Scene number is required'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  location: z.string().min(1, 'Location is required'),
  timeOfDay: z.enum(['Day', 'Night', 'Dawn', 'Dusk'], {
    errorMap: () => ({ message: 'Time of day must be Day, Night, Dawn, or Dusk' })
  }),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute').max(60, 'Duration must be less than 60 minutes'),
  characters: z.array(z.string()).min(1, 'At least one character is required'),
  props: z.array(z.string()),
  vfx: z.boolean(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

// VFX shot validation schema
export const vfxShotSchema = z.object({
  shotName: z.string().min(1, 'Shot name is required').max(50, 'Shot name must be less than 50 characters'),
  sceneId: z.string().min(1, 'Scene is required'),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be less than 300 characters'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  dueDate: z.string().min(1, 'Due date is required'),
  estimatedHours: z.number().min(1, 'Estimated hours must be at least 1').max(200, 'Estimated hours must be less than 200'),
  complexity: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Complexity must be low, medium, or high' })
  }),
});

// File upload validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Date validation helpers
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
