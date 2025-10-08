export type SampleStatus = 'Received' | 'Prep' | 'Analyzing' | 'QA/QC' | 'Reported';

export type MineralType = 'Cu' | 'Co' | 'Li' | 'Au' | 'Sn' | 'Ta' | 'W' | 'Zn' | 'Pb' | 'Ni';

export type Unit = '%' | 'g/t' | 'ppm' | 'oz/t';

export interface Sample {
  id: string;
  mineral: MineralType;
  site: string;
  status: SampleStatus;
  grade: number | null;
  unit: Unit;
  updatedAt: string;
  createdAt?: string;
  mass?: number;
  notes?: string;
  clientId?: string;
  timeline?: TimelineEvent[];
  qrCode?: string;
}

export interface TimelineEvent {
  label: string;
  done: boolean;
  when: string | null;
  notes?: string;
}

export interface SampleSubmission {
  mineral: MineralType;
  site: string;
  unit: Unit;
  mass: number;
  notes?: string;
  clientId?: string;
}

export interface Report {
  id: string;
  mineral: MineralType;
  site: string;
  grade: number;
  unit: Unit;
  url: string;
  issuedAt: string;
  hash: string;
  qrCode?: string;
  certified: boolean;
}

export interface DashboardStats {
  totalSamples: number;
  activeSamples: number;
  analyzingSamples: number;
  completedReports: number;
  averageProcessingTime: string;
  monthlyGrowth: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'analyst';
  company?: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
