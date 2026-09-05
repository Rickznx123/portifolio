import { useEffect, useState } from 'react';
import { ArrowUpRight, FolderKanban, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../lib/firestore';
import type { Project } from '../../types/portfolio';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => { getAllProjects().then(setProjects).catch(() => setProjects([])); }, []);
  const published = projects.filter((project) => project.published).length;
  const featured = projects.find((project) => project.featured);
  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">PAINEL ADMINISTRATIVO</p><h1>Visão geral</h1><p className="admin-muted">Acompanhe o estado atual do seu portfólio.</p></div><Link className="admin-primary compact" to="/admin/projetos/novo">NOVO PROJETO <ArrowUpRight size={16} /></Link></div><div className="admin-stats"><div><span>Total de projetos</span><strong>{projects.length}</strong></div><div><span>Projetos publicados</span><strong>{published}</strong></div><div><span>Projetos rascunho</span><strong>{projects.length - published}</strong></div><div><span>Projeto em destaque</span><strong>{featured ? '1' : '0'}</strong></div></div><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">STATUS</p><h2>{featured ? featured.title : 'Nenhum destaque selecionado'}</h2></div><Video size={22} /></div>{featured ? <p className="admin-muted">{featured.category} · {featured.published ? 'Publicado' : 'Rascunho'}</p> : <p className="admin-muted">Marque um projeto como destaque para exibi-lo no site público.</p>}<Link className="admin-text-link" to="/admin/projetos">Gerenciar projetos <ArrowUpRight size={15} /></Link></section><section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">ACESSO RÁPIDO</p><h2>Seu conteúdo</h2></div><FolderKanban size={22} /></div><div className="quick-links"><Link to="/admin/projetos/novo">Adicionar projeto</Link><Link to="/admin/configuracoes">Editar configurações</Link></div></section></div>;
}
