import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const { loading, plans, storageData, fetchData, handleCheckout } = usePayment();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fallback defaults
  const usagePercent = storageData?.usagePercent ?? 0;
  const usedStorageMB = (storageData?.usedStorage || 0) / (1024 * 1024);
  const maxStorageMB = (storageData?.maxStorage || 500 * 1024 * 1024) / (1024 * 1024);

  // Helper formats
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  const formatGB = (bytes) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return Number.isInteger(gb) ? gb : gb.toFixed(1);
  };

  // Lọc plans dựa trên toggle tháng/năm
  const filteredPlans = plans.filter(plan => {
    if (billingCycle === 'monthly') return plan.durationMonths < 12;
    return plan.durationMonths >= 12;
  });

  const showToggle = plans.length > 0; 

  return (
    <div className="h-full w-full flex flex-col bg-[#fdfbf9] p-4 lg:p-6 overflow-hidden relative">
      
      {/* Background Decor (Nhẹ nhàng, màu cam) */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#ff8a00]/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#ff5c00]/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Header Row */}
      <div className="flex justify-between items-start mb-4 z-10 shrink-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a]">
            Nâng cấp không gian học tập
          </h1>
          
          {/* Storage Mini-Indicator (Nhiều màu sắc hơn, gọn gàng) */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#ff5c00]/20 shadow-sm text-xs font-medium text-gray-700 w-fit">
            <div className="w-6 h-6 rounded-full bg-[#ff5c00]/10 flex items-center justify-center">
              <i className="bi bi-cloud-check-fill text-[#ff5c00]" />
            </div>
            <span>Đã dùng <b>{usedStorageMB.toFixed(1)} MB</b> / {maxStorageMB >= 1024 ? `${(maxStorageMB/1024).toFixed(1)} GB` : `${maxStorageMB.toFixed(0)} MB`}</span>
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden ml-1">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${usagePercent > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00]'}`} 
                style={{ width: `${Math.min(100, usagePercent)}%` }} 
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400 shadow-sm"
        >
          <i className="bi bi-x-lg text-sm" />
        </button>
      </div>

      {/* Toggle Row */}
      {showToggle && (
        <div className="flex justify-center mb-6 z-10 shrink-0">
          <div className="inline-flex items-center bg-white/60 backdrop-blur-md p-1 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                billingCycle === 'monthly' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gói Tháng</span>
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-5 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                billingCycle === 'yearly' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {billingCycle === 'yearly' && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gói Năm (Tiết kiệm)</span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Plans Grid (Flexible space to prevent scroll) */}
      <div className="flex-1 min-h-0 z-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto h-full">
          {loading && plans.length === 0 ? (
            // Skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 h-full animate-pulse flex flex-col shadow-sm">
                <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-8 bg-gray-100 rounded w-1/2 mb-6" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                  <div className="h-3 bg-gray-100 rounded w-4/6" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl w-full mt-4" />
              </div>
            ))
          ) : plans.length === 0 ? (
             <div className="col-span-full flex flex-col items-center justify-center h-full text-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-[#ff5c00]/10 rounded-full flex items-center justify-center mb-3">
                <i className="bi bi-star-fill text-2xl text-[#ff5c00]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Bạn đang dùng gói cao nhất!</h3>
              <p className="text-sm text-gray-500">Hiện tại hệ thống không có gói nào lớn hơn.</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-full text-center bg-white/50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <i className="bi bi-inbox text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Không có gói phù hợp</h3>
              <p className="text-sm text-gray-500">Chưa có gói {billingCycle === 'monthly' ? 'tháng' : 'năm'} nào để hiển thị.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPlans.map((plan, index) => {
                const isPremium = plan.price > 100000 || plans.length === 1 || index === 1; // Highlighting logic
                
                return (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl p-5 flex flex-col relative overflow-hidden transition-all h-full ${
                      isPremium 
                      ? 'border-2 border-[#ff5c00] shadow-lg shadow-[#ff5c00]/5' 
                      : 'border border-gray-100 shadow-sm hover:border-[#ff5c00]/30 hover:shadow-md'
                    }`}
                  >
                    {isPremium && (
                      <div className="absolute top-0 right-0 bg-[#ff5c00] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl">
                        Phổ biến
                      </div>
                    )}

                    <div className="mb-4 mt-1">
                      <h3 className={`text-base font-bold mb-1 ${isPremium ? 'text-[#ff5c00]' : 'text-gray-800'}`}>
                        {plan.planName}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{formatPrice(plan.price)}</span>
                        <span className="text-xs text-gray-500 font-medium">/{plan.durationMonths}T</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 flex-1 text-[13px] text-gray-600">
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPremium ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-gray-100 text-gray-500'}`}>
                          <i className="bi bi-check2 text-[10px] font-bold" />
                        </div>
                        <span>Lưu trữ lên đến <b className="text-gray-900">{formatGB(plan.quotaSize)} GB</b></span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPremium ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-gray-100 text-gray-500'}`}>
                          <i className="bi bi-check2 text-[10px] font-bold" />
                        </div>
                        <span>Quản lý tài liệu học tập không giới hạn</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPremium ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-gray-100 text-gray-500'}`}>
                          <i className="bi bi-check2 text-[10px] font-bold" />
                        </div>
                        <span>Sử dụng AI phân tích tài liệu cao cấp</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPremium ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-gray-100 text-gray-500'}`}>
                          <i className="bi bi-check2 text-[10px] font-bold" />
                        </div>
                        <span>Tốc độ Upload/Download cực nhanh</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loading}
                      className={`w-full py-2.5 mt-4 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                        isPremium
                        ? 'bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white hover:shadow-lg hover:shadow-[#ff5c00]/30'
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                      } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <i className="bi bi-arrow-repeat animate-spin text-base" />
                      ) : (
                        isPremium ? 'Mua gói này' : 'Nâng cấp'
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

    </div>
  );
}
