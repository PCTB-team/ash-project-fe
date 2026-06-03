import { useState } from 'react';
import { message } from 'antd';
import { ADMIN_CREDENTIALS } from '../utils/constants';

// ============================================================================
// 🔗 API PLACEHOLDER (AUTH)
// Khi backend deploy, hãy điền link API thực tế vào biến dưới đây để gọi đăng nhập/đăng ký.
// ============================================================================
export const LOGIN_API_URL = "http://localhost:8080/api/v1/auth/login";
export const REGISTER_API_URL = "http://localhost:8080/api/v1/auth/register";
export const VERIFY_REGISTER_OTP_API_URL = "http://localhost:8080/api/v1/auth/otp-verification";
export const RESEND_OTP_API_URL = "http://localhost:8080/api/v1/auth/otp-requests";
export const REFRESH_TOKEN_API_URL = "http://localhost:8080/api/v1/auth/refresh-token";
export const LOGOUT_API_URL = "http://localhost:8080/api/v1/auth/logout";

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    setErrorMsg('');
    setIsLoading(true);

    if (!values.usernameOrEmail) { setErrorMsg('Vui lòng điền email hoặc tên đăng nhập.'); setIsLoading(false); return; }
    if (!values.password || values.password.length < 6) { setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.'); setIsLoading(false); return; }

    if (values.usernameOrEmail === ADMIN_CREDENTIALS.username && values.password === ADMIN_CREDENTIALS.password) {
      message.success('Xác thực quản trị viên thành công!');
      localStorage.setItem('accessToken', 'admin_mock_token');
      onAdminLoginSuccess();
      setIsLoading(false);
      return;
    }

    try {
      // Giả sử API nhận vào username và password (nếu API cần 'email' thì bạn sửa lại key nhé)
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: values.usernameOrEmail, 
          password: values.password 
        })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Response is not JSON:", text);
        }
      }

      if (response.ok || data.code === 1000) {
        // Hứng Token từ Backend. Cấu trúc có thể nằm ở data.token, data.result.token...
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;
        
        // Lưu vào LocalStorage
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
      setIsLoading(false);
      return false;
    }
    if (!values.fullname || values.fullname.trim().length < 2) {
      setErrorMsg('Họ và tên phải có ít nhất 2 ký tự.');
      setIsLoading(false);
      return false;
    }
    if (values.password !== values.confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      setIsLoading(false);
      return false;
    }

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.displayName.replace(/\s+/g, ''), // Đảm bảo username không có khoảng trắng
          email: values.usernameOrEmail,
          fullname: values.fullname,
          password: values.password,
          confirmPassword: values.confirmPassword
        })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Response is not JSON:", text);
        }
      }

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Response is not JSON:", text);
        }
      }

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn("Response is not JSON:", text);
        }
      }

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

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsGoogleLoading(false);
    message.success('Đăng nhập bằng Google thành công!');
    localStorage.setItem('accessToken', 'google_mock_token');
    onLoginSuccess('vuongbaovipvip@gmail.com');
  };

  return { isLoading, isGoogleLoading, errorMsg, setErrorMsg, showPassword, setShowPassword, handleLogin, handleRegister, handleVerifyRegisterOtp, handleResendRegisterOtp, handleGoogleLogin };
}
