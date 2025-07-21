# 🎨 Customization Guide

This guide helps you customize the Spin Wheel of Names for your organization or event.

## 📁 Quick Setup

### 1. **Add Your Logo**

1. Put your logo file in the `public/` folder (e.g., `public/my-logo.png`)
2. Update `config/app.config.js`:
   ```javascript
   branding: {
     logo: "/my-logo.png",
     companyName: "Your Company",
     website: "https://yourwebsite.com"
   }
   ```

### 2. **Add Custom Sounds**

1. Put sound files in the `public/sounds/` folder
2. Update the audio configuration:
   ```javascript
   audio: {
     spinSound: "/sounds/my-spin-sound.mp3",
     winnerSound: "/sounds/my-celebration.mp3",
     volume: 0.7
   }
   ```

### 3. **Change Colors & Theme**

Pick a preset or create custom colors:

```javascript
import { colorPresets } from './config/app.config';
theme: {
  primaryColor: "#your-brand-color",
  secondaryColor: "#your-accent-color",
  backgroundColor: "#ffffff",
  textColor: "#1f2937"
}
```

## 🎯 Common Customizations

### **Corporate Event**

```javascript
export const appConfig = {
  title: "Company Annual Giveaway",
  description: "Win amazing prizes at our company event!",
  branding: {
    logo: "/company-logo.png",
    companyName: "Acme Corporation",
    website: "https://acme.com",
  },
  theme: {
    primaryColor: "#003f7f",
    secondaryColor: "#00a651",
  },
};
```

### **School Event**

```javascript
export const appConfig = {
  title: "School Prize Draw",
  description: "Good luck to all our students!",
  branding: {
    logo: "/school-logo.png",
    companyName: "Springfield Elementary",
  },
  defaultParticipants: [
    "Class 1A Students",
    "Class 1B Students",
    "Class 2A Students",
  ],
};
```

### **Wedding/Party**

```javascript
export const appConfig = {
  title: "Wedding Game Night",
  description: "Let's see who wins the door prizes!",
  theme: {
    primaryColor: "#e91e63",
    secondaryColor: "#9c27b0",
  },
  winner: {
    showConfetti: true,
    displayDuration: 7000,
    celebrationSound: true,
  },
};
```

## 🌈 Color Presets

### Rainbow Theme

```javascript
import { colorPresets } from "./config/app.config";
```

Perfect for: Kids events, festivals, celebrations

### Ocean Theme

```javascript

```

Perfect for: Professional events, tech conferences

### Sunset Theme

```javascript

```

Perfect for: Evening events, autumn themes

### Pastel Theme

```javascript

```

Perfect for: Baby showers, spring events, gentle themes

## ⚙️ Environment Variables

For deployment, use environment variables in `.env.local`:

```bash
NEXT_PUBLIC_APP_TITLE="My Event Wheel"
NEXT_PUBLIC_PRIMARY_COLOR="ff6b35"
NEXT_PUBLIC_LOGO_URL="/my-logo.png"
NEXT_PUBLIC_COMPANY_NAME="My Company"
```

## 🎵 Audio Setup

### Supported Formats

- MP3 (recommended)
- WAV
- OGG

### Audio Configuration

```javascript
audio: {
  spinSound: "/sounds/spin.mp3",
  winnerSound: "/sounds/winner.mp3",
  volume: 0.5
}
```

## 📱 Responsive Design

The wheel automatically adjusts for different screen sizes:

- Mobile: Smaller wheel, touch-friendly buttons
- Tablet: Medium wheel, optimized layout
- Desktop: Full-size wheel, all features

## ⚙️ Feature Control

### Granular Feature Management

Every UI element can be controlled via configuration:

```javascript
features: {
  // Core Features
  darkModeToggle: true,         // Show/hide dark mode toggle
  historyTracking: true,        // Enable winners history
  importParticipants: true,     // Allow bulk participant input

  // Deletion Features
  deleteParticipants: true,     // Trash icons on participants
  deleteWinners: true,          // Trash icons on winners
  clearAllParticipants: true,   // "Clear All" in participants section
  clearAllWinners: true,        // "Clear All" in winners section
  categoryManagement: true,     // Category-level delete buttons

  // Advanced Features
  exportResults: true,          // Export functionality
  customColors: true,           // Color customization options
  bumperPrize: true,           // Special bumper prize system
  categoryFiltering: true,     // Filter participants by category
  weightedSpins: false,        // Weighted probability spins
  multipleWinners: false,      // Select multiple winners at once
}

// Bumper Prize Configuration
bumperPrize: {
  enabled: true,
  triggerAfter: 3,            // Show after N winners
  prizes: [
    { name: "Grand Prize", description: "Special reward!", icon: "🏆" },
    { name: "Bonus Round", description: "Extra opportunity!", icon: "🎯" },
  ],
  showAnimation: true,
  specialSound: "/sounds/bumper-prize.mp3",
},

// Category Filtering
categoryFiltering: {
  enabled: true,
  allowMultipleCategories: true,
  showCategoryStats: true,
},

// Multiple Winners
multipleWinners: {
  enabled: false,
  maxWinners: 3,
  selectSimultaneously: false,
  showAllWinners: true,
},
```

### Use Cases

**🏢 Corporate Events** (Restricted)

