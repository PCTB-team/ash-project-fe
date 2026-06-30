/**
 * AdminUsers — Premium User Management with glassmorphism stats and enhanced table.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Avatar, Input, Select, Button, Modal, Progress, Dropdown, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import { adminApi } from '../api/admin.api.js';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

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

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailUser, setDetailUser] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, size: pagination.pageSize, keyword, role: roleFilter, status: statusFilter });
      setUsers(res.result.content);
      setPagination(p => ({ ...p, current: page + 1, total: res.result.totalElements }));
    } finally { setLoading(false); }
  }, [keyword, roleFilter, statusFilter, pagination.pageSize]);

  useEffect(() => { fetchUsers(0); }, [fetchUsers]);

  const handleStatusChange = async (userId, newStatus) => {
    await adminApi.updateUserStatus(userId, newStatus);
    message.success(`Đã ${newStatus === 'BANNED' ? 'khóa' : 'mở khóa'} tài khoản`);
    fetchUsers(pagination.current - 1);
  };

  const handleRoleChange = async (userId, newRole) => {
    await adminApi.updateUserRole(userId, newRole);
    message.success('Đã thay đổi vai trò');
    fetchUsers(pagination.current - 1);
  };

  const handleDelete = (userId, name) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa tài khoản "${name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa', cancelText: 'Hủy', okButtonProps: { danger: true },
      onOk: async () => { await adminApi.deleteUser(userId); message.success('Đã xóa tài khoản'); fetchUsers(pagination.current - 1); },
    });
  };

  const columns = [
    { title: 'Người dùng', key: 'user', render: (_, r) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar size={40} style={{ 
            background: r.roles?.some(role => role.name === 'ADMIN') ? 'linear-gradient(135deg, #ff5c00, #ffaa00)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
            fontSize: 14, fontWeight: 700, border: '2px solid rgba(255,255,255,0.8)' 
          }}>{r.fullname?.charAt(0)}</Avatar>
          {r.status === 'ACTIVE' && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1d1d1f] m-0 leading-tight">{r.fullname}</p>
          <p className="text-[11px] text-black/35 m-0">{r.email}</p>
        </div>
      </div>
    ), width: 260 },
    { title: 'Vai trò', dataIndex: 'roles', render: (roles) => {
      const isAdmin = roles?.some(role => role.name === 'ADMIN');
      return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
          isAdmin ? 'bg-gradient-to-r from-[#ff5c00]/10 to-[#ffaa00]/10 text-[#ff5c00]' : 'bg-[#6366f1]/8 text-[#6366f1]'
        }`}>
          <i className={`bi ${isAdmin ? 'bi-shield-fill' : 'bi-person-fill'} text-[10px]`} />
          {isAdmin ? 'Admin' : 'User'}
        </div>
      );
    }, width: 110 },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => {
      const cfg = { ACTIVE: { color: '#10b981', bg: '#10b98112', text: 'Hoạt động', icon: 'bi-check-circle-fill' }, BANNED: { color: '#f43f5e', bg: '#f43f5e12', text: 'Bị khóa', icon: 'bi-x-circle-fill' }, INACTIVE: { color: '#94a3b8', bg: '#94a3b812', text: 'Không hoạt động', icon: 'bi-dash-circle' } };
      const c = cfg[s] || cfg.INACTIVE;
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ color: c.color, background: c.bg }}>
          <i className={`bi ${c.icon} text-[9px]`} />
          {c.text}
        </div>
      );
    }, width: 140 },
    { title: 'Storage', key: 'storage', render: (_, r) => {
      const used = r.storageUsed || 0;
      const max = r.storageMax || 1;
      const pct = Math.round((used / max) * 100);
      return (
        <div className="min-w-[120px]">
          <Progress percent={pct} size="small" 
            strokeColor={pct > 80 ? { from: '#f43f5e', to: '#e11d48' } : { from: '#ff5c00', to: '#ffaa00' }} 
            trailColor="rgba(0,0,0,0.04)" className="!mb-0" />
          <p className="text-[10px] text-black/35 mt-0.5 font-medium">{formatBytes(used)} / {formatBytes(max)}</p>
        </div>
      );
    }, width: 160 },
    { title: 'Tài liệu', dataIndex: 'documentsCount', render: (v) => <span className="text-[13px] font-bold text-[#1d1d1f]">{v || 0}</span>, width: 80 },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{t ? new Date(t).toLocaleDateString('vi-VN') : 'N/A'}</span>, width: 110 },
    { title: '', key: 'actions', render: (_, r) => (
      <Dropdown menu={{ items: [
        { key: 'view', label: 'Xem chi tiết', icon: <i className="bi bi-eye text-[12px]" />, onClick: () => { setDetailUser(r); setDetailVisible(true); } },
        { key: 'role', label: r.roles?.some(role => role.name === 'ADMIN') ? 'Đổi thành User' : 'Đổi thành Admin', icon: <i className="bi bi-shield text-[12px]" />, onClick: () => handleRoleChange(r.id, r.roles?.some(role => role.name === 'ADMIN') ? 'USER' : 'ADMIN') },
        { key: 'status', label: r.status === 'BANNED' ? 'Mở khóa' : 'Khóa tài khoản', icon: <i className={`bi ${r.status === 'BANNED' ? 'bi-unlock' : 'bi-lock'} text-[12px]`} />, onClick: () => handleStatusChange(r.id, r.status === 'BANNED' ? 'ACTIVE' : 'BANNED') },
        { type: 'divider' },
        { key: 'delete', label: 'Xóa tài khoản', icon: <i className="bi bi-trash text-[12px]" />, danger: true, onClick: () => handleDelete(r.id, r.fullname) },
      ]}} trigger={['click']}>
        <Button type="text" size="small" icon={<i className="bi bi-three-dots-vertical text-[14px]" />} className="!text-black/30 hover:!text-[#ff5c00] !rounded-lg" />
      </Dropdown>
    ), width: 50 },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassMiniCard icon="bi-people-fill" label="Tổng người dùng" value={pagination.total} color="#6366f1" delay={0} />
        <GlassMiniCard icon="bi-person-check-fill" label="Đang hoạt động" value={users.filter(u => u.status === 'ACTIVE').length} color="#10b981" delay={0.05} />
        <GlassMiniCard icon="bi-person-x-fill" label="Bị khóa" value={users.filter(u => u.status === 'BANNED').length} color="#f43f5e" delay={0.1} />
        <GlassMiniCard icon="bi-shield-fill" label="Admin" value={users.filter(u => u.roles?.some(role => role.name === 'ADMIN')).length} color="#ff5c00" delay={0.15} />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex flex-wrap gap-3 items-center p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <Input.Search placeholder="Tìm theo tên hoặc email..." allowClear className="!w-[280px] [&_input]:!rounded-xl [&_.ant-input-group-addon]:!rounded-xl"
            onSearch={v => { setKeyword(v); }} onChange={e => !e.target.value && setKeyword('')} />
          <Select placeholder="Vai trò" allowClear className="!w-[130px]" options={[{ value: 'ADMIN', label: 'Admin' }, { value: 'USER', label: 'User' }]} onChange={v => setRoleFilter(v || '')} />
          <Select placeholder="Trạng thái" allowClear className="!w-[160px]" options={[{ value: 'ACTIVE', label: 'Hoạt động' }, { value: 'BANNED', label: 'Bị khóa' }, { value: 'INACTIVE', label: 'Không hoạt động' }]} onChange={v => setStatusFilter(v || '')} />
          <div className="ml-auto flex items-center gap-2 text-[12px] text-black/35 font-semibold">
            <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
            {pagination.total} người dùng
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: 0 }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <Table dataSource={users} columns={columns} rowKey="id" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'],
              onChange: (p, ps) => { setPagination(prev => ({ ...prev, pageSize: ps })); fetchUsers(p - 1); },
            }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-thead_th]:!border-b-0 [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>

      {/* Detail Modal — Glassmorphism */}
      <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} title={null} width={480} 
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden">
        {detailUser && (
          <div className="relative">
            {/* Header gradient */}
            <div className="absolute top-0 left-0 right-0 h-24 -mx-6 -mt-5"
              style={{ background: 'linear-gradient(135deg, #141428, #1a1a35, #251a35)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #ff5c00, transparent 70%)' }} />
              </div>
            </div>
            
            <div className="relative z-10 text-center pt-8">
              <Avatar size={72} style={{ 
                background: detailUser.roles?.some(role => role.name === 'ADMIN') ? 'linear-gradient(135deg, #ff5c00, #ffaa00)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
                fontSize: 28, fontWeight: 700, border: '4px solid white',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)' 
              }}>{detailUser.fullname?.charAt(0)}</Avatar>
              <h3 className="text-[18px] font-bold mt-3 mb-0">{detailUser.fullname}</h3>
              <p className="text-[13px] text-black/40 mb-4">{detailUser.email}</p>
              <div className="grid grid-cols-2 gap-3 text-left bg-black/[0.02] rounded-2xl p-5 border border-black/[0.04]">
                {[['Username', detailUser.username], ['Vai trò', detailUser.roles?.map(r => r.name).join(', ')], ['Trạng thái', detailUser.status], ['Tài liệu', detailUser.documentsCount || 0],
                  ['Nhóm', detailUser.groupsCount || 0], ['Đăng nhập cuối', detailUser.lastLogin ? new Date(detailUser.lastLogin).toLocaleString('vi-VN') : 'N/A'],
                ].map(([label, val]) => (
                  <div key={label}><p className="text-[10px] text-black/35 font-semibold mb-0.5 uppercase tracking-wider">{label}</p><p className="text-[13px] font-bold m-0">{val}</p></div>
                ))}
              </div>
              <div className="mt-4 px-2">
                <p className="text-[10px] text-black/35 font-semibold mb-1 text-left uppercase tracking-wider">Dung lượng sử dụng</p>
                <Progress percent={Math.round(((detailUser.storageUsed || 0) / (detailUser.storageMax || 1)) * 100)} strokeColor={{ from: '#ff5c00', to: '#ffaa00' }} />
                <p className="text-[11px] text-black/35 text-right font-medium">{formatBytes(detailUser.storageUsed)} / {formatBytes(detailUser.storageMax)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
