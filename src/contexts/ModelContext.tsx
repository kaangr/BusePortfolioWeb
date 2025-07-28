import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModelContextType {
  activeModelId: string | null;
  setActiveModel: (id: string | null) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  const setActiveModel = (id: string | null) => {
    setActiveModelId(id);
  };

  return (
    <ModelContext.Provider value={{
      activeModelId,
      setActiveModel
    }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
} 