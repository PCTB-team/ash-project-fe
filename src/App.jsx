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

// ── Groups Pages ──
import CommunityScreen from './features/groups/pages/CommunityScreen.jsx';
import GroupDetailScreen from './features/groups/pages/GroupDetailScreen.jsx';

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    navigate(redirect || '/dashboard');
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/login" element={<LoginScreen currentView="login" onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<LoginScreen currentView="register" onLoginSuccess={handleLoginSuccess} />} />
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
          <Route path="ai" element={<AIScreen />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default App;
