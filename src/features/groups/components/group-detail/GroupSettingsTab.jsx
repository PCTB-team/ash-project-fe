import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Modal, message, Input } from 'antd';

export default function GroupSettingsTab({ group, onRegenerateInvite, onUpdatePassword, onLeaveGroup, currentUser, isOwner }) {
  const [regenerating, setRegenerating] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const copyInviteLink = () => {
    const link = group.inviteLink || group.inviteToken || '';
    navigator.clipboard.writeText(link);
    message.success('Đã copy Link tham gia!');
  };

  const handleRegenerate = () => {
    Modal.confirm({
      title: 'Tạo Link mời mới?',
      content: 'Link mời hiện tại sẽ bị vô hiệu hóa. Tất cả các link đã chia sẻ trước đó sẽ không còn sử dụng được.',
      okText: 'Tạo mới',
      cancelText: 'Hủy',
      okButtonProps: { className: '!rounded-xl !bg-[var(--color-primary)] !border-none', danger: false },
      cancelButtonProps: { className: '!rounded-xl' },
      centered: true,
      onOk: async () => {
        setRegenerating(true);
        try { await onRegenerateInvite(group.id); }
        finally { setRegenerating(false); }
      },
    });
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      message.warning('Vui lòng nhập mật khẩu mới');
      return;
    }
    setChangingPassword(true);
    try {
      await onUpdatePassword(group.id, newPassword, newPassword);
      setNewPassword('');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {/* General */}
      <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-6 shadow-sm">
        <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)] mb-5 flex items-center gap-2">
          <i className="bi bi-gear text-black/40" /> Thông tin chung
        </h4>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.03]">
            <div className="text-[11px] font-semibold text-black/40 uppercase w-24 pt-0.5 shrink-0">Tên nhóm</div>
            <div className="text-[14px] font-medium text-[var(--color-on-surface)]">{group.name}</div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.03]">
            <div className="text-[11px] font-semibold text-black/40 uppercase w-24 pt-0.5 shrink-0">Mô tả</div>
            <div className="text-[13px] font-medium text-black/60 leading-relaxed">{group.description || '—'}</div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.03]">
            <div className="text-[11px] font-semibold text-black/40 uppercase w-24 pt-0.5 shrink-0">Chủ nhóm</div>
            <div className="text-[14px] font-medium text-[var(--color-on-surface)]">{isOwner ? currentUser : (group.ownerName || group.owner || '—')}</div>
          </div>
        </div>
      </div>

      {/* Security */}
      {isOwner && (
        <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-6 shadow-sm">
        <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)] mb-5 flex items-center gap-2">
          <i className="bi bi-shield-lock text-black/40" /> Bảo mật & Mật khẩu
        </h4>
        <div className="p-4 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.03] flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <i className="bi bi-shield-check text-green-500 text-[16px]" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-medium text-[var(--color-on-surface)]">Bảo mật bằng mật khẩu</div>
            <div className="text-[11px] text-black/40 font-medium mt-0.5">Người dùng cần nhập mật khẩu để tham gia nhóm này</div>
          </div>
        </div>

        <div className="p-5 rounded-[18px] bg-[var(--color-surface-container-low)] border border-black/[0.03]">
          <div className="text-[11px] font-semibold text-black/40 uppercase mb-3">Đổi mật khẩu nhóm</div>
          <div className="flex items-center gap-3">
            <Input.Password
              placeholder="Nhập mật khẩu mới..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="!h-10 !rounded-xl !bg-[var(--color-surface)] !border-black/5 flex-1"
            />
            <Button
              type="primary"
              onClick={handleChangePassword}
              loading={changingPassword}
              className="!rounded-xl !font-medium !text-[12px] !h-10 !px-5 !bg-[var(--color-primary)] !border-none"
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </div>
      )}

      {/* Invite Management */}
      {isOwner && (
        <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-6 shadow-sm">
        <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)] mb-5 flex items-center gap-2">
          <i className="bi bi-link-45deg text-black/40" /> Quản lý lời mời
        </h4>
        <div className="p-5 rounded-[18px] bg-[var(--color-surface-container-low)] border border-black/[0.03] mb-4">
          <div className="text-[11px] font-semibold text-black/40 uppercase mb-2">Link tham gia hiện tại</div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--color-surface)] rounded-xl p-3 border border-black/5 font-mono text-[12px] text-[#007aff] font-medium truncate select-all">
              {group.inviteLink || group.inviteToken || 'Chưa có link mời'}
            </div>
            <Button onClick={copyInviteLink}
              className="!rounded-xl !font-medium !text-[12px] !h-10 !px-4 !border-black/10 shrink-0">
              <i className="bi bi-copy mr-1" /> Copy
            </Button>
          </div>
        </div>
        <Button onClick={handleRegenerate} loading={regenerating}
          className="!rounded-xl !font-medium !text-[12px] !h-10 !px-5 !border-[var(--color-primary)]/20 !text-[var(--color-primary)] hover:!bg-[var(--color-primary)]/10 w-full sm:w-auto">
          <i className="bi bi-arrow-repeat mr-1.5" /> Tạo Link mời mới
        </Button>
        <p className="text-[11px] text-amber-500 font-medium mt-3 flex items-center gap-1.5">
          <i className="bi bi-exclamation-triangle-fill" /> Link cũ sẽ không còn hiệu lực sau khi tạo mới
        </p>
      </div>
      )}

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-2xl p-6 bg-red-50/50">
        <h4 className="text-[14px] font-semibold text-red-600 mb-3 flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill" /> Vùng nguy hiểm
        </h4>
        <p className="text-[12px] text-red-500/70 font-medium mb-4">Các hành động trong khu vực này không thể hoàn tác.</p>
        {isOwner ? (
          <Button danger disabled className="!rounded-xl !font-medium !text-[12px] !h-10">
            <i className="bi bi-trash3 mr-1.5" /> Xóa nhóm (Sắp ra mắt)
          </Button>
        ) : (
          <Button danger onClick={onLeaveGroup} className="!rounded-xl !font-medium !text-[12px] !h-10 border-red-500 text-red-500 hover:!bg-red-50 hover:!border-red-500 hover:!text-red-600 transition-colors">
            <i className="bi bi-box-arrow-right mr-1.5" /> Rời khỏi nhóm
          </Button>
        )}
      </div>
    </motion.div>
  );
}
