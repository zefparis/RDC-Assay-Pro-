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
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
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
    'ANALYZING': 'In Analysis',
    'QA_QC': 'QA/QC',
    'REPORTED': 'Reported',
    'DELIVERED': 'Delivered',
  };
  return statusMap[backendStatus] || 'Received'; // Default fallback
};

// Map frontend status to backend status
const mapStatusToBackend = (frontendStatus: string): string => {
  const statusMap: Record<string, string> = {
    'Received': 'RECEIVED',
    'In Analysis': 'ANALYZING',
    'QA/QC': 'QA_QC',
    'Reported': 'REPORTED',
    'Delivered': 'DELIVERED',
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

  // Admin helpers (Option B: server-side validation via Next API routes)
  async adminLogin(password: string): Promise<{ expiresIn: number }> {
    const res = await fetch('/api/auth/boss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return { expiresIn: data.expiresIn };
  },

  async adminRefresh(): Promise<{ expiresIn: number }> {
    const res = await fetch('/api/auth/boss-refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return { expiresIn: data.expiresIn };
  },

  async adminListSamples(params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Sample>> {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 20),
      ...(params.search ? { search: params.search } : {}),
    });
    const res = await fetch(`/api/admin/samples?${query.toString()}`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const response = await res.json();
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
        qrCode: sample.qrCode,
        reportUrl: sample.report?.reportCode ? `${BASE_URL}/reports/${sample.report.reportCode}.pdf` : undefined,
      })),
      total: response.pagination.total,
      page: response.pagination.page,
      limit: response.pagination.limit,
      totalPages: response.pagination.totalPages,
    };
  },

  async adminUpdateSampleStatus(code: string, nextStatus: SampleStatus, notes?: string): Promise<Sample> {
    const res = await fetch(`/api/admin/samples/${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: mapStatusToBackend(nextStatus), notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const response = await res.json();
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
      reportUrl: sample.report?.reportCode ? `${BASE_URL}/reports/${sample.report.reportCode}.pdf` : undefined,
    };
  },

  async adminUploadReport(code: string, file: File, payload: { grade?: number; unit?: Unit } = {}): Promise<Sample> {
    const form = new FormData();
    form.append('file', file);
    if (payload.grade != null) form.append('grade', String(payload.grade));
    if (payload.unit) form.append('unit', mapUnitToBackend(payload.unit));
    const res = await fetch(`/api/admin/samples/${encodeURIComponent(code)}/report`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const sample = data.data.sample || data.data;
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
      reportUrl: sample.report?.reportCode ? `${BASE_URL}/reports/${sample.report.reportCode}.pdf` : undefined,
    };
  },

  async adminDeleteSample(code: string): Promise<void> {
    const res = await fetch(`/api/admin/samples/${encodeURIComponent(code)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
  },
};
