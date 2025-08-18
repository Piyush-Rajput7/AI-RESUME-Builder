const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Resume endpoints
  async createResume(resume: any) {
    return this.request('/api/resumes/create', {
      method: 'POST',
      body: JSON.stringify(resume),
    });
  }

  async getUserResumes(userId: string) {
    return this.request(`/api/resumes/user/${userId}`);
  }

  async updateResume(id: string, resume: any) {
    return this.request(`/api/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resume),
    });
  }

  async deleteResume(id: string) {
    return this.request(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  // AI endpoints
  async generateSummary(data: any) {
    return this.request('/api/ai/generate-summary', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateAchievements(data: any) {
    return this.request('/api/ai/generate-achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async suggestSkills(data: any) {
    return this.request('/api/ai/suggest-skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async optimizeATS(data: any) {
    return this.request('/api/ai/optimize-ats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listTemplates() {
    return this.request('/api/ai/templates');
  }

  async atsReview(payload: {
    resume: any;
    targetRole: string;
    jobDescription?: string;
  }) {
    return this.request('/api/ai/ats-review', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async atsReviewUpload(form: FormData) {
    const url = `${this.baseURL}/api/ai/ats-review-upload`;
    const headers: Record<string, string> = {};
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: form
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);