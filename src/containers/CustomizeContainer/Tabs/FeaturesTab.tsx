import { Code } from "lucide-react";
import { CustomConfig } from "../index";

interface FeaturesTabProps {
  isDark: boolean;
  customConfig: CustomConfig;
  setCustomConfig: (config: CustomConfig) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  isDark,
  customConfig,
  setCustomConfig,
}) => {
  const getFeatureDescription = (feature: string) => {
    const descriptions: { [key: string]: string } = {
      darkModeToggle: "Allow users to switch between light and dark themes",
      exportResults: "Enable exporting participant and winner data",
      historyTracking: "Keep track of previous winners",
      deleteParticipants: "Allow individual participant deletion",
      deleteWinners: "Allow individual winner deletion",
      clearAllParticipants: "Show clear all participants button",
      clearAllWinners: "Show clear all winners button",
      categoryManagement: "Enable category-level management",
      bumperPrize: "Special rewards after milestones",
      categoryFiltering: "Filter participants by category",
      weightedSpins: "Enable probability-based spinning",
      multipleWinners: "Select multiple winners at once",
    };
    return descriptions[feature] || "Configure this feature";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-blue-600" />
        <h3
          className={`text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Feature Control
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(customConfig.features).map(([feature, enabled]) => (
          <div
            key={feature}
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
                {feature
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <p
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {getFeatureDescription(feature)}
              </p>
            </div>
            <button
              onClick={() =>
                setCustomConfig({
                  ...customConfig,
                  features: { ...customConfig.features, [feature]: !enabled },
                })
              }
              className={`relative w-14 h-7 rounded-full transition-colors ml-4 ${
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
        ))}
      </div>
    </div>
  );
};

export default FeaturesTab;
