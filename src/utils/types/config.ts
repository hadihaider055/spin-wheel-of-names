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
    colorPreset: string;
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
    logo2: string | null;
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
