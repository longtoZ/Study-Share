import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from '@redux/store';
import { Provider } from 'react-redux';
import App from './App.tsx'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={window.env?.VITE_GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID'}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
);
