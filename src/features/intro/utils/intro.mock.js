// ── Stats Data ──
export const statsData = [
  { value: '1,000+', label: 'Tài liệu đã lưu trữ', icon: 'bi-file-earmark-text' },
  { value: '500+', label: 'Sinh viên tin dùng', icon: 'bi-people' },
  { value: '24/7', label: 'Trợ lý AI luôn sẵn sàng', icon: 'bi-robot' },
  { value: '100%', label: 'Miễn phí sử dụng', icon: 'bi-shield-check' },
];

// ── Features Data (3 main features tied to real dashboard) ──
export const featuresList = [
  {
    icon: 'bi-folder2-open',
    color: '#007aff',
    title: 'Quản lý tài liệu thông minh',
    desc: 'Tải lên PDF, DOCX, hình ảnh, video bài giảng — tất cả được tổ chức khoa học trong một nơi duy nhất. Phân loại tự động theo định dạng, tìm kiếm tức thì, quản lý thư mục lồng nhau.',
    highlights: ['Upload kéo thả', 'Phân loại tự động', 'Tìm kiếm thông minh', 'Quản lý folder'],
    link: 'Quản lý ngay',
    view: 'dashboard',
  },
  {
    icon: 'bi-stars',
    color: '#ff5c00',
    title: 'Trợ lý AI học thuật',
    desc: 'Đặt câu hỏi, tóm tắt giáo trình hàng trăm trang chỉ trong vài giây. AI hiểu ngữ cảnh tài liệu của bạn, hỗ trợ giải đáp và tạo đề ôn thi cá nhân hóa.',
    highlights: ['Tóm tắt tài liệu', 'Giải đáp câu hỏi', 'Tạo đề ôn thi', 'Phân tích nội dung'],
    link: 'Trò chuyện với AI',
    view: 'ai',
  },
  {
    icon: 'bi-people-fill',
    color: '#34c759',
    title: 'Nhóm học tập',
    desc: 'Tạo nhóm riêng, mời bạn bè bằng link, chia sẻ tài liệu và cùng thảo luận. Kết nối tri thức cùng đồng đội trong nhóm học tập trực tuyến.',
    highlights: ['Tạo nhóm học tập', 'Chia sẻ qua link', 'Thảo luận nhóm', 'Quản lý thành viên'],
    link: 'Vào nhóm học tập',
    view: 'community',
  },
];

// ── How It Works Data ──
export const howItWorksData = [
  {
    step: 1,
    icon: 'bi-person-plus-fill',
    title: 'Đăng ký tài khoản',
    desc: 'Tạo tài khoản miễn phí chỉ trong 30 giây với email hoặc tài khoản Google.',
  },
  {
    step: 2,
    icon: 'bi-cloud-arrow-up-fill',
    title: 'Tải lên tài liệu',
    desc: 'Upload giáo trình, slide, bài giảng — hệ thống tự động phân loại và lưu trữ đám mây an toàn.',
  },
  {
    step: 3,
    icon: 'bi-lightning-charge-fill',
    title: 'Học thông minh với AI',
    desc: 'Đặt câu hỏi cho AI, tóm tắt tài liệu, tham gia nhóm học tập — tất cả trên một nền tảng.',
  },
];

// ── Dashboard Preview Mock (for hero section) ──
export const dashboardPreviewFiles = [
  { name: 'Giao_trinh_CTDL.pdf', type: 'pdf', size: '2.4 MB', time: '2 giờ trước' },
  { name: 'Bai_giang_OOP_Ch5.docx', type: 'docx', size: '1.1 MB', time: '5 giờ trước' },
  { name: 'Slide_Mang_MT.pptx', type: 'pptx', size: '4.7 MB', time: '1 ngày trước' },
  { name: 'De_thi_CSDL_2024.pdf', type: 'pdf', size: '890 KB', time: '2 ngày trước' },
];

// ── Footer Data ──
export const footerProducts = [
  { label: 'Quản lý tài liệu', action: 'login', redirect: '/dashboard' },
  { label: 'Trợ lý AI', action: 'login', redirect: '/dashboard/ai' },
  { label: 'Nhóm học tập', action: 'login', redirect: '/dashboard/group' },
];

export const footerProjectInfo = [
  'Đồ án môn học',
  'React + Vite + Ant Design',
  'Spring Boot Backend',
  'Cloudinary Storage',
];

export const footerContact = [
  { label: 'capystudy.team@gmail.com', type: 'email', color: 'text-[#ff5c00]' },
  { label: 'GitHub: PCTB-team', type: 'text' },
  { label: 'TP. Hồ Chí Minh, Việt Nam', type: 'text' },
];
