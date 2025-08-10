import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface DataContextType {
  tribes: any[];
  artifacts: any[];
  vrExperiences: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  getTribes: () => Promise<any[]>;
  getArtifacts: () => Promise<any[]>;
  getVRExperiences: () => Promise<any[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [tribes, setTribes] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [vrExperiences, setVRExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getTribes = async () => {
    try {
      const data = await apiClient.getTribes();
      return data || [];
    } catch (error) {
      console.error('Error fetching tribes:', error);
      return [
        {
          id: 1,
          name: 'Bassa',
          displayName: 'Bassa People',
          description: 'The Bassa people are one of Liberia\'s largest ethnic groups, known for their rich oral traditions.',
          population: 576000
        },
        {
          id: 2,
          name: 'Kpelle',
          displayName: 'Kpelle People',
          description: 'The largest ethnic group in Liberia, with a strong tradition of storytelling and music.',
          population: 487000
        }
      ];
    }
  };

  const getArtifacts = async () => {
    try {
      const data = await apiClient.getArtifacts();
      return data || [];
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      return [
        {
          id: 1,
          name: 'Traditional Mask',
          category: 'Ceremonial',
          tribe: 'Bassa',
          description: 'Sacred ceremonial mask used in traditional rituals.'
        }
      ];
    }
  };

  const getVRExperiences = async () => {
    try {
      const data = await apiClient.getVRExperiences();
      return data || [];
    } catch (error) {
      console.error('Error fetching VR experiences:', error);
      return [
        {
          id: 1,
          title: 'Prehistoric Liberia Museum',
          description: 'Immersive VR tour of prehistoric Liberian culture.',
          category: 'Cultural Tour'
        }
      ];
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const [tribesData, artifactsData, vrData] = await Promise.all([
        getTribes(),
        getArtifacts(),
        getVRExperiences()
      ]);
      
      setTribes(tribesData);
      setArtifacts(artifactsData);
      setVRExperiences(vrData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value: DataContextType = {
    tribes,
    artifacts,
    vrExperiences,
    loading,
    refreshData,
    getTribes,
    getArtifacts,
    getVRExperiences
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext; 