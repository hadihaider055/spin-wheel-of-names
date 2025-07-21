// Spin Wheel of Names - Example configuration file
// Copy to app.config.js and customize for your project

export const appConfig = {
  // App branding - customize these for your organization/event
  title: "My Amazing Giveaway",
  description: "Spin to win fantastic prizes!",

  // Visual customization
  theme: {
    primaryColor: "#your-brand-color", // e.g., "#ff6b35"
    secondaryColor: "#your-accent-color", // e.g., "#4ecdc4"
    backgroundColor: "#ffffff",
    textColor: "#1f2937",

    darkMode: {
      backgroundColor: "#1f2937",
      textColor: "#f9fafb",
      primaryColor: "#60a5fa",
      secondaryColor: "#34d399",
    },
  },

  // Spin wheel behavior
  wheel: {
    spinDuration: 4000, // How long the spin lasts (in milliseconds)
    enableSound: true,
    segments: 6, // Default number of wheel segments

    // Visual appearance
    borderWidth: 4,
    textSize: "16px",
    wheelSize: 400,

    // Animation feel
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    minSpins: 5, // Minimum number of full rotations
    maxSpins: 10, // Maximum number of full rotations
  },

  // Winner celebration
  winner: {
    showConfetti: true,
    displayDuration: 6000, // How long to show winner (milliseconds)
    celebrationSound: true,
    animationType: "fadeInScale", // fadeInScale, slideIn, bounce
  },

  // Audio settings
  audio: {
    spinSound: "/your-spin-sound.mp3", // Path to your custom spin sound
    winnerSound: "/your-winner-sound.mp3", // Path to celebration sound
    volume: 0.7, // Volume level (0.0 to 1.0)
  },

  // Your branding (optional)
  branding: {
    logo: "/images/your-logo.png", // Path to your logo (put logo file in public folder)
    companyName: "Your Company Name",
    website: "https://your-website.com",
    showPoweredBy: false, // Set to false to hide "Powered by" text
  },

  // Pre-populate with your participants
  defaultParticipants: [
    "Alice Johnson",
    "Bob Smith",
    "Carol Davis",
    "David Wilson",
    "Emma Brown",
    "Frank Miller",
  ],

  // Enable/disable features
  features: {
    darkModeToggle: true,
    exportResults: true,
    historyTracking: true,
    customColors: true,
    importParticipants: true,

    // Deletion & Management Features
    deleteParticipants: true, // Individual participant delete buttons
    deleteWinners: true, // Individual winner delete buttons
    clearAllParticipants: true, // "Clear All" button for participants
    clearAllWinners: true, // "Clear All" button for winners
    categoryManagement: true, // Category-level "Clear" buttons
  },
};
