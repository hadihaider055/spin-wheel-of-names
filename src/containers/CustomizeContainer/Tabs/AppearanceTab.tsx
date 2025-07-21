import { Palette, Upload, X } from "lucide-react";
import { useRef } from "react";
import { CustomConfig } from "../index";

interface AppearanceTabProps {
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomConfig({ ...customConfig, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setCustomConfig({ ...customConfig, logo: null });
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Branding & Colors
        </h3>
      </div>

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

      {/* Logo Upload Section */}
      <div className="space-y-4">
        <h4 className={`text-md font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Logo & Branding
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} mb-3`}>
              Company/Brand Logo
            </label>
            <div className="space-y-3">
              {customConfig.logo ? (
                <div className="relative group">
                  <div
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
                    onClick={handleLogoClick}
                  >
                    <img
                      src={customConfig.logo}
                      alt="Logo"
                      className="max-h-20 mx-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogoRemove}
                    className={`absolute -top-2 -right-2 p-1 rounded-full ${
                      isDark ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                    } text-white shadow-lg transition-all duration-200 hover:scale-110`}
                    title="Remove logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={handleLogoClick}
                  className={`w-full h-24 border-2 border-dashed ${
                    isDark ? "border-gray-600 bg-gray-700 hover:bg-gray-600" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  } rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group`}
                >
                  <Upload className={`w-6 h-6 ${isDark ? "text-gray-400" : "text-gray-400"} mb-1 group-hover:scale-110 transition-transform`} />
                  <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}>Click to upload logo</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} mb-3`}>
                Company Name
              </label>
              <input
                type="text"
                value={customConfig.companyName}
                onChange={(e) => setCustomConfig({ ...customConfig, companyName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="Your Company"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} mb-3`}>
                Website URL
              </label>
              <input
                type="url"
                value={customConfig.website}
                onChange={(e) => setCustomConfig({ ...customConfig, website: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>
      </div>

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
                onChange={(e) =>
                  setCustomConfig({
                    ...customConfig,
                    primaryColor: e.target.value,
                  })
                }
                className="w-14 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-offset-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <input
              type="text"
              value={customConfig.primaryColor}
              onChange={(e) =>
                setCustomConfig({
                  ...customConfig,
                  primaryColor: e.target.value,
                })
              }
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
                onChange={(e) =>
                  setCustomConfig({
                    ...customConfig,
                    secondaryColor: e.target.value,
                  })
                }
                className="w-14 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-offset-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <input
              type="text"
              value={customConfig.secondaryColor}
              onChange={(e) =>
                setCustomConfig({
                  ...customConfig,
                  secondaryColor: e.target.value,
                })
              }
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-mono text-sm ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;
