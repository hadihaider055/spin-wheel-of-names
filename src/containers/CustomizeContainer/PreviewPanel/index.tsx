import Link from "next/link";
import { Sparkles, Copy, ArrowLeft } from "lucide-react";
import { CustomConfig } from "../index";

interface PreviewPanelProps {
  isDark: boolean;
  previewConfig: CustomConfig;
  hasChanges: boolean;
  onCopyToClipboard: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  isDark,
  previewConfig,
  hasChanges,
  onCopyToClipboard,
}) => {
  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            Live Preview
          </h3>
        </div>

        {/* Mini Wheel Preview */}
        <div className="text-center">
          <div
            className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${previewConfig.primaryColor}, ${previewConfig.secondaryColor})`,
            }}
          >
            <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-white font-bold text-sm mb-1">{previewConfig.title}</div>
                <div className="text-white/80 text-xs">{previewConfig.description}</div>
              </div>
            </div>
            {/* Wheel segments preview */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute w-1/2 h-1/2 origin-bottom-right"
                  style={{
                    transform: `rotate(${i * 90}deg)`,
                  }}
                >
                  <div 
                    className="w-full h-full opacity-30"
                    style={{ 
                      background: i % 2 === 0 ? previewConfig.primaryColor : previewConfig.secondaryColor,
                      clipPath: 'polygon(0 100%, 100% 100%, 50% 0)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
              <div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}>
                Configuration Summary
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Features: <span className="font-medium text-blue-600">
                    {Object.values(previewConfig.features).filter(Boolean).length}/{Object.keys(previewConfig.features).length}
                  </span>
                </div>
                <div className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Duration: <span className="font-medium text-blue-600">
                    {(previewConfig.spinDuration / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Sound: <span className="font-medium text-blue-600">
                    {previewConfig.enableSound ? "On" : "Off"}
                  </span>
                </div>
                <div className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Confetti: <span className="font-medium text-blue-600">
                    {previewConfig.showConfetti ? "On" : "Off"}
                  </span>
                </div>
              </div>
            </div>

            {hasChanges && (
              <div className={`p-3 rounded-lg border-2 border-dashed ${isDark ? "border-yellow-600 bg-yellow-900/20" : "border-yellow-400 bg-yellow-50"}`}>
                <div className={`text-sm font-medium ${isDark ? "text-yellow-300" : "text-yellow-800"} mb-1`}>
                  ⚠️ Unsaved Changes
                </div>
                <div className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-700"}`}>
                  Click "Save Changes" to update the preview and enable download.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6`}>
        <h4 className={`text-base font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
          Quick Actions
        </h4>
        <div className="space-y-3">
          <button
            onClick={onCopyToClipboard}
            disabled={hasChanges}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              hasChanges
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </button>
          
          <Link
            href="/"
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wheel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;