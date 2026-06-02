import React from 'react';

export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center w-full">
      <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="bi bi-check2-circle text-3xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Dashboard</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Đăng nhập thành công! Chào mừng bạn đến với hệ thống AI Study Hub.
        </p>
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
