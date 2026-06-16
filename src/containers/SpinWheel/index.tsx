"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

// Icons
import { Trophy, Users, Play, RotateCcw, Settings } from "lucide-react";
import Link from "next/link";

// Utils
import { Participant } from "@/utils/types/common";
import { getWheelColors } from "@/config/config";
import { useConfig } from "@/contexts/ConfigContext";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { appConfig } = useConfig();
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const truncateName = (name: string, maxChars: number): string => {
    if (name.length <= maxChars) return name;
    if (maxChars <= 3) return name.slice(0, maxChars);
    return name.slice(0, maxChars - 1) + "…";
  };

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

  const colors = getWheelColors(appConfig.wheel.colorPreset || "default");
  const segmentAngle = 360 / participants.length;
  const radius = appConfig.wheel.wheelSize / 2 - 25;
  const centerX = appConfig.wheel.wheelSize / 2;
  const centerY = appConfig.wheel.wheelSize / 2;

  const fontSize = parseInt(String(appConfig.wheel.textSize)) || 16;
  const hubR = 22; // center circle radius
  // Centre the text at the true midpoint between hub edge and outer edge so
  // both halves (inward + outward) are equal, maximising usable width.
  const textRadiusAbs = (hubR + radius) / 2;
  // Each half: (radius - hubR) / 2 minus 4 px padding
  const maxHalfWidth = (radius - hubR) / 2 - 4;
  // Geist Sans Bold: actual char width ≈ fontSize * 0.44
  const maxChars = Math.max(
    4,
    Math.floor((maxHalfWidth * 2) / (fontSize * 0.44)),
  );

  // Scale font down so its HEIGHT (arc direction) fits within each slice.
  const arcWidthAtText = textRadiusAbs * ((segmentAngle * Math.PI) / 180);
  const adaptiveFontSize = Math.min(
    fontSize,
    Math.max(8, Math.floor(arcWidthAtText * 0.85)),
  );

  // Pointer tip lands 10 px inside the segments (past the decorative outer ring)
  const pointerTipY = centerY - radius + 10;

  const isActive = isSpinning || isWheelStopped;

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
    <>
      {/* Full-screen blur spotlight when spinning — rendered into <body> to escape stacking contexts */}
      {typeof document !== "undefined" &&
        isActive &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[3px] pointer-events-none"
            style={{ zIndex: 9998 }}
          />,
          document.body,
        )}

      <div
        className={`${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        } rounded-2xl shadow-2xl p-8 border mb-12 transition-all duration-500`}
        style={{
          position: "relative",
          zIndex: isActive ? 9999 : "auto",
          transform: isActive
            ? "scale(1.025) translateY(-6px)"
            : "scale(1) translateY(0)",
          boxShadow: isActive ? "0 30px 90px rgba(0,0,0,0.45)" : undefined,
        }}
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
          <div
            className="relative mb-8"
            ref={containerRef}
            onMouseMove={(e) => {
              if (!isSpinning && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }
            }}
            onMouseLeave={() => setHoveredName(null)}
          >
            {/* Hover tooltip */}
            {hoveredName && !isSpinning && (
              <div
                className="absolute z-50 pointer-events-none px-2.5 py-1 text-sm font-medium text-white bg-gray-900/90 rounded-lg whitespace-nowrap shadow-lg border border-gray-700"
                style={{
                  left: mousePos.x + 14,
                  top: mousePos.y - 36,
                  transform:
                    mousePos.x > appConfig.wheel.wheelSize * 0.72
                      ? "translateX(-110%)"
                      : "none",
                }}
              >
                {hoveredName}
              </div>
            )}

            {/* Pointer arrow — tip 10 px inside the segments */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                top: `${pointerTipY}px`,
                left: "50%",
                transform: `translateX(-50%) translateY(-100%) ${
                  hoveredSegment !== null ? "scale(1.3)" : "scale(1)"
                }`,
                transformOrigin: "bottom center",
                transition: "transform 0.3s ease",
              }}
            >
              <svg
                width="28"
                height="24"
                viewBox="0 0 28 24"
                className="drop-shadow-lg"
              >
                {/* Tip at bottom-center (14,24), base at top — points down into wheel */}
                <polygon
                  points="14,24 0,0 28,0"
                  fill="#EF4444"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {hoveredSegment !== null && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[60%] w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75" />
              )}
            </div>

            {/* Wheel SVG */}
            <div className="relative">
              <svg
                ref={wheelRef}
                width={appConfig.wheel.wheelSize}
                height={appConfig.wheel.wheelSize}
                className={`drop-shadow-2xl ${
                  isSpinning ? "wheel-transition" : "wheel-reset"
                }`}
                style={{
                  cursor: "default",
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? `transform ${appConfig.wheel.spinDuration}ms ${appConfig.wheel.easing}`
                    : "transform 0.3s ease",
                }}
              >
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius + 15}
                  fill="url(#outerGradient)"
                  stroke="#fff"
                  strokeWidth={appConfig.wheel.borderWidth}
                />

                <defs>
                  <linearGradient
                    id="outerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor={appConfig.theme.primaryColor}
                    />
                    <stop
                      offset="100%"
                      stopColor={appConfig.theme.secondaryColor}
                    />
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
                    <stop
                      offset="0%"
                      stopColor={appConfig.theme.primaryColor}
                    />
                    <stop
                      offset="100%"
                      stopColor={appConfig.theme.secondaryColor}
                    />
                  </radialGradient>
                </defs>

                {participants.map((participant, index) => {
                  const startAngle = index * segmentAngle - 90;
                  const endAngle = (index + 1) * segmentAngle - 90;
                  const midAngle = (startAngle + endAngle) / 2;
                  const textRadius = radius * 0.65; // midpoint between hub and outer edge
                  const gradeRadius = radius * 0.85;
                  const textX =
                    centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
                  const textY =
                    centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);
                  const gradeX =
                    centerX +
                    gradeRadius * Math.cos((midAngle * Math.PI) / 180);
                  const gradeY =
                    centerY +
                    gradeRadius * Math.sin((midAngle * Math.PI) / 180);

                  const isWinningSegment = hoveredSegment === index;
                  const isHovered = !isSpinning && hoverIndex === index;
                  // Winning segment always shows the full name; others are truncated
                  const displayName = isWinningSegment
                    ? participant.name
                    : truncateName(participant.name, maxChars);
                  // Winning segment gets a larger font; otherwise use adaptive size
                  const segFontSize = isWinningSegment ? 16 : adaptiveFontSize;

                  return (
                    <g
                      key={participant.id}
                      style={{ cursor: isSpinning ? "default" : "pointer" }}
                      onMouseEnter={() => {
                        if (!isSpinning) {
                          setHoveredName(participant.name);
                          setHoverIndex(index);
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredName(null);
                        setHoverIndex(null);
                      }}
                    >
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
                        style={{
                          filter: isHovered
                            ? "brightness(1.35) drop-shadow(0 0 8px rgba(255,255,255,0.75))"
                            : "none",
                          transition: "filter 0.15s ease",
                        }}
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isWinningSegment ? "#1a1a1a" : "#fff"}
                        fontSize={segFontSize}
                        fontWeight="700"
                        letterSpacing="0.3"
                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                        style={{
                          userSelect: "none",
                          stroke: isWinningSegment
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.55)",
                          strokeWidth: "2.5px",
                          strokeLinejoin: "round",
                          paintOrder: "stroke fill",
                        }}
                        className={isWinningSegment ? "animate-pulse" : ""}
                      >
                        {displayName}
                      </text>
                      {participant.grade && participant.grade.trim() !== "" && (
                        <text
                          x={gradeX}
                          y={gradeY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isWinningSegment ? "#1a1a1a" : "#fff"}
                          fontSize={
                            isWinningSegment
                              ? 12
                              : Math.max(7, adaptiveFontSize - 2)
                          }
                          fontWeight="600"
                          transform={`rotate(${midAngle}, ${gradeX}, ${gradeY})`}
                          style={{
                            userSelect: "none",
                            stroke: isWinningSegment
                              ? "rgba(255,255,255,0.4)"
                              : "rgba(0,0,0,0.55)",
                            strokeWidth: "2px",
                            strokeLinejoin: "round",
                            paintOrder: "stroke fill",
                          }}
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
                  r="22"
                  fill="url(#centerGradient)"
                  stroke="#fff"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={onSpin}
              disabled={
                isSpinning || isWheelStopped || participants.length === 0
              }
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

            <Link
              href="/customize"
              className={`flex items-center gap-2 px-8 py-5 rounded-2xl ${
                isDark
                  ? "bg-purple-900 hover:bg-purple-800"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105`}
            >
              <Settings className="w-5 h-5" />
              Customize
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpinWheel;
