/**
 * AdminSettings — Premium System Settings with accent borders and enhanced styling.
 */
import { useEffect, useState } from 'react';
import { Card, Input, InputNumber, Switch, Button, Tag, message, Spin } from 'antd';
import { motion } from 'framer-motion';
import { adminApi } from '../api/admin.api.js';

const SECTION_CONFIG = {
  general: { icon: 'bi-gear-fill', color: '#ff5c00', title: 'Cài đặt chung', desc: 'Cấu hình cơ bản của hệ thống' },
  storage: { icon: 'bi-hdd-fill', color: '#6366f1', title: 'Cài đặt lưu trữ', desc: 'Giới hạn dung lượng và loại file' },
  security: { icon: 'bi-shield-fill', color: '#10b981', title: 'Bảo mật', desc: 'Cấu hình an ninh hệ thống' },
  notifications: { icon: 'bi-bell-fill', color: '#f43f5e', title: 'Thông báo', desc: 'Cấu hình thông báo hệ thống' },
};

const SectionCard = ({ sectionKey, children, delay = 0 }) => {
  const cfg = SECTION_CONFIG[sectionKey];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className="relative rounded-2xl overflow-hidden group"
        style={{ 
          background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.04)', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)' 
        }}>
        {/* Left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
          style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)` }} />
        
        <div className="p-6 pl-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}10` }}>
              <i className={`bi ${cfg.icon} text-[18px]`} style={{ color: cfg.color }} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold m-0 text-[#1d1d1f]">{cfg.title}</h3>
              <p className="text-[11px] text-black/35 m-0 font-medium">{cfg.desc}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-black/[0.03] last:border-b-0 group/row hover:bg-black/[0.005] -mx-2 px-2 rounded-lg transition-colors">
    <div className="flex-1 mr-4">
      <p className="text-[13px] font-semibold m-0 text-[#1d1d1f]">{label}</p>
      {description && <p className="text-[11px] text-black/35 m-0 mt-0.5 font-medium">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then(r => { setSettings(r.result); setLoading(false); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      message.success('Đã lưu cài đặt thành công!');
    } catch { message.error('Lỗi khi lưu cài đặt'); }
    finally { setSaving(false); }
  };

  const update = (section, key, value) => {
    setSettings(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Spin size="large" />
        <p className="text-[12px] text-black/30 mt-3 font-medium">Đang tải cài đặt...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-[800px]">
      {/* General */}
      <SectionCard sectionKey="general" delay={0}>
        <SettingRow label="Tên ứng dụng" description="Tên hiển thị trên giao diện">
          <Input value={settings.general.appName} onChange={e => update('general', 'appName', e.target.value)} className="!w-[200px] !rounded-xl" />
        </SettingRow>
        <SettingRow label="Chế độ bảo trì" description="Tạm ngưng truy cập cho người dùng thường">
          <Switch checked={settings.general.maintenanceMode} onChange={v => update('general', 'maintenanceMode', v)}
            checkedChildren="BẬT" unCheckedChildren="TẮT" style={settings.general.maintenanceMode ? { background: '#ff5c00' } : {}} />
        </SettingRow>
        <SettingRow label="Cho phép đăng ký" description="Người dùng mới có thể tự tạo tài khoản">
          <Switch checked={settings.general.allowRegistration} onChange={v => update('general', 'allowRegistration', v)}
            checkedChildren="BẬT" unCheckedChildren="TẮT" style={settings.general.allowRegistration ? { background: '#10b981' } : {}} />
        </SettingRow>
        <SettingRow label="Giới hạn đăng nhập sai" description="Số lần đăng nhập sai tối đa trước khi khóa">
          <InputNumber min={1} max={20} value={settings.general.maxLoginAttempts} onChange={v => update('general', 'maxLoginAttempts', v)} className="!w-[80px] !rounded-xl" />
        </SettingRow>
      </SectionCard>

      {/* Storage */}
      <SectionCard sectionKey="storage" delay={0.05}>
        <SettingRow label="Dung lượng mặc định" description="Dung lượng tối đa cho user mới (MB)">
          <InputNumber min={100} max={10240} value={Math.round(settings.storage.defaultStorageLimit / (1024 * 1024))}
            onChange={v => update('storage', 'defaultStorageLimit', v * 1024 * 1024)}
            className="!w-[100px] !rounded-xl" addonAfter="MB" />
        </SettingRow>
        <SettingRow label="Kích thước file tối đa" description="Giới hạn dung lượng mỗi file upload (MB)">
          <InputNumber min={1} max={500} value={Math.round(settings.storage.maxFileSize / (1024 * 1024))}
            onChange={v => update('storage', 'maxFileSize', v * 1024 * 1024)}
            className="!w-[100px] !rounded-xl" addonAfter="MB" />
        </SettingRow>
        <SettingRow label="Loại file cho phép" description="Các đuôi file được phép upload">
          <div className="flex flex-wrap gap-1.5 max-w-[300px] justify-end">
            {settings.storage.allowedFileTypes.map(t => (
              <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6366f1]/8 text-[#6366f1]">.{t}</span>
            ))}
          </div>
        </SettingRow>
      </SectionCard>

      {/* Security */}
      <SectionCard sectionKey="security" delay={0.1}>
        <SettingRow label="Thời hạn OTP" description="Thời gian hiệu lực mã xác minh (phút)">
          <InputNumber min={1} max={30} value={settings.security.otpExpiryMinutes} onChange={v => update('security', 'otpExpiryMinutes', v)} className="!w-[80px] !rounded-xl" addonAfter="phút" />
        </SettingRow>
        <SettingRow label="Session timeout" description="Tự động đăng xuất sau khoảng thời gian (phút)">
          <InputNumber min={5} max={1440} value={settings.security.sessionTimeoutMinutes} onChange={v => update('security', 'sessionTimeoutMinutes', v)} className="!w-[100px] !rounded-xl" addonAfter="phút" />
        </SettingRow>
        <SettingRow label="Độ dài mật khẩu tối thiểu" description="Số ký tự tối thiểu cho mật khẩu">
          <InputNumber min={4} max={32} value={settings.security.passwordMinLength} onChange={v => update('security', 'passwordMinLength', v)} className="!w-[80px] !rounded-xl" />
        </SettingRow>
        <SettingRow label="Yêu cầu xác minh email" description="Bắt buộc xác minh email khi đăng ký">
          <Switch checked={settings.security.requireEmailVerification} onChange={v => update('security', 'requireEmailVerification', v)}
            checkedChildren="BẬT" unCheckedChildren="TẮT" style={settings.security.requireEmailVerification ? { background: '#10b981' } : {}} />
        </SettingRow>
      </SectionCard>

      {/* Notifications */}
      <SectionCard sectionKey="notifications" delay={0.15}>
        <SettingRow label="Thông báo email" description="Gửi email khi có sự kiện quan trọng">
          <Switch checked={settings.notifications.emailNotifications} onChange={v => update('notifications', 'emailNotifications', v)}
            checkedChildren="BẬT" unCheckedChildren="TẮT" style={settings.notifications.emailNotifications ? { background: '#f43f5e' } : {}} />
        </SettingRow>
        <SettingRow label="Cảnh báo đăng nhập" description="Gửi email khi đăng nhập từ thiết bị lạ">
          <Switch checked={settings.notifications.loginAlerts} onChange={v => update('notifications', 'loginAlerts', v)}
            checkedChildren="BẬT" unCheckedChildren="TẮT" style={settings.notifications.loginAlerts ? { background: '#f43f5e' } : {}} />
        </SettingRow>
        <SettingRow label="Cảnh báo dung lượng" description="Thông báo khi storage vượt ngưỡng (%)">
          <InputNumber min={50} max={99} value={settings.notifications.storageWarningPercent} onChange={v => update('notifications', 'storageWarningPercent', v)} className="!w-[80px] !rounded-xl" addonAfter="%" />
        </SettingRow>
      </SectionCard>

      {/* Save Button — with glow */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-end pt-2 pb-6">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="primary" size="large" loading={saving} onClick={handleSave}
            className="!rounded-xl !border-0 !h-12 !px-12 !font-bold !text-[14px]"
            style={{ 
              background: 'linear-gradient(135deg, #ff5c00, #ffaa00)',
              boxShadow: '0 4px 16px rgba(255,92,0,0.3), 0 1px 3px rgba(255,92,0,0.2)',
            }}
            icon={<i className="bi bi-check-lg mr-1" />}>
            Lưu cài đặt
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
