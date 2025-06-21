// Icons
import { Moon, Sun } from "lucide-react";

const DarkModeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({
  isDark,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
  >
    {isDark ? (
      <Sun className="w-6 h-6 text-yellow-500" />
    ) : (
      <Moon className="w-6 h-6 text-gray-700" />
    )}
  </button>
);

export default DarkModeToggle;
