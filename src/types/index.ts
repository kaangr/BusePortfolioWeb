export interface Content {
  en: {
    about: string;
    title: string;
    aboutTitle: string;
    skills: string;
    projects: string;
    viewProjects: string;
  };
  tr: {
    about: string;
    title: string;
    aboutTitle: string;
    skills: string;
    projects: string;
    viewProjects: string;
  };
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  modelUrl?: string;
  bannerUrl?: string;
}

export interface Skill {
  id: string;
  icon: string;
  name: string;
}

export interface IconOption {
  name: string;
  value: string;
  component: React.ComponentType<any>;
}

export interface AdminData {
  content: Content;
  projects: Project[];
  skills: Skill[];
} 