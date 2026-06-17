import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useGroups } from '../hooks/useGroups';
import GroupCard from '../components/shared/GroupCard';
import CreateGroupModal from '../components/shared/CreateGroupModal';
import JoinGroupModal from '../components/shared/JoinGroupModal';
import EmptyState from '../components/shared/EmptyState';



export default function CommunityScreen({ searchTerm = '', currentUser, onNavigate }) {
  const { groups, isLoading, fetchMyGroups, createGroup } = useGroups();
  const [localSearch, setLocalSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => { fetchMyGroups(); }, [fetchMyGroups]);

  const handleCreateGroup = async (values) => {
    const res = await createGroup({ name: values.name, description: values.description, password: values.password });
    await fetchMyGroups();
    return res;
  };

  const onViewDetail = (groupId, groupData) => onNavigate('group-detail', { groupId, groupData });
  const onRequestJoin = () => setShowJoinModal(true);

  const query = localSearch || searchTerm || '';
  const filteredGroups = groups.filter((grp) => {
    const matchesSearch = grp.name?.toLowerCase().includes(query.toLowerCase());
    return matchesSearch;
  });

  const paginatedGroups = filteredGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Loading skeleton
  const SkeletonCard = () => (
    <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] p-6 shadow-sm animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 rounded-[20px] bg-black/[0.04]" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-black/[0.04] rounded-lg w-2/3" />
          <div className="h-3 bg-black/[0.04] rounded-lg w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-black/[0.04] rounded-lg w-full" />
        <div className="h-3 bg-black/[0.04] rounded-lg w-4/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-black/[0.04] rounded-xl w-16" />
        <div className="h-7 bg-black/[0.04] rounded-xl w-16" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full h-full overflow-y-auto px-4 md:px-8 pb-12 pt-4 text-left select-none relative bg-transparent max-w-[1400px] mx-auto">
      {/* Hero Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 p-8 rounded-[32px] bg-gradient-to-r from-[var(--color-primary)] to-[#1a1a1a] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-[var(--color-primary)]/10 relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[200%] bg-white/5 rounded-full blur-[80px] pointer-events-none transform rotate-45" />
        <div className="text-left space-y-2 relative z-10 max-w-2xl">
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-md border border-white/10">Cộng đồng AI Study</span>
          <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight leading-tight">Nhóm học tập</h3>
          <p className="text-[13px] text-white/75 font-medium leading-relaxed max-w-xl">Quản lý nhóm học tập và chia sẻ tài nguyên cùng bạn bè.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
          <button onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-white text-[var(--color-primary)] font-medium text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <i className="bi bi-plus-lg mr-1.5" /> Tạo nhóm mới
          </button>
          <button onClick={() => setShowJoinModal(true)}
            className="w-full sm:w-auto bg-white/15 text-white font-medium text-[13px] rounded-2xl px-6 py-3.5 cursor-pointer backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98]">
            <i className="bi bi-box-arrow-in-right mr-1.5" /> Tham gia nhóm
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full">
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-black/30 text-[13px]" />
          <input type="text" value={localSearch} onChange={e => { setLocalSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Tìm kiếm nhóm theo tên..."
            className="w-full sm:max-w-md h-11 pl-11 pr-4 rounded-2xl bg-[var(--color-surface)] border border-black/[0.06] text-[13px] font-medium text-[var(--color-on-surface)] focus:outline-none focus:border-[var(--color-primary)]/40 focus:shadow-[0_0_0_3px_rgba(255,92,0,0.08)] transition-all placeholder:text-black/30" />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="text-[14px] font-semibold text-[var(--color-on-surface)] tracking-tight">Danh sách nhóm</h4>
            <span className="text-[12px] font-medium text-black/35">{filteredGroups.length} nhóm</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : paginatedGroups.length > 0 ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence>
                  {paginatedGroups.map(grp => (
                    <GroupCard key={grp.id} group={grp} currentUser={currentUser} onViewDetail={onViewDetail} onRequestJoin={onRequestJoin} />
                  ))}
                </AnimatePresence>
              </motion.div>
              {filteredGroups.length > pageSize && (
                <div className="flex justify-center pt-4">
                  <Pagination current={currentPage} total={filteredGroups.length} pageSize={pageSize} onChange={setCurrentPage} className="custom-modern-pagination" />
                </div>
              )}
            </>
          ) : (
            <div className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] shadow-sm">
              <EmptyState type="noGroups" title="Chưa có nhóm nào" description="Chưa có nhóm học tập nào. Hãy tạo nhóm đầu tiên hoặc tham gia nhóm từ link mời!"
                actionText="Tạo nhóm mới" onAction={() => setShowCreateModal(true)} />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-[var(--color-surface)] border border-black/[0.04] rounded-[24px] p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors duration-500" />
            <h4 className="text-[13px] font-semibold text-[var(--color-on-surface)] tracking-tight mb-5 flex items-center gap-2">
              <i className="bi bi-bar-chart-fill text-[var(--color-primary)]" /> Thống kê cộng đồng
            </h4>
            <div className="space-y-3 relative z-10">
              {[
                { label: 'Nhóm học tập', num: groups.length, icon: 'bi-chat-square-text', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: 'Nhóm của tôi', num: groups.filter(g => g.role === 'LEADER').length, icon: 'bi-person-workspace', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
                { label: 'Đã tham gia', num: groups.filter(g => g.role === 'MEMBER').length, icon: 'bi-people', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-[16px] bg-[var(--color-surface-container-low)] border border-black/[0.02] hover:bg-[var(--color-surface)] hover:border-black/[0.05] transition-all">
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
      <JoinGroupModal open={showJoinModal} onCancel={() => setShowJoinModal(false)} onJoinSuccess={fetchMyGroups} />
    </div>
  );
}
