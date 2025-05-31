import { createContext } from 'react';
import VectorSource from 'ol/source/Vector'; 
import type { ActiveTool } from '../pages/home/types'; 

export interface AppContextType {
  activeTool: ActiveTool;
  setActiveTool: React.Dispatch<React.SetStateAction<ActiveTool>>;
  distanceUnit: 'km' | 'mi';
  setDistanceUnit: React.Dispatch<React.SetStateAction<'km' | 'mi'>>;
  angleUnit: 'deg' | 'rad';
  setAngleUnit: React.Dispatch<React.SetStateAction<'deg' | 'rad'>>;
  measureLineSource: VectorSource;
  measureAngleSource: VectorSource;
  polylineSource: VectorSource;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);