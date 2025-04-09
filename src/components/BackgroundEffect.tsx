import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

interface BackgroundEffectProps {
  count?: number;
  mouse: { current: [number, number] };
  isInteracting?: boolean;
}

export function BackgroundEffect({ count = 2000, mouse, isInteracting = false }: BackgroundEffectProps) {
  const points = useRef<THREE.Points>(null!);
  
  useEffect(() => {
    if (points.current) {
      random.inSphere(points.current.geometry.attributes.position.array, { radius: 8 });
    }
  }, []);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta / 10;
      points.current.rotation.y -= delta / 15;

      // Mouse interaction
      const [mouseX, mouseY] = mouse.current;
      points.current.rotation.x += (mouseY * delta) / 10;
      points.current.rotation.y += (mouseX * delta) / 10;

      // Fade effect when interacting with models
      const opacity = isInteracting ? 0.15 : 0.35;
      (points.current.material as THREE.PointsMaterial).opacity += 
        (opacity - (points.current.material as THREE.PointsMaterial).opacity) * 0.1;
    }
  });

  return (
    <Points ref={points} positions={new Float32Array(count * 3)} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8b5cf6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}