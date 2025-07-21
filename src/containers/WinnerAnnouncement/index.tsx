import { useEffect, useState } from "react";

// Icons
import { Trophy, Sparkles, Gift, Volume2, VolumeX } from "lucide-react";

// Utils
import { Participant } from "@/utils/types/common";
import { config } from "@/config/config";

const WinnerAnnouncement: React.FC<{
  winner: Participant;
  onClose: () => void;
  isDark: boolean;
  giftImage: string | null;
}> = ({ winner, onClose, isDark, giftImage }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(!config.winner.celebrationSound);

  useEffect(() => {
    if (config.audio.winnerSound && config.winner.celebrationSound) {
      const timer = setTimeout(() => {
        if (typeof config.audio.winnerSound === "string") {
          const winnerAudio = new Audio(config.audio.winnerSound);
          winnerAudio.volume = config.audio.volume;
          winnerAudio.loop = true;
          setAudio(winnerAudio);
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (audio && config.winner.celebrationSound) {
      if (isMuted) {
        audio.pause();
      } else {
        audio.play().catch(() => {
          // Audio playback failed (likely due to autoplay policy)
        });
      }
    }
  }, [audio, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      onClose();
    }, config.winner.displayDuration);

    return () => {
      clearTimeout(timer);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [onClose, audio]);

  const handleManualClose = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 ${
        isDark ? "bg-black/20" : "bg-black/60"
      } animate-overlayShow z-[70] backdrop-blur-sm flex items-center justify-center z-50 p-4`}
    >
      <div
        className={`bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 p-1 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto`}
      >
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 md:p-10 rounded-3xl text-center relative`}
        >
          {config.audio.winnerSound && (
            <button
              onClick={toggleMute}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
              aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}

          <div className="mb-8 w-full">
            <div className="relative inline-block">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-spin" />
            </div>

            <h2
              className={`text-4xl font-bold mt-5 ${
                isDark ? "text-white" : "text-gray-800"
              } mb-4`}
            >
              🎉 WINNER! 🎉
            </h2>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl mb-4">
              <p className="text-3xl font-bold mb-2">{winner.name}</p>
              {winner.grade && winner.grade.trim() !== "" && (
                <p className="text-xl opacity-90">Class: {winner.grade}</p>
              )}
            </div>

            {giftImage && (
              <div className="mt-6 mb-6 w-full">
                <img
                  src={giftImage}
                  alt="Winner's Prize"
                  className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-yellow-400 mx-auto"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleManualClose}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Continue Balloting
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerAnnouncement;
