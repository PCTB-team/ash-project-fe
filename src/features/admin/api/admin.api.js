/**
 * admin.api.js — API layer cho Admin Panel
 */
import { axiosClient } from '../../../utils/apiClient.js';

export const adminApi = {
  // ── Dashboard ──
  getDashboardStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/dashboard/stats');
    return res.data;
  },

  getRecentActivities: async ({ page = 0, size = 10, logType = 'ADMIN_ACTION' } = {}) => {
    const res = await axiosClient.get(`/api/v1/admin/logs`, {
      params: { page, size, logType }
    });
    return res.data;
  },

  // ── Users ──
  getUsers: async ({ page = 0, size = 10, keyword = '', role = '', status = '' } = {}) => {
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

  // ── Groups ──
  getGroups: async ({ page = 0, size = 10, keyword = '' } = {}) => {
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
  
  deleteGroup: async (groupId) => {
    const res = await axiosClient.delete(`/api/v1/admin/groups/${groupId}`);
    return res.data;
  },
  
  // TODO: Missing API to update group status (Lock/Unlock Group). 
  // BE needs to provide this endpoint later.
  updateGroupStatus: async (groupId, status) => {
    console.warn("API updateGroupStatus is currently missing from Backend.");
    return { code: 1000, message: 'Not implemented by BE yet' };
  },

  // ── Payments ──
  getPayments: async ({ page = 0, size = 10, status = '' } = {}) => {
    const params = { page, size };
    if (status) params.status = status;
    const res = await axiosClient.get('/api/v1/admin/payments', { params });
    return res.data;
  },
  
  // TODO: Missing API to get subscription plans.
  getPlans: async () => {
    console.warn("API getPlans is currently missing from Backend.");
    return { code: 1000, result: [] }; // Return empty or mock array to avoid breaking UI
  },
  
  // TODO: Missing API to update a plan.
  updatePlan: async (planId, data) => {
    console.warn("API updatePlan is currently missing from Backend.");
    return { code: 1000, message: 'Not implemented by BE yet' };
  },

  // ── AI ──
  getAIStats: async () => {
    const res = await axiosClient.get('/api/v1/admin/ai/statistics');
    return res.data;
  },

  // ── Settings ──
  getSettings: async () => {
    const res = await axiosClient.get('/api/v1/admin/settings');
    return res.data;
  },
  
  // TODO: Missing API to update system settings.
  updateSettings: async (settings) => {
    console.warn("API updateSettings is currently missing from Backend.");
    return { code: 1000, message: 'Not implemented by BE yet' };
  },
};
