import { useEffect, useState } from "react";

// Icons
import { Trophy, Sparkles, Gift } from "lucide-react";

// Utils
import { Participant } from "@/utils/types/common";

const WinnerAnnouncement: React.FC<{
  winner: Participant;
  onClose: () => void;
  isDark: boolean;
  giftImage: string | null;
}> = ({ winner, onClose, isDark, giftImage }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, [winner]);

  return (
    <div className="fixed inset-0 bg-black/20 animate-overlayShow z-[70] backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 p-1 rounded-3xl shadow-2xl`}
      >
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } p-10 rounded-3xl text-center mx-auto`}
        >
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
              <p className="text-xl opacity-90">Class: {winner.grade}</p>
            </div>

            {giftImage && (
              <div className="mt-6 mb-6 w-full">
                {/* <div className="flex items-center justify-center mb-3">
                  <Gift className="w-6 h-6 text-yellow-400 mr-2" />
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Wins This Amazing Prize!
                  </p>
                  <Gift className="w-6 h-6 text-yellow-400 ml-2" />
                </div> */}
                <img
                  src={giftImage}
                  alt="Winner's Prize"
                  className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-yellow-400 mx-auto"
                />
              </div>
            )}
          </div>

          <button
            onClick={onClose}
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
