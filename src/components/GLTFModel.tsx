import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

interface GLTFModelProps {
  url: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function GLTFModel({ url, onLoad, onError }: GLTFModelProps) {
  const { scene, error } = useGLTF(url);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    } else if (scene && onLoad) {
      onLoad();
    }
  }, [scene, error, onLoad, onError]);

  if (error) {
    console.error('GLTF loading error:', error);
    return null;
  }

  if (!scene) {
    return null;
  }

  return <primitive object={scene} scale={[1, 1, 1]} />;
} 