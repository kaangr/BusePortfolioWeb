import React, { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Linkedin, Palette, Camera, Cuboid as Cube, Languages } from 'lucide-react';
import { ModelViewer } from './components/ModelViewer';
import { ProjectCard } from './components/ProjectCard';
import { Background } from './components/Background';
import { motion, useScroll, useTransform } from 'framer-motion';

const content = {
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

const projects = [
  {
    id: 1,
    title: 'Modern Minimalist Living Room',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?w=800'
    ],
    modelUrl: '/models/living-room.glb'
  },
  {
    id: 2,
    title: 'Contemporary Kitchen Design',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
      'https://images.unsplash.com/photo-1556909190-eccf4a8bf97a?w=800'
    ],
    modelUrl: '/models/kitchen.glb'
  },
  {
    id: 3,
    title: 'Luxurious Master Bedroom',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800'
    ],
    modelUrl: '/models/bedroom.glb'
  }
];

const skills = [
  { icon: Palette, name: 'AutoCAD' },
  { icon: Camera, name: '3DS Max' },
  { icon: Cube, name: 'SketchUp' }
];

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

function App() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [isInteracting, setIsInteracting] = useState(false);
  const [cursorParticles, setCursorParticles] = useState<CursorParticle[]>([]);
  const projectsRef = useRef<HTMLDivElement>(null);
  const particleTimeout = useRef<NodeJS.Timeout[]>([]);

  // Clear particle timeouts on unmount
  useEffect(() => {
    return () => {
      particleTimeout.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const shapes = ['triangle', 'circle', 'square'];
    const newParticles: CursorParticle[] = Array.from({ length: 3 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 0.8,
    }));

    setCursorParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    const timeout = setTimeout(() => {
      setCursorParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);

    particleTimeout.current.push(timeout);
  };

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900/50 to-black/50 text-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Cursor particles */}
      {cursorParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-50 mix-blend-plus-lighter"
          initial={{ 
            x: particle.x, 
            y: particle.y,
            rotate: particle.rotation,
            scale: particle.scale,
            opacity: particle.opacity 
          }}
          animate={{ 
            x: particle.x + (Math.random() * 100 - 50),
            y: particle.y + (Math.random() * 100 - 50),
            rotate: particle.rotation + 180,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-3 h-3 bg-white/30 backdrop-blur-sm" style={{
            clipPath: Math.random() > 0.5 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'  // triangle
              : Math.random() > 0.5 
                ? 'circle(50% at 50% 50%)'  // circle
                : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'  // square
          }} />
        </motion.div>
      ))}

      <Background isInteracting={isInteracting} scrollProgress={scrollYProgress.get()} />
      
      {/* Hero Section */}
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center relative px-4"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLanguage(lang => lang === 'en' ? 'tr' : 'en')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <Languages className="w-5 h-5" />
            {language === 'en' ? 'Türkçe' : 'English'}
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border-4 border-white/20 mx-auto shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="text-5xl font-bold mb-4">Buse Arıca</h1>
            <p className="text-2xl text-gray-300 mb-8">{content[language].title}</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">{content[language].about}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
            {skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-2 text-gray-300 justify-center">
                <skill.icon className="w-5 h-5" />
                <span>{skill.name}</span>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToProjects}
            className="px-8 py-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm mt-12"
          >
            {content[language].viewProjects}
          </motion.button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-gray-300">
            <a href="mailto:buse.arıca@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
              buse.arıca@gmail.com
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              TR Istanbul
            </div>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Projects Section */}
      <div ref={projectsRef} className="container mx-auto px-4 py-24 space-y-32">
        <h2 className="text-4xl font-bold mb-16 text-center">{content[language].projects}</h2>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">{project.title}</h3>
              <p className="text-gray-300">{project.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {project.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${project.title} view ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
            <div className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
              <ModelViewer modelUrl={project.modelUrl} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;