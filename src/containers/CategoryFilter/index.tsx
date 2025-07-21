import { useState } from "react";

// Lucide icons
import { Filter, X, Check } from "lucide-react";

// Utils
import { Participant } from "@/utils/types/common";
import { config } from "@/config/config";

interface CategoryFilterProps {
  participants: Participant[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  isDark: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  participants,
  selectedCategories,
  onCategoriesChange,
  isDark,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!config.features.categoryFiltering || !config.categoryFiltering.enabled) {
    return null;
  }

  const availableCategories = Array.from(
    new Set(participants.map((p) => p.category))
  );

  if (availableCategories.length <= 1) {
    return null;
  }

  const toggleCategory = (category: string) => {
    if (config.categoryFiltering.allowMultipleCategories) {
      if (selectedCategories.includes(category)) {
        onCategoriesChange(selectedCategories.filter((c) => c !== category));
      } else {
        onCategoriesChange([...selectedCategories, category]);
      }
    } else {
      onCategoriesChange(
        selectedCategories.includes(category) ? [] : [category]
      );
    }
  };

  const clearAll = () => {
    onCategoriesChange([]);
  };

  const selectAll = () => {
    onCategoriesChange(availableCategories);
  };

  const getParticipantCount = (category: string) => {
    return participants.filter((p) => p.category === category).length;
  };

  const filteredParticipants =
    selectedCategories.length > 0
      ? participants.filter((p) => selectedCategories.includes(p.category))
      : participants;

  return (
    <div
      className={`${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } rounded-xl border p-4 mb-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-500" />
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Filter by Category
          </h3>
          {selectedCategories.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {filteredParticipants.length} selected
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <Filter
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={selectAll}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                isDark
                  ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const count = getParticipantCount(category);

              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? isDark
                        ? "bg-blue-900 border-blue-600 text-blue-300"
                        : "bg-blue-50 border-blue-400 text-blue-800"
                      : isDark
                      ? "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-500 border-blue-500"
                          : isDark
                          ? "border-gray-500"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="font-medium">{category}</span>
                  </div>

                  {config.categoryFiltering.showCategoryStats && (
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedCategories.length > 0 && (
            <div
              className={`p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <strong>{filteredParticipants.length}</strong> participants will
                be included in the spin
                {selectedCategories.length > 1 && (
                  <span>
                    {" "}
                    from <strong>{selectedCategories.length}</strong> categories
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
