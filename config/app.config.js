export const appConfig = {
  // App branding
  title: "Spin Wheel of Names",
  description:
    "A customizable spin wheel for giveaways, contests, and decision making",

  // Visual customization
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",

    // Dark mode colors
    darkMode: {
      backgroundColor: "#1f2937",
      textColor: "#f9fafb",
      primaryColor: "#60a5fa",
      secondaryColor: "#34d399",
    },
  },

  // Spin wheel settings
  wheel: {
    spinDuration: 3000, // milliseconds
    enableSound: true,
    segments: 8, // default number of segments

    // Wheel appearance
    borderWidth: 4,
    textSize: "16px",
    wheelSize: 400, // pixels

    // Animation settings
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    minSpins: 5,
    maxSpins: 10,
  },

  // Winner announcement
  winner: {
    showConfetti: true,
    displayDuration: 5000, // milliseconds
    celebrationSound: true,
    animationType: "fadeInScale", // fadeInScale, slideIn, bounce
  },

  // Sound settings
  audio: {
    spinSound: "/sounds/default-spin.mp3", // Path to spin sound (optional) ... null to disable
    winnerSound: "/sounds/default-sound.mp3", // Path to winner sound (optional) ... null to disable
    volume: 0.7, // 0.0 to 1.0
  },

  // Branding (optional - leave empty to hide)
  branding: {
    logo: "/rtsc-logo-2.png", // Path to logo image
    companyName: "",
    website: "",
    showPoweredBy: true,
  },

  // Default participants (can be overridden)
  defaultParticipants: [
    "Participant 1",
    "Participant 2",
    "Participant 3",
    "Participant 4",
    "Participant 5",
    "Participant 6",
    "Participant 7",
    "Participant 8",
  ],

  // Advanced features
  features: {
    darkModeToggle: true,
    exportResults: true,
    historyTracking: true,
    customColors: true,
    importParticipants: true,
    deleteParticipants: true,
    deleteWinners: true,
    clearAllParticipants: true,
    clearAllWinners: true,
    categoryManagement: true,
    bumperPrize: true,
    categoryFiltering: true,
    weightedSpins: false,
    multipleWinners: false,
  },

  // Bumper prize configuration
  bumperPrize: {
    enabled: true,
    triggerAfter: 3, // Show bumper prize option after N winners
    prizes: [
      {
        name: "Grand Prize",
        description: "Special reward for lucky winner!",
        icon: "🏆",
      },
      {
        name: "Bonus Round",
        description: "Extra spin opportunity!",
        icon: "🎯",
      },
      { name: "Super Prize", description: "Ultimate reward!", icon: "⭐" },
    ],
    showAnimation: true,
    specialSound: "/sounds/bumper-prize.mp3",
  },

  // Category filtering
  categoryFiltering: {
    enabled: true,
    allowMultipleCategories: true,
    showCategoryStats: true,
  },

  // Multiple winners feature
  multipleWinners: {
    enabled: false,
    maxWinners: 3,
    selectSimultaneously: false,
    showAllWinners: true,
  },

  // Weighted spins (premium feature)
  weightedSpins: {
    enabled: false,
    defaultWeight: 1,
    allowCustomWeights: true,
    showWeights: false,
  },
};

// Color presets for quick theming
export const colorPresets = {
  default: {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    colors: [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
    ],
  },
  rainbow: {
    primaryColor: "#e11d48",
    secondaryColor: "#7c3aed",
    colors: [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ],
  },
  ocean: {
    primaryColor: "#0891b2",
    secondaryColor: "#0d9488",
    colors: [
      "#0891b2",
      "#0d9488",
      "#059669",
      "#065f46",
      "#164e63",
      "#155e75",
      "#0f766e",
      "#134e4a",
    ],
  },
  sunset: {
    primaryColor: "#dc2626",
    secondaryColor: "#ea580c",
    colors: [
      "#dc2626",
      "#ea580c",
      "#d97706",
      "#ca8a04",
      "#eab308",
      "#facc15",
      "#fde047",
      "#fef3c7",
    ],
  },
  pastel: {
    primaryColor: "#a855f7",
    secondaryColor: "#ec4899",
    colors: [
      "#fbbf24",
      "#34d399",
      "#60a5fa",
      "#a78bfa",
      "#f472b6",
      "#fb7185",
      "#fbbf24",
      "#34d399",
    ],
  },
};
