"use client";

import { useState } from "react";
import { config } from "@/config/config";
import { testAllAudio } from "@/utils/functions/testAudio";

/**
 * Audio Test Component
 *
 * This is a debugging component you can temporarily add to your app
 * to test audio functionality. Add it to your main page component:
 *
 * import AudioTest from "@/components/debug/AudioTest";
 *
 * Then add <AudioTest /> somewhere in your JSX
 *
 * Remove this component in production!
 */
const AudioTest: React.FC = () => {
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioTestResults, setAudioTestResults] = useState<string[]>([]);

  const handleTestAudio = async () => {
    setIsTestingAudio(true);
    setAudioTestResults([]);

    const tests = [
      { name: "Spin Sound", path: config.audio.spinSound },
      { name: "Winner Sound", path: config.audio.winnerSound },
    ].filter((test) => test.path);

    const results: string[] = [];

    for (const test of tests) {
      try {
        results.push(`Testing ${test.name} (${test.path})...`);

        const audio = new Audio(test.path!);
        audio.volume = config.audio.volume;

        const canPlay = await new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(false), 5000);

          audio.addEventListener("canplay", () => {
            clearTimeout(timeout);
            resolve(true);
          });

          audio.addEventListener("error", () => {
            clearTimeout(timeout);
            resolve(false);
          });

          audio.load();
        });

        if (canPlay) {
          try {
            await audio.play();
            audio.pause();
          } catch (playError) {
            results.push(
              `⚠️ ${test.name}: File loads but playback failed (likely autoplay policy)`
            );
          }
        } else {
          results.push(`❌ ${test.name}: File failed to load`);
        }
      } catch (error) {
        results.push(`❌ ${test.name}: Error - ${error}`);
      }
    }

    results.push("", "Configuration:");
    results.push(`Sound enabled: ${config.wheel.enableSound ? "✅" : "❌"}`);
    results.push(`Volume: ${config.audio.volume}`);
    results.push(`Spin sound: ${config.audio.spinSound || "Not configured"}`);
    results.push(
      `Winner sound: ${config.audio.winnerSound || "Not configured"}`
    );

    setAudioTestResults(results);
    setIsTestingAudio(false);
  };

  const handlePlaySpinSound = async () => {
    if (!config.audio.spinSound) {
      alert("No spin sound configured!");
      return;
    }

    try {
      const audio = new Audio(config.audio.spinSound);
      audio.volume = config.audio.volume;
      await audio.play();

      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 2000);
    } catch (error) {
      alert("Failed to play sound.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-2">🔧 DEBUG: Audio Test</h3>
      <p className="text-sm mb-3">Remove this component in production!</p>

      <div className="space-y-2">
        <button
          onClick={handleTestAudio}
          disabled={isTestingAudio}
          className="block w-full bg-white text-red-500 px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
        >
          {isTestingAudio ? "Testing..." : "Test All Audio"}
        </button>

        <button
          onClick={handlePlaySpinSound}
          className="block w-full bg-white text-red-500 px-3 py-1 rounded text-sm font-medium"
        >
          Play Spin Sound (2s)
        </button>
      </div>

      {audioTestResults.length > 0 && (
        <div className="mt-3 bg-black bg-opacity-50 p-2 rounded text-xs max-h-40 overflow-y-auto">
          {audioTestResults.map((result, index) => (
            <div key={index} className="font-mono">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioTest;
