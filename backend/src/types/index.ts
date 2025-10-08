import { Request } from 'express';
import { User } from '@prisma/client';

// User type without sensitive fields (like password)
export type SafeUser = Omit<User, 'password'>;

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Sample types
export interface CreateSampleRequest {
  mineral: string;
  site: string;
  unit: string;
  mass: number;
  notes?: string;
  priority?: number;
  dueDate?: string;
}

export interface UpdateSampleRequest {
  mineral?: string;
  site?: string;
  status?: string;
  grade?: number;
  unit?: string;
  mass?: number;
  notes?: string;
  priority?: number;
  dueDate?: string;
  analystId?: string;
}

export interface SampleSearchQuery {
  search?: string;
  mineral?: string;
  site?: string;
  status?: string;
  clientId?: string;
  analystId?: string;
  priority?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Report types
export interface CreateReportRequest {
  sampleId: string;
  grade: number;
  unit: string;
  notes?: string;
  certified?: boolean;
}

export interface ReportSearchQuery {
  search?: string;
  mineral?: string;
  site?: string;
  certified?: boolean;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  totalSamples: number;
  activeSamples: number;
  analyzingSamples: number;
  completedReports: number;
  averageProcessingTime: string;
  monthlyGrowth: number;
  recentActivities: ActivitySummary[];
  samplesByStatus: StatusCount[];
  samplesByMineral: MineralCount[];
  monthlyTrends: MonthlyTrend[];
}

export interface ActivitySummary {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
  };
}

export interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface MineralCount {
  mineral: string;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  samples: number;
  reports: number;
}

// File upload types
export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Email types
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
}
