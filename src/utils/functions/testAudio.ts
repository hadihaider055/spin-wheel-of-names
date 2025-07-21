/**
 * Utility function to test audio playback
 * Helps debug audio issues in the browser
 */
export const testAudio = async (
  audioPath: string,
  volume: number = 0.5
): Promise<boolean> => {
  try {
    const audio = new Audio(audioPath);
    audio.volume = volume;

    return new Promise((resolve) => {
      const onCanPlay = () => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
        resolve(true);
      };

      const onError = (error: any) => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
        resolve(false);
      };

      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("error", onError);

      audio.load();
    });
  } catch (error) {
    return false;
  }
};

/**
 * Test all configured audio files
 */
export const testAllAudio = async (config: any) => {
  const tests = [];

  if (config.audio.spinSound) {
    tests.push({
      name: "Spin Sound",
      path: config.audio.spinSound,
      test: testAudio(config.audio.spinSound, config.audio.volume),
    });
  }

  if (config.audio.winnerSound) {
    tests.push({
      name: "Winner Sound",
      path: config.audio.winnerSound,
      test: testAudio(config.audio.winnerSound, config.audio.volume),
    });
  }

  const results = await Promise.all(tests.map((t) => t.test));

  tests.forEach((test, index) => {
    const status = results[index] ? "✅" : "❌";
  });

  return results.every((r) => r);
};
