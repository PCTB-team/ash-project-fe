import React, { createContext, useReducer, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { clearUserProfile } from '../redux/slices/userSlice';

// Khởi tạo state ban đầu từ localStorage để giữ đồng bộ
const initialState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAdmin: localStorage.getItem('accessToken') === 'admin_mock_token' // Dựa theo logic mock hiện tại
};

// Định nghĩa các actions cho reducer
const ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_ADMIN: 'SET_ADMIN'
};

// Reducer xử lý trạng thái
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAdmin: false
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        isAdmin: false
      };
    case ACTIONS.SET_ADMIN:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: 'admin_mock_token',
        refreshToken: null,
        isAdmin: true
      };
    default:
      return state;
  }
}

// Tạo Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatchAuth] = useReducer(authReducer, initialState);
  const dispatchRedux = useDispatch();

  // Hàm login được gọi sau khi API trả về token thành công
  const login = (token, refreshToken) => {
    if (token) localStorage.setItem('accessToken', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    
    dispatchAuth({
      type: ACTIONS.LOGIN,
      payload: { token, refreshToken }
    });
  };

  const loginAsAdmin = () => {
    localStorage.setItem('accessToken', 'admin_mock_token');
    dispatchAuth({ type: ACTIONS.SET_ADMIN });
  };

  // Hàm logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatchAuth({ type: ACTIONS.LOGOUT });
    dispatchRedux(clearUserProfile()); // Xóa dữ liệu user cũ khỏi Redux
  };

  return (
    <AuthContext.Provider value={{ ...state, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dùng context dễ dàng hơn
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
