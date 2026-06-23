import axios from 'axios';
import { message } from 'antd';

const REFRESH_TOKEN_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/refresh-token";

export const axiosClient = axios.create({
  baseURL: 'https://ash-project-be.onrender.com',
  headers: {
    // Let Axios automatically set Content-Type
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(REFRESH_TOKEN_API_URL, { refreshToken });
          const data = refreshRes.data;
          const newToken = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
          const newRefreshToken = data.result?.refreshToken || data.refreshToken;

          if (newToken) {
            localStorage.setItem('accessToken', newToken);
            if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
            onRefreshed(newToken);
          } else {
            throw new Error("Invalid token format received");
          }
        } catch (refreshError) {
          console.error("Lỗi refresh token:", refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }

    // --- GLOBAL ERROR HANDLING ---
    // Ignore global errors if the request explicitly asks to skip them (e.g., config.skipGlobalError = true)
    if (!originalRequest.skipGlobalError && error.response && error.response.data) {
      const code = error.response.data.code;
      const errorMsg = error.response.data.message;

      // Handle specific business logic error codes
      switch (code) {
        case 1219:
        case 1238:
          message.error("Bạn không có quyền thực hiện hành động này.");
          break;
        case 1239:
          message.error("Bạn đã bị tắt quyền tương tác trong nhóm này.");
          break;
        case 1306:
          message.error("Dung lượng không đủ. Vui lòng nâng cấp gói lưu trữ.");
          break;
        case 1304:
          message.error("Loại file không được hỗ trợ.");
          break;
        case 1404:
          // Often for 404 items like file not found or group not found, we don't always show a global message, 
          // but if we want to:
          // message.error("Không tìm thấy dữ liệu yêu cầu.");
          break;
        case 1307:
          // We usually handle FILE_ALREADY_EXISTS at the component level to ask for overwrite
          break;
        default:
          if (error.response.status >= 500) {
            message.error("Lỗi hệ thống máy chủ. Vui lòng thử lại sau.");
          }
          break;
      }
    }

    return Promise.reject(error);
  }
);
