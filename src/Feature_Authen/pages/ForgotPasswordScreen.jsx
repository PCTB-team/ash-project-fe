import { useState } from 'react';
import { Form, message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import ForgotPasswordEmail from '../components/ForgotPasswordEmail';
import OtpVerification from '../components/OtpVerification';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { ANIM } from '../utils/constants';

// ============================================================================
// 🔗 API PLACEHOLDER (FORGOT PASSWORD)
// Khi backend deploy, hãy điền link API thực tế vào biến dưới đây để gửi/xác thực OTP.
// ============================================================================
export const FORGOT_PASSWORD_API_URL = "";


export default function ForgotPasswordScreen({ onNavigate }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset' | 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');

  const handleError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const handleSendOtp = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Có lỗi xảy ra khi gửi OTP');
      
      setEmail(values.email);
      message.success('Mã xác minh đã được gửi đến email của bạn!');
      setStep('otp');
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp) => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Mã xác minh không hợp lệ');
      
      message.success('Xác minh thành công!');
      setStep('reset');
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setErrorMsg('');
    if (values.newPassword !== values.confirmPassword) {
      handleError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: values.newPassword })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Có lỗi xảy ra khi cập nhật mật khẩu');
      
      setStep('success');
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCardProps = () => {
    if (step === 'email') return { title: 'Quên mật khẩu', subtitle: 'Nhập email để nhận mã khôi phục' };
    if (step === 'otp') return { title: 'Xác minh Email', subtitle: 'Nhập mã 6 số được gửi đến hòm thư' };
    if (step === 'reset') return { title: 'Mật khẩu mới', subtitle: 'Tạo mật khẩu an toàn cho tài khoản' };
    return { title: 'Thành công', subtitle: 'Khôi phục tài khoản hoàn tất' };
  };

  return (
    <AuthLayout>
      <AuthCard
        onNavigate={onNavigate}
        errorMsg={errorMsg}
        hideToggle={true}
        title={getCardProps().title}
        subtitle={getCardProps().subtitle}
      >
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <ForgotPasswordEmail 
                form={form} 
                isLoading={isLoading} 
                onSubmit={handleSendOtp} 
                onBack={() => onNavigate('login')} 
              />
            </motion.div>
          )}
          
          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <OtpVerification 
                email={email} 
                isLoading={isLoading} 
                onVerify={handleVerifyOtp} 
                onResend={() => handleSendOtp({ email })}
                onBack={() => setStep('email')} 
              />
            </motion.div>
          )}

          {step === 'reset' && (
            <motion.div key="reset" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <ResetPasswordForm 
                form={form} 
                isLoading={isLoading} 
                onSubmit={handleResetPassword} 
              />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pb-2">
              <div className="w-14 h-14 bg-[#34c759]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#34c759]">
                <i className="bi bi-check-lg text-[28px]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-2">Mật khẩu đã được đặt lại!</h3>
              <p className="text-[13px] text-black/50 mb-7">Bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống AI Study Hub.</p>
              
              <motion.button
                whileHover={{ scale: 1.005, opacity: 0.92 }}
                whileTap={{ scale: 0.997 }}
                onClick={() => onNavigate('login')}
                className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                Về trang đăng nhập
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
}
