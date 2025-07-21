import { appConfig, colorPresets } from "../../config/app.config";

interface AppConfig {
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

function getEnvVar(key: string, fallback: any): any {
  const value = process.env[key];
  if (value === undefined) return fallback;

  if (value === "true") return true;
  if (value === "false") return false;

  if (!isNaN(Number(value))) return Number(value);

  return value;
}

export const config: AppConfig = {
  title: getEnvVar("NEXT_PUBLIC_APP_TITLE", appConfig.title),
  description: getEnvVar("NEXT_PUBLIC_APP_DESCRIPTION", appConfig.description),

  theme: {
    primaryColor: getEnvVar(
      "NEXT_PUBLIC_PRIMARY_COLOR",
      appConfig.theme.primaryColor
    ),
    secondaryColor: getEnvVar(
      "NEXT_PUBLIC_SECONDARY_COLOR",
      appConfig.theme.secondaryColor
    ),
    backgroundColor: getEnvVar(
      "NEXT_PUBLIC_BACKGROUND_COLOR",
      appConfig.theme.backgroundColor
    ),
    textColor: getEnvVar("NEXT_PUBLIC_TEXT_COLOR", appConfig.theme.textColor),
    darkMode: {
      backgroundColor: getEnvVar(
        "NEXT_PUBLIC_DARK_BACKGROUND_COLOR",
        appConfig.theme.darkMode.backgroundColor
      ),
      textColor: getEnvVar(
        "NEXT_PUBLIC_DARK_TEXT_COLOR",
        appConfig.theme.darkMode.textColor
      ),
      primaryColor: getEnvVar(
        "NEXT_PUBLIC_DARK_PRIMARY_COLOR",
        appConfig.theme.darkMode.primaryColor
      ),
      secondaryColor: getEnvVar(
        "NEXT_PUBLIC_DARK_SECONDARY_COLOR",
        appConfig.theme.darkMode.secondaryColor
      ),
    },
  },

  wheel: {
    spinDuration: getEnvVar(
      "NEXT_PUBLIC_SPIN_DURATION",
      appConfig.wheel.spinDuration
    ),
    enableSound: getEnvVar(
      "NEXT_PUBLIC_ENABLE_SOUND",
      appConfig.wheel.enableSound
    ),
    segments: getEnvVar("NEXT_PUBLIC_WHEEL_SEGMENTS", appConfig.wheel.segments),
    borderWidth: getEnvVar(
      "NEXT_PUBLIC_WHEEL_BORDER_WIDTH",
      appConfig.wheel.borderWidth
    ),
    textSize: getEnvVar(
      "NEXT_PUBLIC_WHEEL_TEXT_SIZE",
      appConfig.wheel.textSize
    ),
    wheelSize: getEnvVar("NEXT_PUBLIC_WHEEL_SIZE", appConfig.wheel.wheelSize),
    easing: getEnvVar("NEXT_PUBLIC_WHEEL_EASING", appConfig.wheel.easing),
    minSpins: getEnvVar("NEXT_PUBLIC_MIN_SPINS", appConfig.wheel.minSpins),
    maxSpins: getEnvVar("NEXT_PUBLIC_MAX_SPINS", appConfig.wheel.maxSpins),
  },

  winner: {
    showConfetti: getEnvVar(
      "NEXT_PUBLIC_SHOW_CONFETTI",
      appConfig.winner.showConfetti
    ),
    displayDuration: getEnvVar(
      "NEXT_PUBLIC_WINNER_DISPLAY_DURATION",
      appConfig.winner.displayDuration
    ),
    celebrationSound: getEnvVar(
      "NEXT_PUBLIC_CELEBRATION_SOUND",
      appConfig.winner.celebrationSound
    ),
    animationType: getEnvVar(
      "NEXT_PUBLIC_ANIMATION_TYPE",
      appConfig.winner.animationType
    ),
  },

  audio: {
    spinSound: getEnvVar(
      "NEXT_PUBLIC_SPIN_SOUND_PATH",
      appConfig.audio.spinSound
    ),
    winnerSound: getEnvVar(
      "NEXT_PUBLIC_WINNER_SOUND_PATH",
      appConfig.audio.winnerSound
    ),
    volume: getEnvVar("NEXT_PUBLIC_AUDIO_VOLUME", appConfig.audio.volume),
  },

  branding: {
    logo: getEnvVar("NEXT_PUBLIC_LOGO_URL", appConfig.branding.logo),
    companyName: getEnvVar(
      "NEXT_PUBLIC_COMPANY_NAME",
      appConfig.branding.companyName
    ),
    website: getEnvVar("NEXT_PUBLIC_WEBSITE", appConfig.branding.website),
    showPoweredBy: getEnvVar(
      "NEXT_PUBLIC_SHOW_POWERED_BY",
      appConfig.branding.showPoweredBy
    ),
  },

  defaultParticipants: appConfig.defaultParticipants,

  features: {
    darkModeToggle: getEnvVar(
      "NEXT_PUBLIC_ENABLE_DARK_MODE",
      appConfig.features.darkModeToggle
    ),
    exportResults: getEnvVar(
      "NEXT_PUBLIC_ENABLE_EXPORT",
      appConfig.features.exportResults
    ),
    historyTracking: getEnvVar(
      "NEXT_PUBLIC_ENABLE_HISTORY",
      appConfig.features.historyTracking
    ),
    customColors: getEnvVar(
      "NEXT_PUBLIC_ENABLE_CUSTOM_COLORS",
      appConfig.features.customColors
    ),
    importParticipants: getEnvVar(
      "NEXT_PUBLIC_ENABLE_IMPORT",
      appConfig.features.importParticipants
    ),
    deleteParticipants: getEnvVar(
      "NEXT_PUBLIC_ENABLE_DELETE_PARTICIPANTS",
      appConfig.features.deleteParticipants
    ),
    deleteWinners: getEnvVar(
      "NEXT_PUBLIC_ENABLE_DELETE_WINNERS",
      appConfig.features.deleteWinners
    ),
    clearAllParticipants: getEnvVar(
      "NEXT_PUBLIC_ENABLE_CLEAR_ALL_PARTICIPANTS",
      appConfig.features.clearAllParticipants
    ),
    clearAllWinners: getEnvVar(
      "NEXT_PUBLIC_ENABLE_CLEAR_ALL_WINNERS",
      appConfig.features.clearAllWinners
    ),
    categoryManagement: getEnvVar(
      "NEXT_PUBLIC_ENABLE_CATEGORY_MANAGEMENT",
      appConfig.features.categoryManagement
    ),
    bumperPrize: getEnvVar(
      "NEXT_PUBLIC_ENABLE_BUMPER_PRIZE",
      appConfig.features.bumperPrize
    ),
    categoryFiltering: getEnvVar(
      "NEXT_PUBLIC_ENABLE_CATEGORY_FILTERING",
      appConfig.features.categoryFiltering
    ),
    weightedSpins: getEnvVar(
      "NEXT_PUBLIC_ENABLE_WEIGHTED_SPINS",
      appConfig.features.weightedSpins
    ),
    multipleWinners: getEnvVar(
      "NEXT_PUBLIC_ENABLE_MULTIPLE_WINNERS",
      appConfig.features.multipleWinners
    ),
  },

  bumperPrize: appConfig.bumperPrize,
  categoryFiltering: appConfig.categoryFiltering,
  multipleWinners: appConfig.multipleWinners,
  weightedSpins: appConfig.weightedSpins,
};

export { colorPresets };

export function applyTheme(isDarkMode: boolean = false) {
  const root = document.documentElement;
  const theme = isDarkMode ? config.theme.darkMode : config.theme;

  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--secondary-color", theme.secondaryColor);
  root.style.setProperty("--background-color", theme.backgroundColor);
  root.style.setProperty("--text-color", theme.textColor);
}

export function getWheelColors(preset: string = "default"): string[] {
  return (
    colorPresets[preset as keyof typeof colorPresets]?.colors ||
    colorPresets.default.colors
  );
}
