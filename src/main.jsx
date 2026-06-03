import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// NOTE: Thay thế clientId này bằng Client ID thực tế từ Google Cloud Console
const GOOGLE_CLIENT_ID = "973784581614-5iplta9p33rbkd28o7lneevpm0l5sgva.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
