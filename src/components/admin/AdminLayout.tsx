import { BarChart3, FilePlus2, FolderKanban, LogOut, Settings, Video } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export default function AdminLayout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const links = [['/admin', 'Visão geral', BarChart3], ['/admin/projetos', 'Projetos', FolderKanban], ['/admin/projetos/novo', 'Novo projeto', FilePlus2], ['/admin/midia', 'Mídia', Video], ['/admin/configuracoes', 'Configurações', Settings]] as const;
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand"><span className="brand-mark">R</span><span>RICKELMI</span></div><nav className="admin-nav">{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/admin'}><Icon size={17} />{label}</NavLink>)}</nav><div className="admin-user"><span>{user?.email}</span><button type="button" onClick={async () => { await logout(); navigate('/admin/login'); }}><LogOut size={16} /> Sair</button></div></aside><main className="admin-content"><Outlet /></main></div>;
}
