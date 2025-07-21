interface InstructionsPanelProps {
  isDark: boolean;
}

const InstructionsPanel: React.FC<InstructionsPanelProps> = ({ isDark }) => {
  return (
    <div className={`mt-8 ${isDark ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg p-6`}>
      <h3 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-4`}>
        📋 How to Use Your Custom Configuration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Save & Download</h4>
          </div>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Make your changes, click "Save Changes", then "Download Config" to get your custom app.config.js file
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Replace File</h4>
          </div>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Replace the config/app.config.js file in your project with the downloaded file
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <h4 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Build & Deploy</h4>
          </div>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Run `npm run build` and deploy your customized wheel to your preferred platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel;