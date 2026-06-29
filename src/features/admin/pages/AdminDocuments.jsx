/**
 * AdminDocuments — Premium Document Management with glassmorphism.
 */
import { useEffect, useState, useCallback } from 'react';
import { Card, Table, Tag, Input, Select, Button, Modal, Dropdown, message } from 'antd';
import { motion } from 'framer-motion';
import { adminApi } from '../api/admin.api.js';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FILE_ICONS = { PDF: 'bi-file-earmark-pdf-fill', IMAGE: 'bi-file-earmark-image-fill', AUDIO: 'bi-file-earmark-music-fill', VIDEO: 'bi-file-earmark-play-fill', OTHER: 'bi-file-earmark-zip-fill' };
const FILE_COLORS = { PDF: '#f43f5e', IMAGE: '#6366f1', AUDIO: '#10b981', VIDEO: '#ff5c00', OTHER: '#8b5cf6' };

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
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [keyword, setKeyword] = useState('');
  const [fileType, setFileType] = useState('');

  const fetchDocs = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getDocuments({ page, size: pagination.pageSize, keyword, fileType });
      setDocs(res.result.content);
      setPagination(p => ({ ...p, current: page + 1, total: res.result.totalElements }));
    } finally { setLoading(false); }
  }, [keyword, fileType, pagination.pageSize]);

  useEffect(() => { fetchDocs(0); }, [fetchDocs]);

  const handleDelete = (docId, name) => {
    Modal.confirm({
      title: 'Xác nhận xóa', content: `Xóa vĩnh viễn tài liệu "${name}"?`,
      okText: 'Xóa', cancelText: 'Hủy', okButtonProps: { danger: true },
      onOk: async () => { await adminApi.deleteDocument(docId); message.success('Đã xóa tài liệu'); fetchDocs(pagination.current - 1); },
    });
  };

  const columns = [
    { title: 'Tài liệu', key: 'name', render: (_, r) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105" 
          style={{ background: `${FILE_COLORS[r.type]}10`, border: `1px solid ${FILE_COLORS[r.type]}12` }}>
          <i className={`bi ${FILE_ICONS[r.type] || 'bi-file-earmark'} text-[17px]`} style={{ color: FILE_COLORS[r.type] }} />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1d1d1f] m-0 leading-tight max-w-[250px] truncate">{r.name}</p>
          <p className="text-[11px] text-black/30 m-0 font-medium">{r.extension}</p>
        </div>
      </div>
    ), width: 300 },
    { title: 'Chủ sở hữu', key: 'owner', render: (_, r) => (
      <div>
        <p className="text-[13px] font-semibold m-0">{r.owner}</p>
        <p className="text-[10px] text-black/30 m-0">{r.ownerEmail}</p>
      </div>
    ), width: 180 },
    { title: 'Kích thước', dataIndex: 'size', render: (s) => <span className="text-[13px] text-black/50 font-medium">{formatBytes(s)}</span>, width: 100, sorter: (a, b) => a.size - b.size },
    { title: 'Loại', dataIndex: 'type', render: (t) => {
      const labels = { PDF: 'PDF', IMAGE: 'Hình ảnh', AUDIO: 'Âm thanh', VIDEO: 'Video', OTHER: 'Khác' };
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${FILE_COLORS[t]}, ${FILE_COLORS[t]}cc)` }}>
          <i className={`bi ${FILE_ICONS[t]} text-[9px]`} />
          {labels[t]}
        </div>
      );
    }, width: 110 },
    { title: 'Trạng thái', dataIndex: 'status', render: (s) => (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
        s === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}>
        <i className={`bi ${s === 'ACTIVE' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} text-[9px]`} />
        {s === 'ACTIVE' ? 'Hoạt động' : 'Đã xóa'}
      </div>
    ), width: 120 },
    { title: 'Ngày upload', dataIndex: 'uploadedAt', render: (t) => <span className="text-[12px] text-black/40 font-medium">{new Date(t).toLocaleDateString('vi-VN')}</span>, width: 110, sorter: (a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt) },
    { title: '', key: 'actions', render: (_, r) => (
      <Dropdown menu={{ items: [
        { key: 'delete', label: 'Xóa vĩnh viễn', icon: <i className="bi bi-trash text-[12px]" />, danger: true, onClick: () => handleDelete(r.id, r.name) },
      ]}} trigger={['click']}>
        <Button type="text" size="small" icon={<i className="bi bi-three-dots-vertical text-[14px]" />} className="!text-black/30 hover:!text-[#ff5c00] !rounded-lg" />
      </Dropdown>
    ), width: 50 },
  ];

  const totalSize = docs.reduce((s, d) => s + d.size, 0);
  const activeCount = docs.filter(d => d.status === 'ACTIVE').length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassMiniCard icon="bi-file-earmark-fill" label="Tổng tài liệu" value={pagination.total} color="#ff5c00" delay={0} />
        <GlassMiniCard icon="bi-check-circle-fill" label="Đang hoạt động" value={activeCount} color="#10b981" delay={0.05} />
        <GlassMiniCard icon="bi-hdd-fill" label="Tổng dung lượng" value={formatBytes(totalSize)} color="#6366f1" delay={0.1} />
        <GlassMiniCard icon="bi-file-pdf-fill" label="Phổ biến nhất" value="PDF" color="#f43f5e" delay={0.15} />
      </div>

      {/* Filters + Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="!rounded-2xl !border-0 !overflow-hidden" bodyStyle={{ padding: 0 }}
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.9)' }}>
          <div className="flex flex-wrap gap-3 items-center p-4 pb-0">
            <Input.Search placeholder="Tìm theo tên file hoặc chủ sở hữu..." allowClear className="!w-[300px] [&_input]:!rounded-xl [&_.ant-input-group-addon]:!rounded-xl"
              onSearch={v => setKeyword(v)} onChange={e => !e.target.value && setKeyword('')} />
            <Select placeholder="Loại file" allowClear className="!w-[140px]"
              options={[{ value: 'PDF', label: 'PDF' }, { value: 'IMAGE', label: 'Hình ảnh' }, { value: 'AUDIO', label: 'Âm thanh' }, { value: 'VIDEO', label: 'Video' }, { value: 'OTHER', label: 'Khác' }]}
              onChange={v => setFileType(v || '')} />
          </div>
          <Table dataSource={docs} columns={columns} rowKey="id" loading={loading} size="middle"
            pagination={{ ...pagination, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'],
              onChange: (p, ps) => { setPagination(prev => ({ ...prev, pageSize: ps })); fetchDocs(p - 1); } }}
            className="[&_.ant-table-thead_th]:!bg-[#fafafa] [&_.ant-table-thead_th]:!text-[11px] [&_.ant-table-thead_th]:!font-bold [&_.ant-table-thead_th]:!text-black/35 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider [&_.ant-table-row]:hover:!bg-[#fafafe]"
          />
        </Card>
      </motion.div>
    </div>
  );
}
