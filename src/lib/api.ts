import { Sample, SampleSubmission, Report, DashboardStats, ApiResponse, PaginatedResponse, MineralType, SampleStatus, Unit } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Map backend status to frontend status
const mapStatus = (backendStatus: string): SampleStatus => {
  const statusMap: Record<string, SampleStatus> = {
    'RECEIVED': 'Received',
    'PREP': 'Prep',
    'ANALYZING': 'Analyzing',
    'QA_QC': 'QA/QC',
    'REPORTED': 'Reported',
  };
  return statusMap[backendStatus] || 'Received'; // Default fallback
};

// Map frontend status to backend status
const mapStatusToBackend = (frontendStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Received': 'RECEIVED',
    'Prep': 'PREP',
    'Analyzing': 'ANALYZING',
    'QA/QC': 'QA_QC',
    'Reported': 'REPORTED',
  };
  return statusMap[frontendStatus] || frontendStatus;
};

// Map backend mineral to frontend mineral
const mapMineral = (backendMineral: string): MineralType => {
  const mineralMap: Record<string, MineralType> = {
    'CU': 'Cu',
    'CO': 'Co',
    'LI': 'Li',
    'AU': 'Au',
    'SN': 'Sn',
    'TA': 'Ta',
    'W': 'W',
    'ZN': 'Zn',
    'PB': 'Pb',
    'NI': 'Ni',
  };
  return mineralMap[backendMineral] || 'Cu'; // Default fallback
};

// Map frontend mineral to backend mineral
const mapMineralToBackend = (frontendMineral: MineralType): string => {
  const mineralMap: Record<MineralType, string> = {
    'Cu': 'CU',
    'Co': 'CO',
    'Li': 'LI',
    'Au': 'AU',
    'Sn': 'SN',
    'Ta': 'TA',
    'W': 'W',
    'Zn': 'ZN',
    'Pb': 'PB',
    'Ni': 'NI'
  };
  return mineralMap[frontendMineral] || frontendMineral;
};

// Map backend unit to frontend unit
const mapUnit = (backendUnit: string): Unit => {
  const unitMap: Record<string, Unit> = {
    'PERCENT': '%',
    'GRAMS_PER_TON': 'g/t',
    'PPM': 'ppm',
    'OUNCES_PER_TON': 'oz/t'
  };
  return unitMap[backendUnit] || '%'; // Default fallback
};

// Map frontend unit to backend unit
const mapUnitToBackend = (frontendUnit: string): string => {
  const unitMap: Record<string, string> = {
    '%': 'PERCENT',
    'g/t': 'GRAMS_PER_TON',
    'ppm': 'PPM',
    'oz/t': 'OUNCES_PER_TON'
  };
  return unitMap[frontendUnit] || frontendUnit;
};

