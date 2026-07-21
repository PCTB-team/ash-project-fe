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
    // Nếu có redirect param (vd: từ join group flow), navigate theo redirect
    const redirect = new URLSearchParams(window.location.search).get('redirect');
    return <Navigate to={redirect || '/dashboard'} replace />;
  }

  // Nếu chưa đăng nhập, cho phép render các component con (Login, Register, Intro)
  return <Outlet />;
}
