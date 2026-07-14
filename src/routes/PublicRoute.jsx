import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { checkIsAdmin } from './AdminRoute';

export default function PublicRoute() {
  const { isAuthenticated, isAdmin, accessToken } = useAuthContext();

  // Nếu đã đăng nhập thì không cho vào các trang public (Login, Register)
  if (isAuthenticated) {
    // Nếu là admin, đẩy vào trang admin, ngược lại đẩy vào dashboard
    if (isAdmin || checkIsAdmin(accessToken)) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa đăng nhập, cho phép render các component con (Login, Register, Intro)
  return <Outlet />;
}
