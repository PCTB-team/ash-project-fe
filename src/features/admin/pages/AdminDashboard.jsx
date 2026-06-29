/**
 * AdminDashboard — Premium Overview Dashboard.
 * Welcome banner + Glassmorphism stat cards + Enhanced charts + Timeline activity feed.
 */
import { useEffect, useState } from 'react';
import { Card, Tag, Avatar, Spin } from 'antd';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../api/admin.api.js';

const COLORS = ['#ff5c00', '#6366f1', '#10b981', '#f43f5e', '#8b5cf6'];

const GlassStatCard = ({ icon, label, value, suffix, color, trend, trendValue, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: 'easeOut' }}>
    <div className="relative rounded-2xl p-5 overflow-hidden group cursor-default transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)`,
      }}>
      {/* Gradient accent orb */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.08] group-hover:opacity-[0.12] transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center relative"
          style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)`, border: `1px solid ${color}12` }}>
          <i className={`bi ${icon} text-[18px]`} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            <i className={`bi ${trend === 'up' ? 'bi-arrow-up-right' : 'bi-arrow-down-right'} text-[9px]`} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-[28px] font-extrabold text-[#1d1d1f] leading-none mb-1 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        {suffix && <span className="text-[14px] font-semibold text-black/25 ml-1">{suffix}</span>}
      </p>
      <p className="text-[11px] font-semibold text-black/35 uppercase tracking-wider">{label}</p>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  </motion.div>
);

const WelcomeBanner = ({ stats }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6 }}
    className="relative rounded-2xl overflow-hidden mb-6"
    style={{
      background: 'linear-gradient(135deg, #141428 0%, #1a1a35 40%, #251a35 70%, #1a1428 100%)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    }}
  >
    {/* Animated mesh gradient orbs */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #ff5c00, transparent 70%)' }} />
      <div className="absolute -bottom-10 left-[20%] w-[250px] h-[250px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
      <div className="absolute top-[20%] left-[60%] w-[200px] h-[200px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>

    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff5c00]/80 bg-[#ff5c00]/10 px-3 py-1 rounded-full border border-[#ff5c00]/20">
            Dashboard
          </span>
          <span className="text-[11px] text-white/30 font-medium">•</span>
          <span className="text-[11px] text-white/30 font-medium">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="text-[24px] md:text-[28px] font-extrabold text-white leading-tight mb-2 tracking-tight"
        >
          Xin chào, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff5c00] to-[#ffaa00]">Admin</span> 👋
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[13px] text-white/40 max-w-md leading-relaxed"
        >
          Hệ thống hoạt động ổn định. Dưới đây là tổng quan nhanh về nền tảng Capy Study.
        </motion.p>
      </div>

      {/* Quick stats in banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="flex gap-4 md:gap-6"
      >
        {[
          { label: 'User mới', value: stats?.newUsersThisMonth || 5, icon: 'bi-person-plus-fill', color: '#6366f1' },
          { label: 'Docs mới', value: stats?.newDocsThisMonth || 42, icon: 'bi-file-earmark-plus-fill', color: '#10b981' },
          { label: 'Online', value: stats?.activeUsers || 18, icon: 'bi-circle-fill', color: '#ff5c00' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="w-10 h-10 rounded-xl mx-auto mb-1.5 flex items-center justify-center" 
              style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
              <i className={`bi ${s.icon} text-[14px]`} style={{ color: s.color }} />
            </div>
            <p className="text-[18px] font-extrabold text-white m-0">{s.value}</p>
            <p className="text-[9px] text-white/30 font-semibold uppercase tracking-wider m-0">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </motion.div>
);

const CustomTooltipStyle = { borderRadius: 16, fontSize: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' };

const ActivityTimeline = ({ activities }) => {
  const typeConfig = {
    USER_REGISTER: { icon: 'bi-person-plus-fill', color: '#6366f1', bg: '#6366f115', label: 'Đăng ký' },
    USER_UPLOAD_DOCUMENT: { icon: 'bi-cloud-arrow-up-fill', color: '#ff5c00', bg: '#ff5c0015', label: 'Upload' },
    GROUP_CREATE: { icon: 'bi-people-fill', color: '#8b5cf6', bg: '#8b5cf615', label: 'Tạo nhóm' },
    PAYMENT_SUCCESS: { icon: 'bi-check-circle-fill', color: '#10b981', bg: '#10b98115', label: 'Thanh toán' },
    AI_CHAT: { icon: 'bi-stars', color: '#0ea5e9', bg: '#0ea5e915', label: 'AI Chat' },
    USER_LOGIN: { icon: 'bi-box-arrow-in-right', color: '#94a3b8', bg: '#94a3b815', label: 'Đăng nhập' },
    DELETE_USER: { icon: 'bi-person-x-fill', color: '#f43f5e', bg: '#f43f5e15', label: 'Xóa User' },
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
            className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-black/[0.02] transition-colors group cursor-default"
          >
            {/* Timeline dot + line */}
            <div className="relative flex flex-col items-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ background: cfg.bg, border: `1px solid ${cfg.color}15` }}>
                <i className={`bi ${cfg.icon} text-[14px]`} style={{ color: cfg.color }} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-semibold text-[#1d1d1f] truncate">{act.actor}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" 
                  style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
              </div>
              <p className="text-[11px] text-black/40 m-0 truncate">{act.detail}</p>
            </div>

            <span className="text-[10px] text-black/30 font-medium shrink-0 tabular-nums">
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
        const s = res.result;
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
          
          // Calculate percentage for display if needed
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
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Spin size="large" />
        <p className="text-[12px] text-black/30 mt-3 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner stats={stats} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassStatCard icon="bi-people-fill" label="Tổng người dùng" value={stats.totalUsers} color="#6366f1" trend="up" trendValue="+12%" delay={0} />
        <GlassStatCard icon="bi-file-earmark-fill" label="Tổng tài liệu" value={stats.totalDocuments} color="#ff5c00" trend="up" trendValue="+8%" delay={0.06} />
        <GlassStatCard icon="bi-collection-fill" label="Tổng nhóm" value={stats.totalGroups} color="#8b5cf6" trend="up" trendValue="+5%" delay={0.12} />
        <GlassStatCard icon="bi-cash-stack" label="Tổng doanh thu" value={stats.totalRevenue} suffix="₫" color="#10b981" trend="up" trendValue="+18%" delay={0.18} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden" 
            bodyStyle={{ padding: '20px 20px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center">
                  <i className="bi bi-people-fill text-[13px] text-[#6366f1]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Người dùng mới</span>
              </div>
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-wider">12 tháng</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={usersChart}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#colorUsers)" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden" 
            bodyStyle={{ padding: '20px 20px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff5c00]/10 flex items-center justify-center">
                  <i className="bi bi-cash-stack text-[13px] text-[#ff5c00]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Doanh thu theo tháng</span>
              </div>
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-wider">6 tháng</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueChart}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5c00" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#ffaa00" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [`${v.toLocaleString('vi-VN')}₫`, 'Doanh thu']} />
                <Bar dataKey="revenue" fill="url(#barGrad)" radius={[8, 8, 4, 4]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upload chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden" 
            bodyStyle={{ padding: '20px 20px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <i className="bi bi-cloud-arrow-up-fill text-[13px] text-[#8b5cf6]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Upload theo tuần</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={uploadsChart}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Bar dataKey="uploads" fill="url(#uploadGrad)" radius={[8, 8, 4, 4]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* File type distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden h-full" 
            bodyStyle={{ padding: '20px', height: '100%' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/10 flex items-center justify-center">
                <i className="bi bi-pie-chart-fill text-[13px] text-[#f43f5e]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Phân bố loại file</span>
            </div>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={fileTypeChart} cx="50%" cy="50%" innerRadius={42} outerRadius={70} dataKey="value" strokeWidth={3} stroke="rgba(255,255,255,0.9)">
                    {fileTypeChart.map((entry, i) => <Cell key={i} fill={entry.color || COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={CustomTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-3">
                {fileTypeChart.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-black/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color || COLORS[i], boxShadow: `0 0 6px ${item.color || COLORS[i]}40` }} />
                      <span className="text-[12px] text-black/60 font-medium">{item.name}</span>
                    </div>
                    <span className="text-[12px] font-bold text-black/70">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed — Timeline style */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden h-full" 
            bodyStyle={{ padding: '20px 12px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0ea5e9]/10 flex items-center justify-center">
                  <i className="bi bi-activity text-[13px] text-[#0ea5e9]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Hoạt động gần đây</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Realtime" />
            </div>
            <ActivityTimeline activities={activities} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
