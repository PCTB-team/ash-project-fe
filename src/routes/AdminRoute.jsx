/**
 * AdminRoute — Route guard kiểm tra quyền ADMIN.
 * Khi có JWT thật: decode token để lấy roles bằng thư viện jwt-decode.
 * Hiện tại hỗ trợ cả mock token.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from '../contexts/AuthContext';

export function checkIsAdmin(token) {
  if (!token) return false;
  // Mock admin token
  if (token === 'admin_mock_token') return true;
  
  // Real JWT — decode and check roles safely
  try {
    const decoded = jwtDecode(token);
    if (decoded) {
      const roles = decoded.roles || decoded.role || decoded.scope || [];
      if (Array.isArray(roles)) return roles.includes('ADMIN');
      if (typeof roles === 'string') return roles.includes('ADMIN');
    }
  } catch (error) {
    console.error("Lỗi giải mã JWT (AdminRoute):", error);
    return false;
  }
  
  return false;
}

export default function AdminRoute() {
  const { isAuthenticated, accessToken, isAdmin } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && !checkIsAdmin(accessToken)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
