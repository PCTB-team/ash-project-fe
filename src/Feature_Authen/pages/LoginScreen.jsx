/**
 * LoginScreen — Premium Apple-style authentication page.
 *
 * Layout order (per spec):
 *   Brand → Form Fields → Submit Button → Divider → Google Button
 *
 * Handles both /login and /register via `currentView` prop.
 */
import { useEffect, useState } from 'react';
import { Form, Divider } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import AuthCard from '../components/AuthCard';
import GoogleButton from '../components/GoogleButton';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import OtpVerification from '../components/OtpVerification';
import { ANIM } from '../utils/constants';

export default function LoginScreen({ onLoginSuccess, onAdminLoginSuccess, onNavigate, currentView }) {
  const [form] = Form.useForm();
  const isRegister = currentView === 'register';

  const [registerStep, setRegisterStep] = useState('form'); // 'form' | 'otp' | 'success'
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerValues, setRegisterValues] = useState(null);

  const {
    isLoading, isGoogleLoading, errorMsg, setErrorMsg,
    showPassword, setShowPassword,
    handleLogin, handleRegister, handleVerifyRegisterOtp, handleGoogleLogin,
  } = useAuth({ onLoginSuccess, onAdminLoginSuccess });

  useEffect(() => {
    setErrorMsg('');
    setShowPassword(false);
    setRegisterStep('form');
    setRegisterValues(null);
    form.resetFields();
  }, [currentView, form, setErrorMsg, setShowPassword]);

  const handleToggleMode = () => {
    setErrorMsg('');
    form.resetFields();
    setRegisterStep('form');
    setRegisterValues(null);
    onNavigate(isRegister ? 'login' : 'register');
  };

  const handleRegisterSubmit = async (values) => {
    const success = await handleRegister(values);
    if (success) {
      setRegisterEmail(values.usernameOrEmail);
      setRegisterValues(values);
      setRegisterStep('otp');
    }
  };

  const handleOtpVerify = async (otp) => {
    const success = await handleVerifyRegisterOtp(registerEmail, otp);
    if (success) {
      setRegisterStep('success');
    }
  };

  const isOtpStep = isRegister && registerStep === 'otp';
  const isSuccessStep = isRegister && registerStep === 'success';

  return (
    <AuthLayout>
      <AuthCard
        isRegister={isRegister}
        errorMsg={errorMsg}
        onNavigate={onNavigate}
        onToggleMode={handleToggleMode}
        hideToggle={isOtpStep || isSuccessStep}
        title={isOtpStep ? 'Xác minh Email' : isSuccessStep ? 'Thành công' : undefined}
        subtitle={isOtpStep ? 'Nhập mã 6 số được gửi đến hòm thư' : isSuccessStep ? 'Tài khoản của bạn đã sẵn sàng' : undefined}
      >
        <AnimatePresence mode="wait">
          {isSuccessStep ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pb-2">
              <div className="w-14 h-14 bg-[#34c759]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#34c759]">
                <i className="bi bi-check-lg text-[28px]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[#1d1d1f] mb-2">Tạo tài khoản thành công!</h3>
              <p className="text-[13px] text-black/50 mb-7">Bạn đã có thể sử dụng tài khoản mới để đăng nhập vào hệ thống AI Study Hub.</p>
              
              <motion.button
                whileHover={{ scale: 1.005, opacity: 0.92 }}
                whileTap={{ scale: 0.997 }}
                onClick={() => {
                  setRegisterStep('form');
                  form.resetFields();
                  onNavigate('login');
                }}
                className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
              >
                Về trang đăng nhập
              </motion.button>
            </motion.div>
          ) : isOtpStep ? (
            <motion.div key="otp" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              <OtpVerification 
                email={registerEmail} 
                isLoading={isLoading} 
                onVerify={handleOtpVerify} 
                onResend={() => handleRegister(registerValues)}
                onBack={() => setRegisterStep('form')} 
              />
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
              {/* ── Form ── */}
              <Form
                form={form}
                layout="vertical"
                onFinish={isRegister ? handleRegisterSubmit : handleLogin}
                initialValues={{ usernameOrEmail: 'vuongbaovipvip@gmail.com', password: '12345678', remember: true }}
                requiredMark={false}
                className={isRegister ? '[&_.ant-form-item]:!mb-2.5' : '[&_.ant-form-item]:!mb-3.5'}
              >
                <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
                  {isRegister ? (
                    <RegisterForm form={form} showPassword={showPassword} setShowPassword={setShowPassword} />
                  ) : (
                    <LoginForm form={form} showPassword={showPassword} setShowPassword={setShowPassword} onNavigate={onNavigate} />
                  )}

                  {/* ── Submit Button ── */}
                  <motion.div variants={ANIM.child}>
                    <Form.Item className="!mb-0">
                      <motion.button
                        whileHover={{ scale: 1.005, opacity: 0.92 }}
                        whileTap={{ scale: 0.997 }}
                        type="submit"
                        disabled={isLoading || isGoogleLoading}
                        className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isLoading ? (
                          <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}</span>
                            <i className="bi bi-arrow-right text-[13px] opacity-70" />
                          </>
                        )}
                      </motion.button>
                    </Form.Item>
                  </motion.div>
                </motion.div>
              </Form>

              {/* ── Divider ── */}
              <Divider className="!text-[10px] !font-medium !text-black/[0.15] !my-5">hoặc</Divider>

              {/* ── Google OAuth Button ── */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
              >
                <GoogleButton onClick={handleGoogleLogin} isLoading={isGoogleLoading} isRegister={isRegister} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthLayout>
  );
}
