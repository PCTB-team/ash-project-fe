import { useState } from 'react';
import { message } from 'antd';
import { ADMIN_CREDENTIALS } from '../utils/constants';

export const LOGIN_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/login";
export const REGISTER_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/register";
export const VERIFY_REGISTER_OTP_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/otp-verification";
export const RESEND_OTP_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/otp-requests";
export const REFRESH_TOKEN_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/refresh-token";
export const LOGOUT_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/logout";
export const GOOGLE_LOGIN_API_URL = "https://ash-project-be.onrender.com/api/v1/auth/google-login";

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const safeJsonParse = async (response) => {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  const handleLogin = async (values) => {
    setErrorMsg('');
    setIsLoading(true);

    if (!values.usernameOrEmail) {
      setErrorMsg('Vui lòng điền email hoặc tên đăng nhập.');
      setIsLoading(false);
      return;
    }

    if (!values.password || values.password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.');
      setIsLoading(false);
      return;
    }

    if (values.usernameOrEmail === ADMIN_CREDENTIALS.username && values.password === ADMIN_CREDENTIALS.password) {
      message.success('Xác thực quản trị viên thành công!');
      localStorage.setItem('accessToken', 'admin_mock_token');
      onAdminLoginSuccess();
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: values.usernameOrEmail,
          password: values.password
        })
      });

      const data = await safeJsonParse(response);

      if (response.ok || data.code === 1000) {
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;

        if (token) localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập thành công!');
        onLoginSuccess(values.usernameOrEmail);
      } else {
        if (response.status === 401 || response.status === 403) {
          setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
        } else {
          setErrorMsg(data.message || 'Đăng nhập thất bại!');
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setErrorMsg('');
    setIsLoading(true);

    if (!values.displayName || values.displayName.trim().length < 2) {
      setErrorMsg('Tên đăng nhập phải có ít nhất 2 ký tự.');
      setIsLoading(false); return false;
    }
    if (!values.fullname || values.fullname.trim().length < 2) {
      setErrorMsg('Họ và tên phải có ít nhất 2 ký tự.');
      setIsLoading(false); return false;
    }
    if (values.password !== values.confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      setIsLoading(false); return false;
    }

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.displayName.replace(/\s+/g, ''),
          email: values.usernameOrEmail,
          fullname: values.fullname,
          password: values.password,
          confirmPassword: values.confirmPassword
        })
      });

      const data = await safeJsonParse(response);

      if (response.ok || data.code === 1000) {
        message.success('Đã gửi mã xác minh đến email của bạn!');
        return true;
      } else {
        if (response.status === 409) {
          setErrorMsg('Email hoặc tên đăng nhập đã tồn tại!');
        } else if (response.status === 401) {
          setErrorMsg('Không có quyền thực hiện thao tác này!');
        } else {
          setErrorMsg(data.message || 'Đăng ký thất bại!');
        }
        return false;
      }
    } catch (error) {
      console.error("Register Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegisterOtp = async (email, otp) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(VERIFY_REGISTER_OTP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await safeJsonParse(response);

      if (response.ok || data.code === 1000) {
        message.success('Xác minh thành công! Vui lòng đăng nhập.');
        return true;
      } else {
        setErrorMsg(data.message || 'Mã OTP không hợp lệ!');
        return false;
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendRegisterOtp = async (email) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(RESEND_OTP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await safeJsonParse(response);

      if (response.ok || data.code === 1000) {
        message.success('Mã xác minh mới đã được gửi đến email của bạn!');
        return true;
      } else {
        setErrorMsg(data.message || 'Không thể gửi lại mã OTP!');
        return false;
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (googleCredential) => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(GOOGLE_LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleCredential })
      });

      const data = await safeJsonParse(response);

      if (response.ok || data.code === 1000) {
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;

        if (token) localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập bằng Google thành công!');
        onLoginSuccess(data.result?.email || data.email || 'Người dùng Google');
      } else {
        setErrorMsg(data.message || 'Đăng nhập Google thất bại tại Backend!');
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return {
    isLoading,
    isGoogleLoading,
    errorMsg,
    setErrorMsg,
    showPassword,
    setShowPassword,
    handleLogin,
    handleRegister,
    handleVerifyRegisterOtp,
    handleResendRegisterOtp,
    handleGoogleLogin
  };
}
