/**
 * admin.mock.js — Mock data cho Admin Panel
 */
const randomDate = (start, end) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
};
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const MOCK_USERS = [
  { id: 'u1', username: 'admin', fullname: 'Admin Hệ Thống', email: 'admin@capystudy.com', roles: ['ADMIN'], status: 'ACTIVE', storageUsed: 52428800, storageMax: 5368709120, createdAt: '2025-01-15T08:00:00Z', lastLogin: '2026-06-25T10:30:00Z', avatar: null, documentsCount: 12, groupsCount: 3 },
  { id: 'u2', username: 'nguyenvana', fullname: 'Nguyễn Văn An', email: 'vanan@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 125829120, storageMax: 524288000, createdAt: '2025-03-20T14:30:00Z', lastLogin: '2026-06-24T09:15:00Z', avatar: null, documentsCount: 45, groupsCount: 5 },
  { id: 'u3', username: 'tranthib', fullname: 'Trần Thị Bình', email: 'binhtt@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 209715200, storageMax: 524288000, createdAt: '2025-04-10T09:00:00Z', lastLogin: '2026-06-25T16:45:00Z', avatar: null, documentsCount: 67, groupsCount: 3 },
  { id: 'u4', username: 'lehoangc', fullname: 'Lê Hoàng Cường', email: 'cuonglh@gmail.com', roles: ['USER'], status: 'BANNED', storageUsed: 31457280, storageMax: 524288000, createdAt: '2025-05-02T11:20:00Z', lastLogin: '2026-05-15T08:00:00Z', avatar: null, documentsCount: 8, groupsCount: 1 },
  { id: 'u5', username: 'phamminhd', fullname: 'Phạm Minh Đức', email: 'ducpm@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 419430400, storageMax: 1073741824, createdAt: '2025-05-15T16:00:00Z', lastLogin: '2026-06-25T20:00:00Z', avatar: null, documentsCount: 120, groupsCount: 8 },
  { id: 'u6', username: 'hoangthuha', fullname: 'Hoàng Thu Hà', email: 'hoanghath@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 78643200, storageMax: 524288000, createdAt: '2025-06-01T07:30:00Z', lastLogin: '2026-06-23T14:20:00Z', avatar: null, documentsCount: 23, groupsCount: 2 },
  { id: 'u7', username: 'vudinhhung', fullname: 'Vũ Đình Hùng', email: 'hungvd@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 157286400, storageMax: 524288000, createdAt: '2025-06-20T10:00:00Z', lastLogin: '2026-06-25T11:30:00Z', avatar: null, documentsCount: 34, groupsCount: 4 },
  { id: 'u8', username: 'dothilan', fullname: 'Đỗ Thị Lan', email: 'landth@gmail.com', roles: ['USER'], status: 'INACTIVE', storageUsed: 5242880, storageMax: 524288000, createdAt: '2025-07-05T13:45:00Z', lastLogin: '2026-03-10T09:00:00Z', avatar: null, documentsCount: 2, groupsCount: 0 },
  { id: 'u9', username: 'buiquangm', fullname: 'Bùi Quang Minh', email: 'minhbq@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 314572800, storageMax: 1073741824, createdAt: '2025-07-18T08:15:00Z', lastLogin: '2026-06-25T22:00:00Z', avatar: null, documentsCount: 89, groupsCount: 6 },
  { id: 'u10', username: 'ngothanhnga', fullname: 'Ngô Thanh Nga', email: 'ngant@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 104857600, storageMax: 524288000, createdAt: '2025-08-01T15:30:00Z', lastLogin: '2026-06-24T17:00:00Z', avatar: null, documentsCount: 31, groupsCount: 3 },
  { id: 'u11', username: 'dangvanp', fullname: 'Đặng Văn Phong', email: 'phongdv@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 262144000, storageMax: 524288000, createdAt: '2025-08-22T09:00:00Z', lastLogin: '2026-06-25T08:45:00Z', avatar: null, documentsCount: 56, groupsCount: 4 },
  { id: 'u12', username: 'lythiq', fullname: 'Lý Thị Quỳnh', email: 'quynhlt@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 188743680, storageMax: 1073741824, createdAt: '2025-09-05T11:00:00Z', lastLogin: '2026-06-25T19:30:00Z', avatar: null, documentsCount: 43, groupsCount: 5 },
  { id: 'u13', username: 'trinhduc', fullname: 'Trịnh Đức Thắng', email: 'thangtd@gmail.com', roles: ['USER'], status: 'BANNED', storageUsed: 15728640, storageMax: 524288000, createdAt: '2025-09-20T14:20:00Z', lastLogin: '2026-04-01T10:00:00Z', avatar: null, documentsCount: 5, groupsCount: 1 },
  { id: 'u14', username: 'homait', fullname: 'Hồ Mai Trang', email: 'tranghm@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 367001600, storageMax: 1073741824, createdAt: '2025-10-08T08:00:00Z', lastLogin: '2026-06-24T21:15:00Z', avatar: null, documentsCount: 78, groupsCount: 7 },
  { id: 'u15', username: 'duongvant', fullname: 'Dương Văn Tuấn', email: 'tuandv@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 94371840, storageMax: 524288000, createdAt: '2025-10-25T16:30:00Z', lastLogin: '2026-06-25T13:00:00Z', avatar: null, documentsCount: 28, groupsCount: 2 },
  { id: 'u16', username: 'phanthiu', fullname: 'Phan Thị Uyên', email: 'uyenpt@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 146800640, storageMax: 524288000, createdAt: '2025-11-12T10:45:00Z', lastLogin: '2026-06-23T16:00:00Z', avatar: null, documentsCount: 37, groupsCount: 3 },
  { id: 'u17', username: 'caobav', fullname: 'Cao Bá Vương', email: 'vuongcb@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 471859200, storageMax: 2147483648, createdAt: '2025-11-28T07:00:00Z', lastLogin: '2026-06-25T23:00:00Z', avatar: null, documentsCount: 145, groupsCount: 10 },
  { id: 'u18', username: 'maithix', fullname: 'Mai Thị Xuân', email: 'xuanmt@gmail.com', roles: ['USER'], status: 'INACTIVE', storageUsed: 10485760, storageMax: 524288000, createdAt: '2025-12-15T12:00:00Z', lastLogin: '2026-02-20T15:30:00Z', avatar: null, documentsCount: 4, groupsCount: 1 },
  { id: 'u19', username: 'tadinhy', fullname: 'Tạ Đình Yên', email: 'yentd@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 220200960, storageMax: 1073741824, createdAt: '2026-01-10T09:30:00Z', lastLogin: '2026-06-25T07:30:00Z', avatar: null, documentsCount: 62, groupsCount: 5 },
  { id: 'u20', username: 'luongthiz', fullname: 'Lương Thị Zung', email: 'zunglt@gmail.com', roles: ['USER'], status: 'ACTIVE', storageUsed: 136314880, storageMax: 524288000, createdAt: '2026-02-05T14:00:00Z', lastLogin: '2026-06-24T12:00:00Z', avatar: null, documentsCount: 39, groupsCount: 3 },
];

const FILE_TYPES = ['PDF', 'IMAGE', 'AUDIO', 'VIDEO', 'OTHER'];
const FILE_EXT = { PDF: '.pdf', IMAGE: '.png', AUDIO: '.mp3', VIDEO: '.mp4', OTHER: '.zip' };
const DOC_NAMES = [
  'Bài giảng Toán cao cấp', 'Slide Vật lý đại cương', 'Đề thi Giải tích 1', 'Tóm tắt Lịch sử VN',
  'Giáo trình Lập trình C++', 'Bài tập Xác suất', 'Luận văn tốt nghiệp', 'Đồ án CSDL',
  'Ghi chú Triết học', 'Bản đồ tư duy Sinh', 'Recording buổi học', 'Video Lab hướng dẫn',
  'Tài liệu ôn cuối kỳ', 'Cheat sheet Công thức', 'Ảnh bảng ghi chú', 'Audio thuyết trình',
  'File nén bài tập lớn', 'Slide Marketing', 'Đề cương Kinh tế vi mô', 'Báo cáo thực tập',
  'Sách Data Science', 'Template báo cáo', 'Hình minh họa', 'File scan Đề cũ',
  'Podcast review sách', 'Video thí nghiệm Hóa', 'Câu hỏi trắc nghiệm', 'Slide Kỹ năng mềm',
  'Mind map Quản trị', 'File Excel phân tích',
];

export const MOCK_DOCUMENTS = DOC_NAMES.map((name, i) => {
  const type = FILE_TYPES[i % FILE_TYPES.length];
  const owner = MOCK_USERS[(i % (MOCK_USERS.length - 1)) + 1];
  return {
    id: `doc${i + 1}`, name: `${name}${FILE_EXT[type]}`, owner: owner.fullname, ownerEmail: owner.email,
    ownerId: owner.id, size: Math.floor(Math.random() * 50 * 1024 * 1024) + 102400, type, extension: FILE_EXT[type],
    uploadedAt: randomDate(new Date('2025-06-01'), new Date('2026-06-25')), status: Math.random() > 0.05 ? 'ACTIVE' : 'DELETED',
  };
});

const GROUP_NAMES = [
  'Nhóm Toán Cao Cấp K20', 'CLB Lập Trình FPT', 'Study Group IT-01', 'Ôn thi IELTS Together',
  'Nhóm Đồ Án Java', 'Team Machine Learning', 'Group Hóa Đại Cương', 'Review Sách Mỗi Tuần',
  'Nhóm Thực Tập DN', 'CLB Tiếng Anh', 'Lab AI Research', 'Nhóm Kinh Tế Vĩ Mô',
  'DevOps Study', 'Design Thinking Team', 'Nhóm Ôn Thi Cuối Kỳ'
];

export const MOCK_GROUPS = GROUP_NAMES.map((name, i) => {
  const leader = MOCK_USERS[(i % (MOCK_USERS.length - 1)) + 1];
  return {
    id: `g${i + 1}`, name, description: `Nhóm học tập về ${name.toLowerCase()}`,
    leader: leader.fullname, leaderId: leader.id, leaderEmail: leader.email,
    memberCount: Math.floor(Math.random() * 25) + 3, fileCount: Math.floor(Math.random() * 40) + 1,
    messageCount: Math.floor(Math.random() * 500) + 20,
    status: Math.random() > 0.1 ? 'ACTIVE' : 'LOCKED',
    createdAt: randomDate(new Date('2025-06-01'), new Date('2026-06-01')),
    lastActivity: randomDate(new Date('2026-06-01'), new Date('2026-06-25')),
    hasPassword: Math.random() > 0.6,
  };
});

const PLAN_NAMES = ['Gói Cơ Bản 1GB', 'Gói Tiêu Chuẩn 2GB', 'Gói Nâng Cao 5GB', 'Gói Premium 10GB'];
const PLAN_PRICES = [29000, 49000, 99000, 179000];

export const MOCK_PAYMENTS = Array.from({ length: 35 }, (_, i) => {
  const user = MOCK_USERS[(i % (MOCK_USERS.length - 1)) + 1];
  const planIdx = i % PLAN_NAMES.length;
  const status = i < 25 ? 'SUCCESS' : randomItem(['SUCCESS', 'FAILED', 'PENDING', 'CANCELLED']);
  return {
    id: `txn${i + 1}`, transactionId: `PAY${1719300000000 + i * 100000}`,
    user: user.fullname, userEmail: user.email, userId: user.id,
    plan: PLAN_NAMES[planIdx], amount: PLAN_PRICES[planIdx], status, paymentMethod: 'PayOS',
    createdAt: randomDate(new Date('2025-09-01'), new Date('2026-06-25')),
  };
});

export const MOCK_PLANS = [
  { id: 'plan1', name: 'Gói Cơ Bản', storage: 1073741824, price: 29000, currency: 'VND', active: true, subscriberCount: 45 },
  { id: 'plan2', name: 'Gói Tiêu Chuẩn', storage: 2147483648, price: 49000, currency: 'VND', active: true, subscriberCount: 78 },
  { id: 'plan3', name: 'Gói Nâng Cao', storage: 5368709120, price: 99000, currency: 'VND', active: true, subscriberCount: 34 },
  { id: 'plan4', name: 'Gói Premium', storage: 10737418240, price: 179000, currency: 'VND', active: true, subscriberCount: 12 },
];

const ACT_TYPES = ['USER_REGISTER', 'DOCUMENT_UPLOAD', 'GROUP_CREATE', 'PAYMENT_SUCCESS', 'AI_CHAT', 'USER_LOGIN'];
const ACT_LABELS = {
  USER_REGISTER: 'đã đăng ký tài khoản', DOCUMENT_UPLOAD: 'đã tải lên tài liệu',
  GROUP_CREATE: 'đã tạo nhóm học tập', PAYMENT_SUCCESS: 'đã nâng cấp gói lưu trữ',
  AI_CHAT: 'đã sử dụng AI Chatbot', USER_LOGIN: 'đã đăng nhập',
};

export const MOCK_ACTIVITIES = Array.from({ length: 15 }, (_, i) => {
  const user = MOCK_USERS[i % MOCK_USERS.length];
  const type = ACT_TYPES[i % ACT_TYPES.length];
  return { id: `act${i + 1}`, user: user.fullname, userId: user.id, avatar: user.avatar, type, description: ACT_LABELS[type], timestamp: randomDate(new Date('2026-06-24'), new Date('2026-06-26')) };
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const MOCK_DASHBOARD_STATS = {
  totalUsers: MOCK_USERS.length, totalDocuments: MOCK_DOCUMENTS.length, totalGroups: MOCK_GROUPS.length,
  totalRevenue: MOCK_PAYMENTS.filter(p => p.status === 'SUCCESS').reduce((s, p) => s + p.amount, 0),
  activeUsers: MOCK_USERS.filter(u => u.status === 'ACTIVE').length, newUsersThisMonth: 5, newDocsThisMonth: 42,
};

export const MOCK_USERS_CHART = [
  { month: 'T1', users: 3 }, { month: 'T2', users: 5 }, { month: 'T3', users: 4 }, { month: 'T4', users: 7 },
  { month: 'T5', users: 6 }, { month: 'T6', users: 8 }, { month: 'T7', users: 10 }, { month: 'T8', users: 9 },
  { month: 'T9', users: 12 }, { month: 'T10', users: 14 }, { month: 'T11', users: 11 }, { month: 'T12', users: 15 },
];
export const MOCK_UPLOADS_CHART = [
  { week: 'Tuần 1', uploads: 25 }, { week: 'Tuần 2', uploads: 38 },
  { week: 'Tuần 3', uploads: 30 }, { week: 'Tuần 4', uploads: 45 },
];
export const MOCK_FILE_TYPE_CHART = [
  { name: 'PDF', value: 45, color: '#ff5c00' }, { name: 'Hình ảnh', value: 25, color: '#6366f1' },
  { name: 'Âm thanh', value: 10, color: '#10b981' }, { name: 'Video', value: 12, color: '#f43f5e' },
  { name: 'Khác', value: 8, color: '#8b5cf6' },
];
export const MOCK_REVENUE_CHART = [
  { month: 'T1', revenue: 580000 }, { month: 'T2', revenue: 720000 }, { month: 'T3', revenue: 890000 },
  { month: 'T4', revenue: 650000 }, { month: 'T5', revenue: 1120000 }, { month: 'T6', revenue: 1450000 },
];

export const MOCK_AI_STATS = {
  totalMessages: 3842, totalConversations: 456, knowledgeChatPercent: 38, generalChatPercent: 62,
  documentsSummarized: 127, avgMessagesPerUser: 19.2,
  topUsers: [
    { userId: 'u5', name: 'Phạm Minh Đức', messages: 342, conversations: 45 },
    { userId: 'u17', name: 'Cao Bá Vương', messages: 298, conversations: 38 },
    { userId: 'u14', name: 'Hồ Mai Trang', messages: 256, conversations: 31 },
    { userId: 'u9', name: 'Bùi Quang Minh', messages: 234, conversations: 28 },
    { userId: 'u3', name: 'Trần Thị Bình', messages: 189, conversations: 24 },
  ],
};
export const MOCK_AI_USAGE_CHART = [
  { date: '20/06', messages: 120, knowledge: 45 }, { date: '21/06', messages: 145, knowledge: 52 },
  { date: '22/06', messages: 98, knowledge: 38 }, { date: '23/06', messages: 167, knowledge: 68 },
  { date: '24/06', messages: 189, knowledge: 74 }, { date: '25/06', messages: 210, knowledge: 82 },
  { date: '26/06', messages: 156, knowledge: 61 },
];

export const MOCK_SETTINGS = {
  general: { appName: 'Capy Study', maintenanceMode: false, allowRegistration: true, maxLoginAttempts: 5 },
  storage: { defaultStorageLimit: 524288000, maxFileSize: 52428800, allowedFileTypes: ['pdf','doc','docx','ppt','pptx','xls','xlsx','png','jpg','jpeg','gif','mp3','wav','mp4','avi','zip','rar'] },
  security: { otpExpiryMinutes: 5, sessionTimeoutMinutes: 30, passwordMinLength: 6, requireEmailVerification: true },
  notifications: { emailNotifications: true, loginAlerts: false, storageWarningPercent: 80 },
};
