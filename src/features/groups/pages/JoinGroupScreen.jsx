import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroupPreview, joinGroupViaInvite } from '../api/groups.api';

export default function JoinGroupScreen() {
  const { inviteToken } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupPreview, setGroupPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const data = await getGroupPreview(inviteToken);
        setGroupPreview(data.result || data);
      } catch (err) {
        message.error('Link mời không hợp lệ hoặc đã hết hạn.');
        navigate('/dashboard'); // Go back if invalid
      } finally {
        setIsLoading(false);
      }
    };
    if (inviteToken) fetchPreview();
  }, [inviteToken, navigate]);

  const handleJoin = async (values) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Redirect to login, passing the current URL as redirect
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      message.info('Vui lòng đăng nhập để tham gia nhóm.');
      return;
    }

    setJoining(true);
    try {
      await joinGroupViaInvite(inviteToken, values.password);
      setStep(2); // Success step
    } catch (err) {
      if (err.message === 'WRONG_PASSWORD') message.error('Mật khẩu nhóm không chính xác.');
      else if (err.message === 'ALREADY_MEMBER') {
        message.warning('Bạn đã là thành viên hoặc đang chờ duyệt.');
        navigate('/dashboard/group');
      }
      else message.error('Lỗi khi tham gia nhóm.');
    } finally {
      setJoining(false);
    }
  };

  const slideVariants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#ff5c00]/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-[#ff8a00]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-[#ff5c00]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[460px] bg-white/70 backdrop-blur-xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white overflow-hidden relative z-10"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#ff8a00] to-[#ff5c00] px-8 py-8 flex flex-col items-center justify-center relative overflow-hidden text-center">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white backdrop-blur-md shadow-sm z-10 mb-4">
            <i className={`bi ${step === 2 ? 'bi-check-circle-fill' : 'bi-diagram-3'} text-[32px]`} />
          </div>
          <div className="z-10">
            <h2 className="text-[22px] font-bold text-white mb-1">
              {step === 1 ? 'Tham gia Nhóm' : 'Gia nhập thành công'}
            </h2>
            <p className="text-[13px] font-medium text-white/80">
              {step === 1 ? 'Vui lòng nhập mật khẩu để tiếp tục' : 'Chào mừng bạn đến với nhóm!'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <i className="bi bi-arrow-repeat animate-[spin_1.5s_linear_infinite] text-[32px] text-[#ff5c00]" />
              <p className="text-[14px] font-medium text-black/40">Đang tải thông tin nhóm...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {step === 1 && groupPreview && (
                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>

                  {/* Group Info Card */}
                  <div className="p-5 rounded-[20px] bg-[#f8f9fa] border border-black/[0.04] mb-6 shadow-inner">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 min-w-0 text-center">
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] truncate mb-1">
                          {groupPreview.groupName || groupPreview.name}
                        </h3>
                        <p className="text-[12px] text-black/50 font-medium">
                          <i className="bi bi-person-fill mr-1" /> Trưởng nhóm: {groupPreview.ownerName || groupPreview.owner || 'N/A'}
                        </p>
                      </div>
                    </div>
                    {groupPreview.description && (
                      <div className="text-[13px] text-black/60 font-medium text-center leading-relaxed mt-3 px-2 border-t border-black/5 pt-3">
                        {groupPreview.description}
                      </div>
                    )}
                  </div>

                  <Form layout="vertical" onFinish={handleJoin} requiredMark={false} className="space-y-4">
                    <Form.Item
                      label={<span className="text-[12px] font-bold text-black/60 uppercase tracking-wider">Mật khẩu nhóm</span>}
                      name="password"
                      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                      className="mb-0"
                    >
                      <Input.Password
                        placeholder="Nhập mật khẩu do Leader cung cấp"
                        className="h-14 rounded-[16px] bg-white border border-black/10 hover:border-[#ff5c00]/40 focus:border-[#ff5c00] text-[14px] font-semibold focus:shadow-[0_0_0_3px_rgba(255,92,0,0.1)] transition-all"
                      />
                    </Form.Item>

                    <div className="pt-2">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={joining}
                        className="w-full !h-14 !rounded-[16px] !font-bold !text-[15px] !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white hover:!opacity-90 !shadow-[0_4px_14px_rgba(255,92,0,0.3)] transition-all"
                      >
                        Tham gia nhóm <i className="bi bi-arrow-right ml-2" />
                      </Button>
                      <Button
                        type="text"
                        onClick={() => navigate('/dashboard')}
                        className="w-full !h-12 !rounded-[16px] !font-medium !text-[13px] !text-black/50 mt-3 hover:!bg-black/5"
                      >
                        Quay lại trang chủ
                      </Button>
                    </div>
                  </Form>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <div className="text-center py-6 space-y-5">
                    <div className="w-20 h-20 bg-[#34c759]/10 rounded-full flex items-center justify-center mx-auto border border-[#34c759]/20 shadow-inner">
                      <i className="bi bi-check-lg text-[36px] text-[#34c759]" />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-bold text-[#1d1d1f] mb-2">Chào mừng thành viên mới!</h4>
                      <p className="text-[14px] text-black/50 font-medium leading-relaxed max-w-[280px] mx-auto">
                        Bạn đã gia nhập nhóm <strong>{groupPreview?.groupName || groupPreview?.name}</strong> thành công.
                      </p>
                    </div>
                    <Button
                      type="primary"
                      onClick={() => navigate(`/dashboard/group/${groupPreview?.groupId || groupPreview?.id}`)}
                      className="w-full !h-14 !rounded-[16px] !font-bold !text-[15px] !bg-gradient-to-b !from-[#ff7a00] !to-[#ff5c00] !border-none !text-white hover:!opacity-90 !shadow-[0_4px_14px_rgba(255,92,0,0.3)] transition-all mt-4"
                    >
                      Vào nhóm ngay <i className="bi bi-arrow-right ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
