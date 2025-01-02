import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ClubProvider } from './contexts/ClubContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ClubProvider>
          <Router />
        </ClubProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);