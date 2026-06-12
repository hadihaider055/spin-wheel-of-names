// Next
import Link from "next/link";

// Lucid icons
import { Settings } from "lucide-react";

// Contexts
import { useConfig } from "@/contexts/ConfigContext";

const Navbar: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const { appConfig } = useConfig();
  const { logo, logo2, companyName } = appConfig.branding;

  const primary = isDark ? appConfig.theme.darkMode.primaryColor : appConfig.theme.primaryColor;
  const secondary = isDark ? appConfig.theme.darkMode.secondaryColor : appConfig.theme.secondaryColor;
  const bg = isDark ? appConfig.theme.darkMode.backgroundColor : appConfig.theme.backgroundColor;

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${bg} 0%, ${primary} 50%, ${secondary} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Customize Button */}
        <div className="absolute top-6 right-6">
          <Link
            href="/customize"
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all duration-300 hover:scale-105 border border-white/20"
            title="Customize your wheel"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Customize</span>
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            {/* Left logo */}
            {logo && (
              <img
                src={logo}
                alt={`${companyName || appConfig.title} — left logo`}
                className="w-16 h-16 md:w-20 md:h-20 mr-3 md:mr-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide text-center">
              {appConfig.title}
            </h1>

            {/* Right logo — falls back to logo if logo2 is not set but logo is */}
            {(logo2 || logo) && (
              <img
                src={logo2 || logo!}
                alt={`${companyName || appConfig.title} — right logo`}
                className="w-16 h-16 md:w-20 md:h-20 ml-3 md:ml-4 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          {(appConfig.description || companyName) && (
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 inline-block">
              {appConfig.description && (
                <p className="text-xl md:text-2xl text-white font-semibold">
                  {appConfig.description}
                </p>
              )}
              {companyName && (
                <p className="text-lg text-white/80 mt-2">{companyName}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
