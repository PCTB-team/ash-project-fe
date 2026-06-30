/**
 * AdminPayments — Premium Payment & Revenue Dashboard.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Select, Spin } from 'antd';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../api/admin.api.js';

const formatVND = (v) => v?.toLocaleString('vi-VN') + '₫';
const CustomTooltipStyle = { borderRadius: 16, fontSize: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' };

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
      const res = await adminApi.getPayments({ page, size: pagination.pageSize, status: statusFilter }).catch(() => ({ result: { content: [], stats: {}, totalElements: 0 } }));
      setPayments(res.result.content); setPayStats(res.result.stats);
      setPagination(p => ({ ...p, current: page + 1, total: res.result.totalElements }));
    } finally { setLoading(false); }
  }, [statusFilter, pagination.pageSize]);

  useEffect(() => {
    fetchPayments(0);
    adminApi.getPlans().then(r => setPlans(r.result || []));
    adminApi.getDashboardStats().then(r => {
      if (r.result?.monthlyRevenueTrend) {
        setRevenueChart(r.result.monthlyRevenueTrend.map(item => ({ month: item.label, revenue: item.value })));
      }
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
        CANCELLED: { color: '#94a3b8', bg: '#94a3b812', text: 'Đã hủy', icon: 'bi-dash-circle' } 
      };
      const c = cfg[s] || cfg.PENDING;
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold" style={{ color: c.color, background: c.bg }}>
          <i className={`bi ${c.icon} text-[9px]`} />
          {c.text}
        </div>
      );
    }, width: 130 },
    { title: 'Phương thức', dataIndex: 'paymentMethod', render: (m) => <span className="text-[12px] text-black/40 font-medium">{m}</span>, width: 100 },
    { title: 'Ngày', dataIndex: 'createdAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{new Date(t).toLocaleDateString('vi-VN')}</span>, width: 100, sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  ];

  return (
    <div className="space-y-5">
      {/* Revenue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassMiniCard icon="bi-cash-stack" label="Tổng doanh thu" value={formatVND(payStats?.totalRevenue || 0)} color="#10b981" delay={0} />
        <GlassMiniCard icon="bi-check-circle-fill" label="GD thành công" value={payStats?.successCount || 0} color="#6366f1" delay={0.05} />
        <GlassMiniCard icon="bi-x-circle-fill" label="GD thất bại" value={payStats?.failedCount || 0} color="#f43f5e" delay={0.1} />
        <GlassMiniCard icon="bi-clock-fill" label="Đang chờ" value={payStats?.pendingCount || 0} color="#ff5c00" delay={0.15} />
      </div>

      {/* Revenue Chart + Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: '20px 20px 12px' } }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                  <i className="bi bi-graph-up-arrow text-[13px] text-[#10b981]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Biểu đồ doanh thu</span>
              </div>
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-wider">6 tháng</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [formatVND(v), 'Doanh thu']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#colorRevenue)" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden h-full" styles={{ body: { padding: '20px' } }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#ff5c00]/10 flex items-center justify-center">
                <i className="bi bi-box-fill text-[13px] text-[#ff5c00]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Gói lưu trữ</span>
            </div>
            <div className="space-y-3">
              {plans.map((plan, i) => (
                <motion.div 
                  key={plan.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-black/[0.04] hover:border-[#ff5c00]/20 transition-all cursor-default group"
                  style={{ background: 'rgba(0,0,0,0.01)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${['#6366f1','#8b5cf6','#ff5c00','#10b981'][i]}, ${['#8b5cf6','#6366f1','#ffaa00','#059669'][i]})` }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold m-0">{plan.name}</p>
                      <p className="text-[11px] text-black/30 m-0 font-medium">{(plan.storage / (1024*1024*1024)).toFixed(0)} GB</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-extrabold m-0 bg-clip-text text-transparent bg-gradient-to-r from-[#ff5c00] to-[#ffaa00]">{formatVND(plan.price)}</p>
                    <p className="text-[10px] text-black/30 m-0 font-medium">{plan.subscriberCount} users</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: 0 } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="p-4 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <i className="bi bi-receipt text-[13px] text-[#8b5cf6]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Lịch sử giao dịch</span>
            </div>
            <Select placeholder="Trạng thái" allowClear className="!w-[150px]"
              options={[{ value: 'SUCCESS', label: 'Thành công' }, { value: 'FAILED', label: 'Thất bại' }, { value: 'PENDING', label: 'Chờ xử lý' }, { value: 'CANCELLED', label: 'Đã hủy' }]}
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
