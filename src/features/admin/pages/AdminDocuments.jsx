/* eslint-disable react-hooks/set-state-in-effect */
/**
 * AdminDocuments — Premium Document Management with glassmorphism.
 * Synced with ADMIN_MODULE_FULL_API.md Section 4.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Input, Select, Button, Modal, Dropdown, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import { adminApi } from '../api/admin.api.js';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FILE_TYPE_ICONS = {
  pdf: { icon: 'bi-file-earmark-pdf-fill', color: '#f43f5e' },
  doc: { icon: 'bi-file-earmark-word-fill', color: '#2563eb' },
  docx: { icon: 'bi-file-earmark-word-fill', color: '#2563eb' },
  ppt: { icon: 'bi-file-earmark-ppt-fill', color: '#f97316' },
  pptx: { icon: 'bi-file-earmark-ppt-fill', color: '#f97316' },
  png: { icon: 'bi-file-earmark-image-fill', color: '#8b5cf6' },
  jpg: { icon: 'bi-file-earmark-image-fill', color: '#8b5cf6' },
  jpeg: { icon: 'bi-file-earmark-image-fill', color: '#8b5cf6' },
  mp3: { icon: 'bi-file-earmark-music-fill', color: '#0ea5e9' },
  mp4: { icon: 'bi-file-earmark-play-fill', color: '#10b981' },
  txt: { icon: 'bi-file-earmark-text-fill', color: '#64748b' },
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

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [docStats, setDocStats] = useState(null);
  const [dashStats, setDashStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');

  const fetchDocuments = useCallback(async (page = 0, size = pagination.pageSize) => {
    setLoading(true);
    try {
      const trimmedKeyword = keyword ? keyword.trim() : '';
      const res = await adminApi.getDocuments({ page, size, keyword: trimmedKeyword, fileType: fileTypeFilter });
      setDocuments(res.result?.content || []);
      setPagination(p => ({ ...p, current: page + 1, total: res.result?.totalElements || 0, pageSize: size }));
    } catch (e) {
      console.error('Failed to fetch documents:', e);
      setDocuments([]);
    } finally { setLoading(false); }
  }, [keyword, fileTypeFilter, pagination.pageSize]);

  useEffect(() => { fetchDocuments(0); }, [fetchDocuments]);

  useEffect(() => {
    adminApi.getDocumentStats()
      .then(r => setDocStats(r.result || null))
      .catch(() => setDocStats(null));
    adminApi.getDashboardStats()
      .then(r => setDashStats(r.result || null))
      .catch(() => setDashStats(null));
  }, []);

  const handleDelete = (docId, fileName) => {
    Modal.confirm({
      title: 'Xác nhận xóa tài liệu',
      content: `Di chuyển "${fileName}" vào thùng rác hệ thống? Hành động này có thể hoàn tác.`,
      okText: 'Xóa', cancelText: 'Hủy', okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await adminApi.deleteDocument(docId);
          message.success('Đã chuyển tài liệu vào thùng rác');
          fetchDocuments(pagination.current - 1);
        } catch (e) {
          message.error(e.response?.data?.message || 'Không thể xóa tài liệu');
        }
      },
    });
  };

  const columns = [
    { title: 'Tài liệu', key: 'file', render: (_, r) => {
      const ext = r.fileExtension?.toLowerCase() || '';
      const cfg = FILE_TYPE_ICONS[ext] || { icon: 'bi-file-earmark-fill', color: '#94a3b8' };
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}10` }}>
            <i className={`bi ${cfg.icon} text-[16px]`} style={{ color: cfg.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1d1d1f] m-0 leading-tight truncate max-w-[200px]">{r.fileName}</p>
            <p className="text-[10px] text-black/30 m-0 font-medium uppercase">.{ext} • {formatBytes(r.fileSize)}</p>
          </div>
        </div>
      );
    }, width: 300 },
    { title: 'Chủ sở hữu', key: 'owner', render: (_, r) => (
      <div>
        <p className="text-[13px] font-semibold m-0">{r.ownerUsername}</p>
        <p className="text-[10px] text-black/30 m-0">{r.ownerEmail}</p>
      </div>
    ), width: 200 },
    { title: 'Dung lượng', dataIndex: 'fileSize', render: (v) => <span className="text-[13px] font-bold text-[#1d1d1f]">{formatBytes(v)}</span>, width: 110, sorter: (a, b) => (a.fileSize || 0) - (b.fileSize || 0) },
    { title: 'Trạng thái', dataIndex: 'deleted', render: (d) => (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
        d ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
      }`}>
        <i className={`bi ${d ? 'bi-trash-fill' : 'bi-check-circle-fill'} text-[9px]`} />
        {d ? 'Đã xóa' : 'Hoạt động'}
      </div>
    ), width: 120 },
    { title: 'Ngày tạo', dataIndex: 'createdAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{t ? new Date(t).toLocaleDateString('vi-VN') : 'N/A'}</span>, width: 110, sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
    { title: '', key: 'actions', render: (_, r) => (
      <Dropdown menu={{ items: [
        { key: 'delete', label: 'Xóa tài liệu', icon: <i className="bi bi-trash text-[12px]" />, danger: true, onClick: () => handleDelete(r.id, r.fileName) },
      ]}} trigger={['click']}>
        <Button type="text" size="small" icon={<i className="bi bi-three-dots-vertical text-[14px]" />} className="!text-black/30 hover:!text-[#ff5c00] !rounded-lg" />
      </Dropdown>
    ), width: 50 },
  ];

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassMiniCard icon="bi-file-earmark-fill" label="Tổng tài liệu" value={dashStats?.totalDocuments || pagination.total || 0} color="#ff5c00" delay={0} />
        <GlassMiniCard icon="bi-hdd-fill" label="Tổng dung lượng" value={formatBytes(docStats?.totalSystemStorageBytes || 0)} color="#6366f1" delay={0.05} />
        <GlassMiniCard icon="bi-file-earmark-arrow-up-fill" label="File lớn nhất" value={docStats?.largestFileName ? `${docStats.largestFileName.length > 15 ? docStats.largestFileName.slice(0, 15) + '…' : docStats.largestFileName}` : 'N/A'} color="#f43f5e" delay={0.1} />
        <GlassMiniCard icon="bi-person-fill" label="Top Uploader" value={docStats?.topUploaderUsername ? `${docStats.topUploaderUsername} (${docStats.topUploaderFileCount})` : 'N/A'} color="#10b981" delay={0.15} />
      </div>

      {/* Filters + Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" styles={{ body: { padding: 0 } }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="p-4 pb-0 flex flex-wrap items-center gap-3">
            <Input.Search placeholder="Tìm theo tên file hoặc username..." allowClear className="!w-[300px] [&_input]:!rounded-xl [&_.ant-input-group-addon]:!rounded-xl"
              onSearch={v => setKeyword(v)} onChange={e => !e.target.value && setKeyword('')} />
            <Select placeholder="Loại file" allowClear className="!w-[160px]"
              options={[
                { value: 'DOCUMENT', label: <span><i className="bi bi-file-earmark-text mr-2 text-black/40" /> Tài liệu</span> },
                { value: 'IMAGE', label: <span><i className="bi bi-image mr-2 text-black/40" /> Hình ảnh</span> },
                { value: 'AUDIO', label: <span><i className="bi bi-music-note-beamed mr-2 text-black/40" /> Âm thanh</span> },
                { value: 'VIDEO', label: <span><i className="bi bi-film mr-2 text-black/40" /> Video</span> },
              ]}
              onChange={v => setFileTypeFilter(v || '')} />
            <div className="ml-auto flex items-center gap-2 text-[12px] text-black/35 font-semibold">
              <div className="w-2 h-2 rounded-full bg-[#ff5c00]" />
              {pagination.total} tài liệu
            </div>
          </div>
          <Table dataSource={documents} columns={columns} rowKey="id" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'],
              onChange: (p, ps) => { fetchDocuments(p - 1, ps); },
            }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>
    </div>
  );
}
