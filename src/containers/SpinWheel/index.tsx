"use client";

import { useEffect, useRef } from "react";

// Icons
import { Trophy, Users, Play, RotateCcw } from "lucide-react";

// Utils
import { generateGradientColors } from "@/utils/functions/generateGradientColors";
import { Participant } from "@/utils/types/common";
import { config, getWheelColors } from "@/config/config";

const SpinWheel: React.FC<{
  participants: Participant[];
  onSpin: () => void;
  isSpinning: boolean;
  isWheelStopped: boolean;
  rotation: number;
  hoveredSegment: number | null;
  onReset: () => void;
  isDark: boolean;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  winner: Participant | null;
  handleFullReset: () => void;
}> = ({
  participants,
  onSpin,
  isSpinning,
  isWheelStopped,
  rotation,
  hoveredSegment,
  onReset,
  isDark,
  handleFullReset,
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);

  if (participants.length === 0) {
    return (
      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } rounded-2xl shadow-2xl p-12 text-center border mb-12`}
      >
        <div className={`${isDark ? "text-gray-500" : "text-gray-400"} mb-4`}>
          <Users className="w-24 h-24 mx-auto" />
        </div>
        <h3
          className={`text-xl font-semibold ${
            isDark ? "text-gray-300" : "text-gray-600"
          } mb-2`}
        >
          No Participants Yet
        </h3>
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Add participants below to start the balloting
        </p>
      </div>
    );
  }

  const colors = getWheelColors('default');
  const segmentAngle = 360 / participants.length;
  const radius = config.wheel.wheelSize / 2 - 50;
  const centerX = config.wheel.wheelSize / 2;
  const centerY = config.wheel.wheelSize / 2;

  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div
      className={`${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } rounded-2xl shadow-2xl p-8 border mb-12`}
    >
      <div className="text-center mb-8">
        <h2
          className={`text-3xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          } mb-2`}
        >
          Spin the Wheel
        </h2>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          May the best participant win!
        </p>
        {isWheelStopped && (
          <div
            className={`mt-4 p-3 ${
              isDark
                ? "bg-yellow-900/50 border-yellow-700"
                : "bg-yellow-100 border-yellow-300"
            } border rounded-lg`}
          >
            <p
              className={`${
                isDark ? "text-yellow-300" : "text-yellow-800"
              } font-semibold flex items-center justify-center gap-2`}
            >
              <Trophy className="w-5 h-5" />
              Announcing winner in a moment...
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mb-8">
          <div
            className="absolute z-20"
            style={{
              top: "35px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className={`relative transition-all duration-300 ${
                hoveredSegment !== null ? "animate-pulse scale-125" : ""
              }`}
            >
              <div className="relative -mt-4">
                <div
                  className="absolute z-20"
                  style={{
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className={`relative transition-all duration-300 ${
                      hoveredSegment !== null ? "animate-pulse scale-125" : ""
                    }`}
                  >
                    <div className="relative transform rotate-180">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        className="drop-shadow-lg"
                        style={{
                          transform: "translateY(-50%)",
                        }}
                      >
                        <path
                          d="M12 0L24 24H0L12 0Z"
                          fill="#EF4444"
                          stroke="#fff"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {hoveredSegment !== null && (
                <>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-400 rounded-full animate-pulse"></div>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <svg
              ref={wheelRef}
              width={config.wheel.wheelSize}
              height={config.wheel.wheelSize}
              className={`drop-shadow-2xl ${
                isSpinning ? "wheel-transition" : "wheel-reset"
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? `transform ${config.wheel.spinDuration}ms ${config.wheel.easing}` : 'transform 0.3s ease',
              }}
            >
              <circle
                cx={centerX}
                cy={centerY}
                r={radius + 15}
                fill={`linear-gradient(135deg, ${config.theme.primaryColor}, ${config.theme.secondaryColor})`}
                stroke="#fff"
                strokeWidth={config.wheel.borderWidth}
              />

              <defs>
                <linearGradient
                  id="outerGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={config.theme.primaryColor} />
                  <stop offset="100%" stopColor={config.theme.secondaryColor} />
                </linearGradient>
                {participants.map((_, index) => (
                  <linearGradient
                    key={index}
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={colors[index % colors.length]}
                    />
                    <stop
                      offset="100%"
                      stopColor={colors[(index + 1) % colors.length]}
                    />
                  </linearGradient>
                ))}
                <linearGradient
                  id="winnerGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffd700" />
                  <stop offset="50%" stopColor="#ffed4e" />
                  <stop offset="100%" stopColor="#ffd700" />
                </linearGradient>
                <radialGradient id="centerGradient">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#1e1b4b" />
                </radialGradient>
              </defs>

              {participants.map((participant, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = (index + 1) * segmentAngle - 90;
                const midAngle = (startAngle + endAngle) / 2;
                const textRadius = radius * 0.65;
                const gradeRadius = radius * 0.85;
                const textX =
                  centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
                const textY =
                  centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);
                const gradeX =
                  centerX + gradeRadius * Math.cos((midAngle * Math.PI) / 180);
                const gradeY =
                  centerY + gradeRadius * Math.sin((midAngle * Math.PI) / 180);

                const isWinningSegment = hoveredSegment === index;

                return (
                  <g key={participant.id}>
                    <path
                      d={createSegmentPath(startAngle, endAngle)}
                      fill={
                        isWinningSegment
                          ? "url(#winnerGradient)"
                          : `url(#gradient-${index})`
                      }
                      stroke="#fff"
                      strokeWidth={isWinningSegment ? "6" : "3"}
                      className={isWinningSegment ? "animate-pulse" : ""}
                    />
                    <text
                      x={textX}
                      y={textY - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isWinningSegment ? "#000" : "#fff"}
                      fontSize={isWinningSegment ? "16" : config.wheel.textSize}
                      fontWeight="bold"
                      transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                      className={`${
                        isWinningSegment ? "animate-pulse" : ""
                      } text-lg`}
                    >
                      {participant.name}
                    </text>
                    {participant.grade && participant.grade.trim() !== "" && (
                      <text
                        x={gradeX}
                        y={gradeY + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isWinningSegment ? "#000" : "#fff"}
                        fontSize={isWinningSegment ? "13" : "11"}
                        fontWeight="600"
                        transform={`rotate(${midAngle}, ${gradeX}, ${gradeY})`}
                        className={isWinningSegment ? "animate-pulse" : ""}
                      >
                        ({participant.grade})
                      </text>
                    )}
                  </g>
                );
              })}

              <circle
                cx={centerX}
                cy={centerY}
                r="35"
                fill="url(#centerGradient)"
                stroke="#fff"
                strokeWidth="5"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onSpin}
            disabled={isSpinning || isWheelStopped || participants.length === 0}
            className={`flex items-center gap-3 px-12 py-5 rounded-2xl cursor-pointer text-white font-bold text-lg transition-all duration-300 shadow-xl ${
              isSpinning || isWheelStopped || participants.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transform hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {isSpinning ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Spinning...
              </>
            ) : isWheelStopped ? (
              <>
                <Trophy className="w-6 h-6 animate-bounce" />
                Announcing...
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                SPIN THE WHEEL
              </>
            )}
          </button>

          <button
            onClick={onReset}
            disabled={isSpinning}
            className={`flex items-center gap-2 px-8 py-5 rounded-2xl ${
              isDark
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-gray-500 hover:bg-gray-600"
            } text-white cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <button
            onClick={handleFullReset}
            className={`flex items-center gap-2 px-8 py-5 rounded-2xl ${
              isDark
                ? "bg-red-900 hover:bg-red-800"
                : "bg-red-600 hover:bg-red-700"
            } text-white cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105`}
          >
            <RotateCcw className="w-5 h-5" />
            Full Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
