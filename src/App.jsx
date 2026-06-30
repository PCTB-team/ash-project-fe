/**
 * App.jsx — Root Router
 * 
 * Chỉ chịu trách nhiệm:
 * - Định nghĩa Routes (URL → Page)
 * - Redirect logic cơ bản
 * - Navigation handlers cho các trang public
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import GlobalLoading from './components/common/GlobalLoading.jsx';

// ── Guards ──
import PublicRoute from './routes/PublicRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

// ── Lazy Pages ──
const IntroScreen = lazy(() => import('./features/intro/pages/IntroScreen.jsx'));
const NotFoundScreen = lazy(() => import('./features/intro/pages/NotFoundScreen.jsx'));
const LoginScreen = lazy(() => import('./features/auth/pages/LoginScreen.jsx'));
const ForgotPasswordScreen = lazy(() => import('./features/auth/pages/ForgotPasswordScreen.jsx'));

// ── Dashboard Pages ──
const DashboardLayout = lazy(() => import('./features/dashboard/layouts/DashboardLayout.jsx'));
const DashboardScreen = lazy(() => import('./features/documents/pages/DashboardScreen.jsx'));
const ProfileScreen = lazy(() => import('./features/profile/pages/ProfileScreen.jsx'));
const TrashScreen = lazy(() => import('./features/trash/pages/TrashScreen.jsx'));
const AIScreen = lazy(() => import('./features/ai/pages/AIScreen.jsx'));

// ── Payment Pages ──
const PaymentScreen = lazy(() => import('./features/payment/pages/PaymentScreen.jsx'));
const PaymentSuccessScreen = lazy(() => import('./features/payment/pages/PaymentSuccessScreen.jsx'));
const PaymentCancelScreen = lazy(() => import('./features/payment/pages/PaymentCancelScreen.jsx'));

// ── Groups Pages ──
const CommunityScreen = lazy(() => import('./features/groups/pages/CommunityScreen.jsx'));
const GroupDetailScreen = lazy(() => import('./features/groups/pages/GroupDetailScreen.jsx'));
const JoinGroupScreen = lazy(() => import('./features/groups/pages/JoinGroupScreen.jsx'));

// ── Admin Pages ──
const AdminLayout = lazy(() => import('./features/admin/layouts/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('./features/admin/pages/AdminUsers.jsx'));
const AdminDocuments = lazy(() => import('./features/admin/pages/AdminDocuments.jsx'));
const AdminGroups = lazy(() => import('./features/admin/pages/AdminGroups.jsx'));
const AdminPayments = lazy(() => import('./features/admin/pages/AdminPayments.jsx'));
const AdminAI = lazy(() => import('./features/admin/pages/AdminAI.jsx'));
const AdminSettings = lazy(() => import('./features/admin/pages/AdminSettings.jsx'));
const AdminIntroConfig = lazy(() => import('./features/admin/pages/AdminIntroConfig.jsx'));

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    navigate(redirect || '/dashboard');
  };

  const handleAdminLoginSuccess = () => {
    navigate('/admin');
  };

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/login" element={<LoginScreen currentView="login" onLoginSuccess={handleLoginSuccess} onAdminLoginSuccess={handleAdminLoginSuccess} />} />
          <Route path="/register" element={<LoginScreen currentView="register" onLoginSuccess={handleLoginSuccess} onAdminLoginSuccess={handleAdminLoginSuccess} />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        </Route>

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="trash" element={<TrashScreen />} />
            <Route path="group" element={<CommunityScreen />} />
            <Route path="group/:groupId" element={<GroupDetailScreen />} />
            <Route path="group/:groupId/:tab" element={<GroupDetailScreen />} />
            <Route path="ai" element={<AIScreen />} />
            <Route path="payment" element={<PaymentScreen />} />
          </Route>
          
          {/* Payment Callbacks */}
          <Route path="/payment/success" element={<PaymentSuccessScreen />} />
          <Route path="/payment/cancel" element={<PaymentCancelScreen />} />
        </Route>

        {/* Admin Pages (Role-based guard) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="ai" element={<AdminAI />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="intro-config" element={<AdminIntroConfig />} />
          </Route>
        </Route>

        {/* Unguarded Pages (Accessible to both logged-in and guests) */}
        <Route path="/join/:inviteToken" element={<JoinGroupScreen />} />

        {/* Fallback */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Suspense>
  );
}

export default App;
