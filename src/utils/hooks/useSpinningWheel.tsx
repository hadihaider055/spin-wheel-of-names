import { useState, useEffect } from "react";

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
  const [currentSpinAudio, setCurrentSpinAudio] =
    useState<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (winner && currentSpinAudio) {
      currentSpinAudio.pause();
      currentSpinAudio.currentTime = 0;
      setCurrentSpinAudio(null);
    }
  }, [winner, currentSpinAudio]);

  useEffect(() => {
    return () => {
      if (currentSpinAudio) {
        currentSpinAudio.pause();
        currentSpinAudio.currentTime = 0;
      }
    };
  }, [currentSpinAudio]);

  const spin = (participants: Participant[]) => {
    if (isSpinning || participants.length === 0) return;

    setIsSpinning(true);
    setIsWheelStopped(false);
    setWinner(null);
    setHoveredSegment(null);

    if (currentSpinAudio) {
      currentSpinAudio.pause();
      currentSpinAudio.currentTime = 0;
      setCurrentSpinAudio(null);
    }

    if (appConfig.wheel.enableSound && appConfig.audio.spinSound) {
      try {
        const audio = new Audio(appConfig.audio.spinSound);
        audio.volume = appConfig.audio.volume;
        audio.loop = true;

        setCurrentSpinAudio(audio);

        audio
          .play()
          .then(() => {})
          .catch(() => {});
      } catch (error) {}
    }

    const minRotation = appConfig.wheel.minSpins * 360;
    const maxRotation = appConfig.wheel.maxSpins * 360;
    const randomRotation =
      Math.random() * (maxRotation - minRotation) + minRotation;
    const finalRotation = rotation + randomRotation;

    setRotation(finalRotation);

    setTimeout(() => {
      if (currentSpinAudio) {
        currentSpinAudio.pause();
        currentSpinAudio.currentTime = 0;
        setCurrentSpinAudio(null);
      }

      setIsSpinning(false);
      setIsWheelStopped(true);

      const segmentAngle = 360 / participants.length;
      const normalizedRotation = (360 - (finalRotation % 360)) % 360;
      const winnerIndex = Math.floor(normalizedRotation / segmentAngle);
      setHoveredSegment(winnerIndex);

      setTimeout(() => {
        if (currentSpinAudio) {
          currentSpinAudio.pause();
          currentSpinAudio.currentTime = 0;
          setCurrentSpinAudio(null);
        }

        const newWinner = participants[winnerIndex] || participants[0];
        setWinner(newWinner);
        setWinners((prevWinners) => {
          const updatedWinners = [newWinner, ...prevWinners];
          return updatedWinners.slice(0, 10);
        });
        setIsWheelStopped(false);
      }, 1000);
    }, appConfig.wheel.spinDuration);
  };

  const removeWinner = (winnerId: string, winnerIndex: number) => {
    setWinners((prevWinners) => {
      const updatedWinners = prevWinners.filter(
        (_, index) => index !== winnerIndex
      );
      return updatedWinners;
    });
  };

  const clearWinners = () => {
    setWinners([]);
    localStorage.removeItem(WINNERS_STORAGE_KEY);
  };

  const stopAudio = () => {
    if (currentSpinAudio) {
      currentSpinAudio.pause();
      currentSpinAudio.currentTime = 0;
      setCurrentSpinAudio(null);
    }
  };

  const reset = () => {
    stopAudio();

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
    removeWinner,
    clearWinners,
    stopAudio,
  };
};
