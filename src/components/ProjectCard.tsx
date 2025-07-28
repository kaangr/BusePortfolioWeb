import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  image: string;
  bannerUrl?: string;
  onClick: () => void;
}

export function ProjectCard({ title, image, bannerUrl, onClick }: ProjectCardProps) {
  const handleBannerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bannerUrl) {
      window.open(bannerUrl, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative backdrop-blur-md bg-white/10 p-4 border border-white/20">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />
        <div className="mt-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {bannerUrl && (
            <button
              onClick={handleBannerClick}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600/80 hover:bg-purple-600 rounded-lg transition-colors text-sm"
              title="Afişi Görüntüle"
            >
              <Download className="w-4 h-4" />
              Afiş
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}