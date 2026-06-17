import { Button, message } from 'antd';
import { motion } from 'framer-motion';

export default function GroupCard({ group, currentUser, onViewDetail, onRequestJoin }) {
  const isOwner = group.role === 'LEADER' || group.owner === currentUser;
  const isMember = group.role === 'MEMBER' || group.isMine || group.members?.some(m => m.email === currentUser);
  const memberCount = group.memberCount || group.members?.length || 0;
  const docCount = group.fileCount || group.activeFileCount || group.documents?.length || 0;

  const copyInviteLink = (e) => {
    e.stopPropagation();
    const link = group.inviteLink || group.inviteToken || '';
    if (link) {
      navigator.clipboard.writeText(link);
      message.success('Đã copy Link tham gia!');
    }
  };

  // Package badge
  const packageType = group.packageType || (group.maxMembers > 30 ? 'premium' : group.maxMembers > 10 ? 'starter' : null);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:shadow-black/[0.04] flex flex-col justify-between cursor-pointer relative transition-all duration-300 overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="w-12 h-12 rounded-[20px] bg-[var(--color-surface-container-high)] flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:bg-[var(--color-primary)]/5 transition-colors">
            <i className="bi bi-diagram-3-fill text-[20px]" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Private badge */}
            <span className="flex items-center gap-1 bg-black/[0.03] text-black/40 px-2 py-0.5 rounded-full border border-black/[0.04]">
              <i className="bi bi-lock-fill text-[8px]" />
              <span className="text-[9px] font-medium uppercase tracking-wider">Private</span>
            </span>
            {/* Package badge */}
            {packageType === 'premium' && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300/30">
                <i className="bi bi-gem text-[8px]" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">Premium</span>
              </span>
            )}
            {packageType === 'starter' && (
              <span className="flex items-center gap-1 bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-200/30">
                <i className="bi bi-rocket-takeoff text-[8px]" />
                <span className="text-[9px] font-semibold uppercase tracking-wider">Starter</span>
              </span>
            )}
            {/* Active indicator */}
            <div className="flex items-center gap-1 bg-[#34c759]/10 text-[#34c759] px-2 py-0.5 rounded-full border border-[#34c759]/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34c759]" />
              </span>
              <span className="text-[9px] font-medium uppercase tracking-wider">Active</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h4 className="text-[16px] font-semibold text-[var(--color-on-surface)] tracking-tight line-clamp-1 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
            {group.name}
          </h4>
          <p className="text-[12.5px] text-black/50 font-medium leading-relaxed line-clamp-2 min-h-[36px]">
            {group.description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-black/55 bg-[var(--color-surface-container-high)] px-2.5 py-1.5 rounded-xl">
            <i className="bi bi-people-fill text-black/35" />
            <span>{memberCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-black/55 bg-[var(--color-surface-container-high)] px-2.5 py-1.5 rounded-xl">
            <i className="bi bi-folder2-open text-black/35" />
            <span>{docCount}</span>
          </div>
          {group.createdAt && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-black/40">
              <i className="bi bi-calendar3 text-[10px]" />
              <span>{group.createdAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-5 mt-4 border-t border-black/[0.04] flex justify-between items-center">
        {(isOwner || isMember) && (
          <button onClick={copyInviteLink}
            className="text-[11px] font-medium text-black/35 hover:text-[#007aff] transition-colors flex items-center gap-1 cursor-pointer">
            <i className="bi bi-link-45deg" /> Copy Link
          </button>
        )}
        <div className="ml-auto">
          {(() => {
            if (isOwner || isMember) {
              return (
                <Button type="text" onClick={() => onViewDetail(group.id, group)}
                  className="font-medium text-[12px] rounded-xl h-9 px-5 bg-[var(--color-primary)]/5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 border-none">
                  Chi tiết <i className="bi bi-arrow-right ml-1" />
                </Button>
              );
            }
            return (
              <Button type="primary" onClick={() => onRequestJoin(group)}
                className="font-medium text-[12px] rounded-xl h-9 px-5 shadow-sm shadow-[var(--color-primary)]/20 border-none bg-[var(--color-primary)]">
                Tham gia
              </Button>
            );
          })()}
        </div>
      </div>
    </motion.div>
  );
}
