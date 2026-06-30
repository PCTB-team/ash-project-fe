import { useEffect, useState } from 'react';
import { Card, Form, Input, Select, Button, message, Tabs } from 'antd';
import { motion } from 'framer-motion';

const DEFAULT_CONFIG = {
  heroBadge: 'Nền tảng học tập thông minh',
  heroTitle1: 'Quản lý tài liệu.',
  heroTitle2: 'Học cùng AI.',
  heroTitle3: 'Kết nối tri thức.',
  heroDesc: 'Capy Study giúp sinh viên lưu trữ tài liệu tập trung, tra cứu thông minh với AI, và học nhóm hiệu quả — tất cả trong một nền tảng duy nhất.',
  primaryBtnText: 'Bắt đầu miễn phí',
  bgStyle: 'default',

  stats: [
    { value: '1,000+', label: 'Tài liệu đã lưu trữ', icon: 'bi-file-earmark-text' },
    { value: '500+', label: 'Sinh viên tin dùng', icon: 'bi-people' },
    { value: '24/7', label: 'Trợ lý AI luôn sẵn sàng', icon: 'bi-robot' },
    { value: '100%', label: 'Miễn phí sử dụng', icon: 'bi-shield-check' },
  ],

  features: [
    {
      icon: 'bi-folder2-open', color: '#007aff',
      title: 'Quản lý tài liệu thông minh',
      desc: 'Tải lên PDF, DOCX, hình ảnh, video bài giảng — tất cả được tổ chức khoa học trong một nơi duy nhất. Phân loại tự động theo định dạng, tìm kiếm tức thì, quản lý thư mục lồng nhau.',
      highlights: 'Upload kéo thả, Phân loại tự động, Tìm kiếm thông minh, Quản lý folder',
      link: 'Quản lý ngay', view: 'dashboard'
    },
    {
      icon: 'bi-stars', color: '#ff5c00',
      title: 'Trợ lý AI học thuật',
      desc: 'Đặt câu hỏi, tóm tắt giáo trình hàng trăm trang chỉ trong vài giây. AI hiểu ngữ cảnh tài liệu của bạn, hỗ trợ giải đáp và tạo đề ôn thi cá nhân hóa.',
      highlights: 'Tóm tắt tài liệu, Giải đáp câu hỏi, Tạo đề ôn thi, Phân tích nội dung',
      link: 'Trò chuyện với AI', view: 'ai'
    },
    {
      icon: 'bi-people-fill', color: '#34c759',
      title: 'Nhóm học tập',
      desc: 'Tạo nhóm riêng, mời bạn bè bằng link, chia sẻ tài liệu và cùng thảo luận. Kết nối tri thức cùng đồng đội trong nhóm học tập trực tuyến.',
      highlights: 'Tạo nhóm học tập, Chia sẻ qua link, Thảo luận nhóm, Quản lý thành viên',
      link: 'Vào nhóm học tập', view: 'community'
    }
  ],

  steps: [
    { step: 1, icon: 'bi-person-plus-fill', title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc tài khoản Google.' },
    { step: 2, icon: 'bi-cloud-arrow-up-fill', title: 'Tải lên tài liệu', desc: 'Upload giáo trình, slide, bài giảng — hệ thống tự động phân loại và lưu trữ đám mây an toàn.' },
    { step: 3, icon: 'bi-lightning-charge-fill', title: 'Học thông minh với AI', desc: 'Đặt câu hỏi cho AI, tóm tắt tài liệu, tham gia nhóm học tập — tất cả trên một nền tảng.' }
  ],

  ctaTitle: 'Sẵn sàng nâng cấp cách học?',
  ctaDesc: 'Tham gia cùng hàng trăm sinh viên đang sử dụng Capy Study để quản lý tài liệu và học tập hiệu quả hơn mỗi ngày.',
  ctaBtn: 'Đăng ký miễn phí'
};

export default function AdminIntroConfig() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load config from LocalStorage
    const saved = localStorage.getItem('capy_intro_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with default in case of missing arrays
        form.setFieldsValue({ ...DEFAULT_CONFIG, ...parsed });
      } catch (e) {
        form.setFieldsValue(DEFAULT_CONFIG);
      }
    } else {
      form.setFieldsValue(DEFAULT_CONFIG);
    }
  }, [form]);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('capy_intro_config', JSON.stringify(values));
      message.success('Đã lưu cấu hình trang Intro thành công!');
      setLoading(false);
    }, 600);
  };

  const handleReset = () => {
    form.setFieldsValue(DEFAULT_CONFIG);
    message.info('Đã khôi phục cài đặt gốc. Hãy bấm Lưu để áp dụng.');
  };

  // ── Form Components ──
  const HeroTab = () => (
    <div className="space-y-4">
      <Card className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
        <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
          <i className="bi bi-fonts text-[#ff5c00]" /> Nội dung Hero Banner
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Huy hiệu (Badge)</span>} name="heroBadge" rules={[{ required: true }]}>
            <Input size="large" className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00]" />
          </Form.Item>
          
          <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Dòng tiêu đề 1</span>} name="heroTitle1" rules={[{ required: true }]}>
            <Input size="large" className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00]" />
          </Form.Item>
          
          <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Dòng tiêu đề 2 (Màu cam)</span>} name="heroTitle2" rules={[{ required: true }]}>
            <Input size="large" className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00]" />
          </Form.Item>
          
          <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Dòng tiêu đề 3</span>} name="heroTitle3" rules={[{ required: true }]}>
            <Input size="large" className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00]" />
          </Form.Item>
        </div>

        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Đoạn mô tả ngắn (Description)</span>} name="heroDesc" rules={[{ required: true }]}>
          <Input.TextArea rows={3} className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00]" />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Chữ trên nút (Button Text)</span>} name="primaryBtnText" rules={[{ required: true }]}>
          <Input size="large" className="!rounded-xl hover:!border-[#ff5c00]/50 focus:!border-[#ff5c00] w-full md:w-1/2" />
        </Form.Item>
      </Card>

      <Card className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
        <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
          <i className="bi bi-palette-fill text-[#6366f1]" /> Giao diện & Màu sắc
        </h3>
        
        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Chế độ màu nền (Background Blooms)</span>} name="bgStyle">
          <Select size="large" className="!rounded-xl w-full md:w-1/2">
            <Select.Option value="default">Mặc định (Cam, Xanh, Tím)</Select.Option>
            <Select.Option value="orange">Mặt trời hoàng hôn (Full Cam)</Select.Option>
            <Select.Option value="purple">Vũ trụ (Tím mộng mơ)</Select.Option>
            <Select.Option value="blue">Đại dương (Xanh dương)</Select.Option>
            <Select.Option value="mono">Đơn sắc (Trắng xám)</Select.Option>
          </Select>
        </Form.Item>
      </Card>
    </div>
  );

  const StatsTab = () => (
    <div className="space-y-4">
      <Form.List name="stats">
        {(fields) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <Card key={field.key} className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
                <h3 className="text-[14px] font-bold text-[#1d1d1f] mb-4">Cột Thống kê {index + 1}</h3>
                
                <Form.Item label={<span className="text-[13px]">Giá trị (VD: 1,000+)</span>} name={[field.name, 'value']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
                <Form.Item label={<span className="text-[13px]">Nhãn mô tả</span>} name={[field.name, 'label']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
                <Form.Item label={<span className="text-[13px]">Icon (Bootstrap icon class)</span>} name={[field.name, 'icon']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
              </Card>
            ))}
          </div>
        )}
      </Form.List>
    </div>
  );

  const FeaturesTab = () => (
    <div className="space-y-4">
      <Form.List name="features">
        {(fields) => (
          <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => (
              <Card key={field.key} className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
                <h3 className="text-[14px] font-bold text-[#1d1d1f] mb-4">Tính năng {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label={<span className="text-[13px]">Tiêu đề tính năng</span>} name={[field.name, 'title']} rules={[{ required: true }]}>
                    <Input size="large" className="!rounded-xl" />
                  </Form.Item>
                  <Form.Item label={<span className="text-[13px]">Icon</span>} name={[field.name, 'icon']} rules={[{ required: true }]}>
                    <Input size="large" className="!rounded-xl" />
                  </Form.Item>
                </div>
                <Form.Item label={<span className="text-[13px]">Mô tả chi tiết</span>} name={[field.name, 'desc']} rules={[{ required: true }]}>
                  <Input.TextArea rows={2} className="!rounded-xl" />
                </Form.Item>
                <Form.Item label={<span className="text-[13px]">Từ khóa nổi bật (Cách nhau bằng dấu phẩy)</span>} name={[field.name, 'highlights']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label={<span className="text-[13px]">Chữ nút link</span>} name={[field.name, 'link']} rules={[{ required: true }]}>
                    <Input size="large" className="!rounded-xl" />
                  </Form.Item>
                  <Form.Item label={<span className="text-[13px]">Mã màu Icon (VD: #ff5c00)</span>} name={[field.name, 'color']} rules={[{ required: true }]}>
                    <Input size="large" type="color" className="!rounded-xl p-1 h-10 w-full" />
                  </Form.Item>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Form.List>
    </div>
  );

  const StepsTab = () => (
    <div className="space-y-4">
      <Form.List name="steps">
        {(fields) => (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map((field, index) => (
              <Card key={field.key} className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
                <h3 className="text-[14px] font-bold text-[#1d1d1f] mb-4">Bước {index + 1}</h3>
                
                <Form.Item label={<span className="text-[13px]">Tiêu đề bước</span>} name={[field.name, 'title']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
                <Form.Item label={<span className="text-[13px]">Mô tả</span>} name={[field.name, 'desc']} rules={[{ required: true }]}>
                  <Input.TextArea rows={3} className="!rounded-xl" />
                </Form.Item>
                <Form.Item label={<span className="text-[13px]">Icon</span>} name={[field.name, 'icon']} rules={[{ required: true }]}>
                  <Input size="large" className="!rounded-xl" />
                </Form.Item>
              </Card>
            ))}
          </div>
        )}
      </Form.List>
    </div>
  );

  const CTATab = () => (
    <div className="space-y-4">
      <Card className="!rounded-2xl !border-black/[0.04] !bg-black/[0.01]" styles={{ body: { padding: '20px' } }}>
        <h3 className="text-[15px] font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
          <i className="bi bi-box-arrow-up-right text-[#10b981]" /> Kêu gọi hành động cuối trang
        </h3>
        
        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Tiêu đề</span>} name="ctaTitle" rules={[{ required: true }]}>
          <Input size="large" className="!rounded-xl" />
        </Form.Item>
        
        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Mô tả</span>} name="ctaDesc" rules={[{ required: true }]}>
          <Input.TextArea rows={3} className="!rounded-xl" />
        </Form.Item>
        
        <Form.Item label={<span className="font-semibold text-black/60 text-[13px]">Chữ trên nút đăng ký</span>} name="ctaBtn" rules={[{ required: true }]}>
          <Input size="large" className="!rounded-xl w-full md:w-1/2" />
        </Form.Item>
      </Card>
    </div>
  );

  const tabItems = [
    { key: '1', label: 'Banner chính', children: <HeroTab /> },
    { key: '2', label: 'Thống kê (Stats)', children: <StatsTab /> },
    { key: '3', label: 'Tính năng', children: <FeaturesTab /> },
    { key: '4', label: 'Các bước', children: <StepsTab /> },
    { key: '5', label: 'Kêu gọi cuối trang', children: <CTATab /> },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-black/[0.04] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] relative overflow-hidden">
          {/* Subtle bg decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff5c00]/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#1d1d1f] mb-1">Cấu hình Landing Page Toàn diện</h2>
              <p className="text-[14px] font-medium text-black/50">Tùy chỉnh tiêu đề, hình ảnh, tính năng và tất cả mọi thứ trên trang giới thiệu.</p>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Button onClick={handleReset} 
                className="!rounded-xl !border-black/[0.08] !text-black/60 hover:!text-black hover:!border-black/20 !font-semibold">
                Khôi phục gốc
              </Button>
              <Button type="primary" onClick={() => form.submit()} loading={loading}
                className="!rounded-xl !bg-[#ff5c00] hover:!bg-[#ff4500] !border-none !font-semibold shadow-sm">
                Lưu toàn bộ
              </Button>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Tabs defaultActiveKey="1" items={tabItems} className="custom-intro-tabs" />
          </Form>

        </div>
      </motion.div>
    </div>
  );
}
