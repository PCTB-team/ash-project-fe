import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, message } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function GroupHeader({ group, isOwner, maxMembers }) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const copyInviteLink = () => {
    const link = group.inviteLink || group.inviteToken || `${window.location.origin}/join?token=${group.id}`;
    navigator.clipboard.writeText(link);
    message.success('Đã copy Link tham gia!');
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/dashboard/group')}
        className="mb-5 text-black/50 hover:text-[var(--color-primary)] font-medium text-[13px] flex items-center gap-2 transition-all hover:-translate-x-1 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">
          <i className="bi bi-arrow-left" />
        </div>
        Quay lại cộng đồng
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-[28px] bg-gradient-to-br from-[var(--color-primary)] to-[#1a1a1a] p-[2px] shadow-xl shadow-[var(--color-primary)]/10 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/5 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
        <div className="bg-[var(--color-surface)] rounded-[26px] p-6 md:p-7 flex flex-col xl:flex-row justify-between items-start gap-6 relative z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 max-w-3xl relative z-10 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                <i className="bi bi-diagram-3-fill text-[18px]" />
              </div>
              <div>
                {isOwner && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full text-[9px] font-semibold text-white uppercase tracking-widest shadow-sm mb-1">
                    <i className="bi bi-star-fill text-[8px]" /> Leader
                  </span>
                )}
                <h2 className="text-[20px] md:text-[24px] font-semibold tracking-tight text-[var(--color-on-surface)] leading-tight">{group.name}</h2>
              </div>
            </div>
            <p className="text-[13px] text-black/55 font-medium leading-relaxed max-w-2xl">{group.description}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Tooltip title="Copy Link tham gia">
                <button onClick={copyInviteLink}
                  className="flex items-center gap-2 bg-[#f5f5f7] hover:bg-[#ebebef] border border-black/[0.04] rounded-xl px-3 py-2 transition-all group/btn cursor-pointer shadow-sm">
                  <i className="bi bi-link-45deg text-[#007aff] text-[14px]" />
                  <span className="text-[12px] font-medium text-black/60 group-hover/btn:text-[#007aff] truncate max-w-[100px]">Copy Link</span>
                </button>
              </Tooltip>
              {isOwner && (
                <div className="flex items-center gap-2 bg-[#f5f5f7] border border-black/[0.04] rounded-xl px-3 py-2 shadow-sm">
                  <i className="bi bi-key text-amber-500 text-[14px]" />
                  <span className="text-[12px] font-medium text-black/60 truncate max-w-[100px]">
                    {showPassword ? (group.password || '123456') : '••••••••'}
                  </span>
                  <button onClick={() => setShowPassword(!showPassword)} className="text-black/40 hover:text-black/70 cursor-pointer ml-1">
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full xl:w-64 bg-[var(--color-surface-container-low)] border border-black/[0.04] rounded-[20px] p-4 flex flex-col gap-3 shadow-sm shrink-0 z-10">
            <h4 className="text-[10px] font-semibold text-black/40 uppercase tracking-widest">Thống kê</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[var(--color-surface)] rounded-[14px] p-3 border border-black/5">
                <i className="bi bi-people-fill text-[var(--color-primary)] text-[14px] mb-1 block" />
                <span className="text-[16px] font-semibold text-[var(--color-on-surface)] block leading-none">{group.memberCount || group.members?.length || 0} / {maxMembers}</span>
                <span className="text-[9px] font-medium text-black/40">Thành viên</span>
              </div>
              <div className="bg-[var(--color-surface)] rounded-[14px] p-3 border border-black/5">
                <i className="bi bi-folder2-open text-blue-500 text-[14px] mb-1 block" />
                <span className="text-[16px] font-semibold text-[var(--color-on-surface)] block leading-none">{group.fileCount || group.activeFileCount || group.documents?.length || 0}</span>
                <span className="text-[9px] font-medium text-black/40">Tài liệu</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
