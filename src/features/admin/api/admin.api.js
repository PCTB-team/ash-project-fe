/**
 * admin.api.js — API layer cho Admin Panel (Mock data)
 * Khi có API thật, chỉ cần thay body các function bằng axiosClient calls.
 */
import {
  MOCK_USERS, MOCK_DOCUMENTS, MOCK_GROUPS, MOCK_PAYMENTS, MOCK_PLANS,
  MOCK_ACTIVITIES, MOCK_DASHBOARD_STATS, MOCK_USERS_CHART, MOCK_UPLOADS_CHART,
  MOCK_FILE_TYPE_CHART, MOCK_REVENUE_CHART, MOCK_AI_STATS, MOCK_AI_USAGE_CHART,
  MOCK_SETTINGS,
} from '../utils/admin.mock.js';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const adminApi = {
  // ── Dashboard ──
  getDashboardStats: async () => { await delay(); return { code: 1000, result: MOCK_DASHBOARD_STATS }; },
  getUsersChart: async () => { await delay(); return { code: 1000, result: MOCK_USERS_CHART }; },
  getUploadsChart: async () => { await delay(); return { code: 1000, result: MOCK_UPLOADS_CHART }; },
  getFileTypeChart: async () => { await delay(); return { code: 1000, result: MOCK_FILE_TYPE_CHART }; },
  getRevenueChart: async () => { await delay(); return { code: 1000, result: MOCK_REVENUE_CHART }; },
  getRecentActivities: async () => { await delay(); return { code: 1000, result: MOCK_ACTIVITIES }; },

  // ── Users ──
  getUsers: async ({ page = 0, size = 10, keyword = '', role = '', status = '' } = {}) => {
    await delay();
    let filtered = [...MOCK_USERS];
    if (keyword) filtered = filtered.filter(u => u.fullname.toLowerCase().includes(keyword.toLowerCase()) || u.email.toLowerCase().includes(keyword.toLowerCase()));
    if (role) filtered = filtered.filter(u => u.roles.includes(role));
    if (status) filtered = filtered.filter(u => u.status === status);
    const total = filtered.length;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return { code: 1000, result: { content, totalElements: total, totalPages: Math.ceil(total / size), page } };
  },
  getUserById: async (userId) => { await delay(); const u = MOCK_USERS.find(u => u.id === userId); return { code: 1000, result: u || null }; },
  updateUserRole: async (userId, role) => { await delay(); return { code: 1000, message: 'Success' }; },
  updateUserStatus: async (userId, status) => { await delay(); return { code: 1000, message: 'Success' }; },
  deleteUser: async (userId) => { await delay(); return { code: 1000, message: 'Success' }; },

  // ── Documents ──
  getDocuments: async ({ page = 0, size = 10, keyword = '', fileType = '' } = {}) => {
    await delay();
    let filtered = [...MOCK_DOCUMENTS];
    if (keyword) filtered = filtered.filter(d => d.name.toLowerCase().includes(keyword.toLowerCase()) || d.owner.toLowerCase().includes(keyword.toLowerCase()));
    if (fileType) filtered = filtered.filter(d => d.type === fileType);
    const total = filtered.length;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return { code: 1000, result: { content, totalElements: total, totalPages: Math.ceil(total / size), page } };
  },
  deleteDocument: async (docId) => { await delay(); return { code: 1000, message: 'Success' }; },

  // ── Groups ──
  getGroups: async ({ page = 0, size = 10, keyword = '' } = {}) => {
    await delay();
    let filtered = [...MOCK_GROUPS];
    if (keyword) filtered = filtered.filter(g => g.name.toLowerCase().includes(keyword.toLowerCase()) || g.leader.toLowerCase().includes(keyword.toLowerCase()));
    const total = filtered.length;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    return { code: 1000, result: { content, totalElements: total, totalPages: Math.ceil(total / size), page } };
  },
  deleteGroup: async (groupId) => { await delay(); return { code: 1000, message: 'Success' }; },
  updateGroupStatus: async (groupId, status) => { await delay(); return { code: 1000, message: 'Success' }; },

  // ── Payments ──
  getPayments: async ({ page = 0, size = 10, status = '' } = {}) => {
    await delay();
    let filtered = [...MOCK_PAYMENTS];
    if (status) filtered = filtered.filter(p => p.status === status);
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = filtered.length;
    const start = page * size;
    const content = filtered.slice(start, start + size);
    const stats = {
      totalRevenue: MOCK_PAYMENTS.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0),
      successCount: MOCK_PAYMENTS.filter(p => p.status === 'SUCCESS').length,
      failedCount: MOCK_PAYMENTS.filter(p => p.status === 'FAILED').length,
      pendingCount: MOCK_PAYMENTS.filter(p => p.status === 'PENDING').length,
    };
    return { code: 1000, result: { content, totalElements: total, totalPages: Math.ceil(total / size), page, stats } };
  },
  getPlans: async () => { await delay(); return { code: 1000, result: MOCK_PLANS }; },
  updatePlan: async (planId, data) => { await delay(); return { code: 1000, message: 'Success' }; },

  // ── AI ──
  getAIStats: async () => { await delay(); return { code: 1000, result: MOCK_AI_STATS }; },
  getAIUsageChart: async () => { await delay(); return { code: 1000, result: MOCK_AI_USAGE_CHART }; },

  // ── Settings ──
  getSettings: async () => { await delay(); return { code: 1000, result: MOCK_SETTINGS }; },
  updateSettings: async (settings) => { await delay(500); return { code: 1000, message: 'Settings updated' }; },
};
