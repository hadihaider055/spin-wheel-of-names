"use client";

import React, { useState, useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { applyTheme } from "@/config/config";
import CustomizeHeader from "./Header";
import CustomizeTabs from "./CustomizeTabs";
import PreviewPanel from "./PreviewPanel";
import InstructionsPanel from "./InstructionsPanel";
import Footer from "@/components/common/Footer";

export interface CustomConfig {
  title: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  darkPrimaryColor: string;
  darkSecondaryColor: string;
  darkBackgroundColor: string;
  enableSound: boolean;
  spinDuration: number;
  showConfetti: boolean;
  celebrationSound: boolean;
  displayDuration: number;
  features: { [key: string]: boolean };
  logo: string | null;
  logo2: string | null;
  companyName: string;
  website: string;
  colorPreset: string;
  spinSound: string;
  winnerSound: string | null;
  volume: number;
}

const CustomizeContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("appearance");

  const {
    appConfig,
    setAppConfig,
    resetToDefaults,
    hasCustomizations,
    isHydrated,
    isDark,
    toggleDarkMode,
  } = useConfig();

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const buildCustomConfig = (cfg: typeof appConfig): CustomConfig => ({
    title: cfg.title,
    description: cfg.description,
    primaryColor: cfg.theme.primaryColor,
    secondaryColor: cfg.theme.secondaryColor,
    darkPrimaryColor: cfg.theme.darkMode.primaryColor,
    darkSecondaryColor: cfg.theme.darkMode.secondaryColor,
    darkBackgroundColor: cfg.theme.darkMode.backgroundColor,
    enableSound: cfg.wheel.enableSound,
    spinDuration: cfg.wheel.spinDuration,
    showConfetti: cfg.winner.showConfetti,
    celebrationSound: cfg.winner.celebrationSound,
    displayDuration: cfg.winner.displayDuration,
    features: { ...cfg.features },
    logo: cfg.branding.logo,
    logo2: cfg.branding.logo2,
    companyName: cfg.branding.companyName,
    website: cfg.branding.website,
    colorPreset: cfg.wheel.colorPreset,
    spinSound: cfg.audio.spinSound,
    winnerSound: cfg.audio.winnerSound,
    volume: cfg.audio.volume,
  });

  const [customConfig, setCustomConfigState] = useState<CustomConfig>(() =>
    buildCustomConfig(appConfig)
  );

  const [lastResetTime, setLastResetTime] = useState(Date.now());

  // Re-sync once after localStorage hydration so a direct page reload shows saved values
  useEffect(() => {
    if (isHydrated) {
      setCustomConfigState(buildCustomConfig(appConfig));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  useEffect(() => {
    setCustomConfigState(buildCustomConfig(appConfig));
  // Only re-sync when a reset happens, not on every appConfig change
  // (to avoid overwriting in-flight edits)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastResetTime]);

  const setCustomConfig = (config: CustomConfig) => {
    setCustomConfigState(config);

    const newAppConfig = {
      ...appConfig,
      title: config.title,
      description: config.description,
      theme: {
        ...appConfig.theme,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        // Keep dark mode in sync with the user's chosen colours so toggling
        // dark mode doesn't revert to the old purple defaults.
        darkMode: {
          ...appConfig.theme.darkMode,
          primaryColor: config.darkPrimaryColor,
          secondaryColor: config.darkSecondaryColor,
          backgroundColor: config.darkBackgroundColor,
        },
      },
      wheel: {
        ...appConfig.wheel,
        enableSound: config.enableSound,
        spinDuration: config.spinDuration,
        colorPreset: config.colorPreset,
      },
      winner: {
        ...appConfig.winner,
        showConfetti: config.showConfetti,
        celebrationSound: config.celebrationSound,
        displayDuration: config.displayDuration,
      },
      audio: {
        ...appConfig.audio,
        spinSound: config.spinSound,
        winnerSound: config.winnerSound,
        volume: config.volume,
      },
      branding: {
        ...appConfig.branding,
        logo: config.logo,
        logo2: config.logo2,
        companyName: config.companyName,
        website: config.website,
      },
      features: {
        darkModeToggle: config.features.darkModeToggle ?? appConfig.features.darkModeToggle,
        exportResults: config.features.exportResults ?? appConfig.features.exportResults,
        historyTracking: config.features.historyTracking ?? appConfig.features.historyTracking,
        customColors: config.features.customColors ?? appConfig.features.customColors,
        importParticipants: config.features.importParticipants ?? appConfig.features.importParticipants,
        deleteParticipants: config.features.deleteParticipants ?? appConfig.features.deleteParticipants,
        deleteWinners: config.features.deleteWinners ?? appConfig.features.deleteWinners,
        clearAllParticipants: config.features.clearAllParticipants ?? appConfig.features.clearAllParticipants,
        clearAllWinners: config.features.clearAllWinners ?? appConfig.features.clearAllWinners,
        categoryManagement: config.features.categoryManagement ?? appConfig.features.categoryManagement,
        bumperPrize: config.features.bumperPrize ?? appConfig.features.bumperPrize,
        categoryFiltering: config.features.categoryFiltering ?? appConfig.features.categoryFiltering,
        weightedSpins: config.features.weightedSpins ?? appConfig.features.weightedSpins,
        multipleWinners: config.features.multipleWinners ?? appConfig.features.multipleWinners,
      },
    };

    setAppConfig(newAppConfig);
  };

  const handleSave = () => {
    alert("Changes saved successfully! They're now live on your wheel.");
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all customizations to default values? This cannot be undone."
      )
    ) {
      resetToDefaults();
      setLastResetTime(Date.now());
      alert("All settings have been reset to defaults.");
    }
  };

  const generateConfig = () => {
    return `export const appConfig = {
  title: "${appConfig.title}",
  description: "${appConfig.description}",

  theme: {
    primaryColor: "${appConfig.theme.primaryColor}",
    secondaryColor: "${appConfig.theme.secondaryColor}",
    backgroundColor: "${appConfig.theme.backgroundColor}",
    textColor: "${appConfig.theme.textColor}",
    darkMode: {
      backgroundColor: "${appConfig.theme.darkMode.backgroundColor}",
      textColor: "${appConfig.theme.darkMode.textColor}",
      primaryColor: "${appConfig.theme.darkMode.primaryColor}",
      secondaryColor: "${appConfig.theme.darkMode.secondaryColor}",
    },
  },

  wheel: {
    spinDuration: ${appConfig.wheel.spinDuration},
    enableSound: ${appConfig.wheel.enableSound},
    segments: ${appConfig.wheel.segments},
    borderWidth: ${appConfig.wheel.borderWidth},
    textSize: "${appConfig.wheel.textSize}",
    wheelSize: ${appConfig.wheel.wheelSize},
    easing: "${appConfig.wheel.easing}",
    minSpins: ${appConfig.wheel.minSpins},
    maxSpins: ${appConfig.wheel.maxSpins},
    colorPreset: "${appConfig.wheel.colorPreset}",
  },

  winner: {
    showConfetti: ${appConfig.winner.showConfetti},
    displayDuration: ${appConfig.winner.displayDuration},
    celebrationSound: ${appConfig.winner.celebrationSound},
    animationType: "${appConfig.winner.animationType}",
  },

  audio: {
    spinSound: "${appConfig.audio.spinSound}",
    winnerSound: ${appConfig.audio.winnerSound ? `"${appConfig.audio.winnerSound}"` : null},
    volume: ${appConfig.audio.volume},
  },

  branding: {
    logo: ${appConfig.branding.logo ? `"${appConfig.branding.logo}"` : null},
    logo2: ${appConfig.branding.logo2 ? `"${appConfig.branding.logo2}"` : null},
    companyName: "${appConfig.branding.companyName}",
    website: "${appConfig.branding.website}",
    showPoweredBy: ${appConfig.branding.showPoweredBy},
  },

  defaultParticipants: ${JSON.stringify(appConfig.defaultParticipants, null, 4)},

  features: {
    darkModeToggle: ${appConfig.features.darkModeToggle},
    exportResults: ${appConfig.features.exportResults},
    historyTracking: ${appConfig.features.historyTracking},
    customColors: ${appConfig.features.customColors},
    importParticipants: ${appConfig.features.importParticipants},
    deleteParticipants: ${appConfig.features.deleteParticipants},
    deleteWinners: ${appConfig.features.deleteWinners},
    clearAllParticipants: ${appConfig.features.clearAllParticipants},
    clearAllWinners: ${appConfig.features.clearAllWinners},
    categoryManagement: ${appConfig.features.categoryManagement},
    bumperPrize: ${appConfig.features.bumperPrize},
    categoryFiltering: ${appConfig.features.categoryFiltering},
    weightedSpins: ${appConfig.features.weightedSpins},
    multipleWinners: ${appConfig.features.multipleWinners},
  },

  bumperPrize: {
    enabled: ${appConfig.bumperPrize.enabled},
    triggerAfter: ${appConfig.bumperPrize.triggerAfter},
    prizes: ${JSON.stringify(appConfig.bumperPrize.prizes, null, 6)},
    showAnimation: ${appConfig.bumperPrize.showAnimation},
    specialSound: "${appConfig.bumperPrize.specialSound}",
  },

  categoryFiltering: {
    enabled: ${appConfig.categoryFiltering.enabled},
    allowMultipleCategories: ${appConfig.categoryFiltering.allowMultipleCategories},
    showCategoryStats: ${appConfig.categoryFiltering.showCategoryStats},
  },

  multipleWinners: {
    enabled: ${appConfig.multipleWinners.enabled},
    maxWinners: ${appConfig.multipleWinners.maxWinners},
    selectSimultaneously: ${appConfig.multipleWinners.selectSimultaneously},
    showAllWinners: ${appConfig.multipleWinners.showAllWinners},
  },

  weightedSpins: {
    enabled: ${appConfig.weightedSpins.enabled},
    defaultWeight: ${appConfig.weightedSpins.defaultWeight},
    allowCustomWeights: ${appConfig.weightedSpins.allowCustomWeights},
    showWeights: ${appConfig.weightedSpins.showWeights},
  },
};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateConfig());
    alert("Configuration copied to clipboard!");
  };

  const downloadConfig = () => {
    const element = document.createElement("a");
    const file = new Blob([generateConfig()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "app.config.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${appConfig.theme.darkMode.backgroundColor} 0%, ${appConfig.theme.darkMode.primaryColor}55 50%, ${appConfig.theme.darkMode.secondaryColor}44 100%)`
          : `linear-gradient(135deg, ${appConfig.theme.backgroundColor} 0%, ${appConfig.theme.primaryColor}22 50%, ${appConfig.theme.secondaryColor}22 100%)`,
      }}
    >
      <CustomizeHeader
        isDark={isDark}
        setIsDark={toggleDarkMode}
        hasChanges={false}
        onSave={handleSave}
        onDownload={downloadConfig}
        onReset={hasCustomizations ? handleReset : undefined}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div
              className={`${
                isDark
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/80 border-gray-200/50"
              } backdrop-blur-sm rounded-2xl shadow-xl border p-6`}
            >
              <CustomizeTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isDark={isDark}
                customConfig={customConfig}
                setCustomConfig={setCustomConfig}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`${
                isDark
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-white/80 border-gray-200/50"
              } backdrop-blur-sm rounded-2xl shadow-xl border p-6`}
            >
              <PreviewPanel
                isDark={isDark}
                previewConfig={customConfig}
                hasChanges={false}
                onCopyToClipboard={copyToClipboard}
              />
            </div>
          </div>
        </div>

        <div
          className={`mt-8 ${
            isDark
              ? "bg-gray-800/50 border-gray-700"
              : "bg-white/80 border-gray-200/50"
          } backdrop-blur-sm rounded-2xl shadow-xl border p-6`}
        >
          <InstructionsPanel isDark={isDark} />
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default CustomizeContainer;
