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
  const usedStorageBytes = storageData?.usedStorage || 0;
  const maxStorageBytes = storageData?.maxStorage || storageData?.quotaSize || storageData?.maxStorageSize || storageData?.totalCapacity || 500 * 1024 * 1024;
  const remainingStorageBytes = storageData?.remainingStorage || Math.max(0, maxStorageBytes - usedStorageBytes);

  // Helper formats
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 MB";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }

    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
  };

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
    <div className="h-full w-full flex flex-col bg-[#fcfcfd] px-4 md:px-6 pb-6 pt-5 overflow-hidden relative select-none">
      
      {/* Background Decor (Nhiều màu sắc) */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-[#ff5c00]/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Top Header Row - Giống hệt Dashboard (Thư viện của tôi) */}
      <div className="flex justify-between items-start mb-5 sm:mb-6 z-10 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-[#1d1d1f]">
            Nâng cấp không gian học tập
          </h1>
          <p className="text-[12px] text-black/55 font-medium mt-0.5 flex items-center gap-2">
            Mở rộng lưu trữ và trải nghiệm các tính năng cao cấp cùng AI
          </p>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.02] border border-black/5 hover:bg-black/[0.06] hover:text-black transition-colors text-black/55 shadow-sm mt-1 cursor-pointer"
        >
          <i className="bi bi-x-lg text-[14px]" />
        </button>
      </div>

      {/* Storage & Toggle Row */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 z-10 shrink-0 gap-4">
        {/* Storage Mini-Indicator (Pro UI) */}
        <div className="inline-flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-black/5 shadow-sm text-[12px] font-medium text-black/60 w-fit">
          <div className="flex items-center gap-1.5 border-r border-black/5 pr-3">
            <i className="bi bi-cloud-check-fill text-[#ff5c00] text-[15px]" />
            <span className="text-[#1d1d1f] font-semibold">{formatBytes(usedStorageBytes)}</span>
            <span className="text-black/40">/ {formatBytes(maxStorageBytes)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#ff5c00]">Còn trống {formatBytes(remainingStorageBytes)}</span>
            <div className="w-20 h-1.5 bg-black/[0.04] rounded-full overflow-hidden ml-1 relative">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out ${usagePercent > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-[#ff5c00] shadow-[0_0_8px_rgba(168,85,247,0.4)]'}`} 
                style={{ width: `${Math.min(100, usagePercent)}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Toggle */}
        {showToggle && (
          <div className="inline-flex items-center bg-black/[0.03] p-1 rounded-xl border border-black/5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-5 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                billingCycle === 'monthly' ? 'text-white' : 'text-black/55 hover:text-black'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#ff5c00] rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gói Tháng</span>
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-5 py-1.5 text-[12px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                billingCycle === 'yearly' ? 'text-white' : 'text-black/55 hover:text-black'
              }`}
            >
              {billingCycle === 'yearly' && (
                <motion.div
                  layoutId="billing-toggle"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-[#ff5c00] rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Gói Năm (Tiết kiệm)</span>
            </button>
          </div>
        )}
      </div>

      {/* Pricing Plans Grid */}
      <div className="flex-1 min-h-0 z-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-[1100px] h-full">
          {loading && plans.length === 0 ? (
            // Skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-black/5 rounded-2xl p-5 h-full animate-pulse flex flex-col shadow-sm">
                <div className="h-5 bg-black/[0.03] rounded w-1/3 mb-3" />
                <div className="h-8 bg-black/[0.03] rounded w-1/2 mb-6" />
                <div className="space-y-3 flex-1">
                  <div className="h-3 bg-black/[0.03] rounded w-full" />
                  <div className="h-3 bg-black/[0.03] rounded w-5/6" />
                  <div className="h-3 bg-black/[0.03] rounded w-4/6" />
                </div>
                <div className="h-10 bg-black/[0.03] rounded-xl w-full mt-4" />
              </div>
            ))
          ) : plans.length === 0 ? (
             <div className="col-span-full flex flex-col items-center justify-center h-full text-center bg-white/40 rounded-2xl border border-dashed border-black/10">
              <div className="w-14 h-14 bg-[#ff5c00]/10 rounded-full flex items-center justify-center mb-3">
                <i className="bi bi-star-fill text-[24px] text-[#ff5c00]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">Bạn đang dùng gói cao nhất!</h3>
              <p className="text-[12px] text-black/55 font-medium">Hiện tại hệ thống không có gói nào lớn hơn.</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center h-full text-center bg-white/40 rounded-2xl border border-dashed border-black/10">
              <div className="w-14 h-14 bg-black/[0.03] rounded-full flex items-center justify-center mb-3">
                <i className="bi bi-inbox text-[24px] text-black/30" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-1">Không có gói phù hợp</h3>
              <p className="text-[12px] text-black/55 font-medium">Chưa có gói {billingCycle === 'monthly' ? 'tháng' : 'năm'} nào để hiển thị.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPlans.map((plan, index) => {
                const isPremium = plan.price > 100000 || plans.length === 1 || index === 1; // Highlighting logic
                
                // Bảng màu cho từng gói
                const colorSchemes = [
                  { 
                    base: 'text-blue-500', 
                    bgAccent: 'bg-blue-50', 
                    borderAccent: 'border-blue-500', 
                    hoverBorder: 'hover:border-blue-500',
                    hoverShadow: 'hover:shadow-[0_4px_20px_rgba(59,130,246,0.15)]',
                    hoverButtonShadow: 'hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)]',
                    gradient: 'from-blue-500 to-cyan-400',
                    hoverGradient: 'hover:from-blue-500 hover:to-cyan-400',
                    shadow: 'shadow-[0_4px_20px_rgba(59,130,246,0.15)]',
                  },
                  { 
                    base: 'text-[#ff5c00]', 
                    bgAccent: 'bg-[#ff5c00]/10', 
                    borderAccent: 'border-[#ff5c00]', 
                    hoverBorder: 'hover:border-[#ff5c00]',
                    hoverShadow: 'hover:shadow-[0_4px_20px_rgba(255,92,0,0.15)]',
                    hoverButtonShadow: 'hover:shadow-[0_8px_24px_rgba(255,92,0,0.4)]',
                    gradient: 'from-[#ff7a00] to-[#ff5c00]',
                    hoverGradient: 'hover:from-[#ff7a00] hover:to-[#ff5c00]',
                    shadow: 'shadow-[0_4px_20px_rgba(255,92,0,0.15)]',
                  },
                  { 
                    base: 'text-purple-500', 
                    bgAccent: 'bg-purple-50', 
                    borderAccent: 'border-purple-500', 
                    hoverBorder: 'hover:border-purple-500',
                    hoverShadow: 'hover:shadow-[0_4px_20px_rgba(168,85,247,0.15)]',
                    hoverButtonShadow: 'hover:shadow-[0_8px_24px_rgba(168,85,247,0.4)]',
                    gradient: 'from-purple-500 to-pink-500',
                    hoverGradient: 'hover:from-purple-500 hover:to-pink-500',
                    shadow: 'shadow-[0_4px_20px_rgba(168,85,247,0.15)]',
                  },
                  { 
                    base: 'text-emerald-500', 
                    bgAccent: 'bg-emerald-50', 
                    borderAccent: 'border-emerald-500', 
                    hoverBorder: 'hover:border-emerald-500',
                    hoverShadow: 'hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
                    hoverButtonShadow: 'hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]',
                    gradient: 'from-emerald-400 to-teal-500',
                    hoverGradient: 'hover:from-emerald-400 hover:to-teal-500',
                    shadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.15)]',
                  }
                ];
                
                const scheme = colorSchemes[index % colorSchemes.length];

                return (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl p-5 md:p-6 flex flex-col relative overflow-hidden transition-all duration-300 h-full border-2 ${
                      isPremium 
                      ? `${scheme.borderAccent} ${scheme.shadow} scale-[1.02] z-10` 
                      : `border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${scheme.hoverBorder} ${scheme.hoverShadow} hover:scale-[1.01]`
                    }`}
                  >
                    {isPremium && (
                      <div className={`absolute top-0 right-0 bg-gradient-to-r ${scheme.gradient} text-white text-[10px] font-semibold uppercase py-1 px-3 rounded-bl-xl shadow-sm`}>
                        Phổ biến
                      </div>
                    )}

                    <div className="mb-4 mt-1">
                      <h3 className={`text-[16px] font-semibold mb-1 ${scheme.base}`}>
                        {plan.planName}
                      </h3>
                      
                      {/* Giá ảo gạch ngang */}
                      <div className="text-[12px] text-black/40 line-through mb-0.5 font-medium">
                        {formatPrice(plan.price * 1.5)}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className={`text-[24px] font-semibold ${scheme.base}`}>{formatPrice(plan.price)}</span>
                        <span className="text-[12.5px] text-black/55 font-medium">/{plan.durationMonths}T</span>
                        
                        {/* Huy hiệu giảm giá ảo */}
                        <span className={`ml-2 text-[10px] font-semibold ${scheme.base} ${scheme.bgAccent} px-1.5 py-0.5 rounded-md border border-current/20`}>
                          -33%
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 flex-1 text-[12.5px] text-black/60 font-medium mt-2">
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-[3px] w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 ${scheme.bgAccent} ${scheme.base}`}>
                          <i className="bi bi-check2 text-[10px]" />
                        </div>
                        <span>Lưu trữ lên đến <b className="text-[#1d1d1f]">{formatGB(plan.quotaSize)} GB</b></span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-[3px] w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 ${scheme.bgAccent} ${scheme.base}`}>
                          <i className="bi bi-check2 text-[10px]" />
                        </div>
                        <span>Quản lý tài liệu học tập không giới hạn</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-[3px] w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 ${scheme.bgAccent} ${scheme.base}`}>
                          <i className="bi bi-check2 text-[10px]" />
                        </div>
                        <span>Sử dụng AI phân tích tài liệu cao cấp</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-[3px] w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 ${scheme.bgAccent} ${scheme.base}`}>
                          <i className="bi bi-check2 text-[10px]" />
                        </div>
                        <span>Tốc độ Upload/Download cực nhanh</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loading}
                      className={`w-full h-10 mt-5 rounded-full font-medium text-[13px] transition-all duration-300 cursor-pointer flex items-center justify-center group ${
                        isPremium
                        ? `bg-gradient-to-r ${scheme.gradient} text-white shadow-md hover:${scheme.hoverButtonShadow} hover:brightness-110`
                        : `border-2 ${scheme.borderAccent} ${scheme.base} bg-transparent hover:bg-gradient-to-r ${scheme.hoverGradient} hover:text-white hover:border-transparent ${scheme.hoverButtonShadow}`
                      } ${loading ? 'opacity-70 !cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <i className="bi bi-hourglass-split animate-[spin_2s_linear_infinite]" />
                      ) : (
                        isPremium ? 'Đăng ký ngay' : 'Nâng cấp'
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
