import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Modal } from 'antd';
import EmptyState from '../shared/EmptyState';

export default function GroupMembersTab({ group, currentUser, isOwner, onTogglePermission, onKick }) {
  const [search, setSearch] = useState('');
  const members = group.members || [];

  const filtered = members.filter(m => {
    const name = (m.fullName || m.email || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const handleKick = (member) => {
    Modal.confirm({
      title: 'Xóa thành viên',
      content: `Bạn có chắc muốn xóa "${member.fullName || member.email?.split('@')[0]}" khỏi nhóm?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true, className: '!rounded-xl' },
      cancelButtonProps: { className: '!rounded-xl' },
      centered: true,
      onOk: () => onKick(group.id, member.memberId || member.id),
    });
  };

  return (
    <motion.div key="members" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-[16px] text-[var(--color-on-surface)]">
            Thành viên <span className="text-black/30 font-normal text-[14px]">({members.length})</span>
          </h4>
        </div>
        <div className="relative w-full sm:w-auto sm:min-w-[220px]">
          <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 text-[13px]" />
          <Input placeholder="Tìm thành viên..." value={search} onChange={e => setSearch(e.target.value)}
            className="!pl-10 !h-10 !rounded-xl !bg-[var(--color-surface-container-low)] !border-black/[0.06] !text-[13px] !font-medium" />
        </div>
      </div>

      {/* Member List */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl shadow-sm">
          <EmptyState type="noMembers" title="Không tìm thấy" description="Không có thành viên nào phù hợp với tìm kiếm." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((member, idx) => {
            const isLeader = member.role === 'leader' || member.role === 'LEADER' || member.email === group.owner;
            const isSelf = member.email === currentUser;
            const displayName = member.fullName || member.email?.split('@')[0] || 'User';

            return (
              <motion.div key={member.memberId || member.email || member.id || idx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                className="flex items-center p-4 rounded-[18px] border border-black/[0.03] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/15 hover:shadow-sm transition-all group">
                {/* Avatar */}
                <div className="relative mr-3.5 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)] font-semibold text-[14px] border border-black/5">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-[#34c759]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[13.5px] text-[var(--color-on-surface)] truncate">{displayName}</span>
                    {isSelf && <span className="bg-black/5 text-black/50 text-[9px] font-semibold px-2 py-0.5 rounded-full">Bạn</span>}
                  </div>
                  <div className="text-[11px] text-black/35 font-medium truncate mt-0.5">{member.email}</div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {isOwner && !isLeader && !isSelf && (
                    <>
                      <button onClick={() => onTogglePermission(group.id, member.memberId || member.id, !member.canUpload)}
                        className={`h-7 px-2.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${member.canUpload ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20' : 'text-black/40 bg-black/[0.02] border-black/[0.06] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]' }`}>
                        <i className={`bi ${member.canUpload ? 'bi-cloud-check-fill' : 'bi-cloud-arrow-up'}`} />
                        {member.canUpload ? 'Upload ✓' : 'Upload'}
                      </button>
                      <button onClick={() => handleKick(member)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-black/25 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                        <i className="bi bi-person-dash text-[12px]" />
                      </button>
                    </>
                  )}
                  {isLeader ? (
                    <span className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 font-medium text-[10px] uppercase rounded-full px-3 py-1 flex items-center gap-1">
                      <i className="bi bi-star-fill text-[8px]" /> Leader
                    </span>
                  ) : (
                    <span className="bg-black/[0.03] text-black/40 font-medium text-[10px] uppercase rounded-full px-2.5 py-1">Member</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
