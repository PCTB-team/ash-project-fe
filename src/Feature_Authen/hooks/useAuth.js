import { useState } from 'react';
import { message } from 'antd';
import { ADMIN_CREDENTIALS } from '../utils/constants';

// ============================================================================
// 🔗 API PLACEHOLDER (AUTH)
// Khi backend deploy, hãy điền link API thực tế vào biến dưới đây để gọi đăng nhập/đăng ký.
// ============================================================================
export const LOGIN_API_URL = "http://localhost:8080/api/v1/auth/login";
export const REGISTER_API_URL = "http://localhost:8080/api/v1/auth/register";
export const VERIFY_REGISTER_OTP_API_URL = "http://localhost:8080/api/v1/auth/verify-register-otp";

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    if (!values.usernameOrEmail) { setErrorMsg('Vui lòng điền email hoặc tên đăng nhập.'); return; }
    if (!values.password || values.password.length < 6) { setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.'); return; }

    if (values.usernameOrEmail === ADMIN_CREDENTIALS.username && values.password === ADMIN_CREDENTIALS.password) {
      message.success('Xác thực quản trị viên thành công!');
      onAdminLoginSuccess();
      return;
    }
    message.success('Đăng nhập thành công!');
    onLoginSuccess(values.usernameOrEmail);
  };

  const handleRegister = async (values) => {
    setErrorMsg('');
    setIsLoading(true);
    // TODO: Giả lập call API -> fetch(REGISTER_API_URL, ...)
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    if (!values.displayName || values.displayName.trim().length < 2) { setErrorMsg('Tên đăng nhập phải có ít nhất 2 ký tự.'); return false; }
    if (values.password !== values.confirmPassword) { setErrorMsg('Mật khẩu nhập lại không trùng khớp.'); return false; }
    
    message.success('Đã gửi mã xác minh đến email của bạn!');
    return true; // Return true để mở form OTP
  };

  const handleVerifyRegisterOtp = async (email, otp) => {
    setErrorMsg('');
    setIsLoading(true);
    // TODO: Giả lập call API -> fetch(VERIFY_REGISTER_OTP_API_URL, ...)
    await new Promise(r => setTimeout(r, 800));
    setIsLoading(false);

    // Dữ liệu mock: chỉ nhận mã '123456'
    if (otp !== '123456') {
      setErrorMsg('Mã OTP không hợp lệ (Mock: vui lòng nhập 123456)');
      return false;
    }

    message.success('Xác minh thành công! Vui lòng đăng nhập.');
    return true;
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsGoogleLoading(false);
    message.success('Đăng nhập bằng Google thành công!');
    onLoginSuccess('vuongbaovipvip@gmail.com');
  };

  return { isLoading, isGoogleLoading, errorMsg, setErrorMsg, showPassword, setShowPassword, handleLogin, handleRegister, handleVerifyRegisterOtp, handleGoogleLogin };
}
