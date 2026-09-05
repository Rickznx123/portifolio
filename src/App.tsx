import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import PublicPortfolio from './components/PublicPortfolio';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import ProjectFormPage from './components/admin/ProjectFormPage';
import ProjectsPage from './components/admin/ProjectsPage';
import SettingsPage from './components/admin/SettingsPage';

function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="admin-loading">Carregando painel...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export default function App() {
  return <AuthProvider><BrowserRouter><Routes><Route path="/" element={<PublicPortfolio />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin" element={<AdminRoute />}><Route index element={<AdminDashboard />} /><Route path="projetos" element={<ProjectsPage />} /><Route path="projetos/novo" element={<ProjectFormPage />} /><Route path="projetos/:id" element={<ProjectFormPage />} /><Route path="midia" element={<SettingsPage />} /><Route path="configuracoes" element={<SettingsPage />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter></AuthProvider>;
}
