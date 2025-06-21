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
            <img
              src="/rtsc-logo-2.png"
              alt="RTSC Logo"
              className="w-20 h-20 mr-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
              Knowledge Forum
            </h1>
            <img
              src="/kf-logo-2.png"
              alt="RTSC Logo"
              className="w-20 h-20 mr-4"
            />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 inline-block">
            <p className="text-xl md:text-2xl text-white font-semibold">
              Round Table Summer Camp 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
