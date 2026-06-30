import { Form, Checkbox, ConfigProvider } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { INPUT_CLS, INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

/**
 * LoginForm — Apple-style login form fields with Formik & Yup.
 */
export default function LoginForm({ formik, showPassword, setShowPassword }) {
  const navigate = useNavigate();
  return (
    <>
      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? 'error' : ''}
          help={formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? formik.errors.usernameOrEmail : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Email hoặc tên đăng nhập</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person text-[14px]" /></span>
              <input type="text" name="usernameOrEmail" autoComplete="username" placeholder="name@example.com"
                className={INPUT_CLS}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.usernameOrEmail} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
          help={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="••••••••"
                className={INPUT_CLS_PR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50 transition-colors cursor-pointer">
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-[13px]`} />
              </button>
            </div>
          </div>
        </Form.Item>
      </motion.div>

      <motion.div variants={ANIM.child} className="flex items-center justify-between mb-1 -mt-1">
        <Form.Item>
          <ConfigProvider theme={{ token: { colorPrimary: '#ff5c00' } }}>
            <Checkbox 
              name="remember" 
              checked={formik.values.remember}
              onChange={formik.handleChange}
              className="text-[11.5px] font-normal text-black/40 select-none">
              Ghi nhớ
            </Checkbox>
          </ConfigProvider>
        </Form.Item>
        <button type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-[11.5px] font-medium text-[#ff5c00] hover:text-[#e05000] transition-colors cursor-pointer">
          Quên mật khẩu?
        </button>
      </motion.div>
    </>
  );
}
