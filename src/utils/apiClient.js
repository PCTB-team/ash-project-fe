import { message } from 'antd';

const REFRESH_TOKEN_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/refresh-token";

// Trạng thái lock để tránh gọi API refresh nhiều lần cùng lúc
let isRefreshing = false;
let refreshSubscribers = [];

// Đăng ký các request đang chờ refresh token
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

// Gọi lại các request đã đăng ký khi refresh token thành công
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  // Gắn header mặc định
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const config = { ...options, headers };

  let response = await fetch(url, config);

    // Nếu lỗi 401 (Hết hạn token)
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Nếu không có refreshToken -> Bắt buộc logout
      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return response;
      }

      // Nếu chưa có tiến trình refresh nào đang chạy -> Bắt đầu refresh
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(REFRESH_TOKEN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newToken = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
            const newRefreshToken = data.result?.refreshToken || data.refreshToken;

            if (newToken) {
              localStorage.setItem('accessToken', newToken);
              if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
              onRefreshed(newToken);
            } else {
              throw new Error("Invalid token format received");
            }
          } else {
            throw new Error("Refresh token expired");
          }
        } catch (error) {
          console.error("Lỗi refresh token:", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          window.location.href = '/login';
          return response;
        } finally {
          isRefreshing = false;
        }
      }

      // Chờ cho tiến trình refresh chạy xong, sau đó gọi lại API cũ với token mới
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          config.headers['Authorization'] = `Bearer ${newToken}`;
          resolve(fetch(url, config));
        });
      });
    }

    return response;
};
