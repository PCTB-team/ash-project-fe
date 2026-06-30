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

      {/* Detail Modal — Glassmorphism */}
      <Modal open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} title={null} width={480} 
        destroyOnClose centered
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden">
        {detailUser && (() => {
          const used = detailUser.storageUsed || 0;
          const max = detailUser.storageMax || 536870912; // fallback 500MB
          const percent = Math.min(100, Math.max(0, Math.round((used / max) * 100)));
          const isWarning = percent > 85;
          
          return (
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
            <div className="px-6 pb-6 relative">
              <Avatar size={80} className="absolute -top-10 border-4 border-white shadow-md bg-white text-[#6366f1] font-bold text-[32px] flex items-center justify-center">
                {detailUser.fullname?.charAt(0)}
              </Avatar>
              <div className="pt-12">
                <h3 className="text-[18px] font-bold mt-3 mb-0">{detailUser.fullname}</h3>
                <p className="text-[13px] text-black/40 mb-4">{detailUser.email}</p>
                
                {/* Storage Progress */}
                <div className="mb-5 bg-black/[0.02] p-4 rounded-xl border border-black/[0.04]">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[12px] font-bold text-[#1d1d1f] flex items-center gap-1.5">
                      <i className="bi bi-cloud-check text-[#6366f1]" /> Bộ nhớ đám mây
                    </span>
                    <span className="text-[11px] font-medium text-black/40">
                      <span className={isWarning ? 'text-red-500 font-bold' : 'text-[#6366f1] font-bold'}>{formatBytes(used)}</span> / {formatBytes(max)}
                    </span>
                  </div>
                  <Progress percent={percent} strokeColor={isWarning ? '#f43f5e' : 'linear-gradient(to right, #6366f1, #8b5cf6)'} trailColor="rgba(0,0,0,0.04)" size="small" showInfo={false} />
                  <p className="text-[10px] text-black/35 font-medium m-0 mt-1.5 text-right">Đã dùng {percent}%</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left bg-black/[0.02] rounded-xl p-5 border border-black/[0.04]">
                  {[['Username', detailUser.username], ['Vai trò', detailUser.roles?.map(r => r.name).join(', ')], 
                    ['Trạng thái', getUserStatus(detailUser) === 'BANNED' ? 'Bị khóa' : 'Hoạt động'], 
                    ['Tài liệu', detailUser.documentsCount || 0],
                    ['Xác minh', detailUser.verified ? 'Đã xác minh' : 'Chưa xác minh'],
                    ['Ngày tạo', detailUser.createdAt ? new Date(detailUser.createdAt).toLocaleDateString('vi-VN') : 'N/A']
                  ].map(([label, val]) => (
                    <div key={label}><p className="text-[10px] text-black/35 font-semibold mb-0.5 uppercase tracking-wider">{label}</p><p className="text-[13px] font-bold m-0">{val}</p></div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="primary" onClick={() => setDetailVisible(false)} className="!rounded-xl !bg-[#6366f1] hover:!bg-[#4f46e5] !border-none px-6">Đóng</Button>
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
        width={440}
        destroyOnClose
        centered
        className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6"
      >
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center mx-auto mb-3">
            <i className="bi bi-hdd-fill text-[20px]" />
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 m-0">Cấp gói lưu trữ</h3>
          <p className="text-[13px] text-gray-500 m-0 mt-1">Cấp thủ công cho <strong>{storagePlanUser?.fullname || storagePlanUser?.username}</strong></p>
        </div>

        <Form form={storagePlanForm} layout="vertical" onFinish={handleSetStoragePlan}>
          <Form.Item name="planId" label={<span className="text-[12px] font-semibold">Chọn gói</span>} rules={[{ required: true, message: 'Vui lòng chọn gói!' }]}>
            <Select placeholder="Chọn gói lưu trữ" size="large" className="!rounded-xl">
              {plans.map(p => (
                <Select.Option key={p.id} value={p.id}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{p.planName}</span>
                    <span className="text-black/40 text-[12px]">{formatBytes(p.quotaSize)} • {p.price?.toLocaleString('vi-VN')}₫/{p.durationMonths}th</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="reason" label={<span className="text-[12px] font-semibold">Lý do (tùy chọn)</span>}>
            <Input.TextArea rows={2} placeholder="VD: PayOS webhook bị lỡ. Admin đã xác nhận chuyển khoản." className="!rounded-xl" />
          </Form.Item>
          <div className="flex gap-3 mt-4">
            <Button className="flex-1 !h-10 !rounded-xl font-medium" onClick={() => setStoragePlanVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={storagePlanLoading} className="flex-1 !h-10 !rounded-xl font-medium !bg-[#6366f1] hover:!bg-[#4f46e5] !border-none">Xác nhận cấp</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
