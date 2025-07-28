import React from 'react';
import { useModel } from '../contexts/ModelContext';
import { Cpu, X } from 'lucide-react';

export function MemoryIndicator() {
  const { activeModelId, setActiveModel } = useModel();

  if (!activeModelId) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500/30">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4" />
        <span className="text-sm">3D Model Aktif (#{activeModelId})</span>
        <button
          onClick={() => setActiveModel(null)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          title="Tüm 3D modelleri kapat"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="text-xs text-blue-200 mt-1">
        Bellekten tasarruf için sadece 1 model aktif
      </div>
    </div>
  );
} 