// API functions
export const api = {
  // Sample management
  async searchSamples(query: string = '', page: number = 1, limit: number = 10): Promise<PaginatedResponse<Sample>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(query && { search: query })
    });
    
    const response = await apiRequest(`/samples?${params}`);
    
    return {
      data: response.data.map((sample: any) => ({
        id: sample.sampleCode,
        mineral: mapMineral(sample.mineral),
        site: sample.site,
        status: mapStatus(sample.status),
        grade: sample.grade,
        unit: mapUnit(sample.unit),
        updatedAt: sample.updatedAt?.split('T')[0] || sample.receivedAt?.split('T')[0],
        createdAt: sample.receivedAt?.split('T')[0],
        mass: sample.mass,
        notes: sample.notes,
        timeline: sample.timeline?.map((event: any) => ({
          label: mapStatus(event.status),
          done: true,
          when: event.timestamp?.split('T')[0]
        }))
      })),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
    };
  },

  async getSample(id: string): Promise<Sample> {
    const response = await apiRequest(`/samples/code/${id}`);
    const sample = response.data.sample;
    
    return {
      id: sample.sampleCode,
      mineral: mapMineral(sample.mineral),
      site: sample.site,
      status: mapStatus(sample.status),
      grade: sample.grade,
      unit: mapUnit(sample.unit),
      updatedAt: sample.updatedAt?.split('T')[0] || sample.receivedAt?.split('T')[0],
      createdAt: sample.receivedAt?.split('T')[0],
      mass: sample.mass,
      notes: sample.notes,
      qrCode: sample.qrCode,
      timeline: sample.timeline?.map((event: any) => ({
        label: mapStatus(event.status),
        done: true,
        when: event.timestamp?.split('T')[0],
        notes: event.notes
      })) || []
    };
  },

  async createSample(payload: SampleSubmission): Promise<Sample> {
    const backendPayload = {
      mineral: mapMineralToBackend(payload.mineral),
      site: payload.site,
      unit: mapUnitToBackend(payload.unit),
      mass: payload.mass,
      notes: payload.notes
    };
    
    const response = await apiRequest('/samples', {
      method: 'POST',
      body: JSON.stringify(backendPayload)
    });
    
    const sample = response.data.sample;
    
    return {
      id: sample.sampleCode,
      mineral: mapMineral(sample.mineral),
      site: sample.site,
      status: mapStatus(sample.status),
      grade: sample.grade,
      unit: mapUnit(sample.unit),
      updatedAt: sample.updatedAt?.split('T')[0] || sample.receivedAt?.split('T')[0],
      createdAt: sample.receivedAt?.split('T')[0],
      mass: sample.mass,
      notes: sample.notes
    };
  },

  async updateSample(id: string, updates: Partial<Sample>): Promise<Sample> {
    // First get the sample to get its internal ID
    const sampleResponse = await apiRequest(`/samples/code/${id}`);
    const sampleId = sampleResponse.data.sample.id;
    
    const backendUpdates: any = {};
    if (updates.mineral) backendUpdates.mineral = mapMineralToBackend(updates.mineral);
    if (updates.site) backendUpdates.site = updates.site;
    if (updates.status) backendUpdates.status = mapStatusToBackend(updates.status);
    if (updates.grade !== undefined) backendUpdates.grade = updates.grade;
    if (updates.unit) backendUpdates.unit = mapUnitToBackend(updates.unit);
    if (updates.mass !== undefined) backendUpdates.mass = updates.mass;
    if (updates.notes !== undefined) backendUpdates.notes = updates.notes;
    
    const response = await apiRequest(`/samples/${sampleId}`, {
      method: 'PUT',
      body: JSON.stringify(backendUpdates)
    });
    
    const sample = response.data.sample;
    
    return {
      id: sample.sampleCode,
      mineral: mapMineral(sample.mineral),
      site: sample.site,
      status: mapStatus(sample.status),
      grade: sample.grade,
      unit: mapUnit(sample.unit),
      updatedAt: sample.updatedAt?.split('T')[0] || sample.receivedAt?.split('T')[0],
      createdAt: sample.receivedAt?.split('T')[0],
      mass: sample.mass,
      notes: sample.notes
    };
  },

  // Reports management
  async getReports(filter: { mineral?: MineralType; site?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Report>> {
    const params = new URLSearchParams({
      page: (filter.page || 1).toString(),
      limit: (filter.limit || 10).toString(),
      ...(filter.mineral && { mineral: mapMineralToBackend(filter.mineral) }),
      ...(filter.site && { site: filter.site })
    });
    
    const response = await apiRequest(`/reports?${params}`);
    
    return {
      data: response.data.map((report: any) => ({
        id: report.reportCode,
        mineral: mapMineral(report.sample.mineral),
        site: report.sample.site,
        grade: report.grade,
        unit: mapUnit(report.unit),
        url: `${BASE_URL}/reports/${report.reportCode}.pdf`,
        issuedAt: report.issuedAt?.split('T')[0],
        hash: report.hash,
        certified: report.certified,
        qrCode: report.qrCode
      })),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
    };
  },

  async getReport(id: string): Promise<Report> {
    const response = await apiRequest(`/reports/code/${id}`);
    const report = response.data.report;
    
    return {
      id: report.reportCode,
      mineral: mapMineral(report.sample.mineral),
      site: report.sample.site,
      grade: report.grade,
      unit: mapUnit(report.unit),
      url: `${BASE_URL}/reports/${report.reportCode}.pdf`,
      issuedAt: report.issuedAt?.split('T')[0],
      hash: report.hash,
      certified: report.certified,
      qrCode: report.qrCode
    };
  },

  // Dashboard analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiRequest('/dashboard/stats');
    const stats = response.data.stats;
    
    return {
      totalSamples: stats.totalSamples,
      activeSamples: stats.activeSamples,
      analyzingSamples: stats.analyzingSamples,
      completedReports: stats.completedSamples || stats.completedReports,
      averageProcessingTime: stats.averageProcessingTime,
      monthlyGrowth: stats.monthlyGrowth,
    };
  },

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    const { tokens, user } = response.data;
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    
    return {
      token: tokens.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        company: user.company
      },
    };
  },

  async logout(): Promise<void> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      // Ignore logout errors
    }
    
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  // Get current user profile
  async getProfile(): Promise<any> {
    const response = await apiRequest('/auth/profile');
    return response.data.user;
  },
};
