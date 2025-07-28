import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import App from './App.tsx';
import { AdminLayout } from './pages/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ContentManagement } from './pages/ContentManagement';
import { ProjectManagement } from './pages/ProjectManagement';
import { SkillsManagement } from './pages/SkillsManagement';
import { AdminLogin } from './pages/AdminLogin';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="skills" element={<SkillsManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
);
