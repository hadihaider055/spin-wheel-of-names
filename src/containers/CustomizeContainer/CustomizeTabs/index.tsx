import { Palette, Settings, Code } from "lucide-react";
import { CustomConfig } from "../index";
import AppearanceTab from "../Tabs/AppearanceTab";
import BehaviorTab from "../Tabs/BehaviorTab";
import FeaturesTab from "../Tabs/FeaturesTab";

interface CustomizeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const CustomizeTabs: React.FC<CustomizeTabsProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  const tabs = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "behavior", label: "Behavior", icon: Settings },
    { id: "features", label: "Features", icon: Code },
  ];

  return (
    <>
      {/* Tab Navigation */}
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-gradient-to-r from-purple-50 to-indigo-50"
        } rounded-xl shadow-lg p-2`}
      >
        <div
          className={`flex space-x-1 ${
            isDark ? "bg-gray-700" : "bg-white/50"
          } rounded-lg p-1`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? isDark
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : isDark
                  ? "text-gray-300 hover:text-white hover:bg-gray-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div
        className={`${
          isDark ? "bg-gray-800" : "bg-gradient-to-br from-white to-purple-50/30"
        } rounded-xl shadow-lg p-6`}
      >
        {activeTab === "appearance" && (
          <AppearanceTab
            isDark={isDark}
            customConfig={customConfig}
            setCustomConfig={setCustomConfig}
          />
        )}

        {activeTab === "behavior" && (
          <BehaviorTab
            isDark={isDark}
            customConfig={customConfig}
            setCustomConfig={setCustomConfig}
          />
        )}

        {activeTab === "features" && (
          <FeaturesTab
            isDark={isDark}
            customConfig={customConfig}
            setCustomConfig={setCustomConfig}
          />
        )}
      </div>
    </>
  );
};

export default CustomizeTabs;
