import { motion } from 'framer-motion';
import { Tooltip, message } from 'antd';

export default function GroupOverviewTab({ group, isOwner }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('vi-VN');
  };

  const stats = [
    { label: 'Thành viên', value: group.memberCount || group.members?.length || 0, icon: 'bi-people-fill', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
    { label: 'Tài liệu', value: group.fileCount || group.activeFileCount || group.documents?.length || 0, icon: 'bi-folder2-open', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Dung lượng', value: group.storageUsed ? `${(group.storageUsed / 1024 / 1024).toFixed(1)} MB` : '0 MB', icon: 'bi-hdd', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const activities = [
    { icon: 'bi-person-plus-fill', color: 'text-green-500', bg: 'bg-green-500/10', text: 'Thành viên mới tham gia', time: 'Vừa xong' },
    { icon: 'bi-cloud-arrow-up-fill', color: 'text-blue-500', bg: 'bg-blue-500/10', text: 'Tài liệu mới được upload', time: '2 phút trước' },
    { icon: 'bi-shield-check', color: 'text-amber-500', bg: 'bg-amber-500/10', text: 'Quyền upload được cập nhật', time: '5 phút trước' },
  ];

  const copyInviteLink = () => {
    const link = group.inviteLink || `${window.location.origin}/join?token=${group.inviteToken || group.id}`;
    navigator.clipboard.writeText(link);
    message.success('Đã copy Link tham gia!');
  };

  return (
    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#1a1a1a] rounded-[28px] p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/5 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <i className="bi bi-diagram-3-fill text-[24px]" />
            </div>
            <div>
              {isOwner && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full text-[9px] font-semibold text-white uppercase shadow-md mb-1">
                  <i className="bi bi-star-fill text-[8px]" /> Leader
                </span>
              )}
              <h2 className="text-xl font-semibold">{group.name}</h2>
            </div>
          </div>
          <p className="text-[14px] text-white/75 font-medium leading-relaxed max-w-xl mb-6">{group.description}</p>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
              <i className="bi bi-person-circle text-white/70" />
              <span className="text-[12px] font-medium text-white/80">{group.ownerName || group.owner || 'Leader'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
              <i className="bi bi-calendar3 text-white/70" />
              <span className="text-[12px] font-medium text-white/80">{formatDate(group.createdAt)}</span>
            </div>
            <Tooltip title="Nhấp để copy Link tham gia">
              <button onClick={copyInviteLink} className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-xl px-3 py-2 border border-white/15 transition-all cursor-pointer group">
                <i className="bi bi-link-45deg text-white/70 group-hover:text-white" />
                <span className="text-[12px] font-medium text-white/80 group-hover:text-white truncate max-w-[120px]">Copy Link</span>
                <i className="bi bi-copy text-[10px] text-white/40 group-hover:text-white" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-[var(--color-surface)] border border-black/[0.04] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-black/[0.08] transition-all group">
            <div className={`w-10 h-10 ${s.bg} rounded-[14px] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <i className={`bi ${s.icon} ${s.color} text-[16px]`} />
            </div>
            <div className="text-xl font-semibold text-[var(--color-on-surface)] mb-1">{s.value}</div>
            <div className="text-[11px] font-medium text-black/40 uppercase">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-6 shadow-sm">
        <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)] mb-5 flex items-center gap-2">
          <i className="bi bi-activity text-[var(--color-primary)]" /> Hoạt động gần đây
        </h4>
        <div className="space-y-4">
          {activities.map((act, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-surface-container-low)] transition-colors">
              <div className={`w-9 h-9 ${act.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <i className={`bi ${act.icon} ${act.color} text-[14px]`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[var(--color-on-surface)] truncate">{act.text}</p>
                <p className="text-[11px] font-medium text-black/35 mt-0.5">{act.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
