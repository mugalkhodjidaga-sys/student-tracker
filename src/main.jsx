import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StorageProvider } from './providers/StorageContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/student-tracker">
      <StorageProvider>
        <App />
      </StorageProvider>
    </BrowserRouter>
  </StrictMode>
);
