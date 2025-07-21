import { useEffect, useState } from "react";

// Lucide icons
import { Trophy, Gift, Star, Target, Volume2, VolumeX } from "lucide-react";

// Utils
import { useConfig } from "@/contexts/ConfigContext";

interface BumperPrize {
  name: string;
  description: string;
  icon: string;
}

interface BumperPrizeModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPrize: (prize: BumperPrize) => void;
  isDark: boolean;
}

const BumperPrizeModal: React.FC<BumperPrizeModalProps> = ({
  isVisible,
  onClose,
  onSelectPrize,
  isDark,
}) => {
  const { appConfig } = useConfig();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isVisible && appConfig.bumperPrize.specialSound) {
      const timer = setTimeout(() => {
        const bumperAudio = new Audio(appConfig.bumperPrize.specialSound);
        bumperAudio.volume = appConfig.audio.volume;
        bumperAudio.loop = false;
        setAudio(bumperAudio);
      }, 200);

      return () => {
        clearTimeout(timer);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, [isVisible]);

  useEffect(() => {
    if (audio && !isMuted) {
      audio.play().catch(() => {});
    }
  }, [audio, isMuted]);

  const toggleMute = () => {
    if (audio) {
      if (isMuted) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
    setIsMuted(!isMuted);
  };

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case "🏆":
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case "🎯":
        return <Target className="w-8 h-8 text-red-500" />;
      case "⭐":
        return <Star className="w-8 h-8 text-purple-500" />;
      default:
        return <Gift className="w-8 h-8 text-blue-500" />;
    }
  };

  if (
    !isVisible ||
    !appConfig.features.bumperPrize ||
    !appConfig.bumperPrize.enabled
  ) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 ${
        isDark ? "bg-black/30" : "bg-black/70"
      } z-80 backdrop-blur-sm flex items-center justify-center p-4`}
    >
      <div
        className={`bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto ${
          appConfig.bumperPrize.showAnimation ? "animate-pulse" : ""
        }`}
      >
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 md:p-8 rounded-3xl text-center relative`}
        >
          {appConfig.bumperPrize.specialSound && (
            <button
              onClick={toggleMute}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}

          <div className="mb-6">
            <div className="relative inline-block">
              <Gift className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>

            <h2
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-2`}
            >
              🎉 BUMPER PRIZE! 🎉
            </h2>
            <p
              className={`text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Choose your special reward!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {appConfig.bumperPrize.prizes.map((prize, index) => (
              <button
                key={index}
                onClick={() => onSelectPrize(prize)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 hover:border-purple-400 text-white"
                    : "bg-gray-50 border-gray-200 hover:border-purple-400 text-gray-800"
                }`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {getIconComponent(prize.icon)}
                  <h3 className="font-bold text-lg">{prize.name}</h3>
                  <p className="text-sm opacity-80">{prize.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-gray-800"
            }`}
          >
            Skip Bumper Prize
          </button>
        </div>
      </div>
    </div>
  );
};

export default BumperPrizeModal;
