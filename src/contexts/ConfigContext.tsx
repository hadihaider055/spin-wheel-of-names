"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { config } from "@/config/config";
import type { AppConfig } from "@/utils/types/config";

export type { AppConfig };

interface ConfigContextType {
  appConfig: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  setAppConfig: (config: AppConfig) => void;
  updateFeature: (feature: keyof AppConfig["features"], enabled: boolean) => void;
  updateTheme: (theme: Partial<AppConfig["theme"]>) => void;
  updateWheelSettings: (settings: Partial<AppConfig["wheel"]>) => void;
  updateWinnerSettings: (settings: Partial<AppConfig["winner"]>) => void;
  updateBranding: (branding: Partial<AppConfig["branding"]>) => void;
  resetToDefaults: () => void;
  hasCustomizations: boolean;
  isHydrated: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = "rtsc-wheel-config";

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [appConfig, setAppConfig] = useState<AppConfig>(config);
  const [hasCustomizations, setHasCustomizations] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
          const p = JSON.parse(savedConfig);
          // Migrate: if saved theme still has old blue defaults, reset to new purple defaults
          const OLD_PRIMARY = "#3b82f6";
          const OLD_SECONDARY = "#10b981";
          if (p.theme?.primaryColor === OLD_PRIMARY && p.theme?.secondaryColor === OLD_SECONDARY) {
            delete p.theme;
          }
          // Deep-merge each section so new fields from defaults are always present
          setAppConfig({
            ...config,
            ...p,
            theme: {
              ...config.theme,
              ...p.theme,
              darkMode: { ...config.theme.darkMode, ...p.theme?.darkMode },
            },
            wheel: { ...config.wheel, ...p.wheel },
            audio: { ...config.audio, ...p.audio },
            branding: { ...config.branding, ...p.branding },
            features: { ...config.features, ...p.features },
          });
          setHasCustomizations(true);
        }
      } catch (error) {
        console.warn("Failed to load saved configuration:", error);
      }
      setIsHydrated(true);
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

  const updateFeature = (feature: keyof AppConfig["features"], enabled: boolean) => {
    const newConfig = {
      ...appConfig,
      features: { ...appConfig.features, [feature]: enabled },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateTheme = (themeUpdates: Partial<AppConfig["theme"]>) => {
    const newConfig = {
      ...appConfig,
      theme: { ...appConfig.theme, ...themeUpdates },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateWheelSettings = (settings: Partial<AppConfig["wheel"]>) => {
    const newConfig = {
      ...appConfig,
      wheel: { ...appConfig.wheel, ...settings },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateWinnerSettings = (settings: Partial<AppConfig["winner"]>) => {
    const newConfig = {
      ...appConfig,
      winner: { ...appConfig.winner, ...settings },
    };
    setAppConfig(newConfig);
    saveToStorage(newConfig);
  };

  const updateBranding = (branding: Partial<AppConfig["branding"]>) => {
    const newConfig = {
      ...appConfig,
      branding: { ...appConfig.branding, ...branding },
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
    isHydrated,
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
