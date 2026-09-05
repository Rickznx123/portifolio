export const portfolioCategories = ['COMERCIAIS', 'REDES SOCIAIS', 'MOTION DESIGN', 'ANÚNCIOS'] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];
export type ProjectStatus = 'RASCUNHO' | 'PUBLICADO';

export type Project = {
  id: string;
  title: string;
  category: PortfolioCategory;
  client: string;
  year: string;
  description: string;
  videoUrl: string;
  videoPath?: string;
  thumbnailUrl: string;
  thumbnailPath?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type PortfolioSettings = {
  name: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  bio: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  whatsapp: string;
  whatsappUrl: string;
  showreelUrl: string;
  showreelPath?: string;
};

export const defaultSettings: PortfolioSettings = {
  name: 'Rickelmi',
  title: 'Editor de Vídeo / Motion Design',
  description: 'Transformo ideias em vídeos que prendem atenção.',
  heroTitle: 'EDITOR DE VÍDEO',
  heroSubtitle: 'MOTION DESIGN',
  heroDescription: 'Criação e edição de vídeos para redes sociais, marcas, campanhas e conteúdo digital.',
  bio: 'Sou Rickelmi, editor de vídeo e criador visual. Trabalho principalmente com conteúdo para redes sociais, vídeos comerciais e peças visuais para marcas.\n\nMeu foco é transformar ideias em vídeos mais envolventes, combinando edição, ritmo, composição, motion design e identidade visual.\n\nEstou constantemente aprimorando minhas habilidades e estudando novas técnicas para elevar a qualidade dos meus trabalhos.',
  instagram: '@ricksantos.af',
  instagramUrl: 'https://instagram.com/ricksantos.af',
  email: 'ricksantos1428@gmail.com',
  whatsapp: '(66) 99240-2445',
  whatsappUrl: 'https://wa.me/5566992402445',
  showreelUrl: '',
};
