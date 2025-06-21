"use client";

import { useEffect, useState } from "react";

// Components
import DarkModeToggle from "@/components/common/DarkModeToggle";
import Input from "@/components/common/Input";
import Navbar from "@/components/common/Navbar";
import GiftSection from "@/containers/GiftSection";
import SpinWheel from "@/containers/SpinWheel";
import WinnerAnnouncement from "@/containers/WinnerAnnouncement";

// Utils
import { parseParticipants } from "@/utils/functions/parseParticipants";
import { useDarkMode } from "@/utils/hooks/useDarkMode";
import { useSpinWheel } from "@/utils/hooks/useSpinningWheel";
import { Participant } from "@/utils/types/common";

const PARTICIPANTS_STORAGE_KEY = "wheelOfFortuneParticipants";

const BallotingApp: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [giftImage, setGiftImage] = useState<string | null>(null);
  const { isDark, toggleDarkMode } = useDarkMode();
  const {
    isSpinning,
    isWheelStopped,
    winner,
    rotation,
    hoveredSegment,
    spin,
    reset,
  } = useSpinWheel();

  useEffect(() => {
    const savedParticipants = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    if (savedParticipants) {
      try {
        setParticipants(JSON.parse(savedParticipants));
      } catch (error) {
        console.error("Failed to parse saved participants", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      PARTICIPANTS_STORAGE_KEY,
      JSON.stringify(participants)
    );
  }, [participants]);

  const handleParseParticipants = () => {
    const { participants: newParticipants } = parseParticipants(inputText);
    setParticipants(newParticipants);
  };

  const handleSpin = () => {
    if (!isSpinning && !isWheelStopped && participants.length > 0) {
      spin(participants);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setGiftImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleWinnerClose = () => {
    if (winner) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.id !== winner.id)
      );
    }
    reset();
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      }`}
    >
      <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
      <Navbar isDark={isDark} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <GiftSection
          giftImage={giftImage}
          onImageUpload={handleImageUpload}
          isDark={isDark}
        />

        <SpinWheel
          participants={participants}
          onSpin={handleSpin}
          isSpinning={isSpinning}
          isWheelStopped={isWheelStopped}
          rotation={rotation}
          hoveredSegment={hoveredSegment}
          onReset={reset}
          isDark={isDark}
          setParticipants={setParticipants}
          winner={winner}
        />

        <Input
          value={inputText}
          onChange={setInputText}
          onParse={handleParseParticipants}
          participantCount={participants.length}
          isDark={isDark}
        />

        {participants.length > 0 && (
          <div
            className={`mt-12 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            } rounded-2xl shadow-2xl p-8 border`}
          >
            <h3
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              } mb-6`}
            >
              Loaded Participants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from(new Set(participants.map((p) => p.category))).map(
                (category) => (
                  <div
                    key={category}
                    className={`${
                      isDark
                        ? "bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-700"
                        : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
                    } p-4 rounded-xl border`}
                  >
                    <h4
                      className={`font-bold ${
                        isDark ? "text-purple-300" : "text-indigo-800"
                      } mb-3`}
                    >
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {participants
                        .filter((p) => p.category === category)
                        .map((participant) => (
                          <div
                            key={participant.id}
                            className={`text-sm ${
                              isDark ? "bg-gray-700" : "bg-white"
                            } p-2 rounded-lg shadow-sm`}
                          >
                            <span
                              className={`font-semibold ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {participant.name}
                            </span>
                            <span
                              className={`${
                                isDark ? "text-gray-300" : "text-gray-600"
                              } ml-2`}
                            >
                              ({participant.grade})
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {winner && (
        <WinnerAnnouncement
          winner={winner}
          onClose={handleWinnerClose}
          isDark={isDark}
          giftImage={giftImage}
        />
      )}
    </div>
  );
};

export default BallotingApp;
