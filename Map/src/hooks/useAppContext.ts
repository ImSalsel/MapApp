import { useContext } from 'react';
import { AppContext, type AppContextType } from '../context/appContextType';

// hook pro použití AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be inside AppProvider');
  }
  return context;
};