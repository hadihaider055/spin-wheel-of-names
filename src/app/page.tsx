"use client";

import { useEffect, useState } from "react";

// Components
import DarkModeToggle from "@/components/common/DarkModeToggle";
import Input from "@/components/common/Input";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import GiftSection from "@/containers/GiftSection";
import SpinWheel from "@/containers/SpinWheel";
import WinnerAnnouncement from "@/containers/WinnerAnnouncement";
import BumperPrizeModal from "@/containers/BumperPrize";
import CategoryFilter from "@/containers/CategoryFilter";
import MultipleWinnersModal from "@/containers/MultipleWinners";

// Utils
import { parseParticipants } from "@/utils/functions/parseParticipants";
import { useDarkMode } from "@/utils/hooks/useDarkMode";
import { useSpinWheel } from "@/utils/hooks/useSpinningWheel";
import { Participant } from "@/utils/types/common";
import { applyTheme } from "@/config/config";
import { useConfig } from "@/contexts/ConfigContext";
import { Trash2 } from "lucide-react";

const PARTICIPANTS_STORAGE_KEY = "wheelOfFortuneParticipants";
const WINNERS_STORAGE_KEY = "wheelOfFortuneWinners";
const GIFT_IMAGE_STORAGE_KEY = "wheelOfFortuneGiftImage";
const SELECTED_CATEGORIES_STORAGE_KEY = "wheelOfFortuneSelectedCategories";

