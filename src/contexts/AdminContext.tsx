import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminData, Content, Project, Skill } from '../types';
import { 
  Palette, Camera, Cuboid as Cube, Languages, Home, 
  Lightbulb, Hammer, PaintBucket, Ruler, Layers,
  Building, Sofa, Bed, ChefHat
} from 'lucide-react';

// Default data
const defaultContent: Content = {
  en: {
    about: "I'm currently pursuing my Bachelor's degree in Interior Design at Beykent University. With a passion for creating harmonious and functional spaces, I combine innovative design principles with practical solutions. My expertise in various design software allows me to bring creative visions to life, while my attention to detail ensures each project meets the highest standards of aesthetic and functionality.",
    title: "Interior Designer",
    aboutTitle: "About Me",
    skills: "Technical Skills",
    projects: "Featured Projects",
    viewProjects: "View My Projects"
  },
  tr: {
    about: "Beykent Üniversitesi'nde İç Mimarlık lisans eğitimimi sürdürüyorum. Uyumlu ve işlevsel mekanlar yaratma tutkusuyla, yenilikçi tasarım prensiplerini pratik çözümlerle birleştiriyorum. Çeşitli tasarım yazılımlarındaki uzmanlığım, yaratıcı vizyonları hayata geçirmemi sağlarken, detaylara olan dikkatim her projenin estetik ve işlevsellik açısından en yüksek standartlara ulaşmasını sağlıyor.",
    title: "İç Mimar",
    aboutTitle: "Hakkımda",
    skills: "Teknik Beceriler",
    projects: "Öne Çıkan Projeler",
    viewProjects: "Projelerimi Görüntüle"
  }
};

const defaultProjects: Project[] = [
  {
    id: 1,
    title: 'Modern Minimalist Living Room',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/images/living-room-main.jpg',
    gallery: ['/images/living-room-1.png', '/images/living-room-2.jpg'],
    modelUrl: '/models/living-room.glb'
  },
  {
    id: 2,
    title: 'Contemporary Kitchen Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/images/kitchen-main.jpg',
    gallery: ['/images/kitchen-1.jpg', '/images/kitchen-2.jpg'],
    modelUrl: '/models/kitchen.glb'
  },
  {
    id: 3,
    title: 'Luxurious Master Bedroom',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/images/bedroom-main.jpg',
    gallery: ['/images/bedroom-1.jpg', '/images/bedroom-2.jpg'],
    modelUrl: '/models/bedroom.glb'
  },
  {
    id: 4,
    title: 'Elegant Bathroom Design',
    description: 'A modern bathroom design featuring clean lines and premium materials.',
    image: '/images/bathroom-main.jpg',
    gallery: ['/images/bathroom-1.jpg'],
    modelUrl: '/models/the_bathroom.glb',
    bannerUrl: '/banner/buse_arica.pdf'
  }
];

const defaultSkills: Skill[] = [
  { id: '1', icon: 'Palette', name: 'AutoCAD' },
  { id: '2', icon: 'Camera', name: '3DS Max' },
  { id: '3', icon: 'Cube', name: 'SketchUp' },
  { id: '4', icon: 'Palette', name: 'Rhino' },
  { id: '5', icon: 'Camera', name: 'Photoshop' }
];

export const iconOptions = [
  { name: 'Palette', value: 'Palette', component: Palette },
  { name: 'Camera', value: 'Camera', component: Camera },
  { name: 'Cube', value: 'Cube', component: Cube },
  { name: 'Languages', value: 'Languages', component: Languages },
  { name: 'Home', value: 'Home', component: Home },
  { name: 'Lightbulb', value: 'Lightbulb', component: Lightbulb },
  { name: 'Hammer', value: 'Hammer', component: Hammer },
  { name: 'PaintBucket', value: 'PaintBucket', component: PaintBucket },
  { name: 'Ruler', value: 'Ruler', component: Ruler },
  { name: 'Layers', value: 'Layers', component: Layers },
  { name: 'Building', value: 'Building', component: Building },
  { name: 'Sofa', value: 'Sofa', component: Sofa },
  { name: 'Bed', value: 'Bed', component: Bed },
  { name: 'ChefHat', value: 'ChefHat', component: ChefHat }
];

interface AdminContextType {
  data: AdminData;
  updateContent: (content: Content) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: number, project: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(() => {
    const saved = localStorage.getItem('admin-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          content: defaultContent,
          projects: defaultProjects,
          skills: defaultSkills
        };
      }
    }
    return {
      content: defaultContent,
      projects: defaultProjects,
      skills: defaultSkills
    };
  });

  useEffect(() => {
    localStorage.setItem('admin-data', JSON.stringify(data));
  }, [data]);

  const updateContent = (content: Content) => {
    setData(prev => ({ ...prev, content }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newId = Math.max(...data.projects.map(p => p.id), 0) + 1;
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: newId }]
    }));
  };

  const updateProject = (id: number, project: Partial<Project>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...project } : p)
    }));
  };

  const deleteProject = (id: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newId = Date.now().toString();
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: newId }]
    }));
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, ...skill } : s)
    }));
  };

  const deleteSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  return (
    <AdminContext.Provider value={{
      data,
      updateContent,
      addProject,
      updateProject,
      deleteProject,
      addSkill,
      updateSkill,
      deleteSkill
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 