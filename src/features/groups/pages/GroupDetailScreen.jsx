import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useGroups } from '../hooks/useGroups';

import GroupHeader from '../components/group-detail/GroupHeader';
import GroupDetailSidebar from '../components/group-detail/GroupDetailSidebar';
import GroupOverviewTab from '../components/group-detail/GroupOverviewTab';
import GroupDocumentsTab from '../components/group-detail/GroupDocumentsTab';
import GroupMembersTab from '../components/group-detail/GroupMembersTab';
import GroupTrashTab from '../components/group-detail/GroupTrashTab';
import GroupSettingsTab from '../components/group-detail/GroupSettingsTab';
import UploadDocumentModal from '../components/group-detail/UploadDocumentModal';

import { useParams, useLocation, useNavigate, useOutletContext } from 'react-router-dom';

export default function GroupDetailScreen() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName: currentUser } = useOutletContext();
  const initialGroupData = location.state?.groupData;

  const {
    currentGroup, files, trashFiles,
    fetchGroupById, fetchFiles, fetchTrashFiles,
    toggleUploadPermission, kickMember,
    uploadFile, deleteFile, restoreFile, regenerateInvite,
  } = useGroups();

  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (groupId) {
      // Bỏ qua fetchGroupById vì chưa có API này, dùng initialGroupData thay thế
      // fetchFiles(groupId); // Tạm tắt để tránh lỗi 500
    }
  }, [groupId, fetchGroupById, fetchFiles]);

  const group = initialGroupData || currentGroup;

  if (!group) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }
  const isOwner = group.role === 'LEADER' || group.owner === currentUser;
  const currentMember = group.members?.find(m => m.email === currentUser);
  const isMember = isOwner || group.role === 'MEMBER' || group.isMine || !!currentMember;
  const canUpload = isOwner || group.canUpload || currentMember?.canUpload;
  const maxMembers = group.maxMembers || 10;

  // Non-member view
  if (!isMember && !isOwner) {
    return (
      <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 max-w-[1400px] mx-auto">
        <GroupHeader group={group} isOwner={false} maxMembers={maxMembers} />
        <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[32px] p-12 text-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="w-24 h-24 bg-[var(--color-primary)]/5 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-[var(--color-primary)] border border-[var(--color-primary)]/10">
            <i className="bi bi-shield-lock-fill text-[40px]" />
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--color-on-surface)] mb-2 tracking-tight">Khu vực riêng tư</h3>
          <p className="text-[14px] text-black/50 font-medium max-w-md mx-auto mb-8">Nội dung của nhóm chỉ dành cho thành viên chính thức.</p>
          <button onClick={() => navigate('/dashboard/group')}
            className="bg-[var(--color-primary)] text-white font-medium rounded-xl h-12 px-8 shadow-lg shadow-[var(--color-primary)]/20 border-none cursor-pointer hover:opacity-90 transition-all">
            Trở về cộng đồng
          </button>
        </div>
      </div>
    );
  }

  const handleUpload = async (file) => {
    await uploadFile(group.id, file);
    setShowUploadModal(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <GroupOverviewTab group={group} isOwner={isOwner} maxMembers={maxMembers} />;
      case 'documents':
        return <GroupDocumentsTab group={group} files={files} currentUser={currentUser} isOwner={isOwner} canUpload={canUpload} onUpload={() => setShowUploadModal(true)} onDelete={deleteFile} />;
      case 'members':
        return <GroupMembersTab group={group} currentUser={currentUser} isOwner={isOwner} onTogglePermission={toggleUploadPermission} onKick={kickMember} />;
      case 'trash':
        return <GroupTrashTab group={group} trashFiles={trashFiles} fetchTrashFiles={fetchTrashFiles} onRestore={restoreFile} />;
      case 'settings':
        return <GroupSettingsTab group={group} onRegenerateInvite={regenerateInvite} currentUser={currentUser} isOwner={isOwner} />;
      default:
        return <GroupOverviewTab group={group} isOwner={isOwner} maxMembers={maxMembers} />;
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none bg-transparent max-w-[1400px] mx-auto">
      <GroupHeader group={group} isOwner={isOwner} maxMembers={maxMembers} />

      {/* Discord-style Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <div className="xl:col-span-3">
          <GroupDetailSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isOwner={isOwner}
            trashCount={trashFiles.length}
          />
        </div>

        {/* Content */}
        <div className="xl:col-span-9">
          <AnimatePresence mode="wait">
            {renderTab()}
          </AnimatePresence>
        </div>
      </div>

      <UploadDocumentModal
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
