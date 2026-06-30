import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useGroups } from '../hooks/useGroups';
import GroupCard from '../components/shared/GroupCard';
import CreateGroupModal from '../components/shared/CreateGroupModal';
import JoinGroupModal from '../components/shared/JoinGroupModal';
import EmptyState from '../components/shared/EmptyState';



import { useNavigate, useOutletContext } from 'react-router-dom';

export default function CommunityScreen() {
  const navigate = useNavigate();
  const { searchTerm = '', fullName: currentUser } = useOutletContext();
  const { groups, totalGroups, isLoading, fetchMyGroups, createGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Refetch when page or searchTerm changes
  useEffect(() => {
    fetchMyGroups(currentPage - 1, pageSize, searchTerm);
  }, [fetchMyGroups, currentPage, searchTerm]);

  // Reset pagination to page 1 when global search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateGroup = async (values) => {
    const res = await createGroup({ name: values.name, description: values.description, password: values.password });
    setCurrentPage(1); // will trigger useEffect to fetch page 1
    return res;
  };

  const onViewDetail = (groupId, groupData) => navigate(`/dashboard/group/${groupId}`, { state: { groupData } });
  const onRequestJoin = () => setShowJoinModal(true);

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-4 shadow-sm animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-black/[0.04] shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-black/[0.04] rounded-lg w-1/3" />
        <div className="h-3 bg-black/[0.04] rounded-lg w-1/2" />
      </div>
      <div className="w-20 h-9 rounded-xl bg-black/[0.04] shrink-0" />
    </div>
  );

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-6 pb-10 pt-4 text-left select-none relative bg-transparent max-w-[1100px] mx-auto">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[#1a1a1a] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-5 shadow-sm relative overflow-hidden">
        <div className="text-left space-y-2 relative z-10 max-w-2xl">
          <span className="text-[10px] font-medium uppercase text-white/80 bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-md border border-white/10">Cộng đồng AI Study</span>
          <h3 className="text-[20px] md:text-xl font-semibold">Nhóm học tập</h3>
          <p className="text-[13px] text-white/75 font-medium leading-relaxed max-w-xl">Quản lý nhóm học tập và chia sẻ tài nguyên cùng bạn bè.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
          <button onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-white text-[var(--color-primary)] font-medium text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <i className="bi bi-plus-lg mr-1.5" /> Tạo nhóm mới
          </button>
          <button onClick={() => setShowJoinModal(true)}
            className="w-full sm:w-auto bg-white/15 text-white font-medium text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98]">
            <i className="bi bi-box-arrow-in-right mr-1.5" /> Tham gia nhóm
          </button>
        </div>
      </motion.div>



      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)]">Danh sách nhóm</h4>
            <span className="text-[12px] font-medium text-black/35">{totalGroups || 0} nhóm</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : groups.length > 0 ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <AnimatePresence>
                  {groups.map(grp => (
                    <GroupCard key={grp.id} group={grp} currentUser={currentUser} onViewDetail={onViewDetail} onRequestJoin={onRequestJoin} />
                  ))}
                </AnimatePresence>
              </motion.div>
              {totalGroups > pageSize && (
                <div className="flex justify-center pt-4">
                  <Pagination current={currentPage} total={totalGroups} pageSize={pageSize} onChange={setCurrentPage} className="custom-modern-pagination" />
                </div>
              )}
            </>
          ) : (
            <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl shadow-sm">
              <EmptyState type="noGroups" title="Chưa có nhóm nào" description="Chưa có nhóm học tập nào. Hãy tạo nhóm đầu tiên hoặc tham gia nhóm từ link mời!"
                actionText="Tạo nhóm mới" onAction={() => setShowCreateModal(true)} />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[var(--color-surface)] border border-black/[0.04] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <h4 className="text-[13px] font-semibold text-[var(--color-on-surface)] mb-5 flex items-center gap-2">
              <i className="bi bi-bar-chart-fill text-[var(--color-primary)]" /> Thống kê cộng đồng
            </h4>
            <div className="space-y-3 relative z-10">
              {[
                { label: 'Nhóm học tập', num: groups.length, icon: 'bi-chat-square-text', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Nhóm của tôi', num: groups.filter(g => g.role === 'LEADER').length, icon: 'bi-person-workspace', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
                { label: 'Đã tham gia', num: groups.filter(g => g.role === 'MEMBER').length, icon: 'bi-people', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-surface-container-low)] border border-black/[0.02] hover:bg-[var(--color-surface)] hover:border-black/[0.05] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                      <i className={`bi ${s.icon} text-[14px]`} />
                    </div>
                    <span className="text-[12px] font-medium text-black/65">{s.label}</span>
                  </div>
                  <span className={`text-[13px] font-semibold ${s.color}`}>{s.num}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <CreateGroupModal open={showCreateModal} onCancel={() => setShowCreateModal(false)} onCreate={handleCreateGroup} />
      <JoinGroupModal open={showJoinModal} onCancel={() => setShowJoinModal(false)} onJoinSuccess={() => setCurrentPage(1)} />
    </div>
  );
}
