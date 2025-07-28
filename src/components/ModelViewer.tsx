import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { GLTFModel } from './GLTFModel';
import { useModel } from '../contexts/ModelContext';

interface ModelViewerProps {
  modelUrl: string;
  projectId: number;
}

export function ModelViewer({ modelUrl, projectId }: ModelViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const { activeModelId, setActiveModel } = useModel();
  
  // Bu model aktif mi kontrol et
  const isActive = activeModelId === projectId.toString();

  // Başka bir model aktif olduğunda bu modeli kapat
  useEffect(() => {
    if (activeModelId && activeModelId !== projectId.toString() && showModel) {
      setShowModel(false);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [activeModelId, projectId, showModel]);

  const handleLoadError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const handleLoadSuccess = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  // Eğer model URL'i yoksa veya boşsa fallback göster
  if (!modelUrl || modelUrl.trim() === '') {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-600">
        <div className="text-center p-6">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-300 mb-2">3D Model Yok</p>
          <p className="text-sm text-gray-500">Bu proje için henüz 3D model eklenmemiş</p>
        </div>
      </div>
    );
  }

  if (!showModel) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-600">
        <div className="text-center">
          <button
            onClick={() => {
              setActiveModel(projectId.toString());
              setShowModel(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors mb-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
            <span>3D Modeli Yükle</span>
          </button>
          {activeModelId && activeModelId !== projectId.toString() && (
            <p className="text-xs text-yellow-400">
              ⚠️ Başka bir 3D model aktif. Bu modeli açmak diğerini kapatacak.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full relative bg-gray-900 rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
            <p className="text-gray-300">3D Model Yükleniyor...</p>
          </div>
        </div>
      )}
      
             {/* Model Kapatma Butonu */}
       <button
         onClick={() => {
           setShowModel(false);
           setIsLoaded(false);
           setHasError(false);
           setActiveModel(null);
         }}
         className="absolute top-4 right-4 z-30 p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors"
         title="3D Modeli Kapat"
       >
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
         </svg>
       </button>

       <Canvas 
         shadows 
         camera={{ position: [0, 0, 5], fov: 50 }}
         className="bg-gray-900"
         style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
       >
        <Suspense fallback={null}>
          {/* Daha iyi aydınlatma */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          
          <Stage environment="city" intensity={0.7} adjustCamera={1.5}>
            <GLTFModel
              url={modelUrl}
              onLoad={handleLoadSuccess}
              onError={handleLoadError}
            />
          </Stage>
          
          <OrbitControls 
            autoRotate={isLoaded}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 rounded-lg z-20">
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-400" />
            <p className="text-white mb-2">Model Yüklenemedi</p>
            <p className="text-gray-400 text-sm mb-4">Dosya bulunamadı veya desteklenmiyor</p>
            <button
              onClick={() => {
                setShowModel(false);
                setHasError(false);
                setIsLoaded(false);
                setActiveModel(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )}
    </div>
  );
}