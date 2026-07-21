/**
 * AdminDashboard — Premium Overview Dashboard.
 * Ultra-Premium Light Theme matching the new sleek Apple/Stripe-inspired UI.
 */
import { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../api/admin.api.js';

const COLORS = ['#ff5c00', '#0ea5e9', '#10b981', '#f43f5e', '#eab308', '#8b5cf6'];

const GlassStatCard = ({ icon, label, value, suffix, color, trend, trendValue, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: 'easeOut' }}>
    <div className="relative rounded-[20px] p-5 overflow-hidden group cursor-default transition-all duration-300 hover:translate-y-[-2px] bg-white border border-black/[0.03]"
      style={{
        boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)',
      }}>
      {/* Subtle radial glow on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: color }} />

      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-[12px] flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105"
          style={{ background: `${color}12` }}>
          <i className={`bi ${icon} text-[18px]`} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}>
            <i className={`bi ${trend === 'up' ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'} text-[9px]`} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-[28px] font-extrabold text-[#1d1d1f] leading-none mb-1.5 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        {suffix && <span className="text-[14px] font-bold text-black/30 ml-1">{suffix}</span>}
      </p>
      <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wider">{label}</p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  </motion.div>
);

const WelcomeBanner = ({ stats }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-[24px] overflow-hidden mb-6 bg-white border border-[#ff5c00]/10"
    style={{
      boxShadow: '0 10px 40px -10px rgba(255,92,0,0.08)',
    }}
  >
    {/* Clean light mesh gradient background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[100px] -right-[50px] w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.15]"
        style={{ background: '#ff5c00' }} />
      <div className="absolute -bottom-[100px] left-[10%] w-[250px] h-[250px] rounded-full blur-[60px] opacity-[0.1]"
        style={{ background: '#ffaa00' }} />
      <div className="absolute top-[20%] left-[50%] w-[200px] h-[200px] rounded-full blur-[60px] opacity-[0.05]"
        style={{ background: '#6366f1' }} />
      {/* Soft grid overlay */}
      <div className="absolute inset-0 opacity-[0.4]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>

    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ff5c00] bg-[#ff5c00]/10 px-3 py-1 rounded-full border border-[#ff5c00]/10">
            Tổng quan hệ thống
          </span>
          <span className="text-[11px] text-black/20 font-medium">•</span>
          <span className="text-[11px] text-black/40 font-bold">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="text-[26px] md:text-[32px] font-extrabold text-[#1d1d1f] leading-tight mb-2 tracking-tight"
        >
          Chào mừng trở lại, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5c00] to-[#ff8a00]">Admin</span> 👋
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[13.5px] text-black/50 max-w-md leading-relaxed font-medium"
        >
          Hệ thống đang hoạt động ổn định. Dưới đây là báo cáo nhanh về lưu lượng và hoạt động trên nền tảng Capy Study ngày hôm nay.
        </motion.p>
      </div>

      {/* Quick stats in banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="flex gap-3 md:gap-4 bg-white/60 backdrop-blur-md p-3 rounded-[20px] border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
      >
        {[
          { label: 'Người dùng mới', value: stats?.newUsersThisMonth || 5, icon: 'bi-person-plus-fill', color: '#6366f1' },
          { label: 'Tài liệu mới', value: stats?.newDocsThisMonth || 42, icon: 'bi-file-earmark-plus-fill', color: '#10b981' },
          { label: 'Người dùng', value: stats?.activeUsers || 18, icon: 'bi-broadcast', color: '#ff5c00' },
        ].map((s, i) => (
          <div key={i} className="text-center px-4 py-2 relative group">
            {i !== 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-black/[0.05]" />}
            <div className="w-9 h-9 rounded-[10px] mx-auto mb-2 flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-105"
              style={{ color: s.color, border: `1px solid ${s.color}20` }}>
              <i className={`bi ${s.icon} text-[13px]`} />
            </div>
            <p className="text-[20px] font-extrabold text-[#1d1d1f] m-0 leading-none mb-1">{s.value}</p>
            <p className="text-[9px] text-black/40 font-bold uppercase tracking-wider m-0">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const CustomTooltipStyle = {
  borderRadius: 12,
  fontSize: 12,
  border: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(10px)',
  color: '#1d1d1f',
  fontWeight: 600
};

const ActivityTimeline = ({ activities }) => {
  const typeConfig = {
    USER_REGISTER: { icon: 'bi-person-plus-fill', color: '#6366f1', bg: '#6366f115', label: 'Đăng ký' },
    USER_UPLOAD_DOCUMENT: { icon: 'bi-cloud-arrow-up-fill', color: '#ff5c00', bg: '#ff5c0015', label: 'Upload' },
    GROUP_CREATE: { icon: 'bi-people-fill', color: '#8b5cf6', bg: '#8b5cf615', label: 'Tạo nhóm' },
    PAYMENT_SUCCESS: { icon: 'bi-check-circle-fill', color: '#10b981', bg: '#10b98115', label: 'Thanh toán' },
    AI_CHAT: { icon: 'bi-stars', color: '#0ea5e9', bg: '#0ea5e915', label: 'AI Chat' },
    USER_LOGIN: { icon: 'bi-box-arrow-in-right', color: '#94a3b8', bg: '#94a3b815', label: 'Đăng nhập' },
    DELETE_USER: { icon: 'bi-person-x-fill', color: '#f43f5e', bg: '#f43f5e15', label: 'Xóa User' },
    SET_USER_STORAGE_PLAN: { icon: 'bi-hdd-fill', color: '#6366f1', bg: '#6366f115', label: 'Cấp gói' },
    LOCK_USER: { icon: 'bi-lock-fill', color: '#f43f5e', bg: '#f43f5e15', label: 'Khóa TK' },
    UNLOCK_USER: { icon: 'bi-unlock-fill', color: '#10b981', bg: '#10b98115', label: 'Mở khóa' },
    ADMIN_ACTION: { icon: 'bi-shield-fill', color: '#ffaa00', bg: '#ffaa0015', label: 'Admin' },
  };

  return (
    <div className="space-y-1">
      {activities?.slice(0, 8).map((act, i) => {
        const cfg = typeConfig[act.action] || typeConfig.ADMIN_ACTION;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-black/[0.02] transition-colors group cursor-default"
          >
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{ background: cfg.bg, color: cfg.color }}>
              <i className={`bi ${cfg.icon} text-[13px]`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[12.5px] font-bold text-[#1d1d1f] truncate">{act.actor}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
              </div>
              <p className="text-[11px] text-black/50 m-0 truncate font-medium">{act.detail}</p>
            </div>

            <span className="text-[10px] text-black/30 font-bold shrink-0 tabular-nums">
              {new Date(act.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersChart, setUsersChart] = useState([]);
  const [uploadsChart, setUploadsChart] = useState([]);
  const [fileTypeChart, setFileTypeChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        const s = res?.result || { totalUsers: 0, totalDocuments: 0, totalGroups: 0, totalRevenue: 0 };
        setStats(s);

        // Map users chart
        setUsersChart((s.monthlyUserGrowth || []).map(item => ({ month: item.label, users: item.value })));

        // Map uploads chart
        setUploadsChart((s.weeklyUploadTrend || []).map(item => ({ week: item.label, uploads: item.uploads })));

        // Map file types chart
        if (s.fileTypeDistribution) {
          const fileTypes = Object.entries(s.fileTypeDistribution).map(([name, value], i) => ({
            name, value, color: COLORS[i % COLORS.length]
          })).filter(item => item.value > 0);

          const totalFiles = fileTypes.reduce((acc, curr) => acc + curr.value, 0);
          const fileTypesWithPercent = fileTypes.map(ft => ({
            ...ft,
            percent: totalFiles > 0 ? Math.round((ft.value / totalFiles) * 100) : 0
          }));
          setFileTypeChart(fileTypesWithPercent);
        }

        // Map revenue chart
        setRevenueChart((s.monthlyRevenueTrend || []).map(item => ({ month: item.label, revenue: item.value })));

        // Set activities
        setActivities(s.recentActivities || []);
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
        setStats({
          totalUsers: 0, totalDocuments: 0, totalGroups: 0, totalRevenue: 0
        });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Spin size="large" />
        <p className="text-[13px] text-black/40 mt-3 font-semibold">Đang tải dữ liệu tổng quan...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner stats={stats} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <GlassStatCard icon="bi-people-fill" label="Tổng người dùng" value={stats?.totalUsers || 0} color="#6366f1" trend="up" trendValue="+12%" delay={0} />
        <GlassStatCard icon="bi-broadcast" label="Đang hoạt động" value={stats?.activeUsersRightNow || 0} color="#10b981" delay={0.04} />
        <GlassStatCard icon="bi-file-earmark-fill" label="Tổng tài liệu" value={stats?.totalDocuments || 0} color="#ff5c00" trend="up" trendValue="+8%" delay={0.08} />
        <GlassStatCard icon="bi-collection-fill" label="Tổng nhóm" value={stats?.totalGroups || 0} color="#8b5cf6" delay={0.12} />
        <GlassStatCard icon="bi-cash-stack" label="Tổng doanh thu" value={stats?.totalRevenue || 0} suffix="₫" color="#0ea5e9" delay={0.16} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="!rounded-[20px] !border-0 !overflow-hidden"
            styles={{ body: { padding: '24px 24px 16px' } }}
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)', background: 'white' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#6366f1]/10 flex items-center justify-center">
                  <i className="bi bi-people-fill text-[14px] text-[#6366f1]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Người dùng mới</span>
              </div>
              <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider bg-black/[0.03] px-2.5 py-1 rounded-md">12 tháng</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={usersChart}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#colorUsers)" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="!rounded-[20px] !border-0 !overflow-hidden"
            styles={{ body: { padding: '24px 24px 16px' } }}
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)', background: 'white' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#ff5c00]/10 flex items-center justify-center">
                  <i className="bi bi-cash-stack text-[14px] text-[#ff5c00]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Doanh thu theo tháng</span>
              </div>
              <span className="text-[10px] font-bold text-black/30 uppercase tracking-wider bg-black/[0.03] px-2.5 py-1 rounded-md">6 tháng</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChart}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5c00" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ffaa00" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [`${v.toLocaleString('vi-VN')}₫`, 'Doanh thu']} />
                <Bar dataKey="revenue" fill="url(#barGrad)" radius={[6, 6, 4, 4]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="!rounded-[20px] !border-0 !overflow-hidden h-full"
            styles={{ body: { padding: '24px 24px 16px', height: '100%' } }}
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)', background: 'white' }}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-[10px] bg-[#8b5cf6]/10 flex items-center justify-center">
                <i className="bi bi-cloud-arrow-up-fill text-[14px] text-[#8b5cf6]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Upload theo tuần</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={uploadsChart}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: '#a1a1aa', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Bar dataKey="uploads" fill="url(#uploadGrad)" radius={[6, 6, 4, 4]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* File type distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="!rounded-[20px] !border-0 !overflow-hidden h-full"
            styles={{ body: { padding: '24px', height: '100%' } }}
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)', background: 'white' }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] bg-[#f43f5e]/10 flex items-center justify-center">
                <i className="bi bi-pie-chart-fill text-[14px] text-[#f43f5e]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Phân bố loại file</span>
            </div>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={fileTypeChart} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={4} stroke="#ffffff">
                    {fileTypeChart.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={CustomTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-4">
                {fileTypeChart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/[0.02] hover:bg-black/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color || COLORS[i] }} />
                      <span className="text-[13px] text-[#1d1d1f] font-bold">{item.name}</span>
                    </div>
                    <span className="text-[12.5px] font-extrabold text-black/50">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="!rounded-[20px] !border-0 !overflow-hidden h-full flex flex-col"
            styles={{ body: { padding: '24px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' } }}
            style={{ boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03), 0 0 3px rgba(0,0,0,0.02)', background: 'white' }}>
            <div className="flex items-center justify-between px-2 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-[10px] bg-[#0ea5e9]/10 flex items-center justify-center">
                  <i className="bi bi-activity text-[14px] text-[#0ea5e9]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Hoạt động gần đây</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col justify-between">
              <ActivityTimeline activities={activities} />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
