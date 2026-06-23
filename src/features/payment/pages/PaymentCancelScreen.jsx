import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-black/5 text-center"
      >
        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="bi bi-dash-circle text-black/40 text-4xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-black mb-2">Đã huỷ thanh toán</h2>
        <p className="text-black/50 mb-8">
          Quá trình thanh toán đã được huỷ bỏ an toàn. Không có khoản phí nào được tính vào tài khoản của bạn.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/dashboard/payment')}
            className="w-full bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] text-white rounded-2xl py-4 font-semibold hover:opacity-90 transition-opacity shadow-md shadow-[#ff5c00]/20"
          >
            Xem lại các gói nâng cấp
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-white text-black border border-black/10 rounded-2xl py-4 font-semibold hover:bg-black/5 transition-colors"
          >
            Trở về Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
