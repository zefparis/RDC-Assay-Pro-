import Joi from 'joi';

// Common patterns
const emailPattern = Joi.string().email().lowercase().required();
const passwordPattern = Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')).required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  });

const phonePattern = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional();
const namePattern = Joi.string().min(2).max(100).required();

// Enums
const mineralTypes = ['CU', 'CO', 'LI', 'AU', 'SN', 'TA', 'W', 'ZN', 'PB', 'NI'];
const units = ['PERCENT', 'GRAMS_PER_TON', 'PPM', 'OUNCES_PER_TON'];
const sampleStatuses = ['RECEIVED', 'PREP', 'ANALYZING', 'QA_QC', 'REPORTED', 'CANCELLED'];
const userRoles = ['CLIENT', 'ADMIN', 'ANALYST', 'SUPERVISOR'];

// Auth schemas
export const registerSchema = Joi.object({
  email: emailPattern,
  password: passwordPattern,
  name: namePattern,
  company: Joi.string().max(200).optional(),
  phone: phonePattern,
});

export const loginSchema = Joi.object({
  email: emailPattern,
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: passwordPattern,
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  company: Joi.string().max(200).optional(),
  phone: phonePattern,
  avatar: Joi.string().uri().optional(),
});

// Sample schemas
export const createSampleSchema = Joi.object({
  mineral: Joi.string().valid(...mineralTypes).required(),
  site: Joi.string().min(2).max(200).required(),
  unit: Joi.string().valid(...units).required(),
  mass: Joi.number().positive().precision(2).required(),
  notes: Joi.string().max(1000).optional(),
  priority: Joi.number().integer().min(1).max(3).default(1),
  dueDate: Joi.date().iso().greater('now').optional(),
});

export const updateSampleSchema = Joi.object({
  mineral: Joi.string().valid(...mineralTypes).optional(),
  site: Joi.string().min(2).max(200).optional(),
  status: Joi.string().valid(...sampleStatuses).optional(),
  grade: Joi.number().positive().precision(4).optional(),
  unit: Joi.string().valid(...units).optional(),
  mass: Joi.number().positive().precision(2).optional(),
  notes: Joi.string().max(1000).optional(),
  priority: Joi.number().integer().min(1).max(3).optional(),
  dueDate: Joi.date().iso().greater('now').optional(),
  analystId: Joi.string().uuid().optional(),
});

export const sampleSearchSchema = Joi.object({
  search: Joi.string().max(100).optional(),
  mineral: Joi.string().valid(...mineralTypes).optional(),
  site: Joi.string().max(200).optional(),
  status: Joi.string().valid(...sampleStatuses).optional(),
  clientId: Joi.string().uuid().optional(),
  analystId: Joi.string().uuid().optional(),
  priority: Joi.number().integer().min(1).max(3).optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'receivedAt', 'dueDate', 'sampleCode', 'site', 'mineral', 'status', 'priority').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Report schemas
export const createReportSchema = Joi.object({
  sampleId: Joi.string().uuid().required(),
  grade: Joi.number().positive().precision(4).required(),
  unit: Joi.string().valid(...units).required(),
  notes: Joi.string().max(1000).optional(),
  certified: Joi.boolean().default(false),
});

export const reportSearchSchema = Joi.object({
  search: Joi.string().max(100).optional(),
  mineral: Joi.string().valid(...mineralTypes).optional(),
  site: Joi.string().max(200).optional(),
  certified: Joi.boolean().optional(),
  dateFrom: Joi.date().iso().optional(),
  dateTo: Joi.date().iso().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('issuedAt', 'reportCode', 'grade', 'mineral', 'site').default('issuedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// User management schemas (admin only)
export const createUserSchema = Joi.object({
  email: emailPattern,
  password: passwordPattern,
  name: namePattern,
  role: Joi.string().valid(...userRoles).default('CLIENT'),
  company: Joi.string().max(200).optional(),
  phone: phonePattern,
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().lowercase().optional(),
  name: Joi.string().min(2).max(100).optional(),
  role: Joi.string().valid(...userRoles).optional(),
  company: Joi.string().max(200).optional(),
  phone: phonePattern,
  isActive: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
});

export const userSearchSchema = Joi.object({
  search: Joi.string().max(100).optional(),
  role: Joi.string().valid(...userRoles).optional(),
  isActive: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'name', 'email', 'role', 'lastLoginAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

// Timeline event schema
export const addTimelineEventSchema = Joi.object({
  status: Joi.string().valid(...sampleStatuses).required(),
  notes: Joi.string().max(500).optional(),
});

// File upload schema
export const fileUploadSchema = Joi.object({
  sampleId: Joi.string().uuid().required(),
});

// Pagination schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// ID parameter schema
export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const sampleCodeParamSchema = Joi.object({
  sampleCode: Joi.string().pattern(/^[A-Z]{2,3}-\d{4,6}$/).required(),
});

export const reportCodeParamSchema = Joi.object({
  reportCode: Joi.string().pattern(/^RPT-[A-Z]{2,3}-\d{4,6}$/).required(),
});
