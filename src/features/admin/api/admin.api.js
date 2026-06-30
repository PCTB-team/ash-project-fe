/**
 * admin.api.js — API layer cho Admin Panel
 * Synced with ADMIN_MODULE_FULL_API.md contract.
 */
import { axiosClient } from '../../../utils/apiClient.js';

export const adminApi = {
  // ── 1. Dashboard ──
  getDashboardStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/dashboard/stats');
    return res.data;
  },

  // ── 2. Audit Logs ──
  getRecentActivities: async ({ page = 0, size = 10, logType = 'ADMIN_ACTION' } = {}) => {
    const res = await axiosClient.get('/api/v1/admin/logs', {
      params: { page, size, logType }
    });
    return res.data;
  },

  // ── 3. User Management ──
  getUsers: async ({ page = 0, size = 20, keyword = '', role = '', status = '' } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (role) params.role = role;
    if (status) params.status = status;
    const res = await axiosClient.get('/api/v1/admin/users', { params });
    return res.data;
  },

  getUserById: async (userId) => {
    const res = await axiosClient.get(`/api/v1/admin/users/${userId}`);
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await axiosClient.put(`/api/v1/admin/users/${userId}/role?roleName=${role}`);
    return res.data;
  },

  updateUserStatus: async (userId, status) => {
    let res;
    if (status === 'BANNED') {
      res = await axiosClient.put(`/api/v1/admin/users/${userId}/lock`, { reason: 'Policy violation' });
    } else {
      res = await axiosClient.put(`/api/v1/admin/users/${userId}/unlock`);
    }
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await axiosClient.delete(`/api/v1/admin/users/${userId}`);
    return res.data;
  },

  setUserStoragePlan: async (userId, planId, reason) => {
    const res = await axiosClient.put(`/api/v1/admin/users/${userId}/storage-plan`, {
      planId,
      reason
    });
    return res.data;
  },

  // ── 4. Document Management ──
  getDocuments: async ({ page = 0, size = 20, keyword = '', fileType = '' } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (fileType && fileType !== 'ALL') params.fileType = fileType;
    const res = await axiosClient.get('/api/v1/admin/documents', { params });
    return res.data;
  },

  getDocumentStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/documents/statistics');
    return res.data;
  },

  deleteDocument: async (docId) => {
    const res = await axiosClient.delete(`/api/v1/admin/documents/${docId}`);
    return res.data;
  },

  // ── 5. Study Group Management ──
  getGroups: async ({ page = 0, size = 20, keyword = '' } = {}) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    const res = await axiosClient.get('/api/v1/admin/groups', { params });
    return res.data;
  },

  getGroupById: async (groupId) => {
    const res = await axiosClient.get(`/api/v1/admin/groups/${groupId}`);
    return res.data;
  },

  getGroupStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/groups/statistics');
    return res.data;
  },

  updateGroupStatus: async (groupId, status) => {
    const res = await axiosClient.put(`/api/v1/admin/groups/${groupId}/status`, { status });
    return res.data;
  },

  deleteGroup: async (groupId) => {
    const res = await axiosClient.delete(`/api/v1/admin/groups/${groupId}`);
    return res.data;
  },

  // ── 6. Payments, Plans, and Revenue ──
  getPayments: async ({ page = 0, size = 20, status = '' } = {}) => {
    const params = { page, size };
    if (status && status !== 'ALL') params.status = status;
    const res = await axiosClient.get('/api/v1/admin/payments', { params });
    return res.data;
  },

  getRevenueStats: async ({ granularity = 'MONTH', from = '', to = '' } = {}) => {
    const params = { granularity };
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await axiosClient.get('/api/v1/admin/payments/revenue', { params });
    return res.data;
  },

  getMonthlyRevenue: async ({ from = '', to = '' } = {}) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await axiosClient.get('/api/v1/admin/payments/revenue/monthly', { params });
    return res.data;
  },

  getPlans: async () => {
    const res = await axiosClient.get('/api/v1/admin/plans');
    return res.data;
  },

  updatePlan: async (planId, data) => {
    const res = await axiosClient.put(`/api/v1/admin/plans/${planId}`, data);
    return res.data;
  },

  // ── 7. AI Statistics ──
  getAIStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/ai/statistics');
    return res.data;
  },

  // ── 8. System Settings ──
  getSettings: async () => {
    const res = await axiosClient.get('/api/v1/admin/settings');
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await axiosClient.put('/api/v1/admin/settings', settings);
    return res.data;
  },
};
