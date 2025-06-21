import { useState, useEffect } from "react";

// Types
import { Participant } from "../types/common";

const WINNERS_STORAGE_KEY = "wheelOfFortuneWinners";

export const useSpinWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWheelStopped, setIsWheelStopped] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);

  useEffect(() => {
    const savedWinners = localStorage.getItem(WINNERS_STORAGE_KEY);
    if (savedWinners) {
      try {
        setWinners(JSON.parse(savedWinners));
      } catch (error) {
        console.error("Failed to parse saved winners", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(WINNERS_STORAGE_KEY, JSON.stringify(winners));
  }, [winners]);

  const spin = (participants: Participant[]) => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setIsWheelStopped(false);
    setWinner(null);
    setHoveredSegment(null);

    const minRotation = 8 * 360;
    const maxRotation = 15 * 360;
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
        const newWinner = participants[winnerIndex] || participants[0];
        setWinner(newWinner);
        setWinners((prevWinners) => {
          const updatedWinners = [newWinner, ...prevWinners];
          return updatedWinners.slice(0, 10);
        });
        setIsWheelStopped(false);
      }, 1000);
    }, 5000);
  };

  const clearWinners = () => {
    setWinners([]);
    localStorage.removeItem(WINNERS_STORAGE_KEY);
  };

  const reset = () => {
    setIsSpinning(false);
    setIsWheelStopped(false);
    setWinner(null);
    setRotation(0);
    setHoveredSegment(null);
  };

  return {
    isSpinning,
    isWheelStopped,
    winner,
    rotation,
    hoveredSegment,
    winners,
    spin,
    reset,
    clearWinners,
  };
};
