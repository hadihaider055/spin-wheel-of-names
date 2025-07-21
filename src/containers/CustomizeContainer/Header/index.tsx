import Link from "next/link";
import { ArrowLeft, Sun, Moon, Save, Download, RotateCcw } from "lucide-react";

interface CustomizeHeaderProps {
  isDark: boolean;
  setIsDark: () => void;
  hasChanges: boolean;
  onSave: () => void;
  onDownload: () => void;
  onReset?: () => void;
}

const CustomizeHeader: React.FC<CustomizeHeaderProps> = ({
  isDark,
  setIsDark,
  hasChanges,
  onSave,
  onDownload,
  onReset,
}) => {
  return (
    <div className={`${isDark ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"} border-b sticky top-0 z-50 backdrop-blur-sm shadow-lg`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isDark ? "text-gray-300 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"} transition-all duration-200`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Wheel
            </Link>
            <div className={`h-6 w-px ${isDark ? "bg-gray-600" : "bg-gray-300"}`}></div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"} flex items-center gap-2`}>
              <span className="text-3xl">🎨</span>
              Customize Your Wheel
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={setIsDark}
              className={`p-3 rounded-xl ${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} transition-all duration-200 shadow-sm hover:shadow-md`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            
            {onReset && (
              <button
                onClick={onReset}
                className={`flex items-center gap-2 px-4 py-2 ${isDark ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-700"} text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md hover:scale-105`}
                title="Reset to default settings"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}

            <button
              onClick={onSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              title="Apply changes to live wheel"
            >
              <Save className="w-4 h-4" />
              Apply Changes
            </button>

            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              title="Download configuration file"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeHeader;