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
export const GOOGLE_LOGIN_API_URL = "http://localhost:8080/api/v1/auth/google-login";

export default function useAuth({ onLoginSuccess, onAdminLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ============================================================================
  // 1. HÀM ĐĂNG NHẬP (LOGIN)
  // Flow: Validate form -> Gọi API -> Nhận Token -> Lưu vào LocalStorage -> Chuyển trang
  // ============================================================================
  const handleLogin = async (values) => {
    setErrorMsg(''); // Xóa lỗi cũ trên giao diện
    setIsLoading(true); // Bật trạng thái loading để vô hiệu hóa nút bấm

    // Bước 1: Kiểm tra dữ liệu đầu vào (không được để trống, độ dài tối thiểu)
    if (!values.usernameOrEmail) { setErrorMsg('Vui lòng điền email hoặc tên đăng nhập.'); setIsLoading(false); return; }
    if (!values.password || values.password.length < 6) { setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự.'); setIsLoading(false); return; }

    // Bước 2: Xử lý ngoại lệ (Tài khoản Admin nội bộ dùng để test)
    if (values.usernameOrEmail === ADMIN_CREDENTIALS.username && values.password === ADMIN_CREDENTIALS.password) {
      message.success('Xác thực quản trị viên thành công!');
      localStorage.setItem('accessToken', 'admin_mock_token');
      onAdminLoginSuccess();
      setIsLoading(false);
      return;
    }

    try {
      // Bước 3: Gửi request POST chứa identifier và password lên Server
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: values.usernameOrEmail,
          password: values.password
        })
      });

      // Bước 4: Xử lý dữ liệu text thành dạng JSON an toàn
      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("Response is not JSON:", text);
        }
      }

      // Bước 5: Kiểm tra kết quả (HTTP Status 2xx hoặc mã logic Backend là 1000)
      if (response.ok || data.code === 1000) {
        // Lấy Token (chìa khóa bảo mật) từ JSON trả về
        const token = data.result?.token || data.token || data.accessToken || data.result?.accessToken;
        const refreshToken = data.result?.refreshToken || data.refreshToken;

        // Lưu chìa khóa này vào kho lưu trữ cục bộ của trình duyệt
        if (token) localStorage.setItem('accessToken', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        message.success('Đăng nhập thành công!');
        // Báo cho App.js biết là đã đăng nhập xong để nó đổi màn hình
        onLoginSuccess(values.usernameOrEmail);
      } else {
        // Bước 6: Xử lý khi đăng nhập sai tài khoản / mật khẩu
        if (response.status === 401 || response.status === 403) {
          setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
        } else {
          setErrorMsg(data.message || 'Đăng nhập thất bại!');
        }
      }
    } catch (error) {
      // Bắt lỗi mất mạng hoặc Server sập
      console.error("Login Error:", error);
      setErrorMsg('Không thể kết nối đến máy chủ.');
    } finally {
      // Dù thành công hay thất bại cũng phải tắt loading
      setIsLoading(false);
    }
  };

  // ============================================================================
  // 2. HÀM ĐĂNG KÝ (REGISTER)
  // Flow: Validate form -> Gọi API tạo tài khoản -> Đợi OTP gửi về Email
  // ============================================================================
  const handleRegister = async (values) => {
    setErrorMsg('');
    setIsLoading(true);

    // Kiểm tra tính hợp lệ cơ bản của form (Frontend Validation)
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
      // Gọi API đăng ký tài khoản mới lên Backend
      const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.displayName.replace(/\s+/g, ''), // Cắt hết dấu cách trong username
          email: values.usernameOrEmail,
          fullname: values.fullname,
          password: values.password,
          confirmPassword: values.confirmPassword
        })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try { data = JSON.parse(text); } catch { console.warn("Response is not JSON:", text); }
      }

      // Xử lý kết quả trả về từ Backend
      if (response.ok || data.code === 1000) {
        message.success('Đã gửi mã xác minh đến email của bạn!');
        return true; // Trả về true để component bên ngoài biết mà chuyển sang màn hình nhập OTP
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

  // ============================================================================
  // 3. HÀM XÁC THỰC MÃ OTP (VERIFY OTP)
  // Flow: Gửi email + mã OTP mà user nhập lên API -> Nhận kết quả từ Backend
  // ============================================================================
  const handleVerifyRegisterOtp = async (email, otp) => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await fetch(VERIFY_REGISTER_OTP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }) // Payload truyền đi
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try { data = JSON.parse(text); } catch { console.warn("Response is not JSON:", text); }
      }

      if (response.ok || data.code === 1000) {
        message.success('Xác minh thành công! Vui lòng đăng nhập.');
        return true; // Xác minh thành công, giao diện sẽ ẩn form OTP đi
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
        } catch {
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

  // ============================================================================
  // 4. HÀM ĐĂNG NHẬP BẰNG GOOGLE (GOOGLE LOGIN)
  // Flow: Người dùng đăng nhập popup Google -> Google trả về credential (Token) -> 
  // Gửi token đó cho Backend của mình kiểm tra -> Lấy JWT Access Token từ Backend.
  // ============================================================================
  const handleGoogleLogin = async (googleCredential) => {
    setIsGoogleLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(GOOGLE_LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: googleCredential, // Token được cấp bởi Google
        })
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try { data = JSON.parse(text); } catch { console.warn("Response is not JSON:", text); }
      }

      if (response.ok || data.code === 1000) {
        // Backend tạo một account hoặc tìm thấy account tương ứng, rồi trả lại Token hệ thống
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

  return { isLoading, isGoogleLoading, errorMsg, setErrorMsg, showPassword, setShowPassword, handleLogin, handleRegister, handleVerifyRegisterOtp, handleResendRegisterOtp, handleGoogleLogin };
}
