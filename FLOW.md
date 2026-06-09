# 🔄 Capy Study FE — Code Flow Documentation

Tài liệu mô tả luồng hoạt động (flow) của toàn bộ ứng dụng frontend.

---

## 📁 Cấu trúc dự án

```
src/
├── main.jsx                          # 🚀 Entry point — khởi tạo React app
├── App.jsx                           # 🗺️ Router — định nghĩa tất cả Routes
├── index.css                         # 🎨 Global CSS + Font + Tailwind
│
├── assets/                           # 🖼️ Hình ảnh (logo, mascot)
│   ├── logo.png                      #    Logo Capybara chính
│   ├── logo_AI.png                   #    Logo cho floating AI assistant
│   ├── logo_fire.png                 #    Logo lửa (Profile page)
│   └── logo_folder.png              #    Logo folder (Profile page)
│
└── features/                         # 📦 Feature modules (chia theo chức năng)
    │
    ├── auth/                         # 🔐 Authentication (Đăng nhập / Đăng ký)
    │   ├── components/               #    UI: AuthCard, LoginForm, RegisterForm, GoogleButton, OTP...
    │   ├── hooks/useAuth.js          #    Logic: gọi API login/register/OTP/Google
    │   ├── pages/                    #    Pages: LoginScreen, ForgotPasswordScreen
    │   └── utils/constants.js        #    Hằng số: animation, CSS classes, admin credentials
    │
    ├── dashboard/                    # 📊 Dashboard (Trang chính sau đăng nhập)
    │   ├── components/               #    UI: DocumentManager, DocumentViewer, FileIcon
    │   ├── hooks/useDragScroll.js    #    Hook: kéo scroll ngang cho tab bar
    │   ├── layouts/                  #    Layout: MainLayout (Sidebar + Header + Content)
    │   ├── pages/                    #    Pages: DashboardFeature, DashboardScreen, ProfileScreen, TrashScreen
    │   └── utils/                    #    Helpers: dateUtils, fileConfig, helpers, notificationData
    │
    └── intro/                        # 🏠 Landing Page (Trang giới thiệu)
        ├── components/               #    UI: IntroHeader, IntroFooter
        ├── pages/                    #    Pages: IntroScreen + intro_styles.css
        └── utils/intro.mock.js       #    Data: nội dung giới thiệu, simulation chat
```

---

## 🚀 Flow 1: Khởi chạy ứng dụng

```
main.jsx
  │
  ├── 1. Wrap app với <StrictMode>
  ├── 2. Wrap với <GoogleOAuthProvider> (Google Login SDK)
  ├── 3. Wrap với <BrowserRouter> (React Router)
  └── 4. Render <App /> component
         │
         └── App.jsx kiểm tra:
              ├── Có accessToken trong localStorage?
              │   ├── CÓ  → redirect đến /dashboard
              │   └── KHÔNG → giữ nguyên route hiện tại
              │
              └── Render Routes:
                   ├── /                  → IntroScreen (Landing page)
                   ├── /login             → LoginScreen (mode: login)
                   ├── /register          → LoginScreen (mode: register)
                   ├── /forgot-password   → ForgotPasswordScreen
                   ├── /dashboard         → DashboardFeature
                   └── /*                 → Redirect về /
```

---

## 🔐 Flow 2: Đăng nhập / Đăng ký

### 2a. Đăng nhập thường

```
LoginScreen (currentView="login")
  │
  ├── Render: AuthLayout → AuthCard → LoginForm
  │
  └── User nhập email + password → Submit
       │
       └── useAuth.handleLogin()
            │
            ├── Kiểm tra admin credentials (hardcode)
            │   └── Match → setToken("admin_mock_token") → onLoginSuccess()
            │
            └── Gọi POST /api/v1/auth/login
                 │
                 ├── 200 OK → Lưu accessToken + refreshToken vào localStorage
                 │            → message.success() → onLoginSuccess()
                 │            → App.jsx navigate('/dashboard')
                 │
                 └── 401/403 → Hiện lỗi "Sai mật khẩu"
```

### 2b. Đăng ký

```
LoginScreen (currentView="register")
  │
  ├── Render: AuthLayout → AuthCard → RegisterForm
  │
  └── User nhập thông tin → Submit
       │
       └── useAuth.handleRegister()
            │
            ├── Validate: username ≥ 2 ký tự, fullname, password match
            │
            └── POST /api/v1/auth/register
                 │
                 ├── 200 OK → Chuyển sang OtpVerification component
                 │            → User nhập mã OTP từ email
                 │            → POST /api/v1/auth/otp-verification
                 │            → Thành công → Chuyển về Login
                 │
                 └── 409 → "Email đã tồn tại"
```

### 2c. Google Login

```
GoogleButton component
  │
  └── Google SDK trả về credential token
       │
       └── useAuth.handleGoogleLogin(credential)
            │
            └── POST /api/v1/auth/google-login { token: credential }
                 │
                 └── 200 OK → Lưu tokens → navigate('/dashboard')
```

---

## 📊 Flow 3: Dashboard (Trang chính)

