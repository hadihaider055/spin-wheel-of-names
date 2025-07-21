import { config } from "@/config/config";

const Navbar: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div className="relative overflow-hidden">
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900"
            : "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900"
        }`}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            {config.branding.logo && (
              <img
                src={config.branding.logo}
                alt={`${config.branding.companyName || config.title} Logo`}
                className="w-16 h-16 md:w-20 md:h-20 mr-3 md:mr-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide text-center">
              {config.title}
            </h1>
            {config.branding.logo && (
              <img
                src={config.branding.logo}
                alt={`${config.branding.companyName || config.title} Logo`}
                className="w-16 h-16 md:w-20 md:h-20 ml-3 md:ml-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 inline-block">
            <p className="text-xl md:text-2xl text-white font-semibold">
              {config.description}
            </p>
            {config.branding.companyName && (
              <p className="text-lg text-white/80 mt-2">
                {config.branding.companyName}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
