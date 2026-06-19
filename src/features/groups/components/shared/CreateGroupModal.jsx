import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateGroupModal({ open, onCancel, onCreate }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({});
  const [createdGroup, setCreatedGroup] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleStep1 = (values) => {
    setFormValues(values);
    setStep(2);
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await onCreate(formValues);
      const result = res?.result || res || {};
      setCreatedGroup(result);
      setStep(3);
    } catch {
      // Error handled by hook
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setStep(1);
    setFormValues({});
    setCreatedGroup(null);
    onCancel();
  };

  const copyLink = () => {
    const link = createdGroup?.inviteLink || createdGroup?.inviteToken || '';
    navigator.clipboard.writeText(link);
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={500} destroyOnHidden centered
      styles={{ body: { padding: 0 } }}
      closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-white/50 hover:text-white transition-colors" />}
      className="!p-0 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-sm z-10">
          <i className={`bi ${step === 3 ? 'bi-check2-circle' : 'bi-diagram-3-fill'} text-[24px]`} />
        </div>
        <div className="text-left text-white z-10">
          <h3 className="text-[18px] font-semibold">
            {step === 1 ? 'Tạo Nhóm Thảo Luận' : step === 2 ? 'Xác Nhận Thông Tin' : 'Tạo Thành Công!'}
          </h3>
          <p className="text-[10px] font-medium text-white/80 uppercase mt-0.5">
            Bước {step} / 3
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="px-6 pt-5 pb-2 bg-[#fcfcfd] flex items-center gap-2 justify-center">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-[var(--color-primary)]' : s < step ? 'w-4 bg-[var(--color-primary)]/40' : 'w-4 bg-black/10'}`} />
        ))}
      </div>

      {/* Content */}
      <div className="px-6 pb-6 bg-[#fcfcfd] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <Form form={form} layout="vertical" onFinish={handleStep1} requiredMark={false} className="space-y-4 pt-3">
                <Form.Item label={<span className="text-[11px] font-semibold text-black/60 uppercase">Tên nhóm</span>}
                  name="name" rules={[{ required: true, message: 'Vui lòng điền tên nhóm!' }]} className="mb-0">
                  <Input placeholder="VD: Nhóm học Machine Learning K22"
                    className="h-11 rounded-xl bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] focus:shadow-[0_0_0_2px_rgba(255,92,0,0.1)] text-[13px] font-semibold" />
                </Form.Item>
                <Form.Item label={<span className="text-[11px] font-semibold text-black/60 uppercase">Mật khẩu nhóm</span>}
                  name="password" rules={[{ required: true, message: 'Vui lòng đặt mật khẩu!' }, { min: 5, message: 'Mật khẩu >= 5 ký tự!' }]} className="mb-0">
                  <Input.Password placeholder="Tối thiểu 5 ký tự"
                    className="h-11 rounded-xl bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] text-[13px] font-semibold" />
                </Form.Item>
                <Form.Item label={<span className="text-[11px] font-semibold text-black/60 uppercase">Mô tả</span>}
                  name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]} className="mb-0">
                  <Input.TextArea rows={3} placeholder="Mục đích của nhóm..."
                    className="rounded-xl bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] text-[13px] font-semibold resize-none pt-3" />
                </Form.Item>
                <div className="flex gap-2.5 pt-3 justify-end">
                  <Button onClick={handleClose} className="!rounded-full !font-medium !text-[13px] !h-10 !px-6 !border-black/10 !text-black/60">Hủy</Button>
                  <Button type="primary" htmlType="submit"
                    className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-lg">
                    Tiếp theo <i className="bi bi-arrow-right ml-1" />
                  </Button>
                </div>
              </Form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="space-y-3 pt-4">
                {[
                  { label: 'Tên nhóm', value: formValues.name },
                  { label: 'Mô tả', value: formValues.description },
                  { label: 'Giới hạn', value: '10 thành viên (Mặc định)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-3.5 rounded-[14px] bg-white border border-black/[0.04]">
                    <span className="text-[10px] font-semibold text-black/40 uppercase w-20 pt-0.5 shrink-0">{item.label}</span>
                    <span className="text-[13px] font-medium text-[var(--color-on-surface)]">{item.value}</span>
                  </div>
                ))}
                <div className="flex gap-2.5 pt-4 justify-between">
                  <Button onClick={() => setStep(1)} className="!rounded-full !font-medium !text-[13px] !h-10 !px-6 !border-black/10 !text-black/60">
                    <i className="bi bi-arrow-left mr-1" /> Quay lại
                  </Button>
                  <Button type="primary" onClick={handleCreate} loading={creating}
                    className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-lg">
                    Xác nhận tạo nhóm
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="text-center pt-4 space-y-5">
                <div className="w-16 h-16 bg-[#34c759]/10 rounded-full flex items-center justify-center mx-auto border border-[#34c759]/20">
                  <i className="bi bi-check-lg text-[32px] text-[#34c759]" />
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-[var(--color-on-surface)] mb-1">Nhóm đã được tạo!</h4>
                  <p className="text-[12px] text-black/50 font-medium">Gửi Link mời cho bạn bè để tham gia nhóm.</p>
                </div>
                <div className="bg-black/[0.02] border border-black/5 rounded-2xl p-4 text-left">
                  <div className="text-[10px] font-semibold text-black/40 uppercase mb-2">Link tham gia</div>
                  <div className="bg-white p-3 rounded-xl border border-black/5 text-[12px] font-mono font-medium text-[#007aff] break-all select-all">
                    {createdGroup?.inviteLink || createdGroup?.inviteToken || 'Đang tạo link...'}
                  </div>
                </div>
                <div className="flex gap-2.5 justify-center pt-2">
                  <Button onClick={copyLink} className="!rounded-full !font-medium !text-[12px] !h-10 !px-5 !border-black/10">
                    <i className="bi bi-copy mr-1.5" /> Copy Link
                  </Button>
                  <Button type="primary" onClick={handleClose}
                    className="!rounded-full !font-medium !text-[12px] !h-10 !px-6 !bg-[#34c759] hover:!bg-[#2eb350] !border-none !shadow-lg !">
                    Hoàn tất
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
