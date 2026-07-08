import * as Yup from 'yup';

// Kịch bản kiểm tra cho Form Đăng nhập
export const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required('Vui lòng nhập email hoặc tên đăng nhập!'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu!'),
  remember: Yup.boolean()
});

// Kịch bản kiểm tra cho Form Đăng ký
export const registerSchema = Yup.object().shape({
  displayName: Yup.string()
    .min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự!')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập không được chứa khoảng trắng hoặc ký tự đặc biệt!')
    .required('Vui lòng nhập tên đăng nhập!'),
  
  fullname: Yup.string()
    .min(2, 'Họ tên quá ngắn!')
    .required('Vui lòng nhập họ và tên!'),
  
  usernameOrEmail: Yup.string()
    .email('Định dạng email không hợp lệ (VD: user@gmail.com)!')
    .required('Vui lòng nhập email!'),
  
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
    .required('Vui lòng nhập mật khẩu!'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu nhập lại không khớp!')
    .required('Vui lòng xác nhận mật khẩu!')
});

export const forgotPasswordEmailSchema = Yup.object().shape({
  email: Yup.string()
    .email('Định dạng email không hợp lệ (VD: user@gmail.com)!')
    .required('Vui lòng nhập email hợp lệ!')
});

export const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
    .required('Vui lòng nhập mật khẩu mới!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu nhập lại không khớp!')
    .required('Vui lòng xác nhận mật khẩu!')
});

