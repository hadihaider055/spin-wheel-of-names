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
  // Participants for the current/last spin (needed by stopSpin)
  const currentParticipantsRef = useRef<Participant[]>([]);
  // Timeouts so manual stop can cancel pending finalisation
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current);
    };
  }, []);

  const stopAudio = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.pause();
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current = null;
    }
  };

  const finalizeSpin = (finalRotation: number) => {
    const participants = currentParticipantsRef.current;
    if (participants.length === 0) {
      setIsSpinning(false);
      return;
    }

    rotationRef.current = finalRotation;
    setRotation(finalRotation);
    setIsSpinning(false);
    setIsWheelStopped(true);

    const segmentAngle = 360 / participants.length;
    const normalizedRotation =
      (((360 - (finalRotation % 360)) % 360) + 360) % 360;
    const winnerIndex = Math.floor(normalizedRotation / segmentAngle);
    setHoveredSegment(winnerIndex);

    finalizeTimeoutRef.current = setTimeout(() => {
      const newWinner = participants[winnerIndex] || participants[0];
      setWinner(newWinner);
      setWinners((prevWinners) => [newWinner, ...prevWinners].slice(0, 10));
      setIsWheelStopped(false);
    }, 1000);
  };

  const spin = (participants: Participant[]) => {
    if (isSpinning || participants.length === 0) return;

    currentParticipantsRef.current = participants;
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
    const randomRotation =
      Math.random() * (maxRotation - minRotation) + minRotation;
    const finalRotation = rotationRef.current + randomRotation;

    rotationRef.current = finalRotation;
    setRotation(finalRotation);

    const spinDuration = appConfig.wheel.spinDuration;

    spinTimeoutRef.current = setTimeout(() => {
      stopAudio();
      finalizeSpin(finalRotation);
    }, spinDuration);
  };

  const stopSpin = (currentVisualRotation: number) => {
    if (!isSpinning) return;
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    stopAudio();
    finalizeSpin(currentVisualRotation);
  };

  const removeWinner = (_winnerId: string, winnerIndex: number) => {
    setWinners((prevWinners) =>
      prevWinners.filter((_, index) => index !== winnerIndex),
    );
  };

  const clearWinners = () => {
    setWinners([]);
    localStorage.removeItem(WINNERS_STORAGE_KEY);
  };

  const reset = () => {
    stopAudio();
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = null;
    }
    if (finalizeTimeoutRef.current) {
      clearTimeout(finalizeTimeoutRef.current);
      finalizeTimeoutRef.current = null;
    }
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
    stopSpin,
    reset,
    removeWinner,
    clearWinners,
    stopAudio,
  };
};
