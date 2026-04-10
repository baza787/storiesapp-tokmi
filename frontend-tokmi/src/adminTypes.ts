// Admin types
export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
  lastLogin?: string;
  createdAt: string;
}

export interface CloudAccount {
  _id: string;
  name: string;
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  isActive: boolean;
  priority: number;
  usageBytes: number;
  limitBytes: number;
  usagePercent: number;
  isOverLimit: boolean;
  totalUploads: number;
  lastUsed?: string;
  notes: string;
  createdAt: string;
}

export interface AdminStats {
  users: number;
  stories: { total: number; active: number; expired: number };
  storage: { used: number; limit: number; percent: number };
  cloudAccounts: { total: number; active: number; overLimit: number };
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  isBanned?: boolean;
  popularityScore: { totalViews: number; totalLikes: number; totalComments: number };
  createdAt: string;
}

// API helper
const ADMIN_API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminFetch = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${ADMIN_API}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Ошибка сервера');
  return data;
};

export const adminAPI = {
  login: (email: string, password: string) =>
    adminFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => adminFetch('/me'),

  setup: (username: string, email: string, password: string) =>
    adminFetch('/setup', { method: 'POST', body: JSON.stringify({ username, email, password }) }),

  stats: () => adminFetch('/stats'),

  // Cloud accounts
  getCloudAccounts: () => adminFetch('/cloud'),

  addCloudAccount: (data: Partial<CloudAccount>) =>
    adminFetch('/cloud', { method: 'POST', body: JSON.stringify(data) }),

  updateCloudAccount: (id: string, data: Partial<CloudAccount>) =>
    adminFetch(`/cloud/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  toggleCloudAccount: (id: string) =>
    adminFetch(`/cloud/${id}/toggle`, { method: 'PATCH' }),

  deleteCloudAccount: (id: string) =>
    adminFetch(`/cloud/${id}`, { method: 'DELETE' }),

  syncCloudUsage: (id: string) =>
    adminFetch(`/cloud/${id}/sync`, { method: 'POST' }),

  // Users
  getUsers: (page = 1, search = '') =>
    adminFetch(`/users?page=${page}&search=${search}`),

  banUser: (id: string, banned: boolean) =>
    adminFetch(`/users/${id}/ban`, { method: 'PATCH', body: JSON.stringify({ banned }) }),
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
