/**
 * AdminPayments — Premium Payment & Revenue Dashboard (Redesigned).
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Select, Empty } from 'antd';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../api/admin.api.js';

const formatVND = (v) => v?.toLocaleString('vi-VN') + '₫';
const formatBytes = (b) => {
  if (!b) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
const CustomTooltipStyle = { borderRadius: 16, fontSize: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' };

const TIER = {
  colors: ['#94a3b8', '#3b82f6', '#8b5cf6', '#ff5c00'],
  gradients: [['#94a3b8', '#64748b'], ['#3b82f6', '#2563eb'], ['#8b5cf6', '#7c3aed'], ['#ff5c00', '#ea580c']],
  icons: ['bi-box', 'bi-rocket-takeoff-fill', 'bi-lightning-charge-fill', 'bi-star-fill'],
  labels: ['Starter', 'Growth', 'Power', 'Ultimate'],
};

/* ── Stat Card ── */
const StatCard = ({ icon, label, value, color, delay = 0, sub }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
    <div className="relative rounded-2xl p-5 overflow-hidden group hover:translate-y-[-2px] transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}>
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12`, border: `1px solid ${color}10` }}>
          <i className={`bi ${icon} text-[16px]`} style={{ color }} />
        </div>
        {sub && <span className="text-[10px] font-bold text-black/25 uppercase tracking-wider">{sub}</span>}
      </div>
      <p className="text-[10px] text-black/35 font-semibold uppercase tracking-wider m-0 mb-0.5">{label}</p>
      <p className="text-[22px] font-extrabold text-[#1d1d1f] m-0 leading-tight">{value}</p>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  </motion.div>
);

/* ── Plan Card ── */
const PlanCard = ({ plan, index, delay = 0 }) => {
  const color = TIER.colors[index] || '#6366f1';
  const [gradFrom, gradTo] = TIER.gradients[index] || ['#6366f1', '#4f46e5'];
  const icon = TIER.icons[index] || 'bi-box';
  const isPopular = index === 2; // PLUS is usually most popular

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl overflow-hidden cursor-default group ${isPopular ? 'ring-2' : ''}`}
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: isPopular ? `0 8px 32px ${color}20, 0 2px 8px rgba(0,0,0,0.04)` : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
        ringColor: isPopular ? `${color}40` : 'transparent',
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
          PHỔ BIẾN
        </div>
      )}

      <div className="p-5">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
            <i className={`bi ${icon} text-[18px] text-white`} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-[#1d1d1f] m-0">{plan.planName}</p>
            <p className="text-[11px] text-black/30 m-0 font-medium">{TIER.labels[index] || 'Plan'}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}>
              {plan.price === 0 ? 'Miễn phí' : formatVND(plan.price)}
            </span>
            {plan.price > 0 && <span className="text-[12px] text-black/30 font-medium">/{plan.durationMonths}th</span>}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${color}12` }}>
              <i className="bi bi-hdd-fill text-[10px]" style={{ color }} />
            </div>
            <span className="text-[13px] font-semibold text-[#1d1d1f]">{formatBytes(plan.quotaSize)} dung lượng</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${color}12` }}>
              <i className="bi bi-calendar-check text-[10px]" style={{ color }} />
            </div>
            <span className="text-[13px] font-semibold text-[#1d1d1f]">{plan.durationMonths} tháng sử dụng</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${color}12` }}>
              <i className="bi bi-people-fill text-[10px]" style={{ color }} />
            </div>
            <span className="text-[13px] font-semibold text-[#1d1d1f]">{plan.subscriberCount || 0} người đăng ký</span>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="h-[3px] rounded-full mt-1" style={{ background: `linear-gradient(to right, ${gradFrom}, ${gradTo})`, opacity: 0.3 }} />
      </div>
    </motion.div>
  );
};

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [payStats, setPayStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPayments = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getPayments({ page, size: pagination.pageSize, status: statusFilter }).catch(() => ({ result: { content: [], totalElements: 0 } }));
      const content = res.result?.content || [];
      setPayments(content);
      
      // Compute stats from payment list
      const stats = {
        totalRevenue: content.filter(p => p.status === 'SUCCESS').reduce((acc, p) => acc + (p.amount || 0), 0),
        successCount: content.filter(p => p.status === 'SUCCESS').length,
        failedCount: content.filter(p => p.status === 'FAILED').length,
        pendingCount: content.filter(p => p.status === 'PENDING').length
      };
      setPayStats(stats);
      setPagination(p => ({ ...p, current: page + 1, total: res.result?.totalElements || 0 }));
    } catch (e) {
      console.error('Failed to fetch payments:', e);
    } finally { setLoading(false); }
  }, [statusFilter, pagination.pageSize]);

  useEffect(() => {
    fetchPayments(0);
    
    // Fetch real plans from API
    adminApi.getPlans()
      .then(r => setPlans(r.result || []))
      .catch(() => setPlans([]));
    
    // Fetch revenue chart from dedicated revenue API
    adminApi.getMonthlyRevenue()
      .then(r => {
        if (r.result?.series) {
          setRevenueChart(r.result.series.map(item => ({ month: item.label, revenue: item.revenue })));
        }
      })
      .catch(() => {
        // Fallback to dashboard stats if revenue API fails
        adminApi.getDashboardStats()
          .then(r => {
            if (r.result?.monthlyRevenueTrend) {
              setRevenueChart(r.result.monthlyRevenueTrend.map(item => ({ month: item.label, revenue: item.value })));
            }
          })
          .catch(() => {});
      });
  }, [fetchPayments]);

  const columns = [
    { title: 'Mã GD', dataIndex: 'transactionId', render: (t) => (
      <span className="text-[12px] font-mono text-black/40 bg-black/[0.03] px-2 py-0.5 rounded-md">{t?.slice(0, 16)}...</span>
    ), width: 160 },
    { title: 'Người dùng', key: 'user', render: (_, r) => (
      <div><p className="text-[13px] font-semibold m-0">{r.username}</p><p className="text-[10px] text-black/30 m-0">{r.email}</p></div>
    ), width: 180 },
    { title: 'Gói', dataIndex: 'planName', render: (p) => (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#6366f1]/8 text-[#6366f1]">
        <i className="bi bi-box-fill text-[9px]" />
        {p}
      </div>
    ), width: 160 },
    { title: 'Số tiền', dataIndex: 'amount', render: (a) => <span className="text-[13px] font-bold text-[#1d1d1f]">{formatVND(a)}</span>, width: 120, sorter: (a, b) => a.amount - b.amount },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => {
      const cfg = { 
        SUCCESS: { color: '#10b981', bg: '#10b98112', text: 'Thành công', icon: 'bi-check-circle-fill' }, 
        FAILED: { color: '#f43f5e', bg: '#f43f5e12', text: 'Thất bại', icon: 'bi-x-circle-fill' }, 
        PENDING: { color: '#f59e0b', bg: '#f59e0b12', text: 'Chờ xử lý', icon: 'bi-clock-fill' }, 
        CANCELLED: { color: '#94a3b8', bg: '#94a3b812', text: 'Đã hủy', icon: 'bi-dash-circle' },
        TIMEOUT: { color: '#78716c', bg: '#78716c12', text: 'Hết hạn', icon: 'bi-hourglass-bottom' }
      };
      const c = cfg[s] || cfg.PENDING;
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ color: c.color, background: c.bg }}>
          <i className={`bi ${c.icon} text-[9px]`} />
          {c.text}
        </div>
      );
    }, width: 130 },
    { title: 'Ngày', dataIndex: 'createdAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{new Date(t).toLocaleDateString('vi-VN')}</span>, width: 100, sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  ];

  return (
    <div className="space-y-5">

      {/* ══ Revenue Stats ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="bi-cash-stack" label="Tổng doanh thu" value={formatVND(payStats?.totalRevenue || 0)} color="#10b981" delay={0} sub="tất cả" />
        <StatCard icon="bi-check-circle-fill" label="GD thành công" value={payStats?.successCount || 0} color="#6366f1" delay={0.05} sub="paid" />
        <StatCard icon="bi-x-circle-fill" label="GD thất bại" value={payStats?.failedCount || 0} color="#f43f5e" delay={0.1} sub="failed" />
        <StatCard icon="bi-clock-fill" label="Đang chờ xử lý" value={payStats?.pendingCount || 0} color="#ff5c00" delay={0.15} sub="pending" />
      </div>

      {/* ══ Revenue Chart (full width) ══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: '24px 24px 16px' } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <i className="bi bi-graph-up-arrow text-[15px] text-[#10b981]" />
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#1d1d1f] block leading-tight">Biểu đồ doanh thu</span>
                <span className="text-[11px] text-black/30 font-medium">Xu hướng 6 tháng gần nhất</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-[11px] font-semibold text-black/35">Doanh thu</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [formatVND(v), 'Doanh thu']} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* ══ Pricing Plans Grid ══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#ff5c00]/10 flex items-center justify-center">
            <i className="bi bi-box-seam-fill text-[15px] text-[#ff5c00]" />
          </div>
          <div>
            <span className="text-[14px] font-bold text-[#1d1d1f] block leading-tight">Gói lưu trữ</span>
            <span className="text-[11px] text-black/30 font-medium">{plans.length} gói đang hoạt động</span>
          </div>
        </div>
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} index={i} delay={0.3 + i * 0.05} />
            ))}
          </div>
        ) : (
          <Card className="!rounded-2xl !border-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <Empty description="Chưa có gói lưu trữ nào" />
          </Card>
        )}
      </motion.div>

      {/* ══ Transactions Table ══ */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: 0 } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="p-4 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
                <i className="bi bi-receipt text-[15px] text-[#8b5cf6]" />
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#1d1d1f] block leading-tight">Lịch sử giao dịch</span>
                <span className="text-[11px] text-black/30 font-medium">{pagination.total} giao dịch</span>
              </div>
            </div>
            <Select placeholder="Trạng thái" allowClear className="!w-[150px]"
              options={[{ value: 'SUCCESS', label: 'Thành công' }, { value: 'FAILED', label: 'Thất bại' }, { value: 'PENDING', label: 'Chờ xử lý' }, { value: 'CANCELLED', label: 'Đã hủy' }, { value: 'TIMEOUT', label: 'Hết hạn' }]}
              onChange={v => setStatusFilter(v || '')} />
          </div>
          <Table dataSource={payments} columns={columns} rowKey="transactionId" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, onChange: (p, ps) => { setPagination(prev => ({ ...prev, pageSize: ps })); fetchPayments(p - 1); } }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>
    </div>
  );
}
