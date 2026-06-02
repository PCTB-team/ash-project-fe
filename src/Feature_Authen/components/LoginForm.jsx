import { Form, Checkbox, message } from 'antd';
import { motion } from 'framer-motion';
import { INPUT_CLS, INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

/**
 * LoginForm — Apple-style login form fields.
 * Email/username, password with toggle, remember-me, forgot password.
 */
export default function LoginForm({ form, showPassword, setShowPassword, onNavigate }) {
  return (
    <>
      {/* Email / Username */}
      <motion.div variants={ANIM.child}>
        <Form.Item name="usernameOrEmail" rules={[{ required: true, message: 'Vui lòng điền thông tin đăng nhập!' }]}>
          <div className="group">
            <label className={LABEL_CLS}>Email hoặc tên đăng nhập</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person text-[14px]" /></span>
              <input type="text" autoComplete="username" placeholder="name@example.com"
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
              <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••"
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

      {/* Remember + Forgot */}
      <motion.div variants={ANIM.child} className="flex items-center justify-between mb-1 -mt-1">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox className="text-[11.5px] font-normal text-black/40 select-none">Ghi nhớ</Checkbox>
        </Form.Item>
        <button type="button"
          onClick={() => onNavigate('forgot-password')}
          className="text-[11.5px] font-medium text-[#0071e3] hover:text-[#0077ED] transition-colors cursor-pointer">
          Quên mật khẩu?
        </button>
      </motion.div>
    </>
  );
}
