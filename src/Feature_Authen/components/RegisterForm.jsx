import { Form } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { INPUT_CLS, INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

/**
 * RegisterForm — Apple-style register form fields.
 * Display name, email, password with toggle, confirm password.
 */
export default function RegisterForm({ form, showPassword, setShowPassword }) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      {/* Display Name */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="displayName" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Tên đăng nhập</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person-badge text-[14px]" /></span>
              <input type="text" autoComplete="name" placeholder="Nguyễn Văn A"
                className={INPUT_CLS}
                onChange={(e) => form.setFieldsValue({ displayName: e.target.value })} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Email */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="usernameOrEmail" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Email</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-envelope text-[14px]" /></span>
              <input type="email" autoComplete="email" placeholder="name@example.com"
                className={INPUT_CLS}
                onChange={(e) => form.setFieldsValue({ usernameOrEmail: e.target.value })} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Password */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Ít nhất 6 ký tự"
                className={INPUT_CLS_PR}
                onChange={(e) => form.setFieldsValue({ password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50 transition-colors cursor-pointer">
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-[13px]`} />
              </button>
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Xác nhận mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu"
                className={INPUT_CLS_PR}
                onChange={(e) => form.setFieldsValue({ confirmPassword: e.target.value })} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50 transition-colors cursor-pointer">
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-[13px]`} />
              </button>
            </div>
          </div>
        </Form.Item>
      </motion.div>
    </>
  );
}
