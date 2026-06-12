import { Settings, Play } from "lucide-react";
import { CustomConfig } from "../index";

interface BehaviorTabProps {
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const WINNER_SOUNDS = [
  { label: "None", value: null },
  { label: "Default", value: "/sounds/default-sound.mp3" },
  { label: "Victory", value: "/sounds/11l-victory-1749704552668-358772.mp3" },
  { label: "Victory (Extended)", value: "/sounds/11l-victory_sound_with_t-1749487402950-357606.mp3" },
  { label: "Applause", value: "/sounds/applause-87939.mp3" },
  { label: "Congratulations", value: "/sounds/congratulations-message-notification-sound-sfx-1-334724.mp3" },
  { label: "Glass Bells", value: "/sounds/fx-gentle-glass-bells-ringtone-320337.mp3" },
  { label: "Medieval Fanfare", value: "/sounds/medieval-fanfare-6826.mp3" },
  { label: "Spin Complete", value: "/sounds/spin-complete-295086.mp3" },
  { label: "Islamic", value: "/sounds/islamic-zaire-hussain.mp3" },
];

const SPIN_SOUNDS = [
  { label: "Default Spin", value: "/sounds/default-spin.mp3" },
  { label: "Glass Bells", value: "/sounds/fx-gentle-glass-bells-ringtone-320337.mp3" },
  { label: "Islamic", value: "/sounds/islamic-zaire-hussain.mp3" },
];

const previewSound = (src: string | null) => {
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = 0.7;
    audio.play().catch(() => {});
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
  } catch {}
};

const Toggle: React.FC<{
  isDark: boolean;
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}> = ({ isDark, enabled, onToggle, label, description }) => (
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
        {label}
      </label>
      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {description}
      </p>
    </div>
    <button
      onClick={onToggle}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        enabled ? "bg-blue-600" : isDark ? "bg-gray-600" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
          enabled ? "translate-x-7" : ""
        }`}
      />
    </button>
  </div>
);

const BehaviorTab: React.FC<BehaviorTabProps> = ({
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  const selectClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
    isDark
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-gray-900"
  }`;

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
            max="30000"
            step="500"
            value={customConfig.spinDuration}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                spinDuration: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>2s</span>
            <span className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              {(customConfig.spinDuration / 1000).toFixed(1)}s
            </span>
            <span>30s</span>
          </div>
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
            max="60000"
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
            <span className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              {(customConfig.displayDuration / 1000).toFixed(0)}s
            </span>
            <span>60s</span>
          </div>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="space-y-3">
        <h4 className={`text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          Visual Effects
        </h4>
        <Toggle
          isDark={isDark}
          enabled={customConfig.showConfetti}
          onToggle={() =>
            setCustomConfig({ ...customConfig, showConfetti: !customConfig.showConfetti })
          }
          label="Confetti Animation"
          description="Show confetti when winner is announced"
        />
      </div>

      {/* Audio Settings */}
      <div className="space-y-4">
        <h4 className={`text-base font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          Audio Settings
        </h4>

        <Toggle
          isDark={isDark}
          enabled={customConfig.enableSound}
          onToggle={() =>
            setCustomConfig({ ...customConfig, enableSound: !customConfig.enableSound })
          }
          label="Spin Sound Effects"
          description="Play sound while the wheel is spinning"
        />

        <Toggle
          isDark={isDark}
          enabled={customConfig.celebrationSound}
          onToggle={() =>
            setCustomConfig({
              ...customConfig,
              celebrationSound: !customConfig.celebrationSound,
            })
          }
          label="Winner Celebration Sound"
          description="Play celebration sound when winner is announced"
        />

        {/* Volume */}
        <div className={`p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Volume — {Math.round(customConfig.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={customConfig.volume}
            onChange={(e) =>
              setCustomConfig({ ...customConfig, volume: parseFloat(e.target.value) })
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Spin Sound Selector */}
        <div className={`p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"} rounded-lg space-y-2`}>
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Spin Sound
          </label>
          <div className="flex gap-2">
            <select
              value={customConfig.spinSound}
              onChange={(e) =>
                setCustomConfig({ ...customConfig, spinSound: e.target.value })
              }
              className={selectClass}
            >
              {SPIN_SOUNDS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => previewSound(customConfig.spinSound)}
              title="Preview spin sound"
              className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                isDark
                  ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Winner Sound Selector */}
        <div className={`p-4 ${isDark ? "bg-gray-700" : "bg-gray-50"} rounded-lg space-y-2`}>
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Winner Announcement Sound
          </label>
          <div className="flex gap-2">
            <select
              value={customConfig.winnerSound ?? ""}
              onChange={(e) =>
                setCustomConfig({
                  ...customConfig,
                  winnerSound: e.target.value || null,
                })
              }
              className={selectClass}
            >
              {WINNER_SOUNDS.map((s) => (
                <option key={s.value ?? "__none__"} value={s.value ?? ""}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => previewSound(customConfig.winnerSound)}
              title="Preview winner sound"
              disabled={!customConfig.winnerSound}
              className={`p-2 rounded-lg flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isDark
                  ? "bg-gray-600 hover:bg-gray-500 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorTab;
