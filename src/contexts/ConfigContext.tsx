"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { config } from "@/config/config";

export interface AppConfig {
  title: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    darkMode: {
      backgroundColor: string;
      textColor: string;
      primaryColor: string;
      secondaryColor: string;
    };
  };
  wheel: {
    spinDuration: number;
    enableSound: boolean;
    segments: number;
    borderWidth: number;
    textSize: string;
    wheelSize: number;
    easing: string;
    minSpins: number;
    maxSpins: number;
  };
  winner: {
    showConfetti: boolean;
    displayDuration: number;
    celebrationSound: boolean;
    animationType: string;
  };
  audio: {
    spinSound: string;
    winnerSound: string | null;
    volume: number;
  };
  branding: {
    logo: string | null;
    companyName: string;
    website: string;
    showPoweredBy: boolean;
  };
  defaultParticipants: string[];
  features: {
    darkModeToggle: boolean;
    exportResults: boolean;
    historyTracking: boolean;
    customColors: boolean;
    importParticipants: boolean;
    deleteParticipants: boolean;
    deleteWinners: boolean;
    clearAllParticipants: boolean;
    clearAllWinners: boolean;
    categoryManagement: boolean;
    bumperPrize: boolean;
    categoryFiltering: boolean;
    weightedSpins: boolean;
    multipleWinners: boolean;
  };
  bumperPrize: {
    enabled: boolean;
    triggerAfter: number;
    prizes: Array<{ name: string; description: string; icon: string }>;
    showAnimation: boolean;
    specialSound: string;
  };
  categoryFiltering: {
    enabled: boolean;
    allowMultipleCategories: boolean;
    showCategoryStats: boolean;
  };
  multipleWinners: {
    enabled: boolean;
    maxWinners: number;
    selectSimultaneously: boolean;
    showAllWinners: boolean;
  };
  weightedSpins: {
    enabled: boolean;
    defaultWeight: number;
    allowCustomWeights: boolean;
    showWeights: boolean;
  };
}

interface ConfigContextType {
  appConfig: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  setAppConfig: (config: AppConfig) => void;
  updateFeature: (
    feature: keyof AppConfig["features"],
    enabled: boolean
  ) => void;
  updateTheme: (theme: Partial<AppConfig["theme"]>) => void;
  updateWheelSettings: (settings: Partial<AppConfig["wheel"]>) => void;
  updateWinnerSettings: (settings: Partial<AppConfig["winner"]>) => void;
  updateBranding: (branding: Partial<AppConfig["branding"]>) => void;
  resetToDefaults: () => void;
  hasCustomizations: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = "rtsc-wheel-config";

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [appConfig, setAppConfig] = useState<AppConfig>(config);
  const [hasCustomizations, setHasCustomizations] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setAppConfig(parsedConfig);
          setHasCustomizations(true);
        }
      } catch (error) {
        console.warn("Failed to load saved configuration:", error);
      }
    }
  }, []);

  const saveToStorage = (newConfig: AppConfig) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
        setHasCustomizations(true);
      } catch (error) {
        console.warn("Failed to save configuration:", error);
      }
    }
  };

  const updateConfig = (updates: Partial<AppConfig>) => {
    const newConfig = { ...appConfig, ...updates };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateFeature = (
    feature: keyof AppConfig["features"],
    enabled: boolean
  ) => {
    const newConfig = {
      ...appConfig,
      features: {
        ...appConfig.features,
        [feature]: enabled,
      },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateTheme = (themeUpdates: Partial<AppConfig["theme"]>) => {
    const newConfig = {
      ...appConfig,
      theme: {
        ...appConfig.theme,
        ...themeUpdates,
      },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateWheelSettings = (settings: Partial<AppConfig["wheel"]>) => {
    const newConfig = {
      ...appConfig,
      wheel: {
        ...appConfig.wheel,
        ...settings,
      },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateWinnerSettings = (settings: Partial<AppConfig["winner"]>) => {
    const newConfig = {
      ...appConfig,
      winner: {
        ...appConfig.winner,
        ...settings,
      },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateBranding = (branding: Partial<AppConfig["branding"]>) => {
    const newConfig = {
      ...appConfig,
      branding: {
        ...appConfig.branding,
        ...branding,
      },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const setAppConfigDirect = (config: AppConfig) => {
    setAppConfig(config);
    saveToStorage(config);
  };

  const resetToDefaults = () => {
    setAppConfig(config);
    setHasCustomizations(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const contextValue: ConfigContextType = {
    appConfig,
    updateConfig,
    setAppConfig: setAppConfigDirect,
    updateFeature,
    updateTheme,
    updateWheelSettings,
    updateWinnerSettings,
    updateBranding,
    resetToDefaults,
    hasCustomizations,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
