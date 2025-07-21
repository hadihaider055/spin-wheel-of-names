# 🎯 Spin Wheel of Names

A customizable, open-source spin wheel application built with Next.js and React. Perfect for giveaways, prize draws, decision making, or any interactive spinning wheel needs.

## ✨ Features

- 🎨 **Fully Customizable** - Colors, branding, and styling
- 🌙 **Dark/Light Mode** - Built-in theme switching
- 🎵 **Sound Effects** - Optional audio feedback
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast & Modern** - Built with Next.js 15 and React 19
- 🎁 **Winner Announcements** - Animated winner display
- 📊 **Participant Management** - Easy import/export/delete of participants
- 🗑️ **Flexible Deletion** - Remove individual participants, winners, or entire categories
- ⚙️ **Configurable Features** - Enable/disable any feature via configuration
- 🌈 **Gradient Colors** - Beautiful auto-generated color schemes
- 💾 **Persistent Storage** - Never lose your participants or winners data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hadihaider055/spin-wheel-of-names.git
   cd spin-wheel-of-names
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Basic Configuration

Create a `config/app.config.js` file in your project root:

```javascript
export const appConfig = {
  title: "My Spin Wheel",
  description: "Win amazing prizes!",
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
  },
  wheel: {
    spinDuration: 3000,
    enableSound: true,
    segments: 8,
  },
  winner: {
    showConfetti: true,
    displayDuration: 5000,
  },
};
```

### Environment Variables

Create a `.env.local` file:

```bash
# App Configuration
NEXT_PUBLIC_APP_TITLE="Spin Wheel of Names"
NEXT_PUBLIC_ENABLE_SOUND=true
NEXT_PUBLIC_PRIMARY_COLOR="#3b82f6"

# Optional: Custom branding
NEXT_PUBLIC_LOGO_URL="/your-logo.png"
NEXT_PUBLIC_FAVICON_URL="/your-favicon.ico"
```

## 📁 Project Structure

```
├── public/                 # Static assets
│   ├── sounds/            # Audio files
│   └── images/            # Logo and images
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable components
│   │   └── common/        # Common UI components
│   ├── containers/        # Page containers
│   │   ├── SpinWheel/     # Main spin wheel component
│   │   ├── GiftSection/   # Prize/gift display
│   │   └── WinnerAnnouncement/ # Winner display
│   └── utils/             # Utilities and helpers
│       ├── functions/     # Helper functions
│       ├── hooks/         # Custom React hooks
│       └── types/         # TypeScript type definitions
├── config/                # Configuration files
└── docs/                  # Documentation
```

## 💾 Data Persistence

The application automatically saves your data locally in your browser:

- **Participants**: All added participants are saved and restored when you return
- **Winners History**: Previous winners are remembered across sessions
- **Settings**: Your customizations and preferences persist
- **No Account Required**: Everything works offline in your browser

### Storage Details

- Uses browser's `localStorage` for data persistence
- Automatically saves when participants are added/removed
- Winners history limited to last 10 entries for performance
- Data persists until you clear browser data or use "Full Reset"

## 🎯 Usage Examples

### Adding Participants

Simply paste a list of names in the input field:

```
John Doe
Jane Smith
Bob Wilson
Alice Johnson
```

Or format with categories and grades:

```
John Doe (Grade A, Sales Team)
Jane Smith (Grade B, Marketing Team)
```

### Managing Participants & Winners

**Participants:**

- **Individual Delete**: Hover over any participant and click the trash icon
- **Category Delete**: Click "Clear" button next to any category name
- **Clear All**: Click "Clear All" button to remove all participants
- **Bulk Import**: Paste multiple names at once in the input field

**Winners:**

- **Individual Delete**: Hover over any winner and click the trash icon
- **Clear All Winners**: Click "Clear All" button in winners section
- **Persistent History**: Winners are saved across sessions (last 10)

### Custom Wheel Configuration

```javascript
const wheelConfig = {
  segments: participants.length,
  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
  spinDuration: 4000,
  enableSound: true,
};
```

## ⚙️ Feature Configuration

Control which features are available in your app:

```javascript
// config/app.config.js
features: {
  darkModeToggle: true,         // Show/hide dark mode button
  exportResults: true,          // Enable result export functionality
  historyTracking: true,        // Save winners history
  customColors: true,           // Allow color customization
  importParticipants: true,     // Allow bulk participant import

  // Deletion Features (NEW)
  deleteParticipants: true,     // Individual participant delete buttons
  deleteWinners: true,          // Individual winner delete buttons
  clearAllParticipants: true,   // "Clear All" button for participants
  clearAllWinners: true,        // "Clear All" button for winners
  categoryManagement: true,     // Category-level "Clear" buttons
}
```

### Environment Variables

```bash
# Disable specific features for production
NEXT_PUBLIC_ENABLE_DELETE_WINNERS=false
NEXT_PUBLIC_ENABLE_CLEAR_ALL_WINNERS=false
NEXT_PUBLIC_ENABLE_CATEGORY_MANAGEMENT=false
```

## 🎨 Customization Guide

### Theming

The app supports full theme customization through CSS variables and configuration files. See `CUSTOMIZATION.md` for detailed instructions.

### Adding Custom Sounds

1. Add your audio files to `public/sounds/`
2. Update the configuration to reference your files
3. Ensure files are in supported formats (MP3, WAV, OGG)

### Custom Animations

Modify the spin wheel animations by editing the CSS in `src/containers/SpinWheel/index.tsx`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: `npm run build && npm run export`
- **Railway**: Direct deployment from Git
- **Docker**: Use the included Dockerfile

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

**Wheel not spinning**: Check that participants are loaded and the wheel is not already spinning.

**Sound not playing**: Ensure `enableSound` is set to `true` and audio files are in the correct directory.

**Styling issues**: Verify your CSS customizations and check browser console for errors.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

- 🐛 [Report a bug](https://github.com/hadihaider055/spin-wheel-of-names/issues)
- 💡 [Request a feature](https://github.com/hadihaider055/spin-wheel-of-names/issues)
- 📖 [View documentation](https://github.com/hadihaider055/spin-wheel-of-names/blob/main/CUSTOMIZATION.md)

---

Made with ❤️ by [Hadi Haider](https://linkedin.com/in/hadi-haider)
