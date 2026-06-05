import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { LOGOUT_API_URL } from '../Feature_Authen/hooks/useAuth';

export default function Dashboard({ onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // Ưu tiên lấy fullname lưu từ API lúc đăng nhập
    const storedName = localStorage.getItem('fullname');
    if (storedName) {
      setFullName(storedName);
      return;
    }

    // Nếu không có, thử giải mã từ JWT token
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);

        // Lấy trường fullname từ token
        const name = payload.fullname || payload.fullName || payload.name || payload.sub;
        if (name) {
          setFullName(name);
        }
      } catch (e) {
        console.error("Lỗi giải mã token:", e);
      }
    }
  }, []);

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(LOGOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        message.success('Đã đăng xuất thành công khỏi hệ thống!');
      } else {
        message.warning('Phiên đăng nhập đã hết hạn, tự động thoát!');
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      // Dù API có lỗi hay không, Frontend vẫn phải xóa token và đẩy ra trang Login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggingOut(false);
      onLogout(); // Chuyển về màn hình login
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center w-full">
      <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="bi bi-check2-circle text-3xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Đăng nhập thành công! Chào mừng <span className="font-semibold text-gray-800">{fullName ? fullName : 'bạn'}</span> đến với nền tảng Capy Study.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất API'}
          </button>
        </div>
      </div>
    </div>
  );
}
