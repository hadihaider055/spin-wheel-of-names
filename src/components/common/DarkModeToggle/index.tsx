// Icons
import { Moon, Sun } from "lucide-react";

// Contexts
import { useConfig } from "@/contexts/ConfigContext";

const DarkModeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({
  isDark,
  onToggle,
}) => {
  const { appConfig } = useConfig();

  if (!appConfig.features.darkModeToggle) {
    return null;
  }

  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
      style={{
        backgroundColor: isDark
          ? appConfig.theme.darkMode.backgroundColor
          : appConfig.theme.backgroundColor,
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
      }}
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500" />
      ) : (
        <Moon className="w-6 h-6 text-gray-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