```
DashboardFeature (Container component)
  │
  ├── 1. KHỞI TẠO STATE:
  │    ├── documents        (từ localStorage + API)
  │    ├── trashDocuments    (từ API)
  │    ├── fullName          (từ localStorage hoặc JWT decode)
  │    ├── avatarUrl, accentColor, searchTerm
  │    └── currentView       (dashboard | profile | trash)
  │
  ├── 2. FETCH DATA (useEffect lần đầu):
  │    ├── fetchDocuments()    → GET /api/v1/documents
  │    │   └── Merge API docs + localStorage docs → setDocuments()
  │    └── fetchTrashDocuments() → GET /api/v1/documents/trash
  │
  ├── 3. RENDER LAYOUT:
  │    └── <MainLayout>        ← Wrapper layout
  │         ├── <Sidebar>      ← Navigation trái (Home, Profile, Trash, Logout)
  │         ├── <AppHeader>    ← Search bar + Notifications + Avatar
  │         └── {children}     ← Nội dung page (tuỳ currentView)
  │
  └── 4. RENDER CONTENT (theo currentView):
       │
       ├── "dashboard" → <DashboardScreen>
       │    ├── DocumentManager (bảng tài liệu chính)
       │    │   ├── Classification Tabs (Tất cả, Tài liệu, Âm thanh, Video...)
       │    │   ├── Sort by extension
       │    │   ├── Folder navigation (breadcrumb)
       │    │   ├── Paginated document list
       │    │   └── Inline folder creation
       │    ├── Upload Modal (Form + Drag & Drop)
       │    ├── DocumentViewer Modal (Preview + Download)
       │    └── Floating AI Assistant button (draggable)
       │
       ├── "profile" → <ProfileScreen>
       │    ├── Avatar upload
       │    ├── Thông tin tài khoản
       │    ├── Storage statistics (dung lượng)
       │    └── Accent color picker
       │
       └── "trash" → <TrashScreen>
            ├── Danh sách tài liệu đã xóa
            ├── Khôi phục → PUT /api/v1/documents/{id}/restore
            └── Xóa vĩnh viễn → DELETE /api/v1/documents/{id}/permanent
```

---

## 📄 Flow 4: Upload tài liệu

```
DashboardScreen
  │
  ├── User nhấn "Tải lên tài liệu" → showUploadModal = true
  │
  └── Upload Modal mở ra:
       │
       ├── Drag & Drop file → setSelectedFile() + auto-fill form (name, type, size)
       │
       └── Submit form → handleUploadSubmit()
            │
            ├── Tạo FormData (file, name, type, content)
            │
            └── POST /api/v1/documents/uploads (multipart/form-data)
                 │
                 ├── 200 OK + result →
                 │   ├── Tạo newDoc object từ API response
                 │   ├── onAddDocument(newDoc) → cập nhật state + localStorage
                 │   └── onRefreshDocuments() → re-fetch từ API
                 │
                 └── Error → message.error()
```

---

## 🔓 Flow 5: Đăng xuất

```
Sidebar → nhấn "Đăng xuất"
  │
  └── DashboardFeature.handleLogoutClick()
       │
       ├── POST /api/v1/auth/logout { refreshToken }
       │
       └── finally:
            ├── localStorage.removeItem('accessToken')
            ├── localStorage.removeItem('refreshToken')
            └── onLogout() → App.jsx navigate('/')
                              → Về IntroScreen
```

---

## 🔗 Danh sách API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/v1/auth/login` | Đăng nhập |
| POST | `/api/v1/auth/register` | Đăng ký |
| POST | `/api/v1/auth/otp-verification` | Xác minh OTP |
| POST | `/api/v1/auth/otp-requests` | Gửi lại OTP |
| POST | `/api/v1/auth/google-login` | Đăng nhập Google |
| POST | `/api/v1/auth/logout` | Đăng xuất |
| POST | `/api/v1/auth/refresh-token` | Refresh token |
| GET | `/api/v1/documents` | Danh sách tài liệu |
| POST | `/api/v1/documents/uploads` | Upload tài liệu |
| PUT | `/api/v1/documents/{id}` | Đổi tên tài liệu |
| DELETE | `/api/v1/documents/{id}` | Xóa tài liệu (vào thùng rác) |
| GET | `/api/v1/documents/{id}/download` | Tải tài liệu |
| GET | `/api/v1/documents/trash` | Danh sách thùng rác |
| PUT | `/api/v1/documents/{id}/restore` | Khôi phục từ thùng rác |
| DELETE | `/api/v1/documents/{id}/permanent` | Xóa vĩnh viễn |

---

## 📦 Thư viện sử dụng

| Package | Vai trò |
|---------|---------|
| `react` + `react-dom` | UI Framework |
| `react-router-dom` | Client-side routing |
| `antd` | UI Components (Button, Modal, Tag, Form, Popover...) |
| `framer-motion` | Animations & micro-interactions |
| `@react-oauth/google` | Google OAuth 2.0 login |
| `bootstrap-icons` | Icon library |
| `tailwindcss` | Utility-first CSS |
