import React, { useState } from "react";

// Icons
import { Users, Info } from "lucide-react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
  participantCount: number;
}

const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
  participantCount: number;
  isDark: boolean;
}> = ({ value, onChange, onParse, participantCount, isDark }) => {
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  return (
    <div
      className={`${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl shadow-2xl p-8 border`}
    >
      <div className="flex items-center mb-6">
        <Users
          className={`w-8 h-8 ${
            isDark ? "text-purple-400" : "text-indigo-600"
          } mr-3`}
        />
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Add Participants
        </h2>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label
            className={`text-sm font-semibold ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Paste your participant list:
          </label>
          <div
            className="relative group"
            onMouseEnter={() => setShowFormatHelp(true)}
            onMouseLeave={() => setShowFormatHelp(false)}
          >
            <button
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                isDark
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Info className="w-3 h-3" />
              Format Help
            </button>

            {showFormatHelp && (
              <div
                className={`absolute z-50 right-0 top-8 w-80 p-4 rounded-xl border shadow-xl ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-300"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <h3
                  className={`font-semibold text-sm mb-3 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  Supported Formats:
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <div
                      className={`font-semibold mb-1 ${
                        isDark ? "text-purple-400" : "text-blue-700"
                      }`}
                    >
                      1. Simple format (one name per line):
                    </div>
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } pl-2`}
                    >
                      Shahmeer
                      <br />
                      Izan Ali
                      <br />
                      Mohammad Raza
                      <br />
                      Faiq Ali
                    </div>
                  </div>

                  <div>
                    <div
                      className={`font-semibold mb-1 ${
                        isDark ? "text-purple-400" : "text-blue-700"
                      }`}
                    >
                      2. With additional info:
                    </div>
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } pl-2`}
                    >
                      Shahmeer (5th Grade)
                      <br />
                      Izan Ali (6th Grade)
                      <br />
                      Mohammad Raza (7th Grade)
                    </div>
                  </div>

                  <div>
                    <div
                      className={`font-semibold mb-1 ${
                        isDark ? "text-purple-400" : "text-blue-700"
                      }`}
                    >
                      3. With categories:
                    </div>
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      } pl-2`}
                    >
                      1st Prize Winners:
                      <br />
                      Shahmeer (5th Grade)
                      <br />
                      Izan Ali (6th Grade)
                      <br />
                      <br />
                      2nd Prize Winners:
                      <br />
                      Mohammad Asad (5th Grade)
                      <br />
                      Saqlain Murtaza (6th Grade)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter participant names, one per line..."
          className={`w-full h-64 p-4 border-2 ${
            isDark
              ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-200"
              : "border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-200"
          } rounded-xl focus:ring-2 transition-all duration-300 font-mono text-sm resize-none`}
        />
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          <span className="font-semibold">{participantCount}</span> participants
          ready
        </div>
        <button
          onClick={onParse}
          disabled={!value.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Load Participants
        </button>
      </div>
    </div>
  );
};

export default Input;
