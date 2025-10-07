import { MineralType, Unit, SampleStatus } from '@/types';

// Application constants
export const APP_NAME = 'RDC Assay Pro';
export const APP_DESCRIPTION = 'Professional mineral assay and certification platform for DRC';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.rdcassay.africa';

// Mineral types with labels
export const MINERAL_TYPES: Record<MineralType, { label: string; color: string }> = {
  Cu: { label: 'Copper', color: '#B45309' },
  Co: { label: 'Cobalt', color: '#1E40AF' },
  Li: { label: 'Lithium', color: '#7C3AED' },
  Au: { label: 'Gold', color: '#F59E0B' },
  Sn: { label: 'Tin', color: '#6B7280' },
  Ta: { label: 'Tantalum', color: '#374151' },
  W: { label: 'Tungsten', color: '#111827' },
  Zn: { label: 'Zinc', color: '#0F766E' },
  Pb: { label: 'Lead', color: '#4B5563' },
  Ni: { label: 'Nickel', color: '#059669' },
};

// Units with labels
export const UNITS: Record<Unit, { label: string; description: string }> = {
  '%': { label: 'Percentage (%)', description: 'Parts per hundred' },
  'g/t': { label: 'Grams per tonne (g/t)', description: 'Grams per metric tonne' },
  'ppm': { label: 'Parts per million (ppm)', description: 'Parts per million' },
  'oz/t': { label: 'Ounces per tonne (oz/t)', description: 'Troy ounces per metric tonne' },
};

// Sample status with colors and descriptions
export const SAMPLE_STATUSES: Record<SampleStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  description: string;
}> = {
  'Received': {
    label: 'Received',
    color: 'text-secondary-700',
    bgColor: 'bg-secondary-100',
    description: 'Sample has been received and logged',
  },
  'Prep': {
    label: 'Preparation',
    color: 'text-warning-700',
    bgColor: 'bg-warning-100',
    description: 'Sample is being prepared for analysis',
  },
  'Analyzing': {
    label: 'Analyzing',
    color: 'text-primary-700',
    bgColor: 'bg-primary-100',
    description: 'Sample is currently being analyzed',
  },
  'QA/QC': {
    label: 'QA/QC',
    color: 'text-info-700',
    bgColor: 'bg-info-100',
    description: 'Quality assurance and quality control checks',
  },
  'Reported': {
    label: 'Reported',
    color: 'text-success-700',
    bgColor: 'bg-success-100',
    description: 'Analysis complete, report generated',
  },
};

// Common mining sites in DRC
export const MINING_SITES = [
  'Kolwezi',
  'Likasi',
  'Lubumbashi',
  'Kipushi',
  'Tenke',
  'Fungurume',
  'Mutanda',
  'Kamoto',
  'Kibali',
  'Manono',
  'Kamoa-Kakula',
  'Lualaba',
  'Katanga',
  'Kasai',
  'Ituri',
];

// Analysis methods
export const ANALYSIS_METHODS = {
  XRF: 'X-Ray Fluorescence',
  AAS: 'Atomic Absorption Spectroscopy',
  'ICP-OES': 'Inductively Coupled Plasma - Optical Emission Spectroscopy',
  'ICP-MS': 'Inductively Coupled Plasma - Mass Spectrometry',
  LOI: 'Loss on Ignition',
  'Fire Assay': 'Fire Assay',
  'Wet Chemistry': 'Wet Chemistry',
  'Gravimetric': 'Gravimetric Analysis',
};

// Sampling methods
export const SAMPLING_METHODS = {
  Grab: 'Grab Sampling',
  Channel: 'Channel Sampling',
  Auger: 'Auger Sampling',
  Core: 'Core Drilling',
  Chip: 'Chip Sampling',
  Bulk: 'Bulk Sampling',
};

// Quality control standards
export const QC_STANDARDS = {
  'ISO 17025': 'General requirements for the competence of testing and calibration laboratories',
  'ISO 9001': 'Quality management systems',
  'ASTM': 'American Society for Testing and Materials standards',
  'CRM': 'Certified Reference Materials',
  'Blanks': 'Method blanks and field blanks',
  'Duplicates': 'Field and laboratory duplicates',
};

// File size limits
export const FILE_SIZE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  REPORT: 50 * 1024 * 1024, // 50MB
};

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  REPORTS: ['pdf'],
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
};

// Validation rules
export const VALIDATION = {
  SAMPLE_ID_PATTERN: /^RC-\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 1000,
  MAX_NOTES_LENGTH: 2000,
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rdc-assay-auth-token',
  USER_DATA: 'rdc-assay-user-data',
  LOCALE: 'rdc-assay-locale',
  THEME: 'rdc-assay-theme',
  PREFERENCES: 'rdc-assay-preferences',
};

// API endpoints
export const API_ENDPOINTS = {
  SAMPLES: '/api/samples',
  REPORTS: '/api/reports',
  DASHBOARD: '/api/dashboard',
  AUTH: '/api/auth',
  USERS: '/api/users',
  UPLOAD: '/api/upload',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAMPLE_CREATED: 'Sample created successfully',
  SAMPLE_UPDATED: 'Sample updated successfully',
  REPORT_GENERATED: 'Report generated successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_SAVED: 'Data saved successfully',
};

// Chart colors for analytics
export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
];

// Default user roles
export const USER_ROLES = {
  ADMIN: 'admin',
  ANALYST: 'analyst',
  CLIENT: 'client',
  VIEWER: 'viewer',
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_EXPORT: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_REAL_TIME_UPDATES: false, // Will be enabled when WebSocket is implemented
};
