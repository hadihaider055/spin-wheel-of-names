import { useEffect, useState } from "react";

// Lucide icons
import { Trophy, Users, X } from "lucide-react";

// Utils
import { Participant } from "@/utils/types/common";
import { config } from "@/config/config";

interface MultipleWinnersModalProps {
  winners: Participant[];
  onClose: () => void;
  isDark: boolean;
  giftImage: string | null;
}

const MultipleWinnersModal: React.FC<MultipleWinnersModalProps> = ({
  winners,
  onClose,
  isDark,
  giftImage,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (config.audio.winnerSound && config.winner.celebrationSound) {
      const timer = setTimeout(() => {
        const winnerAudio = new Audio(config.audio.winnerSound!);
        winnerAudio.volume = config.audio.volume;
        winnerAudio.loop = true;
        setAudio(winnerAudio);
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
    if (audio) {
      audio.play().catch(() => {});
    }
  }, [audio]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      onClose();
    }, config.winner.displayDuration + 2000);

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

  if (
    !config.features.multipleWinners ||
    !config.multipleWinners.enabled ||
    winners.length === 0
  ) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 ${
        isDark ? "bg-black/20" : "bg-black/60"
      } z-70 backdrop-blur-sm flex items-center justify-center p-4`}
    >
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 p-1 rounded-3xl shadow-2xl max-w-4xl w-full mx-auto">
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-6 md:p-8 rounded-3xl text-center relative`}
        >
          <button
            onClick={handleManualClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-600"
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="relative inline-block">
              <Users className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <Trophy className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
            </div>

            <h2
              className={`text-4xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-4`}
            >
              🎉 MULTIPLE WINNERS! 🎉
            </h2>

            <p
              className={`text-xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } mb-6`}
            >
              Congratulations to all {winners.length} winners!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {winners.map((winner, index) => (
              <div
                key={`${winner.id}-${index}`}
                className={`bg-gradient-to-r ${
                  index === 0
                    ? "from-yellow-500 to-orange-500"
                    : index === 1
                    ? "from-gray-400 to-gray-500"
                    : index === 2
                    ? "from-yellow-600 to-yellow-700"
                    : "from-blue-500 to-purple-600"
                } text-white p-4 rounded-xl shadow-lg`}
              >
                <div className="flex items-center justify-center mb-2">
                  {index === 0 && <Trophy className="w-8 h-8 mr-2" />}
                  <span className="text-2xl font-bold">#{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{winner.name}</h3>
                {winner.grade && winner.grade.trim() !== "" && (
                  <p className="text-sm opacity-90">Class: {winner.grade}</p>
                )}
                <p className="text-xs opacity-75">{winner.category}</p>
              </div>
            ))}
          </div>

          {giftImage && (
            <div className="mb-6">
              <img
                src={giftImage}
                alt="Prize"
                className="w-full max-w-md h-32 object-cover rounded-xl shadow-lg border-2 border-yellow-400 mx-auto"
              />
            </div>
          )}

          <button
            onClick={handleManualClose}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue Balloting
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultipleWinnersModal;
