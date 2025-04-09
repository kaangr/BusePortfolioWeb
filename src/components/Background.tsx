import { Canvas } from '@react-three/fiber';
import { BackgroundEffect } from './BackgroundEffect';
import { useRef } from 'react';

interface BackgroundProps {
  isInteracting?: boolean;
}

export function Background({ isInteracting }: BackgroundProps) {
  const mouse = useRef<[number, number]>([0, 0]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = -(clientY / window.innerHeight) * 2 + 1;
    mouse.current = [x, y];
  };

  return (
    <div 
      className="fixed inset-0 -z-10"
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <BackgroundEffect mouse={mouse} isInteracting={isInteracting} />
      </Canvas>
    </div>
  );
}