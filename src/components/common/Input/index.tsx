import React from "react";

// Icons
import { Users } from "lucide-react";

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
        <label
          className={`block text-sm font-semibold ${
            isDark ? "text-gray-300" : "text-gray-700"
          } mb-2`}
        >
          Paste your participant list:
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          //           placeholder={`Shahmeer (5th)
          // Izan Ali (6th)
          // Mohammad Raza (7th)
          // Faiq Ali (8th)

          // Or with categories:

          // 1st Positions:
          // Shahmeer (5th)
          // Izan Ali (6th)

          // 2nd Positions:
          // Mohammad Asad (5th)
          // Saqlain Murtaza (6th)`}
          placeholder="Enter participants names..."
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
