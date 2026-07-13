/* eslint-disable react-hooks/set-state-in-effect */
/**
 * AdminGroups — Premium Group Management with glassmorphism.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Input, Button, Modal, Dropdown, message, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { adminApi } from '../api/admin.api.js';

const GlassMiniCard = ({ icon, label, value, color, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
    <div className="relative rounded-2xl p-4 overflow-hidden group hover:translate-y-[-2px] transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
          style={{ background: `${color}12`, border: `1px solid ${color}10` }}>
          <i className={`bi ${icon} text-[16px]`} style={{ color }} />
        </div>
        <div>
          <p className="text-[10px] text-black/35 font-semibold uppercase tracking-wider m-0">{label}</p>
          <p className="text-[20px] font-extrabold text-[#1d1d1f] m-0 leading-tight">{value}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  </motion.div>
);

const GROUP_COLORS = ['#6366f1', '#8b5cf6', '#ff5c00', '#10b981', '#f43f5e', '#0ea5e9', '#f59e0b', '#ec4899'];

export default function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [detailGroup, setDetailGroup] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchGroups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const [res, statsRes] = await Promise.all([
        adminApi.getGroups({ page, size: pagination.pageSize, keyword }).catch(() => ({ result: { content: [], totalElements: 0 } })),
        adminApi.getGroupStats().catch(() => ({ result: { totalGroups: 0, activeGroupsLast7Days: 0, averageMembersPerGroup: 0 } }))
      ]);
      setGroups(res.result.content);
      setPagination(p => ({ ...p, current: page + 1, total: res.result.totalElements, stats: statsRes.result }));
    } finally { setLoading(false); }
  }, [keyword, pagination.pageSize]);

  useEffect(() => { fetchGroups(0); }, [fetchGroups]);

  const handleDelete = (groupId, name) => {
    Modal.confirm({
      title: 'Xác nhận xóa', content: `Xóa nhóm "${name}"? Tất cả dữ liệu sẽ bị mất.`,
      okText: 'Xóa', cancelText: 'Hủy', okButtonProps: { danger: true },
      onOk: async () => { await adminApi.deleteGroup(groupId); message.success('Đã xóa nhóm'); fetchGroups(pagination.current - 1); },
    });
  };

  const handleToggleStatus = async (groupId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    try {
      await adminApi.updateGroupStatus(groupId, newStatus);
      message.success(`Đã ${newStatus === 'BANNED' ? 'khóa' : 'mở khóa'} nhóm`);
      fetchGroups(pagination.current - 1);
    } catch (e) {
      message.error(e.response?.data?.message || 'Không thể cập nhật trạng thái nhóm');
    }
  };

  const stats = pagination.stats || {};

  const columns = [
    { title: 'Nhóm', key: 'name', render: (_, r, idx) => {
      const color = GROUP_COLORS[idx % GROUP_COLORS.length];
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" 
            style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)`, border: `1px solid ${color}12` }}>
            <i className="bi bi-people-fill text-[16px]" style={{ color }} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#1d1d1f] m-0 leading-tight">{r.name}</p>
            <p className="text-[10px] text-black/30 m-0 max-w-[200px] truncate">{r.description}</p>
          </div>
        </div>
      );
    }, width: 260 },
    { title: 'Trưởng nhóm', key: 'leader', render: (_, r) => (
      <div className="flex items-center gap-2">
        <Avatar size={26} style={{ background: 'linear-gradient(135deg, #ff5c00, #ffaa00)', fontSize: 10, fontWeight: 700 }}>{(r.leaderName || r.leader)?.charAt(0)}</Avatar>
        <span className="text-[12px] font-semibold">{r.leaderName || r.leader}</span>
      </div>
    ), width: 160 },
    { title: 'Thành viên', dataIndex: 'memberCount', render: (v) => (
      <div className="flex items-center gap-1.5 bg-[#6366f1]/8 text-[#6366f1] px-2 py-0.5 rounded-lg w-fit">
        <i className="bi bi-person-fill text-[10px]" />
        <span className="text-[12px] font-bold">{v}</span>
      </div>
    ), width: 100, sorter: (a, b) => a.memberCount - b.memberCount },
    { title: 'Files', dataIndex: 'fileCount', render: (v) => (
      <div className="flex items-center gap-1.5 bg-[#ff5c00]/8 text-[#ff5c00] px-2 py-0.5 rounded-lg w-fit">
        <i className="bi bi-file-earmark-fill text-[10px]" />
        <span className="text-[12px] font-bold">{v}</span>
      </div>
    ), width: 80, sorter: (a, b) => a.fileCount - b.fileCount },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
        s === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}>
        <i className={`bi ${s === 'ACTIVE' ? 'bi-check-circle-fill' : 'bi-lock-fill'} text-[9px]`} />
        {s === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
      </div>
    ), width: 120 },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{new Date(t).toLocaleDateString('vi-VN')}</span>, width: 110 },
    { title: '', key: 'actions', render: (_, r) => (
      <Dropdown menu={{ items: [
        { key: 'view', label: 'Xem chi tiết', icon: <i className="bi bi-eye text-[12px]" />, onClick: () => { setDetailGroup(r); setDetailVisible(true); } },
        { key: 'status', label: r.status === 'ACTIVE' ? 'Khóa nhóm' : 'Mở khóa', icon: <i className={`bi ${r.status === 'ACTIVE' ? 'bi-lock' : 'bi-unlock'} text-[12px]`} />, onClick: () => handleToggleStatus(r.id, r.status) },
        { type: 'divider' },
        { key: 'delete', label: 'Xóa nhóm', icon: <i className="bi bi-trash text-[12px]" />, danger: true, onClick: () => handleDelete(r.id, r.name) },
      ]}} trigger={['click']}>
        <Button type="text" size="small" icon={<i className="bi bi-three-dots-vertical text-[14px]" />} className="!text-black/30 hover:!text-[#ff5c00] !rounded-lg" />
      </Dropdown>
    ), width: 50 },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassMiniCard icon="bi-collection-fill" label="Tổng nhóm" value={stats.totalGroups || 0} color="#6366f1" delay={0} />
        <GlassMiniCard icon="bi-check-circle-fill" label="Hoạt động 7 ngày qua" value={stats.activeGroupsLast7Days || 0} color="#10b981" delay={0.05} />
        <GlassMiniCard icon="bi-people-fill" label="Trung bình thành viên" value={stats.averageMembersPerGroup?.toFixed(1) || 0} color="#ff5c00" delay={0.1} />
        <GlassMiniCard icon="bi-file-earmark-fill" label="Tổng nhóm hiện thị" value={pagination.total} color="#8b5cf6" delay={0.15} />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: 0 } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="p-4 pb-0">
            <Input.Search placeholder="Tìm theo tên nhóm hoặc trưởng nhóm..." allowClear className="!w-[300px] [&_input]:!rounded-xl [&_.ant-input-group-addon]:!rounded-xl"
              onSearch={v => setKeyword(v)} onChange={e => !e.target.value && setKeyword('')} />
          </div>
          <Table dataSource={groups} columns={columns} rowKey="id" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, onChange: (p, ps) => { setPagination(prev => ({ ...prev, pageSize: ps })); fetchGroups(p - 1); } }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>

      {/* Detail Modal — Premium Redesign */}
      <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} title={null} width={500}
        destroyOnClose centered
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden">
        {detailGroup && (() => {
          const color = GROUP_COLORS[groups.indexOf(detailGroup) % GROUP_COLORS.length] || '#6366f1';
          const isActive = detailGroup.status === 'ACTIVE';
          return (
          <div>
            {/* Banner */}
            <div className="relative h-24 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc, #1a1a35)` }}>
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
              <div className="absolute bottom-3 left-8 w-12 h-12 rounded-lg bg-white/5 border border-white/10" style={{ transform: 'rotate(12deg)' }} />
            </div>
            <div className="px-6 pb-6 relative">
              {/* Group Icon */}
              <div className="absolute -top-8 left-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}>
                  <i className="bi bi-people-fill text-[24px] text-white" />
                </div>
              </div>
              <div className="pt-12">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[20px] font-extrabold text-[#1d1d1f] m-0">{detailGroup.name}</h3>
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {isActive ? 'ACTIVE' : 'BANNED'}
                  </div>
                </div>
                <p className="text-[13px] text-black/40 mb-5 font-medium">{detailGroup.description || 'Không có mô tả'}</p>

                {/* Leader Highlight */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl mb-4 border border-black/[0.04]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                  <Avatar size={40} style={{ background: 'linear-gradient(135deg, #ff5c00, #ffaa00)', fontSize: 14, fontWeight: 700 }}>
                    {(detailGroup.leaderName || detailGroup.leader)?.charAt(0)}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#1d1d1f] m-0">{detailGroup.leaderName || detailGroup.leader}</p>
                    <p className="text-[11px] text-black/35 m-0">{detailGroup.leaderEmail || 'N/A'}</p>
                  </div>
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ff5c00]/10 text-[#ff5c00]">Trưởng nhóm</div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {[
                    { icon: 'bi-people-fill', label: 'Thành viên', value: detailGroup.memberCount, color: '#6366f1', bg: '#6366f112' },
                    { icon: 'bi-file-earmark-fill', label: 'Tài liệu', value: detailGroup.fileCount, color: '#ff5c00', bg: '#ff5c0012' },
                    { icon: 'bi-calendar3', label: 'Ngày tạo', value: new Date(detailGroup.createdAt).toLocaleDateString('vi-VN'), color: '#10b981', bg: '#10b98112' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl border border-black/[0.04] text-center" style={{ background: 'rgba(0,0,0,0.012)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ background: item.bg }}>
                        <i className={`bi ${item.icon} text-[14px]`} style={{ color: item.color }} />
                      </div>
                      <p className="text-[9px] text-black/35 font-semibold uppercase tracking-wider m-0 mb-0.5">{item.label}</p>
                      <p className="text-[15px] font-extrabold text-[#1d1d1f] m-0">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                  <Button onClick={() => handleToggleStatus(detailGroup.id, detailGroup.status)}
                    className={`flex-1 !h-10 !rounded-xl !text-[12px] !font-bold !border-none ${isActive ? '!bg-rose-50 !text-rose-500 hover:!bg-rose-100' : '!bg-emerald-50 !text-emerald-600 hover:!bg-emerald-100'}`}>
                    <i className={`bi ${isActive ? 'bi-lock' : 'bi-unlock'} mr-1.5`} /> {isActive ? 'Khóa nhóm' : 'Mở khóa'}
                  </Button>
                  <Button type="primary" onClick={() => setDetailVisible(false)} className="flex-1 !h-10 !rounded-xl !text-[12px] !font-bold !border-none" style={{ background: color }}>
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )})()}
      </Modal>
    </div>
  );
}
