import { useState } from "react";

// Types
import { Participant } from "../types/common";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, toggleDarkMode };
};

export const useSpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWheelStopped, setIsWheelStopped] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const spin = (participants: Participant[]) => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setIsWheelStopped(false);
    setWinner(null);
    setHoveredSegment(null);

    const minRotation = 10 * 360;
    const maxRotation = 18 * 360;
    const randomRotation =
      Math.random() * (maxRotation - minRotation) + minRotation;
    const finalRotation = rotation + randomRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setIsWheelStopped(true);

      const segmentAngle = 360 / participants.length;
      const normalizedRotation = (360 - (finalRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedRotation / segmentAngle);
      setHoveredSegment(winnerIndex);

      setTimeout(() => {
        setWinner(participants[winnerIndex] || participants[0]);
        setIsWheelStopped(false);
      }, 2500);
    }, 5000);
  };

  const reset = () => {
    setWinner(null);
    setRotation(0);
    setIsWheelStopped(false);
    setHoveredSegment(null);
  };

  return {
    isSpinning,
    isWheelStopped,
    winner,
    rotation,
    hoveredSegment,
    spin,
    reset,
  };
};
