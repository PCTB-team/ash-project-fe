/**
 * Tiện ích định dạng ngày tháng chuẩn React
 * Hỗ trợ chuyển đổi chuỗi ISO thành các định dạng hiển thị đẹp mắt cho người dùng.
 */

// Hàm định dạng thời gian tương đối (Ví dụ: "Vừa xong", "5 phút trước", "Hôm qua")
export const formatRelativeTime = (isoString) => {
  if (!isoString) return '';
  
  // Xử lý các chuỗi cứng đặc biệt đang có sẵn trong dự án (mock data fallback)
  if (isoString.includes('phút trước') || isoString.includes('giờ trước') || isoString.includes('Hôm nay') || isoString.includes('Hôm qua')) {
    return isoString;
  }
  
  // Nếu là format cũ "DD/MM/YYYY" thì trả về nguyên bản
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(isoString)) {
     return isoString;
  }

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 172800) return 'Hôm qua';

    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return isoString;
  }
};


