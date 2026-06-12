import { useState, useEffect, useRef } from "react";

// Types
import { Participant } from "../types/common";
import { useConfig } from "@/contexts/ConfigContext";

const WINNERS_STORAGE_KEY = "wheelOfFortuneWinners";

export const useSpinWheel = () => {
  const { appConfig } = useConfig();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isWheelStopped, setIsWheelStopped] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [winners, setWinners] = useState<Participant[]>([]);

  // Ref keeps the current audio element accessible inside closures (no stale state)
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  // Ref keeps the current rotation so setTimeout closures see the latest value
  const rotationRef = useRef(0);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
        spinAudioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.pause();
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current = null;
    }
  };

  const spin = (participants: Participant[]) => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setIsWheelStopped(false);
    setWinner(null);
    setHoveredSegment(null);

    stopAudio();

    if (appConfig.wheel.enableSound && appConfig.audio.spinSound) {
      try {
        const audio = new Audio(appConfig.audio.spinSound);
        audio.volume = appConfig.audio.volume;
        audio.loop = true;
        spinAudioRef.current = audio;
        audio.play().catch(() => {});
      } catch {}
    }

    const minRotation = appConfig.wheel.minSpins * 360;
    const maxRotation = appConfig.wheel.maxSpins * 360;
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
    const finalRotation = rotationRef.current + randomRotation;

    rotationRef.current = finalRotation;
    setRotation(finalRotation);

    const spinDuration = appConfig.wheel.spinDuration;
    const participantCount = participants.length;

    setTimeout(() => {
      stopAudio();
      setIsSpinning(false);
      setIsWheelStopped(true);

      const segmentAngle = 360 / participantCount;
      const normalizedRotation = (360 - (finalRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedRotation / segmentAngle);
      setHoveredSegment(winnerIndex);

      setTimeout(() => {
        const newWinner = participants[winnerIndex] || participants[0];
        setWinner(newWinner);
        setWinners((prevWinners) => [newWinner, ...prevWinners].slice(0, 10));
        setIsWheelStopped(false);
      }, 1000);
    }, spinDuration);
  };

  const removeWinner = (_winnerId: string, winnerIndex: number) => {
    setWinners((prevWinners) => prevWinners.filter((_, index) => index !== winnerIndex));
  };

  const clearWinners = () => {
    setWinners([]);
    localStorage.removeItem(WINNERS_STORAGE_KEY);
  };

  const reset = () => {
    stopAudio();
    setIsSpinning(false);
    setIsWheelStopped(false);
    setWinner(null);
    rotationRef.current = 0;
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
    removeWinner,
    clearWinners,
    stopAudio,
  };
};
