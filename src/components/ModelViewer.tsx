import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ModelViewerProps {
  modelUrl: string;
}

export function ModelViewer({ modelUrl }: ModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const handleLoadError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleLoadSuccess = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  if (!showModel) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-black/20 rounded-lg">
        <button
          onClick={() => setShowModel(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Click to load 3D model</span>
        </button>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full relative">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {/* Model component will be added here */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="white" />
            </mesh>
          </Stage>
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-lg">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <p>Model is too large to preview</p>
            <button
              onClick={() => setShowModel(false)}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}