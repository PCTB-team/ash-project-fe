import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useGroups } from '../../hooks/useGroups';

export default function JoinGroupModal({ open, onCancel, onJoinSuccess }) {
  const { previewGroup, joinViaInvite, groupPreview, isLoading } = useGroups();
  const [step, setStep] = useState(1);
  const [inviteToken, setInviteToken] = useState('');
  const [joining, setJoining] = useState(false);

  const handlePreview = async () => {
    if (!inviteToken.trim()) return;
    // Extract token from full URL if pasted
    let token = inviteToken.trim();
    const match = token.match(/[?&]token=([^&]+)/);
    if (match) token = match[1];
    const lastPart = token.split('/').pop();
    if (lastPart) token = lastPart;

    try {
      await previewGroup(token);
      setInviteToken(token);
      setStep(2);
    } catch {
      // Error handled by hook
    }
  };

  const handleJoin = async (values) => {
    setJoining(true);
    try {
      await joinViaInvite(inviteToken, values.password);
      setStep(3);
      if (onJoinSuccess) onJoinSuccess();
    } catch {
      // Error handled by hook
    } finally {
      setJoining(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setInviteToken('');
    onCancel();
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={440} destroyOnHidden centered
      styles={{ body: { padding: 0 } }}
      closeIcon={<i className="bi bi-x-circle-fill text-[20px] text-white/50 hover:text-white transition-colors" />}
      className="!p-0 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-6 py-5 flex items-center gap-4 relative overflow-hidden rounded-t-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-xl z-10">
          <i className={`bi ${step === 3 ? 'bi-hourglass-split' : 'bi-box-arrow-in-right'} text-[24px]`} />
        </div>
        <div className="text-left text-white z-10">
          <h3 className="text-[18px] font-semibold tracking-tight leading-tight">
            {step === 1 ? 'Tham gia Nhóm' : step === 2 ? 'Nhập mật khẩu' : 'Đang chờ duyệt'}
          </h3>
          <p className="text-[10px] font-medium text-white/80 uppercase tracking-widest mt-0.5">
            {step === 3 ? 'Yêu cầu đã gửi' : `Bước ${step} / 2`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 bg-[#fcfcfd] overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="pt-5 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-black/60 uppercase tracking-widest block mb-2">Link mời hoặc Token</label>
                  <Input value={inviteToken} onChange={e => setInviteToken(e.target.value)} onPressEnter={handlePreview}
                    placeholder="Dán link mời hoặc nhập mã token"
                    className="h-12 rounded-xl bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] focus:shadow-[0_0_0_2px_rgba(255,92,0,0.1)] text-[13px] font-semibold" />
                </div>
                <div className="flex gap-2.5 pt-2 justify-end">
                  <Button onClick={handleClose} className="!rounded-full !font-medium !text-[13px] !h-10 !px-6 !border-black/10 !text-black/60">Hủy</Button>
                  <Button type="primary" onClick={handlePreview} loading={isLoading} disabled={!inviteToken.trim()}
                    className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-lg">
                    Xem trước <i className="bi bi-arrow-right ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="pt-5 space-y-4">
                {/* Group Preview Card */}
                {groupPreview && (
                  <div className="p-4 rounded-[18px] bg-white border border-black/[0.04] shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-[14px] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <i className="bi bi-diagram-3 text-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[15px] font-semibold text-[var(--color-on-surface)] truncate">{groupPreview.name || groupPreview.groupName}</h5>
                        <p className="text-[11px] text-black/40 font-medium truncate">{groupPreview.ownerName || groupPreview.owner || 'Leader'}</p>
                      </div>
                    </div>
                    {groupPreview.description && (
                      <p className="text-[12px] text-black/50 font-medium leading-relaxed line-clamp-2">{groupPreview.description}</p>
                    )}
                  </div>
                )}

                <Form layout="vertical" onFinish={handleJoin} requiredMark={false}>
                  <Form.Item label={<span className="text-[11px] font-semibold text-black/60 uppercase tracking-widest">Mật khẩu nhóm</span>}
                    name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]} className="mb-0">
                    <Input.Password placeholder="Nhập mật khẩu do Leader cung cấp"
                      className="h-12 rounded-xl bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] text-[13px] font-semibold" />
                  </Form.Item>
                  <div className="flex gap-2.5 pt-5 justify-between">
                    <Button onClick={() => setStep(1)} className="!rounded-full !font-medium !text-[13px] !h-10 !px-6 !border-black/10 !text-black/60">
                      <i className="bi bi-arrow-left mr-1" /> Quay lại
                    </Button>
                    <Button type="primary" htmlType="submit" loading={joining}
                      className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-lg">
                      Gửi yêu cầu <i className="bi bi-arrow-right ml-1" />
                    </Button>
                  </div>
                </Form>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                  <i className="bi bi-hourglass-split text-[28px] text-amber-500" />
                </div>
                <h4 className="text-[16px] font-semibold text-[var(--color-on-surface)]">Đang chờ Leader duyệt</h4>
                <p className="text-[13px] text-black/50 font-medium max-w-xs mx-auto">
                  Yêu cầu tham gia đã được gửi. Bạn sẽ trở thành thành viên khi Leader duyệt.
                </p>
                <Button type="primary" onClick={handleClose}
                  className="!rounded-full !font-medium !text-[13px] !h-10 !px-8 !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white !shadow-lg mt-2">
                  Đã hiểu
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
