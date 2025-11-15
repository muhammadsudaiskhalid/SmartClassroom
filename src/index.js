import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClassProvider } from './context/ClassContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/shared/ToastContainer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ClassProvider>
            <Router>
              <App />
            </Router>
          </ClassProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);