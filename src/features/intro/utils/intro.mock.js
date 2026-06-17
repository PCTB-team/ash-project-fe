export const simulationData = [
  { type: 'user', text: '> Giải thích độ phức tạp thuật toán Quicksort?' },
  { type: 'ai', text: '💡 [Quicksort Complexity Analysis]\n- Tốt nhất: O(N log N) (Phân hoạch đều)\n- Trung bình: O(N log N)\n- Tồi nhất: O(N²) (Mảng đã được sắp xếp sẵn)' },
  { type: 'user', text: '> Tóm tắt chương 3 môn Đại số tuyến tính?' },
  { type: 'ai', text: '📐 [Đại số tuyến tính - Chương 3: Không gian vectơ]\n1. Định nghĩa Không gian vectơ con.\n2. Sự độc lập tuyến tính & Tập sinh.\n3. Số chiều (Dimension) và Cơ sở (Basis).' },
  { type: 'user', text: '> Lập lộ trình ôn thi môn Hệ điều hành?' },
  { type: 'ai', text: '🔥 [Lộ trình 3 ngày chinh phục OS]\n- Ngày 1: Quản lý Tiến trình & Lập lịch CPU\n- Ngày 2: Đồng bộ hóa & Luồng (Threads)\n- Ngày 3: Quản lý Bộ nhớ ảo & Giải thuật thay thế trang' }
];

export const problemsList = [
  'Tài liệu rải rác trên Google Drive, Messenger, Zalo và ổ cứng gây thất lạc.',
  'Mất quá nhiều thời gian để mò tìm lại một file PDF, slide giáo trình hoặc bài giảng cũ.',
  'Đọc hàng trăm trang tài liệu dày đặc để ôn tập chuẩn bị thi cử gây quá tải.',
];

export const solutionsList = [
  'Mọi giáo trình được lưu trữ tập trung và tự động phân loại thông minh theo môn học.',
  'Hệ thống tìm kiếm thông minh từ khóa, chủ đề, tự động gắn nhãn phân mục khoa học.',
  'Trợ lý học thuật AI đọc, hiểu tài liệu, hỗ trợ giải đáp & thiết kế câu hỏi ôn thi tức thì.',
];

export const featuresList = [
  { icon: 'bi-folder2-open', title: 'Quản lý tập trung', desc: 'Lưu trữ bài giảng, PDF, tài liệu nghiên cứu tập trung khoa học tại một nơi duy nhất.', link: 'Đến thư viện', view: 'dashboard' },
  { icon: 'bi-shield-check', title: 'Lưu trữ đám mây', desc: 'Đồng bộ hóa dữ liệu đám mây thời gian thực, truy xuất mọi lúc mọi nơi từ điện thoại, laptop.', link: 'Mở kho lưu trữ', view: 'dashboard' },
  { icon: 'bi-stars', title: 'Trợ lý AI thông minh', desc: 'Trò chuyện, đặt câu hỏi, tóm tắt tự động giáo trình hàng trăm trang chỉ trong vài giây.', link: 'Nhắn tin với AI', view: 'ai' },
  { icon: 'bi-people', title: 'Nhóm học tập', desc: 'Tham gia các nhóm trao đổi tài liệu, bài tập lớn, kết nối tri thức cùng đồng đội.', link: 'Vào nhóm học tập', view: 'community' },
];

export const footerProducts = [
  { label: 'Kho tài liệu', action: 'login', redirect: '/dashboard' },
  { label: 'Trợ lý AI', action: 'login', redirect: '/dashboard/ai' },
  { label: 'Nhóm học tập', action: 'login', redirect: '/dashboard/group' },
  { label: 'Lưu trữ đám mây', action: 'login', redirect: '/dashboard' },
];

export const footerCommunity = [
  { label: 'Hướng dẫn sử dụng', action: '/' },
  { label: 'Câu hỏi thường gặp', action: '/' },
  { label: 'Blog & Tin tức', action: '/' },
  { label: 'Cộng đồng', action: '/dashboard/group' },
];

export const footerSupport = [
  { label: 'Hỗ trợ kỹ thuật', type: 'text' },
  { label: 'capystudy.team@gmail.com', type: 'email', color: 'text-[#ff5c00]' },
  { label: 'Báo lỗi & Phản hồi', type: 'text' },
];
