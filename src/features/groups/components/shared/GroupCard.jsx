import { Button, message, Tooltip } from 'antd';
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

  const packageType = group.packageType || (group.maxMembers > 30 ? 'premium' : group.maxMembers > 10 ? 'starter' : null);

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-all duration-300 group gap-4"
      onClick={() => (isOwner || isMember) ? onViewDetail(group.id, group) : null}
    >
      {/* Left side: Icon + Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-container-high)] flex items-center justify-center text-[var(--color-primary)] shrink-0 group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
          <i className="bi bi-diagram-3-fill text-[18px]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h4 className="text-[15px] font-semibold text-[var(--color-on-surface)] truncate group-hover:text-[var(--color-primary)] transition-colors">
              {group.name}
            </h4>
            
            {/* Badges */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Tooltip title="Nhóm riêng tư">
                <span className="flex items-center justify-center bg-black/[0.03] text-black/40 w-5 h-5 rounded-md border border-black/[0.04]">
                  <i className="bi bi-lock-fill text-[10px]" />
                </span>
              </Tooltip>
              {packageType === 'premium' && (
                <span className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 px-2 py-0.5 rounded-md border border-amber-300/30">
                  <i className="bi bi-gem text-[9px]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Premium</span>
                </span>
              )}
              {packageType === 'starter' && (
                <span className="flex items-center gap-1 bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md border border-blue-200/30">
                  <i className="bi bi-rocket-takeoff text-[9px]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Starter</span>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-[12px] text-black/50 font-medium">
            <span className="truncate max-w-[200px] sm:max-w-xs">{group.description || 'Không có mô tả'}</span>
            <span className="w-1 h-1 rounded-full bg-black/10 shrink-0" />
            <div className="flex items-center gap-1 shrink-0">
              <i className="bi bi-people-fill" /> {memberCount}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <i className="bi bi-folder2-open" /> {docCount}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2 shrink-0 sm:ml-4 ml-16">
        {(isOwner || isMember) && (
          <Tooltip title="Copy Link mời">
            <Button 
              type="text" 
              onClick={copyInviteLink}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-black/40 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
            >
              <i className="bi bi-link-45deg text-[18px]" />
            </Button>
          </Tooltip>
        )}
        
        {(() => {
          if (isOwner || isMember) {
            return (
              <Button type="text" onClick={(e) => { e.stopPropagation(); onViewDetail(group.id, group); }}
                className="font-semibold text-[12px] rounded-xl h-9 px-4 bg-[var(--color-primary)]/5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 border-none transition-all">
                Vào nhóm
              </Button>
            );
          }
          return (
            <Button type="primary" onClick={(e) => { e.stopPropagation(); onRequestJoin(group); }}
              className="font-semibold text-[12px] rounded-xl h-9 px-5 shadow-sm border-none bg-[var(--color-primary)] transition-all">
              Tham gia
            </Button>
          );
        })()}
      </div>
    </motion.div>
  );
}
