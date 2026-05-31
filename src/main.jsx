import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StorageProvider } from './providers/StorageContext';
import { GoogleAuthProvider } from './providers/GoogleAuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/student-tracker">
      <GoogleAuthProvider>
        <StorageProvider>
          <App />
        </StorageProvider>
      </GoogleAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
