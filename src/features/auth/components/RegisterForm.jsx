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
            <label className={LABEL_CLS}>Tên đăng nhập (Username)</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person-badge text-[14px]" /></span>
              <input type="text" autoComplete="username" placeholder="nguyenvana"
                className={INPUT_CLS}
                onChange={(e) => { form.setFieldsValue({ displayName: e.target.value }); form.validateFields(['displayName']); }} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Full Name */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Họ và tên</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person-lines-fill text-[14px]" /></span>
              <input type="text" autoComplete="name" placeholder="Nguyễn Văn A"
                className={INPUT_CLS}
                onChange={(e) => { form.setFieldsValue({ fullname: e.target.value }); form.validateFields(['fullname']); }} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Email */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="usernameOrEmail" rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' }
        ]}>
          <div className="group">
            <label className={LABEL_CLS}>Email</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-envelope text-[14px]" /></span>
              <input type="email" autoComplete="email" placeholder="name@example.com"
                className={INPUT_CLS}
                onChange={(e) => { form.setFieldsValue({ usernameOrEmail: e.target.value }); form.validateFields(['usernameOrEmail']); }} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      {/* Password */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="password" rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}>
          <div className="group">
            <label className={LABEL_CLS}>Mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Ít nhất 6 ký tự"
                className={INPUT_CLS_PR}
                onChange={(e) => { form.setFieldsValue({ password: e.target.value }); form.validateFields(['password', 'confirmPassword']); }} />
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
        <Form.Item name="confirmPassword" rules={[
          { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
            },
          }),
        ]}>
          <div className="group">
            <label className={LABEL_CLS}>Xác nhận mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu"
                className={INPUT_CLS_PR}
                onChange={(e) => { form.setFieldsValue({ confirmPassword: e.target.value }); form.validateFields(['confirmPassword']); }} />
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
