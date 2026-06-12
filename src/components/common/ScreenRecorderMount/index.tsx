"use client";

import { useConfig } from "@/contexts/ConfigContext";
import ScreenRecorder from "@/components/common/ScreenRecorder";

// Mounted in the root layout so the recorder persists across page navigations.
const ScreenRecorderMount: React.FC = () => {
  const { isDark } = useConfig();
  return <ScreenRecorder isDark={isDark} />;
};

export default ScreenRecorderMount;
