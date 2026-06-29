/**
 * AdminRoute — Route guard kiểm tra quyền ADMIN.
 * Khi có JWT thật: decode token để lấy roles.
 * Hiện tại hỗ trợ cả mock token và JWT decode.
 */
import { Navigate, Outlet } from 'react-router-dom';

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function checkIsAdmin(token) {
  if (!token) return false;
  // Mock admin token
  if (token === 'admin_mock_token') return true;
  // Real JWT — decode and check roles
  const decoded = decodeJWT(token);
  if (decoded) {
    const roles = decoded.roles || decoded.role || decoded.scope || [];
    if (Array.isArray(roles)) return roles.includes('ADMIN');
    if (typeof roles === 'string') return roles.includes('ADMIN');
  }
  return false;
}

export default function AdminRoute() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!checkIsAdmin(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
