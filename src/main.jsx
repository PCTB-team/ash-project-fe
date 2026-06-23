import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// NOTE: Thay thế clientId này bằng Client ID thực tế từ Google Cloud Console
const GOOGLE_CLIENT_ID = "973784581614-5iplta9p33rbkd28o7lneevpm0l5sgva.apps.googleusercontent.com";

const originalWarn = console.warn;
const originalError = console.error;
const suppressAntdWarning = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Static function can not consume context')) {
    return true;
  }
  return false;
};

console.warn = (...args) => {
  if (suppressAntdWarning(...args)) return;
  originalWarn(...args);
};

console.error = (...args) => {
  if (suppressAntdWarning(...args)) return;
  originalError(...args);
};

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,
)
