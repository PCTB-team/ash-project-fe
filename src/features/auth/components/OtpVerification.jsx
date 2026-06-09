import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ANIM } from '../utils/constants';

export default function OtpVerification({ isLoading, onVerify, onResend, onBack }) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);

    if (value.length === 6) {
      onVerify(value);
    }
  };

  const handleResendClick = () => {
    setOtp('');
    setCountdown(60);
    inputRef.current?.focus();
    if (onResend) onResend();
  };

  return (
    <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
      <motion.div variants={ANIM.child} className="relative flex justify-center gap-2 sm:gap-3 mb-8 cursor-text" onClick={() => inputRef.current?.focus()}>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={otp}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text"
          autoFocus
        />

        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isActive = otp.length === index || (otp.length === 6 && index === 5);
          return (
            <div
              key={index}
              className={`w-10 h-12 sm:w-11 sm:h-14 bg-[#f5f5f7] border-2 flex items-center justify-center rounded-[12px] text-[20px] font-semibold text-[#1d1d1f] transition-all shadow-sm ${isActive ? 'bg-white border-[#0071e3]/40 ring-[3px] ring-[#0071e3]/[0.08]' : 'border-transparent'
                }`}
            >
              {otp[index] || ''}
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={ANIM.child} className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.005, opacity: 0.92 }}
          whileTap={{ scale: 0.997 }}
          onClick={() => onVerify(otp)}
          disabled={isLoading || otp.length < 6}
          className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Xác nhận</span>
              <i className="bi bi-arrow-right text-[13px] opacity-70" />
            </>
          )}
        </motion.button>

        <div className="flex items-center gap-1.5 text-[13px] font-medium">
          <span className="text-black/40">Chưa nhận được mã?</span>
          {countdown > 0 ? (
            <span className="text-black/30">Gửi lại sau {countdown}s</span>
          ) : (
            <button onClick={handleResendClick} className="text-[#0071e3] hover:text-[#0077ED] transition-colors cursor-pointer">
              Gửi lại mã
            </button>
          )}
        </div>

        <button onClick={onBack} className="text-[12px] font-medium text-black/30 hover:text-black/60 transition-colors mt-2">
          Đổi địa chỉ email
        </button>
      </motion.div>
    </motion.div>
  );
}