const BallotingApp: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [giftImage, setGiftImage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showBumperPrize, setShowBumperPrize] = useState(false);
  const [bumperPrizeWinner, setBumperPrizeWinner] = useState<any>(null);
  const [multipleWinners, setMultipleWinners] = useState<Participant[]>([]);
  const [isFullReset, setIsFullReset] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const { appConfig } = useConfig();
  const {
    isSpinning,
    isWheelStopped,
    winner,
    rotation,
    hoveredSegment,
    spin,
    reset,
    winners,
    removeWinner,
    clearWinners,
    stopAudio,
  } = useSpinWheel();

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    document.title = appConfig.title;
  }, [appConfig.title]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedParticipants = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
    const savedGiftImage = localStorage.getItem(GIFT_IMAGE_STORAGE_KEY);
    const savedSelectedCategories = localStorage.getItem(
      SELECTED_CATEGORIES_STORAGE_KEY
    );

    if (savedParticipants) {
      try {
        const participants = JSON.parse(savedParticipants);
        setParticipants(participants);
      } catch (error) {
        console.error("Failed to parse saved participants", error);
      }
    }

    if (savedGiftImage) {
      try {
        setGiftImage(savedGiftImage);
      } catch (error) {
        console.error("Failed to parse saved gift image", error);
      }
    }

    if (savedSelectedCategories) {
      try {
        setSelectedCategories(JSON.parse(savedSelectedCategories));
      } catch (error) {
        console.error("Failed to parse saved selected categories", error);
      }
    }
  }, []);

  useEffect(() => {
    if (
      participants.length === 0 &&
      appConfig.defaultParticipants.length > 0 &&
      !isFullReset
    ) {
      const savedParticipants = localStorage.getItem(PARTICIPANTS_STORAGE_KEY);
      if (!savedParticipants) {
        const defaultParticipants = appConfig.defaultParticipants.map(
          (name, index) => ({
            id: `default-${index}`,
            name,
            grade: "",
            category: "Default Category",
          })
        );
        setParticipants(defaultParticipants);
      }
    }
  }, [appConfig.defaultParticipants, participants.length, isFullReset]);

  useEffect(() => {
    localStorage.setItem(
      PARTICIPANTS_STORAGE_KEY,
      JSON.stringify(participants)
    );
  }, [participants]);

  useEffect(() => {
    if (giftImage) {
      localStorage.setItem(GIFT_IMAGE_STORAGE_KEY, giftImage);
    } else {
      localStorage.removeItem(GIFT_IMAGE_STORAGE_KEY);
    }
  }, [giftImage]);

  useEffect(() => {
    localStorage.setItem(
      SELECTED_CATEGORIES_STORAGE_KEY,
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    if (winner) {
      stopAudio();

      if (
        appConfig.features.bumperPrize &&
        appConfig.bumperPrize.enabled &&
        winners.length >= appConfig.bumperPrize.triggerAfter &&
        (winners.length + 1) % appConfig.bumperPrize.triggerAfter === 0
      ) {
        setShowBumperPrize(true);
      }
    }
  }, [winner, stopAudio, winners.length, appConfig]);

  const handleSpin = () => {
    if (!isSpinning && !isWheelStopped && participants.length > 0) {
      const filteredParticipants =
        selectedCategories.length > 0
          ? participants.filter((p) => selectedCategories.includes(p.category))
          : participants;

      if (filteredParticipants.length > 0) {
        spin(filteredParticipants);
      }
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setGiftImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setGiftImage(null);
  };

  const handleWinnerClose = () => {
    if (winner) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.id !== winner.id)
      );
    }
    reset();
  };

  const handleDeleteParticipant = (participantId: string) => {
    const participantToDelete = participants.find(
      (p) => p.id === participantId
    );
    if (
      participantToDelete &&
      window.confirm(`Remove "${participantToDelete.name}" from the list?`)
    ) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.id !== participantId)
      );
    }
  };

  const handleDeleteCategory = (category: string) => {
    const participantsInCategory = participants.filter(
      (p) => p.category === category
    );
    if (
      participantsInCategory.length > 0 &&
      window.confirm(
        `Remove all ${participantsInCategory.length} participants from "${category}"?`
      )
    ) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.category !== category)
      );
    }
  };

  const handleClearAllParticipants = () => {
    if (
      participants.length > 0 &&
      window.confirm(
        `Remove all ${participants.length} participants from the list?`
      )
    ) {
      setParticipants([]);
    }
  };

  const handleRemoveWinner = (winnerIndex: number) => {
    const winnerToRemove = winners[winnerIndex];
    if (
      winnerToRemove &&
      window.confirm(`Remove "${winnerToRemove.name}" from winners history?`)
    ) {
      removeWinner(winnerToRemove.id, winnerIndex);
    }
  };

  const handleClearAllWinners = () => {
    if (
      winners.length > 0 &&
      window.confirm(`Clear all ${winners.length} winners from history?`)
    ) {
      clearWinners();
    }
  };

  const handleBumperPrizeSelect = (prize: any) => {
    setBumperPrizeWinner({ ...winner, prize });
    setShowBumperPrize(false);
  };

  const handleBumperPrizeClose = () => {
    setShowBumperPrize(false);
  };

  const handleRegularReset = () => {
    console.log("Regular Reset button clicked!");
    reset();
    clearWinners();
    console.log("Regular reset completed - cleared winners and reset wheel state");
  };

  const handleFullReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset everything? This will clear all participants and winners."
      )
    ) {
      setIsFullReset(true);
      setInputText("");
      setParticipants([]);
      setGiftImage(null);
      setSelectedCategories([]);
      setMultipleWinners([]);
      setBumperPrizeWinner(null);

      localStorage.removeItem(PARTICIPANTS_STORAGE_KEY);
      localStorage.removeItem(WINNERS_STORAGE_KEY);
      localStorage.removeItem(GIFT_IMAGE_STORAGE_KEY);
      localStorage.removeItem(SELECTED_CATEGORIES_STORAGE_KEY);

      reset();
      clearWinners();
    }
  };

  const handleParseParticipants = () => {
    const { participants: newParticipants } = parseParticipants(inputText);
    setParticipants(newParticipants);
    setInputText("");

    if (isFullReset && newParticipants.length > 0) {
      setIsFullReset(false);
    }
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
          onImageRemove={handleImageRemove}
          isDark={isDark}
        />

        <SpinWheel
          participants={participants}
          onSpin={handleSpin}
          isSpinning={isSpinning}
          isWheelStopped={isWheelStopped}
          rotation={rotation}
          hoveredSegment={hoveredSegment}
          onReset={handleRegularReset}
          isDark={isDark}
          setParticipants={setParticipants}
          winner={winner}
          handleFullReset={handleFullReset}
        />

        <CategoryFilter
          participants={participants}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          isDark={isDark}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Loaded Participants ({participants.length})
                  </h3>
                  {participants.length > 0 &&
                    appConfig.features.clearAllParticipants && (
                      <button
                        onClick={handleClearAllParticipants}
                        disabled={isSpinning}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                          isDark
                            ? "text-red-400 hover:bg-red-900 border border-red-700"
                            : "text-red-600 hover:bg-red-50 border border-red-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title="Clear all participants"
                      >
                        Clear All
                      </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="flex items-center justify-between mb-3">
                          <h4
                            className={`font-bold ${
                              isDark ? "text-purple-300" : "text-indigo-800"
                            }`}
                          >
                            {category} (
                            {
                              participants.filter(
                                (p) => p.category === category
                              ).length
                            }
                            )
                          </h4>
                          {appConfig.features.categoryManagement && (
                            <button
                              onClick={() => handleDeleteCategory(category)}
                              disabled={isSpinning}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                isDark
                                  ? "text-red-400 hover:bg-red-900"
                                  : "text-red-500 hover:bg-red-100"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={`Clear ${category} category`}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {participants
                            .filter((p) => p.category === category)
                            .map((participant) => (
                              <div
                                key={participant.id}
                                className={`text-sm ${
                                  isDark ? "bg-gray-700" : "bg-white"
                                } p-2 rounded-lg shadow-sm flex items-center justify-between group`}
                              >
                                <div>
                                  <span
                                    className={`font-semibold ${
                                      isDark ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {participant.name}
                                  </span>
                                  {participant.grade &&
                                    participant.grade.trim() !== "" && (
                                      <span
                                        className={`${
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                        } ml-2`}
                                      >
                                        ({participant.grade})
                                      </span>
                                    )}
                                </div>
                                {appConfig.features.deleteParticipants && (
                                  <button
                                    onClick={() =>
                                      handleDeleteParticipant(participant.id)
                                    }
                                    disabled={isSpinning}
                                    className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:scale-110 ${
                                      isDark
                                        ? "hover:bg-red-900 text-red-400 hover:text-red-300"
                                        : "hover:bg-red-100 text-red-500 hover:text-red-700"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    title={`Remove ${participant.name} (Click to delete)`}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Previous Winners ({winners.length})
                  </h3>
                  {winners.length > 0 && appConfig.features.clearAllWinners && (
                    <button
                      onClick={handleClearAllWinners}
                      disabled={isSpinning}
                      className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                        isDark
                          ? "text-red-400 hover:bg-red-900 border border-red-700"
                          : "text-red-600 hover:bg-red-50 border border-red-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Clear all winners"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div
                  className={`${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  } p-4 rounded-xl max-h-[400px] overflow-y-auto`}
                >
                  {winners.length > 0 ? (
                    <div className="space-y-3">
                      {winners.map((winner, index) => (
                        <div
                          key={`${winner.id}-${index}`}
                          className={`p-3 rounded-lg ${
                            index === 0
                              ? isDark
                                ? "bg-yellow-900/30 border border-yellow-700"
                                : "bg-yellow-100 border border-yellow-300"
                              : isDark
                              ? "bg-gray-600"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-center group">
                            <div>
                              <p
                                className={`font-bold ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {winner.name}
                              </p>
                              {winner.grade && winner.grade.trim() !== "" && (
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  Class: {winner.grade}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  NEW!
                                </span>
                              )}
                              {appConfig.features.deleteWinners && (
                                <button
                                  onClick={() => handleRemoveWinner(index)}
                                  disabled={isSpinning}
                                  className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-full hover:scale-110 ${
                                    isDark
                                      ? "hover:bg-red-900 text-red-400 hover:text-red-300"
                                      : "hover:bg-red-100 text-red-500 hover:text-red-700"
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title={`Remove ${winner.name} from winners`}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`py-4 text-center ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No winners yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {winner && !showBumperPrize && (
        <WinnerAnnouncement
          winner={winner}
          onClose={handleWinnerClose}
          isDark={isDark}
          giftImage={giftImage}
        />
      )}

      <BumperPrizeModal
        isVisible={showBumperPrize}
        onClose={handleBumperPrizeClose}
        onSelectPrize={handleBumperPrizeSelect}
        isDark={isDark}
      />

      {multipleWinners.length > 0 && (
        <MultipleWinnersModal
          winners={multipleWinners}
          onClose={() => setMultipleWinners([])}
          isDark={isDark}
          giftImage={giftImage}
        />
      )}

      <Footer isDark={isDark} />
    </div>
  );
};

export default BallotingApp;