```javascript
features: {
  deleteParticipants: false,    // No accidental deletions
  clearAllParticipants: false,  // Prevent data loss
  deleteWinners: false,         // Preserve winner history
  categoryManagement: false,    // Admin-only management
  bumperPrize: true,           // Corporate rewards
  categoryFiltering: true,      // Department filtering
}
```

**🎉 Casual Events** (Full Control)

```javascript
features: {
  deleteParticipants: true,     // Easy participant management
  clearAllParticipants: true,   // Quick reset between rounds
  deleteWinners: true,          // Manage winners list
  categoryManagement: true,     // Full category control
  bumperPrize: true,           // Fun surprise rewards
  multipleWinners: true,       // Group selections
}
```

**📚 Educational** (Learning Focused)

```javascript
features: {
  historyTracking: true,        // Track all attempts
  deleteWinners: false,         // Preserve learning history
  clearAllWinners: false,       // Keep educational records
  categoryFiltering: true,      // Class/grade filtering
  weightedSpins: true,         // Skill-based probability
}
```

## 🎁 Bumper Prize System

The bumper prize feature adds excitement by offering special rewards after certain milestones:

```javascript
bumperPrize: {
  enabled: true,
  triggerAfter: 3,            // Show after every 3 winners
  prizes: [
    { 
      name: "Grand Prize", 
      description: "Ultimate reward for the lucky winner!", 
      icon: "🏆" 
    },
    { 
      name: "Bonus Spin", 
      description: "Get another chance to win!", 
      icon: "🎯" 
    },
  ],
  showAnimation: true,        // Pulsing modal animation
  specialSound: "/sounds/bumper-prize.mp3",
}
```

**Use Cases:**
- **Corporate events**: Quarterly bonuses, team rewards
- **Schools**: Extra credit, special recognition
- **Parties**: Premium prizes, VIP experiences

## 🔍 Category Filtering

Filter participants by categories for targeted selections:

```javascript
categoryFiltering: {
  enabled: true,
  allowMultipleCategories: true,    // Select multiple categories
  showCategoryStats: true,          // Show participant counts
}
```

**Examples:**
- **Company departments**: Engineering, Marketing, Sales
- **School grades**: Grade 1, Grade 2, Grade 3
- **Event groups**: VIPs, General admission, Staff

## 🔧 Advanced Customization

### Custom Wheel Sizes

```javascript
wheel: {
  wheelSize: 500,     // Pixels (default: 400)
  borderWidth: 6,     // Border thickness
  textSize: "18px",   // Text size on wheel
  spinDuration: 4000  // Spin time in ms
}
```

### Winner Animations

```javascript
winner: {
  animationType: "fadeInScale", // fadeInScale, slideIn, bounce
  displayDuration: 6000,        // How long winner shows
  showConfetti: true            // Confetti animation
}
```

## 💾 Data Management

### Persistent Storage

The app automatically saves all your data locally:

- **Participants list** - Saved when you add/remove participants
- **Winners history** - Last 10 winners are remembered
- **Current spin state** - Wheel position and settings persist

### Storage Locations

```javascript
// Browser localStorage keys used:
"wheelOfFortuneParticipants"; // Your participants list
"wheelOfFortuneWinners"; // Previous winners (max 10)
```

### Data Export/Import

The app provides comprehensive participant management:

1. **Individual Management**:

   - Delete single participants with trash icon (hover to reveal)
   - Confirmation dialog prevents accidental deletions

2. **Category Management**:

   - Clear entire categories with "Clear" button
   - Useful for removing whole groups at once

3. **Bulk Operations**:

   - "Clear All" removes all participants instantly
   - "Full Reset" clears participants, winners, and all data

4. **Import**:

   - Paste multiple names at once in the input field
   - Supports various formats (names only, with grades, categories)

5. **Safety Features**:
   - All delete actions require confirmation
   - Delete buttons disabled during spinning
   - Persistent storage automatically saves changes

## ❓ Troubleshooting

**Logo not showing?**

- Check file path starts with `/`
- Ensure file is in `public/` folder
- Check file format (PNG, JPG, SVG supported)

**Sound not playing?**

- **Browser autoplay policy**: Click anywhere on the page first (required for audio)
- **Check file paths**: Ensure files are in `public/sounds/` folder
- **Check browser console**: Look for audio errors with 🔊 prefix
- **Try different formats**: MP3 works best, avoid large files
- **Test audio files**: Temporarily add the AudioTest component:

```typescript
// For debugging only - remove in production!
import AudioTest from "@/components/debug/AudioTest";

// Add <AudioTest /> to your JSX
```

- **Common issues**:
  - File not found (404 error)
  - Unsupported format
  - File too large/corrupt
  - Browser has audio disabled
  - Spin sound not stopping when winner modal opens (should be fixed automatically)

**Colors not updating?**

- Clear browser cache
- Check hex color format (#ffffff)
- Restart development server

**Data not saving?**

- Check if localStorage is enabled in browser
- Clear browser data if corrupted
- Use "Full Reset" and re-add participants

**Delete buttons not showing?**

- Check feature flags in `config/app.config.js`
- Ensure `deleteParticipants` or `deleteWinners` is `true`
- Buttons only appear on hover - try hovering over items
- Buttons are disabled during wheel spinning

## 🎯 Need Help?

- Check out the [README](README.md) for basic setup
- Look at [config/app.config.example.js](config/app.config.example.js) for examples
- Open an issue on [GitHub](https://github.com/hadihaider055/spin-wheel-of-names/issues)

Happy spinning! 🎉
