import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  // Nếu không có token, chuyển hướng về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token, cho phép render các component con
  return <Outlet />;
}
