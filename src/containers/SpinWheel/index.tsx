"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Icons
import { Trophy, Users, Play, RotateCcw, Settings, Square } from "lucide-react";
import Link from "next/link";

// Utils
import { Participant } from "@/utils/types/common";
import { getWheelColors } from "@/config/config";
import { useConfig } from "@/contexts/ConfigContext";

const SpinWheel: React.FC<{
  participants: Participant[];
  onSpin: () => void;
  onStop: (currentRotation: number) => void;
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
  onStop,
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
  const [livePointerIndex, setLivePointerIndex] = useState<number | null>(null);

  const truncateName = (name: string, maxChars: number): string => {
    if (name.length <= maxChars) return name;
    if (maxChars <= 3) return name.slice(0, maxChars);
    return name.slice(0, maxChars - 1) + "…";
  };

  // Read wheel's current visual rotation (degrees) from the rendered transform matrix.
  const readVisualRotation = (): number => {
    const svg = wheelRef.current;
    if (!svg) return 0;
    const t = window.getComputedStyle(svg).transform;
    if (!t || t === "none") return 0;
    try {
      const m = new DOMMatrixReadOnly(t);
      return (Math.atan2(m.b, m.a) * 180) / Math.PI;
    } catch {
      return 0;
    }
  };

  const angleToIndex = (angle: number, count: number): number => {
    const seg = 360 / count;
    const normalized = (((360 - (angle % 360)) % 360) + 360) % 360;
    return Math.floor(normalized / seg) % count;
  };

  // Live-track which segment the arrow is over while spinning.
  useEffect(() => {
    if (!isSpinning || participants.length === 0) {
      if (!isWheelStopped) setLivePointerIndex(null);
      return;
    }
    let frameId = 0;
    let lastIdx = -1;
    const tick = () => {
      const angle = readVisualRotation();
      const idx = angleToIndex(angle, participants.length);
      if (idx !== lastIdx) {
        lastIdx = idx;
        setLivePointerIndex(idx);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isSpinning, isWheelStopped, participants.length]);

  // Manual stop: snap wheel to its current visual position, then finalise.
  const handleStop = () => {
    const svg = wheelRef.current;
    if (!svg) return;
    const currentAngle = readVisualRotation();
    // Freeze the wheel where it is so React's next render doesn't trigger a back-tween.
    svg.style.transition = "none";
    svg.style.transform = `rotate(${currentAngle}deg)`;
    svg.getBoundingClientRect(); // force reflow
    onStop(currentAngle);
  };

  const pointerName = (() => {
    if (isWheelStopped && hoveredSegment !== null)
      return participants[hoveredSegment]?.name ?? null;
    if (isSpinning && livePointerIndex !== null)
      return participants[livePointerIndex]?.name ?? null;
    return null;
  })();

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
  // Geist Sans Bold worst-case char width ≈ fontSize * 0.55 (caps wide glyphs like M/W).
  const CHAR_W = 0.55;
  const maxChars = Math.max(
    4,
    Math.floor((maxHalfWidth * 2) / (fontSize * CHAR_W)),
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
          {pointerName ? (
            <div
              className={`inline-flex items-center gap-3 mt-2 pl-3 pr-5 py-2 rounded-full font-semibold backdrop-blur-md pointer-shimmer ${
                isSpinning ? "pointer-glow" : ""
              } ${
                isDark
                  ? "text-white border border-purple-500/40 bg-gradient-to-r from-purple-900/60 via-fuchsia-900/40 to-indigo-900/60"
                  : "text-indigo-900 border border-purple-300/70 bg-gradient-to-r from-purple-100/90 via-fuchsia-100/80 to-indigo-100/90"
              }`}
              aria-live="polite"
            >
              <span className="flex flex-col items-start leading-tight px-2">
                <span
                  className={`text-[10px] uppercase tracking-[0.18em] font-bold ${
                    isDark ? "text-purple-300/80" : "text-indigo-600/80"
                  }`}
                >
                  {isWheelStopped ? "Stopping at" : "Now pointing at"}
                </span>
                <span
                  key={pointerName}
                  className="animate-name-rise text-base sm:text-lg font-bold max-w-[60vw] truncate"
                  title={pointerName}
                >
                  {pointerName}
                </span>
              </span>
            </div>
          ) : (
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
              May the best participant win!
            </p>
          )}
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

        <div className="flex flex-col items-center w-full">
          <div
            className="relative mb-8 w-full mx-auto"
            ref={containerRef}
            style={{ maxWidth: appConfig.wheel.wheelSize }}
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
                    mousePos.x >
                    (containerRef.current?.offsetWidth ??
                      appConfig.wheel.wheelSize) *
                      0.72
                      ? "translateX(-110%)"
                      : "none",
                }}
              >
                {hoveredName}
              </div>
            )}

            {/* Pointer arrow — tip ~5% inside the outer ring (scales with SVG) */}
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                top: `${(pointerTipY / appConfig.wheel.wheelSize) * 100}%`,
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
            <div className="relative w-full">
              <svg
                ref={wheelRef}
                width={appConfig.wheel.wheelSize}
                height={appConfig.wheel.wheelSize}
                viewBox={`0 0 ${appConfig.wheel.wheelSize} ${appConfig.wheel.wheelSize}`}
                className={`drop-shadow-2xl ${
                  isSpinning ? "wheel-transition" : "wheel-reset"
                }`}
                style={{
                  cursor: "default",
                  width: "100%",
                  height: "auto",
                  display: "block",
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
                  // Winner shows the full name — shrink the font to fit, only truncate
                  // as a last resort when even the minimum font would overflow.
                  const winnerFitFont = Math.min(
                    16,
                    Math.floor(
                      (maxHalfWidth * 2) /
                        (Math.max(1, participant.name.length) * CHAR_W),
                    ),
                  );
                  const winnerFontSize = Math.max(9, winnerFitFont);
                  const winnerMaxChars = Math.max(
                    4,
                    Math.floor((maxHalfWidth * 2) / (winnerFontSize * CHAR_W)),
                  );
                  const displayName = isWinningSegment
                    ? truncateName(participant.name, winnerMaxChars)
                    : truncateName(participant.name, maxChars);
                  const segFontSize = isWinningSegment
                    ? winnerFontSize
                    : adaptiveFontSize;

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
            {isSpinning ? (
              <button
                onClick={handleStop}
                className="flex items-center gap-3 px-12 py-5 rounded-2xl cursor-pointer text-white font-bold text-lg transition-all duration-300 shadow-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:via-red-600 hover:to-orange-600 transform hover:scale-105 hover:shadow-2xl animate-pulse"
              >
                <Square className="w-6 h-6 fill-white" />
                STOP
              </button>
            ) : (
              <button
                onClick={onSpin}
                disabled={isWheelStopped || participants.length === 0}
                className={`flex items-center gap-3 px-12 py-5 rounded-2xl cursor-pointer text-white font-bold text-lg transition-all duration-300 shadow-xl ${
                  isWheelStopped || participants.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transform hover:scale-105 hover:shadow-2xl"
                }`}
              >
                {isWheelStopped ? (
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
            )}

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
