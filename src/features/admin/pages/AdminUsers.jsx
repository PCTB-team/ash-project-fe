/**
 * AdminUsers — Premium User Management with glassmorphism stats and enhanced table.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Avatar, Input, Select, Button, Modal, Progress, Dropdown, message, Spin, Form } from 'antd';
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
  const [storagePlanVisible, setStoragePlanVisible] = useState(false);
  const [storagePlanUser, setStoragePlanUser] = useState(null);
  const [storagePlanLoading, setStoragePlanLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [globalStats, setGlobalStats] = useState({ total: 0, active: 0, locked: 0, admin: 0 });
  const [storagePlanForm] = Form.useForm();

  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ page, size: pagination.pageSize, keyword, role: roleFilter, status: statusFilter });
      setUsers(res.result.content);
      setPagination(p => ({ ...p, current: page + 1, total: res.result.totalElements }));
    } finally { setLoading(false); }
  }, [keyword, roleFilter, statusFilter, pagination.pageSize]);

  useEffect(() => { fetchUsers(0); }, [fetchUsers]);

  useEffect(() => {
    adminApi.getPlans()
      .then(r => setPlans(r.result || []))
      .catch(() => setPlans([]));
      
    // Fetch global stats
    Promise.all([
      adminApi.getDashboardStats().catch(() => ({ result: {} })),
      adminApi.getUsers({ role: 'ADMIN', size: 1 }).catch(() => ({ result: { totalElements: 0 } }))
    ]).then(([dashRes, adminRes]) => {
      const d = dashRes.result || {};
      setGlobalStats({
        total: d.totalUsers || 0,
        active: d.activeUsers || 0,
        locked: d.pendingReports || 0,
        admin: adminRes.result?.totalElements || 0
      });
    });
  }, []);

  // Map accountNonLocked -> display status
  const getUserStatus = (u) => u.accountNonLocked === false ? 'BANNED' : 'ACTIVE';

  const handleStatusChange = async (userId, newStatus) => {
    await adminApi.updateUserStatus(userId, newStatus);
    message.success(`Đã ${newStatus === 'BANNED' ? 'khóa' : 'mở khóa'} tài khoản`);
    const locked = newStatus === 'BANNED';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountNonLocked: !locked } : u));
    if (detailUser && detailUser.id === userId) {
      setDetailUser(prev => ({ ...prev, accountNonLocked: !locked }));
    }
  };

  const handleSetStoragePlan = async (values) => {
    setStoragePlanLoading(true);
    try {
      await adminApi.setUserStoragePlan(storagePlanUser.id, values.planId, values.reason || '');
      message.success(`Đã cấp gói lưu trữ cho ${storagePlanUser.fullname || storagePlanUser.username}`);
      setStoragePlanVisible(false);
      storagePlanForm.resetFields();
      fetchUsers(pagination.current - 1);
    } catch (e) {
      message.error(e.response?.data?.message || 'Không thể cấp gói lưu trữ');
    } finally {
      setStoragePlanLoading(false);
    }
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
          {getUserStatus(r) === 'ACTIVE' && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />}
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
    { title: 'Trạng thái', key: 'status', render: (_, r) => {
      const s = getUserStatus(r);
      const cfg = { ACTIVE: { color: '#10b981', bg: '#10b98112', text: 'Hoạt động', icon: 'bi-check-circle-fill' }, BANNED: { color: '#f43f5e', bg: '#f43f5e12', text: 'Bị khóa', icon: 'bi-x-circle-fill' } };
      const c = cfg[s] || cfg.ACTIVE;
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ color: c.color, background: c.bg }}>
          <i className={`bi ${c.icon} text-[9px]`} />
          {c.text}
        </div>
      );
    }, width: 140 },
    { title: 'Storage', key: 'storage', render: (_, r) => {
      const used = r.storageUsed || 0;
      const max = r.storageMax || 536870912; // fallback 500MB if backend returns 0
      const pct = Math.min(100, Math.max(0, Math.round((used / max) * 100)));
      return (
        <div className="min-w-[120px]">
          <Progress percent={pct} size="small" showInfo={false}
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
        { key: 'view', label: 'Xem chi tiết', icon: <i className="bi bi-eye text-[12px]" />, onClick: async () => { 
          // Fetch real detail from API to get storage and createdAt precisely
          try {
            const detailRes = await adminApi.getUserById(r.id);
            if (detailRes?.result) setDetailUser(detailRes.result);
            else setDetailUser(r); // fallback
          } catch(e) {
            setDetailUser(r);
          }
          setDetailVisible(true); 
        } },
        { key: 'role', label: r.roles?.some(role => role.name === 'ADMIN') ? 'Đổi thành User' : 'Đổi thành Admin', icon: <i className="bi bi-shield text-[12px]" />, onClick: () => handleRoleChange(r.id, r.roles?.some(role => role.name === 'ADMIN') ? 'USER' : 'ADMIN') },
        { key: 'status', label: getUserStatus(r) === 'BANNED' ? 'Mở khóa' : 'Khóa tài khoản', icon: <i className={`bi ${getUserStatus(r) === 'BANNED' ? 'bi-unlock' : 'bi-lock'} text-[12px]`} />, onClick: () => handleStatusChange(r.id, getUserStatus(r) === 'BANNED' ? 'ACTIVE' : 'BANNED') },
        { key: 'storage', label: 'Cấp gói lưu trữ', icon: <i className="bi bi-hdd text-[12px]" />, onClick: () => { setStoragePlanUser(r); setStoragePlanVisible(true); } },
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
        <GlassMiniCard icon="bi-people-fill" label="Tổng người dùng" value={globalStats.total || pagination.total} color="#6366f1" delay={0} />
        <GlassMiniCard icon="bi-person-check-fill" label="Đang hoạt động" value={globalStats.active || 0} color="#10b981" delay={0.05} />
        <GlassMiniCard icon="bi-person-x-fill" label="Bị khóa" value={globalStats.locked || 0} color="#f43f5e" delay={0.1} />
        <GlassMiniCard icon="bi-shield-fill" label="Admin" value={globalStats.admin || 0} color="#ff5c00" delay={0.15} />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex flex-wrap gap-3 items-center p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <Input.Search placeholder="Tìm theo tên hoặc email..." allowClear className="!w-[280px] [&_input]:!rounded-xl [&_.ant-input-group-addon]:!rounded-xl"
            onSearch={v => { setKeyword(v); }} onChange={e => !e.target.value && setKeyword('')} />
          <Select placeholder="Vai trò" allowClear className="!w-[130px]" options={[{ value: 'ADMIN', label: 'Admin' }, { value: 'USER', label: 'User' }]} onChange={v => setRoleFilter(v || '')} />
          <Select placeholder="Trạng thái" allowClear className="!w-[160px]" options={[{ value: 'ACTIVE', label: 'Hoạt động' }, { value: 'BANNED', label: 'Bị khóa' }]} onChange={v => setStatusFilter(v || '')} />
          <div className="ml-auto flex items-center gap-2 text-[12px] text-black/35 font-semibold">
            <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
            {pagination.total} người dùng
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: 0 } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <Table dataSource={users} columns={columns} rowKey="id" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'],
              onChange: (p, ps) => { setPagination(prev => ({ ...prev, pageSize: ps })); fetchUsers(p - 1); },
            }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-thead_th]:!border-b-0 [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>

      {/* Detail Modal — Premium Redesign */}
      <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} title={null} width={520}
        destroyOnClose centered
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden">
        {detailUser && (() => {
          const used = detailUser.storageUsed || 0;
          const max = detailUser.storageMax || 536870912;
          const percent = Math.min(100, Math.max(0, Math.round((used / max) * 100)));
          const isAdmin = detailUser.roles?.some(role => role.name === 'ADMIN');
          const isBanned = getUserStatus(detailUser) === 'BANNED';
          const radius = 38;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (percent / 100) * circumference;

          const infoItems = [
            { icon: 'bi-person-badge', label: 'Username', value: detailUser.username, color: '#6366f1', bg: '#6366f112' },
            { icon: 'bi-shield-fill', label: 'Vai trò', value: isAdmin ? 'Admin' : 'User', color: isAdmin ? '#ff5c00' : '#6366f1', bg: isAdmin ? '#ff5c0012' : '#6366f112' },
            { icon: isBanned ? 'bi-x-circle-fill' : 'bi-check-circle-fill', label: 'Trạng thái', value: isBanned ? 'Bị khóa' : 'Hoạt động', color: isBanned ? '#f43f5e' : '#10b981', bg: isBanned ? '#f43f5e12' : '#10b98112' },
            { icon: 'bi-file-earmark-text', label: 'Tài liệu', value: detailUser.documentsCount || 0, color: '#8b5cf6', bg: '#8b5cf612' },
            { icon: 'bi-patch-check-fill', label: 'Xác minh', value: detailUser.verified ? 'Đã xác minh' : 'Chưa', color: detailUser.verified ? '#10b981' : '#94a3b8', bg: detailUser.verified ? '#10b98112' : '#94a3b812' },
            { icon: 'bi-calendar3', label: 'Ngày tạo', value: detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString('vi-VN') : 'N/A', color: '#f59e0b', bg: '#f59e0b12' },
          ];

          return (
          <div>
            {/* Banner */}
            <div className="relative h-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)' }}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute bottom-4 left-6 w-16 h-16 rounded-full bg-white/5 border border-white/10" />
            </div>
            <div className="px-6 pb-6 relative">
              {/* Avatar */}
              <div className="absolute -top-10 left-6">
                <Avatar size={80} style={{ background: isAdmin ? 'linear-gradient(135deg, #ff5c00, #ffaa00)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 30, fontWeight: 800, border: '4px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                  {detailUser.fullname?.charAt(0)}
                </Avatar>
              </div>
              <div className="pt-14">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[20px] font-extrabold text-[#1d1d1f] m-0">{detailUser.fullname}</h3>
                  <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isAdmin ? 'bg-[#ff5c00]/10 text-[#ff5c00]' : 'bg-[#6366f1]/10 text-[#6366f1]'}`}>{isAdmin ? 'ADMIN' : 'USER'}</div>
                </div>
                <p className="text-[13px] text-black/40 mb-5 font-medium">{detailUser.email}</p>

                {/* Storage Ring + Info */}
                <div className="flex gap-5 mb-5 p-4 rounded-2xl border border-black/[0.04]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                  <div className="relative w-[96px] h-[96px] shrink-0">
                    <svg viewBox="0 0 96 96" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="7" />
                      <circle cx="48" cy="48" r={radius} fill="none" stroke={percent > 85 ? '#f43f5e' : '#6366f1'} strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${percent > 85 ? 'rgba(244,63,94,0.3)' : 'rgba(99,102,241,0.3)'})` }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[20px] font-extrabold text-[#1d1d1f] leading-none">{percent}%</span>
                      <span className="text-[9px] font-bold text-black/30 uppercase mt-0.5">đã dùng</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[12px] font-bold text-[#1d1d1f] flex items-center gap-1.5 mb-1"><i className="bi bi-cloud-fill text-[#6366f1]" /> Bộ nhớ đám mây</span>
                    <span className="text-[22px] font-extrabold text-[#1d1d1f] leading-tight">{formatBytes(used)}</span>
                    <span className="text-[11px] text-black/35 font-medium">trong tổng {formatBytes(max)}</span>
                  </div>
                </div>

                {/* Info Grid with Icon Badges */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  {infoItems.map(item => (
                    <div key={item.label} className="p-3 rounded-xl border border-black/[0.04] hover:border-black/[0.08] transition-colors" style={{ background: 'rgba(0,0,0,0.012)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2" style={{ background: item.bg }}>
                        <i className={`bi ${item.icon} text-[12px]`} style={{ color: item.color }} />
                      </div>
                      <p className="text-[9px] text-black/35 font-semibold uppercase tracking-wider m-0 mb-0.5">{item.label}</p>
                      <p className="text-[13px] font-bold text-[#1d1d1f] m-0 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5">
                  <Button onClick={() => { setStoragePlanUser(detailUser); setStoragePlanVisible(true); }} className="flex-1 !h-10 !rounded-xl !text-[12px] !font-bold !border-[#6366f1]/20 !text-[#6366f1] hover:!bg-[#6366f1]/5">
                    <i className="bi bi-hdd mr-1.5" /> Cấp gói
                  </Button>
                  <Button onClick={() => handleStatusChange(detailUser.id, isBanned ? 'ACTIVE' : 'BANNED')} className={`flex-1 !h-10 !rounded-xl !text-[12px] !font-bold !border-none ${isBanned ? '!bg-emerald-50 !text-emerald-600 hover:!bg-emerald-100' : '!bg-rose-50 !text-rose-500 hover:!bg-rose-100'}`}>
                    <i className={`bi ${isBanned ? 'bi-unlock' : 'bi-lock'} mr-1.5`} /> {isBanned ? 'Mở khóa' : 'Khóa'}
                  </Button>
                  <Button type="primary" onClick={() => setDetailVisible(false)} className="flex-1 !h-10 !rounded-xl !text-[12px] !font-bold !bg-[#6366f1] hover:!bg-[#4f46e5] !border-none">
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )})()}
      </Modal>

      {/* Storage Plan Modal */}
      <Modal
        title={null}
        open={storagePlanVisible}
        onCancel={() => { setStoragePlanVisible(false); storagePlanForm.resetFields(); }}
        footer={null}
        width={460}
        destroyOnClose
        centered
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <i className="bi bi-hdd-stack-fill text-[22px] text-white" />
          </div>
          <h3 className="text-[20px] font-extrabold text-[#1d1d1f] m-0">Cấp gói lưu trữ</h3>
          <p className="text-[13px] text-black/40 m-0 mt-1">Cấp thủ công cho <strong className="text-[#1d1d1f]">{storagePlanUser?.fullname || storagePlanUser?.username}</strong></p>
        </div>

        <div className="px-6 pb-6">
          <Form form={storagePlanForm} layout="vertical" onFinish={handleSetStoragePlan}>
            <Form.Item name="planId" label={<span className="text-[11px] font-bold text-black/40 uppercase tracking-wider">Chọn gói lưu trữ</span>} rules={[{ required: true, message: 'Vui lòng chọn gói!' }]} className="!mb-4">
              <Select placeholder="── Chọn gói ──" size="large" className="!rounded-xl [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-black/[0.08] [&_.ant-select-selector]:!h-[48px] [&_.ant-select-selection-item]:!leading-[46px]"
                popupClassName="!rounded-xl !p-1"
                optionLabelProp="label"
              >
                {plans.map((p, i) => {
                  const icons = ['📦', '🚀', '⚡', '⭐'];
                  const colors = ['#94a3b8', '#3b82f6', '#8b5cf6', '#ff5c00'];
                  const color = colors[i] || '#6366f1';
                  return (
                    <Select.Option key={p.id} value={p.id} label={p.planName}>
                      <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[16px]">{icons[i] || '📦'}</span>
                          <div>
                            <span className="text-[13px] font-bold text-[#1d1d1f] block leading-tight">{p.planName}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${color}12`, color }}>{(p.quotaSize / (1024*1024*1024)).toFixed(0)} GB</span>
                              <span className="text-[10px] text-black/30">{p.durationMonths} tháng</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[13px] font-extrabold" style={{ color }}>{p.price?.toLocaleString('vi-VN')}₫</span>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="reason" label={<span className="text-[11px] font-bold text-black/40 uppercase tracking-wider">Lý do (tùy chọn)</span>} className="!mb-4">
              <Input.TextArea rows={2} placeholder="VD: PayOS webhook bị lỡ. Admin đã xác nhận chuyển khoản." className="!rounded-xl !border-black/[0.06] focus:!border-[#6366f1]" />
            </Form.Item>
            <div className="flex gap-2.5">
              <Button className="flex-1 !h-11 !rounded-xl !font-bold !text-[13px]" onClick={() => setStoragePlanVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={storagePlanLoading} className="flex-1 !h-11 !rounded-xl !font-bold !text-[13px] !border-none" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>Xác nhận cấp gói</Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
