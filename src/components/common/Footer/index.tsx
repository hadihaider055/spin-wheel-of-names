// Lucid icons
import { Heart, Linkedin, Github, Mail, ExternalLink } from "lucide-react";

interface FooterProps {
  isDark: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDark }) => {
  return (
    <footer
      className={`relative mt-20 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-indigo-900/20"
            : "bg-gradient-to-r from-gray-100/80 via-purple-50/60 to-blue-50/60"
        }`}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Made with Love */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Made with
              </span>
              <Heart
                className="w-5 h-5 text-red-500 animate-pulse"
                fill="currentColor"
              />
              <span
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                by
              </span>
            </div>
            <h3
              className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}
            >
              Hadi Haider
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mt-1`}
            >
              Software Engineer & Open Source Enthusiast
            </p>
          </div>

          {/* App Info */}
          <div className="text-center">
            <div
              className={`inline-block px-4 py-2 rounded-full ${
                isDark ? "bg-gray-800/50" : "bg-white/70"
              } backdrop-blur-sm border ${
                isDark ? "border-gray-700" : "border-gray-300"
              } mb-3 shadow-sm`}
            >
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                🎯 2025 Spin Wheel of Names
              </span>
            </div>
            <p
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Open source • Customizable • Built with Next.js
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-4`}
            >
              Let's connect and build something amazing together
            </p>
            <div className="flex items-center justify-center md:justify-end gap-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com/in/hadi-haider"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300"
                    : "bg-white/80 hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-gray-200/50"
                } hover:scale-105 shadow-sm hover:shadow-md`}
                title="Connect on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-sm font-medium">LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/hadihaider055"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 hover:text-gray-300"
                    : "bg-white/80 hover:bg-gray-50 text-gray-700 hover:text-gray-800 border border-gray-200/50"
                } hover:scale-105 shadow-sm hover:shadow-md`}
                title="View GitHub Profile"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Email */}
              <a
                href="mailto:haiderhadi055@gmail.com"
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isDark
                    ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300"
                    : "bg-white/80 hover:bg-green-50 text-green-600 hover:text-green-700 border border-gray-200/50"
                } hover:scale-105 shadow-sm hover:shadow-md`}
                title="Send me an email"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-8 pt-6 border-t ${
            isDark ? "border-gray-800" : "border-gray-100"
          } text-center`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className={`text-xs ${
                isDark ? "text-gray-500" : "text-gray-600"
              }`}
            >
              © 2025 Spin Wheel of Names. Open source project available on
              GitHub.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hadihaider055/spin-wheel-of-names"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors hover:underline flex items-center gap-1`}
              >
                <Github className="w-3 h-3" />⭐ Star on GitHub
              </a>
              <span
                className={`w-1 h-1 rounded-full ${
                  isDark ? "bg-gray-600" : "bg-gray-300"
                }`}
              ></span>
              <span
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Built with Next.js & React
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
