"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Video, Square, Download, Mic, MicOff, X, Circle, Camera, CameraOff, GripVertical, Pause, Play } from "lucide-react";

type RecordingState = "idle" | "requesting" | "recording" | "stopped";

// Defined at module level so its identity is stable across renders.
// If defined inside ScreenRecorder, React treats it as a NEW component type
// on every render, unmounting+remounting the button mid-click and swallowing the event.
const Toggle: React.FC<{
  enabled: boolean;
  onToggle: () => void;
  label: React.ReactNode;
  icon: React.ReactNode;
  rowBg: string;
  disabled?: boolean;
}> = ({ enabled, onToggle, label, icon, rowBg, disabled }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg ${rowBg} ${disabled ? "opacity-40" : ""}`}>
    <div className="flex items-center gap-2">{icon}<span className="text-sm">{label}</span></div>
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : ""}`} />
    </button>
  </div>
);

const ScreenRecorder: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<RecordingState>("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [includeMic, setIncludeMic] = useState(false);
  const [includeCamera, setIncludeCamera] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [usedMime, setUsedMime] = useState("video/webm");
  const [isExpanded, setIsExpanded] = useState(false);
  // Camera overlay shown on the page so screen recording captures it naturally
  const [cameraActive, setCameraActive] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Destination node kept alive for the recording duration so new mic sources can connect mid-recording
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  // Stored gain node so we can mute/unmute mic while recording without rebuilding the graph
  const micGainRef = useRef<GainNode | null>(null);
  // Silent keepalive source — ensures the AudioContext destination always emits audio
  // samples even when no real sources are connected. Without this, MediaRecorder stalls
  // buffering video frames while waiting for audio data, causing frozen video playback.
  const keepaliveRef = useRef<ConstantSourceNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Draggable camera overlay position — null until mounted so we can read window size
  const [camPos, setCamPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; initX: number; initY: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    setCamPos({ x: 24, y: window.innerHeight - 250 });
  }, []);

  useEffect(() => {
    if (cameraActive && cameraVideoRef.current && cameraStreamRef.current) {
      cameraVideoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraActive]);

  const stopMic = () => {
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
  };

  // Call getUserMedia directly in the toggle handlers — must stay inside the
  // user-gesture call stack so Chrome grants permissions without a second prompt.
  const handleMicToggle = () => {
    if (state === "recording") {
      if (includeMic) {
        // Mute via gain — keeps the node connected so unmute is instant
        if (micGainRef.current) micGainRef.current.gain.value = 0;
        setIncludeMic(false);
      } else if (micGainRef.current) {
        // Was muted but gain node exists — just unmute
        micGainRef.current.gain.value = 2.5;
        setIncludeMic(true);
      } else {
        // Mic was never enabled — request and connect to the live AudioContext destination
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then((stream) => {
            micStreamRef.current = stream;
            const audioCtx = audioCtxRef.current;
            const dest = audioDestRef.current;
            if (!audioCtx || !dest) return;
            const micSource = audioCtx.createMediaStreamSource(new MediaStream(stream.getAudioTracks()));
            const gain = audioCtx.createGain();
            gain.gain.value = 2.5;
            micSource.connect(gain);
            gain.connect(dest);
            micGainRef.current = gain;
            setIncludeMic(true);
          })
          .catch(() => {});
      }
      return;
    }
    if (includeMic) {
      stopMic();
      setIncludeMic(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          micStreamRef.current = stream;
          setIncludeMic(true);
        })
        .catch(() => {});
    }
  };

  const handleCameraToggle = () => {
    if (includeCamera) {
      // Hide the overlay. During recording keep the stream alive so re-enabling is instant.
      if (state !== "recording") {
        cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      setCameraActive(false);
      setIncludeCamera(false);
    } else {
      if (cameraStreamRef.current) {
        // Stream already alive (was hidden mid-recording) — just re-show overlay
        setCameraActive(true);
        setIncludeCamera(true);
      } else {
        // Request a fresh camera stream (works both before and during recording)
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then((stream) => {
            cameraStreamRef.current = stream;
            setIncludeCamera(true);
            setCameraActive(true);
          })
          .catch(() => {});
      }
    }
  };

  // Stable callback ref — useCallback prevents re-firing on every render
  const setCameraVideoRef = useCallback((el: HTMLVideoElement | null) => {
    cameraVideoRef.current = el;
    if (el && cameraStreamRef.current) el.srcObject = cameraStreamRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
      keepaliveRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  if (!mounted) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const startRecording = async () => {
    setState("requesting");
    try {
      const displayStream: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
        // Pre-select the current tab in Chrome's picker (Chrome 94+).
        // selfBrowserSurface ensures the current tab is listed and highlighted (Chrome 107+).
        preferCurrentTab: true,
        selfBrowserSurface: "include",
      });
      displayStreamRef.current = displayStream;

      const displayAudioTracks = displayStream.getAudioTracks();
      const micAudioTracks: MediaStreamTrack[] = includeMic
        ? (micStreamRef.current?.getAudioTracks() ?? [])
        : [];

      // Always create an AudioContext so new mic sources can be connected mid-recording
      const audioCtx = new AudioContext();
      await audioCtx.resume();
      audioCtxRef.current = audioCtx;
      const dest = audioCtx.createMediaStreamDestination();
      audioDestRef.current = dest;

      // Silent keepalive: ConstantSourceNode at 0 gain ensures the destination always
      // produces audio samples. Without a connected source the dest track emits nothing,
      // causing MediaRecorder to stall waiting for audio — which freezes the video.
      const keepalive = audioCtx.createConstantSource();
      const keepaliveGain = audioCtx.createGain();
      keepaliveGain.gain.value = 0;
      keepalive.connect(keepaliveGain);
      keepaliveGain.connect(dest);
      keepalive.start();
      keepaliveRef.current = keepalive;

      if (displayAudioTracks.length > 0)
        audioCtx.createMediaStreamSource(new MediaStream(displayAudioTracks)).connect(dest);
      if (micAudioTracks.length > 0) {
        const micSource = audioCtx.createMediaStreamSource(new MediaStream(micAudioTracks));
        const gain = audioCtx.createGain();
        gain.gain.value = 2.5;
        micSource.connect(gain);
        gain.connect(dest);
        micGainRef.current = gain;
      }
      const finalAudioTracks = dest.stream.getAudioTracks();

      const videoTrack = displayStream.getVideoTracks()[0];
      const recordingStream = new MediaStream([
        ...(videoTrack ? [videoTrack] : []),
        ...finalAudioTracks,
      ]);

      chunksRef.current = [];
      // WebM is preferred for screen recording — it handles long recordings and audio/video
      // sync reliably. Fragmented MP4 (what MediaRecorder produces) has known sync issues
      // on long recordings and can produce frozen video if muxing falls behind.
      const MIME_PRIORITY = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4;codecs=avc1,mp4a.40.2",
        "video/mp4;codecs=avc1",
      ];
      const chosenMime = MIME_PRIORITY.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      const recorder = chosenMime
        ? new MediaRecorder(recordingStream, { mimeType: chosenMime })
        : new MediaRecorder(recordingStream);
      const actualMime = recorder.mimeType || "video/webm";
      setUsedMime(actualMime);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: actualMime });
        setRecordedBlob(blob);
        setState("stopped");
        setIsPaused(false);
        if (timerRef.current) clearInterval(timerRef.current);
        displayStreamRef.current?.getTracks().forEach((t) => t.stop());
        audioCtxRef.current?.close();
        displayStreamRef.current = null;
        audioCtxRef.current = null;
        audioDestRef.current = null;
        micGainRef.current = null;
        keepaliveRef.current?.stop();
        keepaliveRef.current = null;
      };

      videoTrack?.addEventListener("ended", () => {
        if (mediaRecorderRef.current?.state !== "inactive")
          mediaRecorderRef.current?.stop();
      });

      mediaRecorderRef.current = recorder;
      recorder.start(500);
      setState("recording");
      setIsPaused(false);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
      displayStreamRef.current = null;
      micStreamRef.current = null;
      audioCtxRef.current = null;
      setState("idle");
    }
  };

  const pauseResumeRecording = async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      // Suspend AudioContext so no audio is processed or buffered during pause.
      // Without this, the AudioContext clock keeps ticking and causes timeline
      // drift that degrades audio quality on resume.
      await audioCtxRef.current?.suspend();
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
    } else if (recorder.state === "paused") {
      // Resume AudioContext first so audio is flowing before the recorder
      // starts collecting data again — prevents a silent gap at the seam.
      await audioCtxRef.current?.resume();
      recorder.resume();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      setIsPaused(false);
    }
  };

  // Draggable camera overlay handlers
  const onDragStart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const initX = rect.left;
    const initY = rect.top;
    setCamPos({ x: initX, y: initY });
    dragRef.current = { startX: e.clientX, startY: e.clientY, initX, initY };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setCamPos({
        x: Math.max(0, Math.min(window.innerWidth - 200, dragRef.current.initX + (ev.clientX - dragRef.current.startX))),
        y: Math.max(0, Math.min(window.innerHeight - 150, dragRef.current.initY + (ev.clientY - dragRef.current.startY))),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const downloadRecording = () => {
    if (!recordedBlob) return;
    const fileExt = usedMime.startsWith("video/mp4") ? "mp4" : "webm";
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spin-wheel-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.${fileExt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetRecorder = () => {
    setRecordedBlob(null);
    setDuration(0);
    setIsPaused(false);
    setState("idle");
  };

  const panelBg = isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900";
  const rowBg = isDark ? "bg-gray-700" : "bg-gray-50";

  return (
    <>
      {/* ── Camera overlay: visible on page so screen recording captures it ── */}
      {cameraActive && (
        <div
          className="fixed z-[60] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/70 cursor-move select-none"
          style={{ width: 200, top: camPos?.y ?? window.innerHeight - 250, left: camPos?.x ?? 24 }}
          onMouseDown={onDragStart}
        >
          <video
            ref={setCameraVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover block"
            style={{ aspectRatio: "4/3" }}
          />
          <div className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 cursor-move">
            <GripVertical className="w-3 h-3 text-white" />
          </div>
          {state === "recording" && !isPaused && (
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          {state === "recording" && isPaused && (
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-yellow-400" />
          )}
        </div>
      )}

      {/* ── Recorder panel + trigger ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {isExpanded && (
          <div className={`rounded-2xl shadow-2xl border p-4 ${panelBg}`} style={{ width: 272 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-500" />
                <span className="font-semibold text-sm">Screen Recorder</span>
              </div>
              <button onClick={() => setIsExpanded(false)} className={`p-1 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Idle */}
            {state === "idle" && (
              <div className="space-y-2">
                <Toggle
                  rowBg={rowBg}
                  enabled={includeMic}
                  onToggle={handleMicToggle}
                  label="Microphone"
                  icon={includeMic ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                />
                <Toggle
                  rowBg={rowBg}
                  enabled={includeCamera}
                  onToggle={handleCameraToggle}
                  label="Camera overlay"
                  icon={includeCamera ? <Camera className="w-4 h-4 text-blue-500" /> : <CameraOff className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                />
                {cameraActive && (
                  <p className={`text-xs px-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                    Camera preview is live — drag it anywhere on screen.
                  </p>
                )}
                <p className={`text-xs px-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Choose a tab, window, or screen in the browser picker.
                </p>
                <button
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                >
                  <Circle className="w-3 h-3 fill-white" />
                  Start Recording
                </button>
              </div>
            )}

            {/* Requesting */}
            {state === "requesting" && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Waiting for permission...</p>
              </div>
            )}

            {/* Recording */}
            {state === "recording" && (
              <div className="space-y-2">
                {/* Timer */}
                <div className="flex items-center justify-center gap-3 py-2">
                  {isPaused
                    ? <div className="w-3 h-3 rounded-sm bg-yellow-400" />
                    : <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  }
                  <span className={`font-mono font-bold text-lg ${isPaused ? (isDark ? "text-yellow-400" : "text-yellow-500") : "text-red-500"}`}>
                    {formatTime(duration)}
                  </span>
                  <span className={`text-xs font-semibold ${isPaused ? (isDark ? "text-yellow-400" : "text-yellow-600") : (isDark ? "text-gray-400" : "text-gray-500")}`}>
                    {isPaused ? "PAUSED" : "REC"}
                  </span>
                </div>

                {/* Mic toggle during recording */}
                <Toggle
                  rowBg={rowBg}
                  enabled={includeMic}
                  onToggle={handleMicToggle}
                  label="Microphone"
                  icon={includeMic ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                />

                {/* Camera toggle during recording */}
                <Toggle
                  rowBg={rowBg}
                  enabled={includeCamera}
                  onToggle={handleCameraToggle}
                  label="Camera overlay"
                  icon={includeCamera ? <Camera className="w-4 h-4 text-blue-500" /> : <CameraOff className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                />

                {/* Pause / Resume */}
                <button
                  onClick={pauseResumeRecording}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                    isPaused
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : isDark
                      ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                      : "bg-yellow-400 hover:bg-yellow-500 text-white"
                  }`}
                >
                  {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                  {isPaused ? "Resume" : "Pause"}
                </button>

                {/* Stop */}
                <button
                  onClick={stopRecording}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors text-white ${isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-700 hover:bg-gray-800"}`}
                >
                  <Square className="w-4 h-4 fill-white" />
                  Stop Recording
                </button>
              </div>
            )}

            {/* Stopped */}
            {state === "stopped" && (
              <div className="space-y-2">
                <p className={`text-center text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Done — {formatTime(duration)}</p>
                <button
                  onClick={downloadRecording}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download (.{usedMime.startsWith("video/mp4") ? "mp4" : "webm"})
                </button>
                <button
                  onClick={resetRecorder}
                  className={`w-full py-2 px-4 rounded-lg text-sm transition-colors ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  Record Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trigger */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          title={state === "recording" ? `${isPaused ? "Paused" : "Recording"} — ${formatTime(duration)}` : "Screen Recorder"}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl border-2 font-semibold text-sm transition-all duration-300 hover:scale-105 ${
            state === "recording"
              ? isPaused
                ? "bg-yellow-400 text-white border-yellow-300"
                : "bg-red-500 text-white border-red-400 animate-pulse"
              : "bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
          }`}
        >
          <Video className="w-4 h-4" />
          {state === "recording"
            ? <span className="font-mono font-bold">{formatTime(duration)}</span>
            : <span>Record</span>
          }
        </button>
      </div>
    </>
  );
};

export default ScreenRecorder;
