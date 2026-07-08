import { Form } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

export default function ResetPasswordForm({ formik, isLoading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={formik.handleSubmit}>
      <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
        {/* New Password */}
      <motion.div variants={ANIM.child}>
        <Form.Item 
          validateStatus={formik.touched.newPassword && formik.errors.newPassword ? 'error' : ''}
          help={formik.touched.newPassword && formik.errors.newPassword ? formik.errors.newPassword : ''}
          className="!mb-3.5"
        >
          <div className="group">
            <label className={LABEL_CLS}>Mật khẩu mới</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="newPassword"
                autoComplete="new-password" 
                placeholder="Ít nhất 6 ký tự"
                className={INPUT_CLS_PR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newPassword}
              />
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
        <Form.Item 
          validateStatus={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
          help={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : ''}
          className="!mb-3.5"
        >
          <div className="group">
            <label className={LABEL_CLS}>Xác nhận mật khẩu</label>
            <div className="relative">
              <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                name="confirmPassword"
                autoComplete="new-password" 
                placeholder="Nhập lại mật khẩu mới"
                className={INPUT_CLS_PR}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/25 hover:text-black/50 transition-colors cursor-pointer">
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-[13px]`} />
              </button>
            </div>
          </div>
        </Form.Item>
      </motion.div>

      <motion.div variants={ANIM.child} className="mt-6">
        <motion.button
          whileHover={{ scale: 1.005, opacity: 0.92 }}
          whileTap={{ scale: 0.997 }}
          type="submit"
          disabled={isLoading}
          className="w-full h-[42px] text-white bg-gradient-to-b from-[#ff7a00] to-[#ff5c00] font-medium rounded-[12px] text-[13.5px] border-none shadow-[0_1px_3px_rgba(255,92,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Cập nhật mật khẩu</span>
              <i className="bi bi-check2 text-[15px] opacity-70" />
            </>
          )}
        </motion.button>
      </motion.div>
      </motion.div>
    </form>
  );
}
