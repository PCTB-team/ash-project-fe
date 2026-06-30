/**
 * App.jsx — Root Router
 * 
 * Chỉ chịu trách nhiệm:
 * - Định nghĩa Routes (URL → Page)
 * - Redirect logic cơ bản
 * - Navigation handlers cho các trang public
 */

import { Routes, Route, useNavigate } from 'react-router-dom';

// ── Guards ──
import PublicRoute from './routes/PublicRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

// ── Pages ──
import IntroScreen from './features/intro/pages/IntroScreen.jsx';
import NotFoundScreen from './features/intro/pages/NotFoundScreen.jsx';
import LoginScreen from './features/auth/pages/LoginScreen.jsx';
import ForgotPasswordScreen from './features/auth/pages/ForgotPasswordScreen.jsx';

// ── Dashboard Pages ──
import DashboardLayout from './features/dashboard/layouts/DashboardLayout.jsx';
import DashboardScreen from './features/documents/pages/DashboardScreen.jsx';
import ProfileScreen from './features/profile/pages/ProfileScreen.jsx';
import TrashScreen from './features/trash/pages/TrashScreen.jsx';
import AIScreen from './features/ai/pages/AIScreen.jsx';

// ── Payment Pages ──
import PaymentScreen from './features/payment/pages/PaymentScreen.jsx';
import PaymentSuccessScreen from './features/payment/pages/PaymentSuccessScreen.jsx';
import PaymentCancelScreen from './features/payment/pages/PaymentCancelScreen.jsx';

// ── Groups Pages ──
import CommunityScreen from './features/groups/pages/CommunityScreen.jsx';
import GroupDetailScreen from './features/groups/pages/GroupDetailScreen.jsx';
import JoinGroupScreen from './features/groups/pages/JoinGroupScreen.jsx';

// ── Admin Pages ──
import AdminLayout from './features/admin/layouts/AdminLayout.jsx';
import AdminDashboard from './features/admin/pages/AdminDashboard.jsx';
import AdminUsers from './features/admin/pages/AdminUsers.jsx';
import AdminGroups from './features/admin/pages/AdminGroups.jsx';
import AdminPayments from './features/admin/pages/AdminPayments.jsx';
import AdminAI from './features/admin/pages/AdminAI.jsx';
import AdminSettings from './features/admin/pages/AdminSettings.jsx';
import AdminIntroConfig from './features/admin/pages/AdminIntroConfig.jsx';

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
  );
}

export default App;
