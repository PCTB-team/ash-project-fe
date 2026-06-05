import { Form } from 'antd';
import { motion } from 'framer-motion';
import { INPUT_CLS, LABEL_CLS, ICON_WRAP, ANIM } from '../utils/constants';

export default function ForgotPasswordEmail({ form, isLoading, onSubmit, onBack }) {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false} className="[&_.ant-form-item]:!mb-4">
      <motion.div variants={ANIM.stagger} initial="initial" animate="animate">
        
        <motion.div variants={ANIM.child}>
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}>
            <div className="group">
              <label className={LABEL_CLS}>Email cá nhân</label>
              <div className="relative">
                <span className={ICON_WRAP}><i className="bi bi-envelope text-[14px]" /></span>
                <input type="email" autoComplete="email" placeholder="name@example.com" className={INPUT_CLS}
                  onChange={(e) => form.setFieldsValue({ email: e.target.value })} />
              </div>
            </div>
          </Form.Item>
        </motion.div>

        <motion.div variants={ANIM.child} className="mt-6 flex flex-col gap-3">
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
                <span>Gửi mã xác minh</span>
                <i className="bi bi-arrow-right text-[13px] opacity-70" />
              </>
            )}
          </motion.button>
          
          <button type="button" onClick={onBack} disabled={isLoading} className="text-[13px] font-medium text-black/50 hover:text-black/80 transition-colors h-[40px]">
            Quay lại đăng nhập
          </button>
        </motion.div>
      </motion.div>
    </Form>
  );
}
