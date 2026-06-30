import { Form } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { INPUT_CLS, INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

/**
 * RegisterForm — Apple-style register form fields with Formik & Yup.
 */
export default function RegisterForm({ formik, showPassword, setShowPassword }) {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  return (
    <>
      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.displayName && formik.errors.displayName ? 'error' : ''}
          help={formik.touched.displayName && formik.errors.displayName ? formik.errors.displayName : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Tên đăng nhập (Username)</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person-badge text-[14px]" /></span>
              <input type="text" name="displayName" autoComplete="username" placeholder="nguyenvana"
                className={INPUT_CLS}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.displayName} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.fullname && formik.errors.fullname ? 'error' : ''}
          help={formik.touched.fullname && formik.errors.fullname ? formik.errors.fullname : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Họ và tên</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-person-lines-fill text-[14px]" /></span>
              <input type="text" name="fullname" autoComplete="name" placeholder="Nguyễn Văn A"
                className={INPUT_CLS}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname} />
            </div>
          </div>
        </Form.Item>
      </motion.div>

      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? 'error' : ''}
          help={formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? formik.errors.usernameOrEmail : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Email</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-envelope text-[14px]" /></span>
              <input type="email" name="usernameOrEmail" autoComplete="email" placeholder="name@example.com"
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
              <input type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" placeholder="Ít nhất 6 ký tự"
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

      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
          help={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ''}
        >
          <div className="group">
            <label className={LABEL_CLS}>Xác nhận mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" autoComplete="new-password" placeholder="Nhập lại mật khẩu"
                className={INPUT_CLS_PR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword} />
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
