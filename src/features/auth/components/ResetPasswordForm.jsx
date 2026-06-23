import { Form } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { INPUT_CLS_PR, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

export default function ResetPasswordForm({ form, isLoading, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false} className="[&_.ant-form-item]:!mb-3.5">
      <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
        {/* New Password */}
        <motion.div variants={ANIM.child}>
          <Form.Item name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}>
            <div className="group">
              <label className={LABEL_CLS}>Mật khẩu mới</label>
              <div className="relative">
                <span className={ICON_WRAP}><i className="bi bi-lock text-[14px]" /></span>
                <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Ít nhất 6 ký tự"
                  className={INPUT_CLS_PR}
                  onChange={(e) => { form.setFieldsValue({ newPassword: e.target.value }); form.validateFields(['newPassword', 'confirmPassword']); }} />
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
            { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
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
                <input type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu mới"
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
    </Form>
  );
}
