import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export function ProjectCard({ title, image, onClick }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden rounded-xl cursor-pointer group"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative backdrop-blur-md bg-white/10 p-4 border border-white/20">
        <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      </div>
    </motion.div>
  );
}