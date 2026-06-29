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
        adminApi.getGroups({ page, size: pagination.pageSize, keyword }),
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
    message.info('Tính năng này hiện tại chưa được hỗ trợ bởi Backend.');
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
        <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: 0 }}
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

      {/* Detail Modal */}
      <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} title={null} width={480} 
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden">
        {detailGroup && (
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-20 -mx-6 -mt-5"
              style={{ background: 'linear-gradient(135deg, #141428, #1a1a35, #2d1a45)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
              </div>
            </div>
            <div className="relative z-10 pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-lg"
                  style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.2)' }}>
                  <i className="bi bi-people-fill text-[24px] text-[#6366f1]" />
                </div>
                <h3 className="text-[18px] font-bold m-0">{detailGroup.name}</h3>
                <p className="text-[12px] text-black/35 mt-1">{detailGroup.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-black/[0.02] rounded-2xl p-5 border border-black/[0.04]">
                {[['Trưởng nhóm', detailGroup.leaderName || detailGroup.leader], ['Email trưởng nhóm', detailGroup.leaderEmail || 'N/A'], ['Thành viên', detailGroup.memberCount], ['Tài liệu', detailGroup.fileCount],
                  ['Trạng thái', detailGroup.status],
                  ['Ngày tạo', new Date(detailGroup.createdAt).toLocaleDateString('vi-VN')],
                ].map(([label, val]) => (
                  <div key={label}><p className="text-[10px] text-black/35 font-semibold mb-0.5 uppercase tracking-wider">{label}</p><p className="text-[13px] font-bold m-0">{val}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
