/**
 * AdminAI — Premium AI Statistics with bento grid layout.
 */
import { useEffect, useState } from 'react';
import { Card, Avatar, Spin } from 'antd';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminApi } from '../api/admin.api.js';

const CustomTooltipStyle = { borderRadius: 16, fontSize: 12, border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: 'rgba(255,255,255,0.95)' };

const BentoStatCard = ({ icon, label, value, color, size = 'normal', delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
    <div className={`relative rounded-2xl overflow-hidden group hover:translate-y-[-2px] transition-all duration-300 h-full ${size === 'large' ? 'p-6' : 'p-4'}`}
      style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' }}>
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      <div className={`flex ${size === 'large' ? 'flex-col items-center text-center gap-3' : 'items-center gap-3'}`}>
        <div className={`${size === 'large' ? 'w-14 h-14' : 'w-10 h-10'} rounded-xl flex items-center justify-center shrink-0`}
          style={{ background: `${color}12`, border: `1px solid ${color}10` }}>
          <i className={`bi ${icon} ${size === 'large' ? 'text-[22px]' : 'text-[16px]'}`} style={{ color }} />
        </div>
        <div>
          <p className={`${size === 'large' ? 'text-[32px]' : 'text-[22px]'} font-extrabold text-[#1d1d1f] m-0 leading-tight`}>{value}</p>
          <p className="text-[10px] text-black/35 font-semibold uppercase tracking-wider m-0 mt-1">{label}</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  </motion.div>
);

export default function AdminAI() {
  const [stats, setStats] = useState(null);
  const [usageChart, setUsageChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u] = await Promise.all([adminApi.getAIStats(), adminApi.getAIUsageChart()]);
        setStats(s.result); setUsageChart(u.result);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Spin size="large" />
        <p className="text-[12px] text-black/30 mt-3 font-medium">Đang tải thống kê AI...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Bento Grid Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <BentoStatCard icon="bi-chat-dots-fill" label="Tổng tin nhắn" value={stats.totalMessages.toLocaleString()} color="#ff5c00" delay={0} />
        <BentoStatCard icon="bi-chat-left-text-fill" label="Cuộc trò chuyện" value={stats.totalConversations} color="#6366f1" delay={0.04} />
        <BentoStatCard icon="bi-book-fill" label="Knowledge Chat" value={`${stats.knowledgeChatPercent}%`} color="#10b981" delay={0.08} />
        <BentoStatCard icon="bi-robot" label="General Chat" value={`${stats.generalChatPercent}%`} color="#8b5cf6" delay={0.12} />
        <BentoStatCard icon="bi-file-text-fill" label="Tài liệu tóm tắt" value={stats.documentsSummarized} color="#f43f5e" delay={0.16} />
        <BentoStatCard icon="bi-bar-chart-fill" label="TB tin nhắn/user" value={stats.avgMessagesPerUser} color="#0ea5e9" delay={0.20} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: '20px 20px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff5c00]/10 flex items-center justify-center">
                  <i className="bi bi-graph-up text-[13px] text-[#ff5c00]" />
                </div>
                <span className="text-[13px] font-bold text-[#1d1d1f]">Lượt sử dụng AI</span>
              </div>
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-wider">7 ngày</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={usageChart}>
                <defs>
                  <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c00" stopOpacity={0.2}/><stop offset="95%" stopColor="#ff5c00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKnow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="messages" name="Tổng tin nhắn" stroke="#ff5c00" fill="url(#colorMsg)" strokeWidth={2.5} dot={{ r: 3, fill: '#ff5c00', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="knowledge" name="Knowledge Chat" stroke="#6366f1" fill="url(#colorKnow)" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: '20px 20px 12px' }}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                <i className="bi bi-pie-chart-fill text-[13px] text-[#8b5cf6]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Phân bố loại chat</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[
                { name: 'General Chat', value: stats.generalChatPercent },
                { name: 'Knowledge Chat', value: stats.knowledgeChatPercent },
              ]} layout="vertical" barGap={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#999' }} domain={[0, 100]} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#555', fontWeight: 600 }} width={130} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CustomTooltipStyle} formatter={v => [`${v}%`]} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={36}>
                  {[
                    <defs key="defs">
                      <linearGradient id="genGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ff5c00"/><stop offset="100%" stopColor="#ffaa00"/>
                      </linearGradient>
                      <linearGradient id="knowGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#8b5cf6"/>
                      </linearGradient>
                    </defs>
                  ]}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Top Users — Card style */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: '20px' }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f43f5e]/10 flex items-center justify-center">
                <i className="bi bi-trophy-fill text-[13px] text-[#f43f5e]" />
              </div>
              <span className="text-[13px] font-bold text-[#1d1d1f]">Top người dùng AI</span>
            </div>
            <span className="text-[10px] font-semibold text-black/30 uppercase tracking-wider">Top 5</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {stats.topUsers.map((user, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const colors = ['#ff5c00', '#6366f1', '#10b981', '#8b5cf6', '#f43f5e'];
              return (
                <motion.div 
                  key={user.userId}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative rounded-2xl p-4 text-center group cursor-default"
                  style={{ 
                    background: i === 0 ? 'linear-gradient(135deg, #ff5c00/5, #ffaa00/3)' : 'rgba(0,0,0,0.01)',
                    border: `1px solid ${i === 0 ? 'rgba(255,92,0,0.12)' : 'rgba(0,0,0,0.04)'}`,
                  }}
                >
                  {/* Rank */}
                  <div className="absolute -top-1 -left-1 text-[16px]">{medals[i] || ''}</div>
                  
                  <Avatar size={48} style={{ 
                    background: `linear-gradient(135deg, ${colors[i]}, ${colors[(i + 1) % 5]})`, 
                    fontSize: 18, fontWeight: 700, border: '3px solid white',
                    boxShadow: `0 4px 12px ${colors[i]}30`,
                  }}>
                    {user.name?.charAt(0)}
                  </Avatar>
                  <p className="text-[13px] font-bold mt-2 mb-0 truncate">{user.name}</p>
                  <div className="flex justify-center gap-3 mt-2">
                    <div>
                      <p className="text-[16px] font-extrabold m-0" style={{ color: colors[i] }}>{user.messages}</p>
                      <p className="text-[9px] text-black/30 font-semibold uppercase m-0">Tin nhắn</p>
                    </div>
                    <div className="w-px bg-black/[0.06]" />
                    <div>
                      <p className="text-[16px] font-extrabold m-0 text-[#1d1d1f]">{user.conversations}</p>
                      <p className="text-[9px] text-black/30 font-semibold uppercase m-0">Cuộc chat</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
