import { Settings } from "lucide-react";
import { CustomConfig } from "../index";

interface BehaviorTabProps {
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const BehaviorTab: React.FC<BehaviorTabProps> = ({
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-blue-600" />
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Wheel Behavior
        </h3>
      </div>

      {/* Spin Duration */}
      <div>
        <label
          className={`block text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-3`}
        >
          Spin Duration
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={customConfig.spinDuration}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                spinDuration: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>2s</span>
            <span
              className={`font-semibold ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {(customConfig.spinDuration / 1000).toFixed(1)}s
            </span>
            <span>8s</span>
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="space-y-4">
        <h4
          className={`text-base font-semibold ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Audio Settings
        </h4>

        <div
          className={`flex items-center justify-between p-4 ${
            isDark ? "bg-gray-700" : "bg-gray-50"
          } rounded-lg`}
        >
          <div>
            <label
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Spin Sound Effects
            </label>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Play sound while the wheel is spinning
            </p>
          </div>
          <button
            onClick={() =>
              setCustomConfig({
                ...customConfig,
                enableSound: !customConfig.enableSound,
              })
            }
            className={`relative w-14 h-7 rounded-full transition-colors ${
              customConfig.enableSound
                ? "bg-blue-600"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
                customConfig.enableSound ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        <div
          className={`flex items-center justify-between p-4 ${
            isDark ? "bg-gray-700" : "bg-gray-50"
          } rounded-lg`}
        >
          <div>
            <label
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Winner Celebration Sound
            </label>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Play celebration sound when winner is announced
            </p>
          </div>
          <button
            onClick={() =>
              setCustomConfig({
                ...customConfig,
                celebrationSound: !customConfig.celebrationSound,
              })
            }
            className={`relative w-14 h-7 rounded-full transition-colors ${
              customConfig.celebrationSound
                ? "bg-blue-600"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
                customConfig.celebrationSound ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="space-y-4">
        <h4
          className={`text-base font-semibold ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Visual Effects
        </h4>

        <div
          className={`flex items-center justify-between p-4 ${
            isDark ? "bg-gray-700" : "bg-gray-50"
          } rounded-lg`}
        >
          <div>
            <label
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confetti Animation
            </label>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Show confetti when winner is announced
            </p>
          </div>
          <button
            onClick={() =>
              setCustomConfig({
                ...customConfig,
                showConfetti: !customConfig.showConfetti,
              })
            }
            className={`relative w-14 h-7 rounded-full transition-colors ${
              customConfig.showConfetti
                ? "bg-blue-600"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
                customConfig.showConfetti ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Winner Display Duration */}
      <div>
        <label
          className={`block text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-3`}
        >
          Winner Display Duration
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="3000"
            max="10000"
            step="1000"
            value={customConfig.displayDuration}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                displayDuration: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>3s</span>
            <span
              className={`font-semibold ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {(customConfig.displayDuration / 1000).toFixed(0)}s
            </span>
            <span>10s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorTab;
