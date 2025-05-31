import React, { useState, type ReactNode, useMemo } from 'react';
import VectorSource from 'ol/source/Vector'; 
import type { ActiveTool } from '../pages/home/types'; 
import { AppContext, type AppContextType } from './appContextType';

// AppProvider obaluje aplikaci a tímn poskytuje sdílené stavy
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // stav pro aktivní nástroj, jednotky vzdálenosti a úhlu  
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
  const [angleUnit, setAngleUnit] = useState<'deg' | 'rad'>('deg');

  // vytvoření VectorSource pro jednotlivé nástroje
  const [measureLineSource] = useState(() => new VectorSource());
  const [measureAngleSource] = useState(() => new VectorSource());
  const [polylineSource] = useState(() => new VectorSource());

  // useMemo pro optimalizaci komponetů kteří odebírají hodnoty z kontextu
  const contextValue = useMemo<AppContextType>(() => ({ 
    activeTool, setActiveTool,
    distanceUnit, setDistanceUnit,
    angleUnit, setAngleUnit,
    measureLineSource,
    measureAngleSource,
    polylineSource
  }), [activeTool, distanceUnit, angleUnit, measureLineSource, measureAngleSource, polylineSource]);

  // poskytování kontextu pro celou aplikaci
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};