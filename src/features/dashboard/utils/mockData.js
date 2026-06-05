// Thư viện Mock Data tập trung cho toàn dự án
// Sử dụng chuẩn thời gian ISO 8601 để tương thích với Backend

// Lấy thời điểm hiện tại trừ đi số phút để mô phỏng dữ liệu "Mới đây"
const getPastDate = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000).toISOString();



export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Phân tích tài liệu hoàn tất',
    desc: 'AI đã hoàn thành phân tích "Giáo trình Triết học.pdf"',
    time: getPastDate(5),
    icon: 'bi-robot',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 2,
    title: 'Hệ thống cập nhật',
    desc: 'Bảo trì máy chủ dự kiến vào 00:00 đêm nay.',
    time: getPastDate(120),
    icon: 'bi-shield-exclamation',
    color: 'text-[#ff5c00]',
    bg: 'bg-[#ff5c00]/10'
  }
];

export const OLDER_NOTIFICATIONS = [
  {
    id: 4,
    title: 'Trợ lý AI đã tóm tắt xong 50 trang tài liệu "Triết học Mác-Lênin"',
    time: getPastDate(2880), // 2 days ago
    isRead: true,
    icon: 'bi-file-earmark-text text-[#007aff]',
    bg: 'bg-[#007aff]/10'
  },
  {
    id: 5,
    title: 'Nhóm "Đồ án Tốt nghiệp" vừa tải lên 3 tài liệu mới',
    time: getPastDate(4320), // 3 days ago
    isRead: true,
    icon: 'bi-cloud-arrow-up text-[#ff5c00]',
    bg: 'bg-[#ff5c00]/10'
  },
  {
    id: 6,
    title: 'Dung lượng lưu trữ của bạn sắp đầy (Đã dùng 95%)',
    time: getPastDate(5760), // 4 days ago
    isRead: true,
    icon: 'bi-exclamation-triangle text-[#ff3b30]',
    bg: 'bg-[#ff3b30]/10'
  },
  {
    id: 7,
    title: 'Bạn đã đạt mốc 10.000 điểm cống hiến cộng đồng!',
    time: getPastDate(10080), // 1 week ago
    isRead: true,
    icon: 'bi-trophy text-[#ffd60a]',
    bg: 'bg-[#ffd60a]/10'
  }
];

