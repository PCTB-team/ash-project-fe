import { Navigate, Outlet } from 'react-router-dom';

export default function PublicRoute() {
  const token = localStorage.getItem('accessToken');

  // Nếu đã đăng nhập thì không cho vào các trang public (Login, Register), đẩy thẳng vào Dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Nếu chưa đăng nhập, cho phép render các component con (Login, Register, Intro)
  return <Outlet />;
}
