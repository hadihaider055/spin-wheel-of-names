import { Palette, Upload, X, Link, Unlink } from "lucide-react";
import { useRef, useState } from "react";
import { CustomConfig } from "../index";

interface AppearanceTabProps {
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const COLOR_PRESETS = [
  {
    id: "default",
    name: "Default",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
  },
  {
    id: "rainbow",
    name: "Rainbow",
    colors: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: ["#0891b2", "#0d9488", "#059669", "#065f46"],
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: ["#dc2626", "#ea580c", "#d97706", "#ca8a04"],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: ["#fbbf24", "#34d399", "#60a5fa", "#a78bfa"],
  },
];

const AppearanceTab: React.FC<AppearanceTabProps> = ({
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const logo2InputRef = useRef<HTMLInputElement>(null);
  const [followLight, setFollowLight] = useState(true);

  const setLightColor = (key: "primaryColor" | "secondaryColor", value: string) => {
    const update: Partial<CustomConfig> = { [key]: value };
    if (followLight) {
      if (key === "primaryColor") update.darkPrimaryColor = value;
      if (key === "secondaryColor") update.darkSecondaryColor = value;
    }
    setCustomConfig({ ...customConfig, ...update });
  };

  const syncNow = () => {
    setCustomConfig({
      ...customConfig,
      darkPrimaryColor: customConfig.primaryColor,
      darkSecondaryColor: customConfig.secondaryColor,
    });
  };

  const handleLogoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: "logo" | "logo2"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomConfig({ ...customConfig, [slot]: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const LogoSlot = ({
    slot,
    label,
    inputRef,
  }: {
    slot: "logo" | "logo2";
    label: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => {
    const value = customConfig[slot];
    return (
      <div>
        <label
          className={`block text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-3`}
        >
          {label}
        </label>
        <div className="space-y-3">
          {value ? (
            <div className="relative group">
              <div
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <img
                  src={value}
                  alt={label}
                  className="max-h-20 mx-auto object-contain"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <button
                onClick={() => setCustomConfig({ ...customConfig, [slot]: null })}
                className={`absolute -top-2 -right-2 p-1 rounded-full ${
                  isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                } text-white shadow-lg transition-all duration-200 hover:scale-110`}
                title={`Remove ${label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              className={`w-full h-24 border-2 border-dashed ${
                isDark
                  ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              } rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group`}
            >
              <Upload
                className={`w-6 h-6 ${
                  isDark ? "text-gray-400" : "text-gray-400"
                } mb-1 group-hover:scale-110 transition-transform`}
              />
              <p
                className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                Click to upload
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, slot)}
            className="hidden"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Branding &amp; Colors
        </h3>
      </div>

      {/* Title & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            App Title
          </label>
          <input
            type="text"
            value={customConfig.title}
            onChange={(e) =>
              setCustomConfig({ ...customConfig, title: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="My Spin Wheel"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Description
          </label>
          <input
            type="text"
            value={customConfig.description}
            onChange={(e) =>
              setCustomConfig({ ...customConfig, description: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Win amazing prizes!"
          />
        </div>
      </div>

      {/* Logos */}
      <div className="space-y-4">
        <h4
          className={`text-md font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Logos
        </h4>
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Left Logo appears to the left of the title; Right Logo appears to the right. If only Left Logo is set, it mirrors on both sides.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoSlot slot="logo" label="Left Logo" inputRef={logoInputRef} />
          <LogoSlot slot="logo2" label="Right Logo" inputRef={logo2InputRef} />
        </div>
      </div>

      {/* Company info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Company Name
          </label>
          <input
            type="text"
            value={customConfig.companyName}
            onChange={(e) =>
              setCustomConfig({ ...customConfig, companyName: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Your Company"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Website URL
          </label>
          <input
            type="url"
            value={customConfig.website}
            onChange={(e) =>
              setCustomConfig({ ...customConfig, website: e.target.value })
            }
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Primary & Secondary colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Primary Color
          </label>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={customConfig.primaryColor}
                onChange={(e) => setLightColor("primaryColor", e.target.value)}
                className="w-14 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={customConfig.primaryColor}
              onChange={(e) => setLightColor("primaryColor", e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-sm ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        <div>
          <label
            className={`block text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Secondary Color
          </label>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="color"
                value={customConfig.secondaryColor}
                onChange={(e) => setLightColor("secondaryColor", e.target.value)}
                className="w-14 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
            </div>
            <input
              type="text"
              value={customConfig.secondaryColor}
              onChange={(e) => setLightColor("secondaryColor", e.target.value)}
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-sm ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dark Mode Colors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h4
              className={`text-md font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Dark Mode Colors
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              These colors apply when dark mode is active.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !followLight;
                setFollowLight(next);
                if (next) syncNow();
              }}
              title={followLight ? "Unlink from light mode" : "Link to light mode"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                followLight
                  ? isDark
                    ? "bg-blue-600/30 text-blue-300 border border-blue-600/50 hover:bg-blue-600/40"
                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : isDark
                  ? "bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {followLight ? <Link className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
              {followLight ? "Following light mode" : "Custom"}
            </button>
            {!followLight && (
              <button
                onClick={syncNow}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                Sync now
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(
            [
              { label: "Primary Color", key: "darkPrimaryColor" },
              { label: "Secondary Color", key: "darkSecondaryColor" },
              { label: "Background Color", key: "darkBackgroundColor" },
            ] as { label: string; key: "darkPrimaryColor" | "darkSecondaryColor" | "darkBackgroundColor" }[]
          ).map(({ label, key }) => {
            const isLinked = followLight && key !== "darkBackgroundColor";
            return (
              <div key={key} className={isLinked ? "opacity-50 pointer-events-none" : ""}>
                <label
                  className={`block text-sm font-semibold ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-3`}
                >
                  {label}
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="color"
                    value={customConfig[key]}
                    onChange={(e) => {
                      setFollowLight(false);
                      setCustomConfig({ ...customConfig, [key]: e.target.value });
                    }}
                    className="w-full h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customConfig[key]}
                    onChange={(e) => {
                      setFollowLight(false);
                      setCustomConfig({ ...customConfig, [key]: e.target.value });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-sm ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wheel color presets */}
      <div>
        <label
          className={`block text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-3`}
        >
          Wheel Color Preset
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() =>
                setCustomConfig({ ...customConfig, colorPreset: preset.id })
              }
              className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                customConfig.colorPreset === preset.id
                  ? "border-blue-500 shadow-lg shadow-blue-500/30"
                  : isDark
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex gap-1 mb-2 justify-center">
                {preset.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p
                className={`text-xs font-medium text-center ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
