import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Instagram, Mail, MessageCircle, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getPublishedProjects, getSettings } from '../lib/firestore';
import { defaultSettings, portfolioCategories, type PortfolioCategory, type PortfolioSettings, type Project } from '../types/portfolio';

const tools = [
  ['EDIÇÃO', 'CapCut'],
  ['DESIGN', 'Photoshop', 'Figma', 'Illustrator'],
  ['MOTION DESIGN', 'After Effects — Em aprendizado'],
  ['EDIÇÃO PROFISSIONAL', 'Premiere Pro — Em aprendizado'],
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

function Video({ src, poster, className, autoPlay = false }: { src: string; poster?: string; className: string; autoPlay?: boolean }) {
  return (
    <video className={className} autoPlay={autoPlay} muted={autoPlay} loop={autoPlay} playsInline controls poster={poster} preload={autoPlay ? 'metadata' : 'metadata'}>
      <source src={src} />
    </video>
  );
}

export default function PublicPortfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<PortfolioSettings>(defaultSettings);
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory | 'TODOS'>('TODOS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPublishedProjects(), getSettings()])
      .then(([nextProjects, nextSettings]) => {
        setProjects(nextProjects);
        setSettings(nextSettings);
      })
      .catch(() => setSettings(defaultSettings))
      .finally(() => setLoading(false));
  }, []);

  const featured = projects.find((project) => project.featured) ?? projects[0];
  const filteredProjects = useMemo(() => activeFilter === 'TODOS' ? projects : projects.filter((project) => project.category === activeFilter), [activeFilter, projects]);

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-block"><span className="brand-mark">R</span><span className="brand-name">{settings.name.toUpperCase()}</span></div>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#work">Trabalhos</a><a href="#about">Sobre mim</a><a href="#process">Processo</a><a href="#contact">Contato</a>
        </nav>
        <a className="nav-cta" href={settings.whatsappUrl} target="_blank" rel="noreferrer">Fale comigo</a>
      </header>

      <main>
        <section className="hero section-frame">
          <motion.div className="hero-copy" initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.7 }}>
            <p className="eyebrow">{settings.name.toUpperCase()}</p>
            <h1>EDITOR DE VÍDEO<span>MOTION DESIGN</span></h1>
            <p className="lead">{settings.description}</p>
            <p className="subtitle">Criação e edição de vídeos para redes sociais, marcas, campanhas e conteúdo digital.</p>
            <div className="hero-actions"><a href="#work" className="primary-btn">VER MEUS TRABALHOS <ArrowRight size={16} /></a><a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="secondary-btn">FALE COMIGO</a></div>
            <div className="scroll-indicator">ROLE PARA EXPLORAR <ChevronDown size={16} /></div>
          </motion.div>
          {settings.showreelUrl && <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <div className="video-frame"><div className="video-overlay" /><Video src={settings.showreelUrl} className="hero-video" /><div className="video-badge"><Play size={12} /> SHOWREEL</div></div>
          </motion.div>}
        </section>

        <section id="work" className="section-frame portfolio-section">
          <div className="portfolio-topline"><div><p className="eyebrow">TRABALHOS SELECIONADOS</p><h2>Projetos em destaque</h2></div><div className="filter-row" aria-label="Filtros de portfólio"><button type="button" className={activeFilter === 'TODOS' ? 'filter active' : 'filter'} onClick={() => setActiveFilter('TODOS')}>TODOS</button>{portfolioCategories.map((category) => <button key={category} type="button" className={category === activeFilter ? 'filter active' : 'filter'} onClick={() => setActiveFilter(category)}>{category}</button>)}</div></div>
          {loading && <p className="empty-state">Carregando trabalhos...</p>}
          {!loading && filteredProjects.length === 0 && <p className="empty-state">Nenhum trabalho publicado nesta categoria.</p>}
          <div className="portfolio-grid">{filteredProjects.map((project, index) => <motion.article key={project.id} className="project-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }}><div className="project-thumb-wrap"><Video src={project.videoUrl} poster={project.thumbnailUrl} className="project-thumb" /><div className="project-overlay"><span>VER PROJETO <ArrowRight size={16} /></span></div></div><div className="project-meta"><div className="project-kicker"><span>{project.category}</span>{project.year && <span>{project.year}</span>}</div><h3>{project.title}</h3><p>{project.description}</p></div></motion.article>)}</div>
        </section>

        <section className="section-frame featured-block"><p className="eyebrow">PROJETO EM DESTAQUE</p>{featured ? <div className="featured-layout"><div className="featured-video-shell"><Video src={featured.videoUrl} poster={featured.thumbnailUrl} className="featured-video" autoPlay /></div><div className="featured-copy"><div className="featured-head"><span className="feature-label">{featured.category}</span><h3>{featured.title}</h3></div><div className="feature-details"><div><span>CLIENTE</span><p>{featured.client || 'Não informado'}</p></div><div><span>ANO</span><p>{featured.year || 'Não informado'}</p></div><div><span>FUNÇÃO</span><p>Editor de Vídeo / Motion Design</p></div></div><p className="feature-story">{featured.description}</p></div></div> : <p className="empty-state">Nenhum projeto em destaque publicado.</p>}</section>

        <section id="about" className="section-frame about-section"><div className="about-intro"><div><p className="eyebrow">SOBRE MIM</p><h2>{settings.bio.split('\n').map((paragraph) => <span key={paragraph}>{paragraph}<br /><br /></span>)}</h2></div><div className="portrait-placeholder"><div className="portrait-glow" /><span>FOTO</span></div></div><div className="specialties-wrap">{['EDIÇÃO DE VÍDEO', 'MOTION DESIGN', 'REDES SOCIAIS', 'COMERCIAIS', 'ANÚNCIOS', 'COR E SOM'].map((item) => <span key={item} className="specialty-pill">{item}</span>)}</div></section>
        <section id="process" className="section-frame process-section"><p className="eyebrow">MEU PROCESSO</p><div className="process-grid">{[['01 — IDEIA', 'Entendimento do objetivo, conteúdo e público.'], ['02 — EDIÇÃO', 'Construção do ritmo, cortes, narrativa e estrutura visual.'], ['03 — DESIGN E MOTION', 'Animações, tipografia, efeitos e elementos visuais.'], ['04 — FINALIZAÇÃO', 'Ajustes finais, sound design, revisão e entrega.']].map(([title, text]) => <motion.div key={title} className="process-card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><span>{title}</span><p>{text}</p></motion.div>)}</div></section>
        <section className="section-frame tools-section"><p className="eyebrow">FERRAMENTAS QUE USO</p><div className="tools-row">{tools.map(([category, ...items]) => <div className="tool-group" key={category}><span className="tool-category">{category}</span>{items.map((tool) => <span key={tool}>{tool}</span>)}</div>)}</div></section>
        <section className="section-frame cta-section"><p className="eyebrow">TEM UM PROJETO EM MENTE?</p><h2>Vamos transformar sua ideia em um vídeo que vale a pena assistir.</h2><a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="primary-btn large">FALE COMIGO <ArrowRight size={18} /></a></section>
      </main>

      <footer id="contact" className="footer section-frame"><div className="footer-brand"><p className="brand-name">{settings.name.toUpperCase()}</p><span>{settings.title}</span></div><div className="contact-grid"><a href={`mailto:${settings.email}`}><Mail size={16} /> {settings.email}</a><a href={settings.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> {settings.whatsapp}</a><a href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={16} /> {settings.instagram}</a></div><div className="footer-bottom"><span>© 2026 {settings.name.toUpperCase()}</span><span>{settings.title}</span></div></footer>
    </div>
  );
}
