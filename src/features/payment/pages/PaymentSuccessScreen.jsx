import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';

export default function PaymentSuccessScreen() {
  const navigate = useNavigate();
  const { pollStatus } = usePayment();
  const [status, setStatus] = useState('POLLING'); // POLLING, SUCCESS, FAILED
  const pollingStarted = useRef(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (pollingStarted.current) return;
      pollingStarted.current = true;

      const txId = localStorage.getItem('latestPaymentTransactionId');
      if (!txId) {
        setStatus('FAILED');
        return;
      }

      const finalStatus = await pollStatus(txId);
      setStatus(finalStatus);
    };

    checkStatus();
  }, [pollStatus]);

  const handleReturn = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/5 text-center relative overflow-hidden"
      >
        {status === 'POLLING' && (
          <div className="flex flex-col items-center py-8">
            <div className="relative w-24 h-24 mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-black/5 border-t-[#ff5c00]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="bi bi-shield-lock text-3xl text-black/20" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Đang xác nhận...</h2>
            <p className="text-black/50">Vui lòng đợi trong giây lát, hệ thống đang đồng bộ giao dịch của bạn từ PayOS.</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-4"
          >
            <div className="w-24 h-24 bg-[#ff5c00]/10 rounded-full flex items-center justify-center mb-6 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-16 h-16 bg-gradient-to-r from-[#ff8a00] to-[#ff5c00] rounded-full flex items-center justify-center shadow-lg shadow-[#ff5c00]/30"
              >
                <i className="bi bi-check-lg text-white text-4xl" />
              </motion.div>
              {/* Confetti particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute w-2 h-2 bg-[#ff5c00] rounded-full"
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Nâng cấp thành công!</h2>
            <p className="text-black/50 mb-8">Không gian học tập của bạn đã được mở rộng. Hãy tiếp tục tận hưởng các tính năng cao cấp nhé.</p>
            <button 
              onClick={handleReturn}
              className="w-full bg-black text-white rounded-2xl py-4 font-semibold hover:bg-black/80 transition-colors"
            >
              Trở về Dashboard
            </button>
          </motion.div>
        )}

        {status === 'FAILED' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-4"
          >
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                <i className="bi bi-x-lg text-white text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Thanh toán thất bại</h2>
            <p className="text-black/50 mb-8">Rất tiếc, đã có lỗi xảy ra hoặc giao dịch của bạn không được xác nhận. Vui lòng thử lại sau.</p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => navigate('/dashboard/payment')}
                className="flex-1 bg-black/5 text-black rounded-2xl py-4 font-semibold hover:bg-black/10 transition-colors"
              >
                Thử lại
              </button>
              <button 
                onClick={handleReturn}
                className="flex-1 bg-black text-white rounded-2xl py-4 font-semibold hover:bg-black/80 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
