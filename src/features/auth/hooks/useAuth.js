import { useState } from 'react';
import { message } from 'antd';
import { ADMIN_CREDENTIALS } from '../utils/constants';
import { axiosClient } from '../../../utils/apiClient.js';

export const LOGIN_API_URL = "/api/v1/auth/login";
export const REGISTER_API_URL = "/api/v1/auth/register";
export const VERIFY_REGISTER_OTP_API_URL = "/api/v1/auth/otp-verification";
export const RESEND_OTP_API_URL = "/api/v1/auth/otp-requests";
export const REFRESH_TOKEN_API_URL = "/api/v1/auth/refresh-token";
export const LOGOUT_API_URL = "/api/v1/auth/logout";
export const GOOGLE_LOGIN_API_URL = "/api/v1/auth/google-login";

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await axiosClient.post(LOGIN_API_URL, {
        identifier: values.usernameOrEmail,
        password: values.password
      });

      const data = response.data;

      if (response.status === 200 || data.code === 1000) {
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;

        if (token) localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập thành công!');
        onLoginSuccess(values.usernameOrEmail);
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data || {};
        if (status === 401 || status === 403) {
          setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
        } else {
          setErrorMsg(data.message || 'Đăng nhập thất bại!');
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
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
      const response = await axiosClient.post(REGISTER_API_URL, {
        username: values.displayName.replace(/\s+/g, ''),
        email: values.usernameOrEmail,
        fullname: values.fullname,
        password: values.password,
        confirmPassword: values.confirmPassword
      });

      const data = response.data;

      if (response.status === 200 || data.code === 1000) {
        message.success('Đã gửi mã xác minh đến email của bạn!');
        return true;
      }
    } catch (error) {
      console.error("Register Error:", error);
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data || {};
        if (status === 409) {
          setErrorMsg('Email hoặc tên đăng nhập đã tồn tại!');
        } else if (status === 401) {
          setErrorMsg('Không có quyền thực hiện thao tác này!');
        } else {
          setErrorMsg(data.message || 'Đăng ký thất bại!');
        }
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRegisterOtp = async (email, otp) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post(VERIFY_REGISTER_OTP_API_URL, { email, otp });
      const data = response.data;

      if (response.status === 200 || data.code === 1000) {
        message.success('Xác minh thành công! Vui lòng đăng nhập.');
        return true;
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      if (error.response) {
        const data = error.response.data || {};
        setErrorMsg(data.message || 'Mã OTP không hợp lệ!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendRegisterOtp = async (email) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post(RESEND_OTP_API_URL, { email });
      const data = response.data;

      if (response.status === 200 || data.code === 1000) {
        message.success('Mã xác minh mới đã được gửi đến email của bạn!');
        return true;
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      if (error.response) {
        const data = error.response.data || {};
        setErrorMsg(data.message || 'Không thể gửi lại mã OTP!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (googleCredential) => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    try {
      const response = await axiosClient.post(GOOGLE_LOGIN_API_URL, { token: googleCredential });
      const data = response.data;

      if (response.status === 200 || data.code === 1000) {
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;

        if (token) localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập bằng Google thành công!');
        onLoginSuccess(data.result?.email || data.email || 'Người dùng Google');
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      if (error.response) {
        const data = error.response.data || {};
        setErrorMsg(data.message || 'Đăng nhập Google thất bại tại Backend!');
      } else {
        setErrorMsg('Không thể kết nối đến máy chủ.');
      }
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
