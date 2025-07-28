import React, { useState, useRef, useEffect } from 'react';
import { Mail, MapPin, Linkedin, Languages } from 'lucide-react';
import { ModelViewer } from './components/ModelViewer';
import { ProjectCard } from './components/ProjectCard';
import { Background } from './components/Background';
import { RulerCursor } from './components/DesignerCursor';
import { PendantLamp } from './components/PendantLamp';
import { PDFViewer } from './components/PDFViewer';
import { MemoryIndicator } from './components/MemoryIndicator';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAdmin, iconOptions } from './contexts/AdminContext';
import { ModelProvider } from './contexts/ModelContext';



interface CursorParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

function App() {
  const { data } = useAdmin();
  const [selectedProject, setSelectedProject] = useState(data.projects[0]);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [isInteracting, setIsInteracting] = useState(false);
  const [pdfViewer, setPdfViewer] = useState<{isOpen: boolean, url: string, title: string}>({
    isOpen: false,
    url: '',
    title: ''
  });
  const projectsRef = useRef<HTMLDivElement>(null);

  const content = data.content;
  const projects = data.projects;
  const skills = data.skills;

  // Admin butonu için özel URL kontrolü (?admin=show parametresi)
  const showAdminButton = new URLSearchParams(window.location.search).has('admin');

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption?.component;
  };

  const openPDFViewer = (url: string, title: string) => {
    setPdfViewer({ isOpen: true, url, title });
  };

  const closePDFViewer = () => {
    setPdfViewer({ isOpen: false, url: '', title: '' });
  };

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const scrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ModelProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900/50 to-black/50 text-white relative overflow-hidden">
      <RulerCursor />
      <PendantLamp />
      <Background isInteracting={isInteracting} scrollProgress={scrollYProgress.get()} />
      
      {/* Hero Section */}
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center relative px-4"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className="absolute top-4 right-4 flex gap-3">
          {showAdminButton && (
            <a
              href="/admin/login"
              className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors backdrop-blur-sm text-red-400 border border-red-500/30"
              title="Admin Erişimi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </a>
          )}
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
          className="text-center max-w-4xl mx-auto space-y-8 relative pb-48"
        >
          <img
            src="/images/profile.png"
            alt="Buse Arıca"
            className="w-48 h-48 rounded-full object-cover border-4 border-white/20 mx-auto shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div>
            <h1 className="text-5xl font-bold mb-4">Buse Arıca</h1>
            <p className="text-2xl text-gray-300 mb-8">{content[language].title}</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">{content[language].about}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
            {skills.map((skill) => {
              const IconComponent = getIconComponent(skill.icon);
              return (
                <div key={skill.id} className="flex items-center gap-2 text-gray-300 justify-center">
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                  <span>{skill.name}</span>
                </div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToProjects}
            className="px-8 py-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm mt-12 mb-24"
          >
            {content[language].viewProjects}
          </motion.button>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-gray-300 pb-8">
            <a href="mailto:buse.arıca@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors backdrop-blur-sm px-4 py-2 rounded-lg">
              <Mail className="w-5 h-5" />
              bbusearcc@gmail.com
            </a>
            <div className="flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-lg">
              <MapPin className="w-5 h-5" />
              TR Istanbul
            </div>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors backdrop-blur-sm p-2 rounded-lg"
            >
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
              {project.bannerUrl && (
                <button
                  onClick={() => openPDFViewer(project.bannerUrl!, project.title)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-600 rounded-lg transition-colors text-sm mt-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Proje Afişini Görüntüle
                </button>
              )}
            </div>
            <div className="backdrop-blur-lg bg-white/5 rounded-xl p-4 border border-white/10">
              <ModelViewer modelUrl={project.modelUrl || ''} projectId={project.id} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={closePDFViewer}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />

      {/* Memory Usage Indicator */}
      <MemoryIndicator />
      </div>
    </ModelProvider>
  );
}

export default App;