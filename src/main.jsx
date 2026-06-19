import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// NOTE: Thay thế clientId này bằng Client ID thực tế từ Google Cloud Console
const GOOGLE_CLIENT_ID = "973784581614-5iplta9p33rbkd28o7lneevpm0l5sgva.apps.googleusercontent.com";

// Suppress antd static message warning since we don't use dynamic themes for messages
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('Static function can not consume context')) {
    return;
  }
  originalWarn(...args);
};

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>,
)
