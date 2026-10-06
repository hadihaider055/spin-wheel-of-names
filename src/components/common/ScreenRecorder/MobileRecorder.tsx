"use client";

import { useState, useRef, useEffect } from "react";
import { toCanvas } from "html-to-image";
import { Video, Square, Download, Mic, MicOff, X, Circle, Pause, Play } from "lucide-react";
import { Toggle } from "./Toggle";

type RecordingState = "idle" | "requesting" | "recording" | "stopped";

// Mobile browsers can't capture the screen, so we composite our own frames:
//  - background: full-page DOM snapshot via html-to-image (~1 s on a mid-range phone —
//    it clones every computed style and blocks the main thread while doing it)
//  - live layers: SVGs marked [data-recorder-live] (the wheel + pointer) serialised
//    raw and drawn at their current rotation every frame (~0 ms each)
// Background snapshots pause while a live layer is moving, so spins record smoothly;
// live layers are anchored to where they were in the background, so they stay aligned.
// ponytail: HTML that changes mid-spin (e.g. the live pointer name) shows up only once
// the wheel stops; mark more SVGs live, or use the OS recorder (shown in the panel).
const TARGET_FPS = 30;
const BG_IDLE_GAP_MS = 250;
const LIVE_SETTLE_MS = 600;

type Point = { x: number; y: number };
// Viewport centre of an element (the bounding box of a rotated element shares its centre)
const centerOf = (el: Element): Point => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

// Draw one live SVG centred at `at`, with its current CSS rotation — read from the
// computed transform, so mid-transition spins are captured. Returns the angle so
// callers can detect motion.
const imgCache = new WeakMap<Element, { src: string; img: HTMLImageElement }>();
const drawLiveSvg = (ctx: CanvasRenderingContext2D, svg: SVGSVGElement, at: Point) => {
  const transform = getComputedStyle(svg).transform;
  const m = new DOMMatrix(transform === "none" ? undefined : transform);
  const angle = Math.atan2(m.b, m.a);
  // clientWidth/Height = untransformed CSS size (the rect is the rotated bounding box)
  const w = svg.clientWidth;
  const h = svg.clientHeight;
  if (!w || !h || at.y + h < 0 || at.y - h > window.innerHeight) return angle;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.removeAttribute("style");
  clone.removeAttribute("class");
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  // Inside an <img> the SVG can't inherit page fonts — pass the family explicitly
  clone.setAttribute("font-family", getComputedStyle(svg).fontFamily);
  const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));

  let entry = imgCache.get(svg);
  if (entry?.src !== src) {
    const img = new Image();
    img.src = src;
    entry = { src, img };
    imgCache.set(svg, entry);
  }
  if (!entry.img.complete || !entry.img.naturalWidth) return angle;

  ctx.save();
  ctx.translate(at.x, at.y);
  ctx.rotate(angle);
  ctx.drawImage(entry.img, -w / 2, -h / 2, w, h);
  ctx.restore();
  return angle;
};

const MIME_PRIORITY = [
  "video/mp4;codecs=avc1", // iOS Safari only records mp4
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const MobileRecorder: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [state, setState] = useState<RecordingState>("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [includeMic, setIncludeMic] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [usedMime, setUsedMime] = useState("video/mp4");
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Flags read by the async capture loop — refs so it sees the latest value
  const capturingRef = useRef(false);
  const pausedRef = useRef(false);

  const stopEverything = () => {
    capturingRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
  };

  useEffect(() => stopEverything, []);

  // getUserMedia must run inside the tap handler so iOS shows the permission prompt
  const handleMicToggle = () => {
    if (includeMic) {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
      setIncludeMic(false);
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        micStreamRef.current = stream;
        setIncludeMic(true);
      })
      .catch(() => setError("Microphone permission was denied."));
  };

  const startRecording = async () => {
    setError(null);
    setState("requesting");
    try {
      // Even dimensions — H.264 encoders reject odd sizes
      const width = Math.floor(window.innerWidth / 2) * 2;
      const height = Math.floor(window.innerHeight / 2) * 2;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas.captureStream || typeof MediaRecorder === "undefined")
        throw new Error("This browser can't record video.");

      const bg = getComputedStyle(document.body).backgroundColor;
      const liveSvgs = () =>
        [...document.querySelectorAll<SVGSVGElement>("svg[data-recorder-live]")]
          .sort((a, b) => Number(a.dataset.recorderLive) - Number(b.dataset.recorderLive));
      const snapshot = async () => {
        const scrollY = window.scrollY;
        // Where each live layer sits in this snapshot — live layers are drawn here, so
        // they stay aligned with the background even if scroll/layout shifts afterwards
        const anchors = new Map(liveSvgs().map((svg) => [svg, centerOf(svg)]));
        const image = await toCanvas(document.body, {
          width,
          height,
          pixelRatio: 1,
          backgroundColor: bg,
          // The app uses system fonts; embedding web fonts adds ~250KB per frame for nothing
          skipFonts: true,
          // Shift in-flow content to the current scroll position; fixed elements
          // stay pinned to the (viewport-sized) snapshot like on screen
          style: { marginTop: `${-scrollY}px` },
          filter: (node) => !(node instanceof HTMLElement && node.dataset.recorderUi !== undefined),
        });
        return { image, anchors };
      };

      // Latest background snapshot; the compositor draws live layers over it
      let background = await snapshot();
      // Background snapshots are skipped until this time — set while live layers move
      let liveUntil = 0;
      const lastAngles = new WeakMap<Element, number>();
      const drawFrame = () => {
        ctx.drawImage(background.image, 0, 0, width, height);
        liveSvgs().forEach((svg) => {
          // Mounted after the snapshot → no anchor yet, use its live position
          const angle = drawLiveSvg(ctx, svg, background.anchors.get(svg) ?? centerOf(svg));
          if (lastAngles.has(svg) && lastAngles.get(svg) !== angle) liveUntil = performance.now() + LIVE_SETTLE_MS;
          lastAngles.set(svg, angle);
        });
      };
      // Paint the first frame before starting so the video doesn't open black
      drawFrame();

      const stream = canvas.captureStream(TARGET_FPS);
      micStreamRef.current?.getAudioTracks().forEach((t) => stream.addTrack(t));

      const chosenMime = MIME_PRIORITY.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
      const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
      const actualMime = recorder.mimeType || chosenMime || "video/mp4";
      setUsedMime(actualMime);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopEverything();
        setIncludeMic(false);
        setRecordedBlob(new Blob(chunksRef.current, { type: actualMime }));
        setState("stopped");
        setIsPaused(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500);
      capturingRef.current = true;
      pausedRef.current = false;
      setState("recording");
      setIsPaused(false);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);

      // Compositor at TARGET_FPS; cleared by stopEverything via capturingRef check
      const frameTimer = setInterval(() => {
        if (!capturingRef.current) return clearInterval(frameTimer);
        if (!pausedRef.current) drawFrame();
      }, 1000 / TARGET_FPS);

      // Background loop: one full-page snapshot at a time. Skipped while live layers
      // move — a snapshot blocks the main thread long enough to stall the compositor.
      (async () => {
        while (capturingRef.current) {
          if (!pausedRef.current && performance.now() >= liveUntil) {
            try {
              background = await snapshot();
            } catch {
              // A single failed snapshot (e.g. an image mid-load) — keep the previous one
            }
          }
          await new Promise((r) => setTimeout(r, BG_IDLE_GAP_MS));
        }
      })();
    } catch (e) {
      stopEverything();
      setIncludeMic(false);
      setError(e instanceof Error ? e.message : "Recording failed to start.");
      setState("idle");
    }
  };

  const pauseResumeRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    if (recorder.state === "recording") {
      recorder.pause();
      pausedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPaused(true);
    } else if (recorder.state === "paused") {
      pausedRef.current = false;
      recorder.resume();
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  };

  const fileExt = usedMime.startsWith("video/mp4") ? "mp4" : "webm";

  const downloadRecording = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spin-wheel-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.${fileExt}`;
    a.click();
    // Delay revoke — mobile Safari starts the download asynchronously
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  const resetRecorder = () => {
    setRecordedBlob(null);
    setDuration(0);
    setIsPaused(false);
    setState("idle");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const panelBg = isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900";
  const rowBg = isDark ? "bg-gray-700" : "bg-gray-50";
  const muted = isDark ? "text-gray-400" : "text-gray-500";

  return (
    // data-recorder-ui keeps this panel out of the recorded frames
    <div data-recorder-ui className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isExpanded && (
        <div className={`rounded-2xl shadow-2xl border p-4 ${panelBg}`} style={{ width: "min(272px, calc(100vw - 32px))" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-sm">Screen Recorder</span>
            </div>
            <button onClick={() => setIsExpanded(false)} aria-label="Close" className={`p-1 rounded-full transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && <p className="text-xs px-1 mb-2 text-red-500">{error}</p>}

          {state === "idle" && (
            <div className="space-y-2">
              <Toggle
                rowBg={rowBg}
                enabled={includeMic}
                onToggle={handleMicToggle}
                label="Microphone"
                icon={includeMic ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className={`w-4 h-4 ${muted}`} />}
              />
              <p className={`text-xs px-1 ${muted}`}>
                Records this page in the browser at a lower frame rate. Page sounds are only captured through the mic.
              </p>
              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
              >
                <Circle className="w-3 h-3 fill-white" />
                Start Recording
              </button>
              <p className={`text-xs px-1 pt-1 ${muted}`}>
                <span className="font-semibold">Want smooth 60fps with sound?</span>{" "}
                {isIOS()
                  ? "Use iOS Screen Recording: open Control Center and tap the record button."
                  : "Use Android Screen record: swipe down twice and tap Screen record in Quick Settings."}
              </p>
            </div>
          )}

          {state === "requesting" && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Preparing recorder...</p>
            </div>
          )}

          {state === "recording" && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 py-2">
                {isPaused ? <div className="w-3 h-3 rounded-sm bg-yellow-400" /> : <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />}
                <span className={`font-mono font-bold text-lg ${isPaused ? (isDark ? "text-yellow-400" : "text-yellow-500") : "text-red-500"}`}>
                  {formatTime(duration)}
                </span>
                <span className={`text-xs font-semibold ${isPaused ? (isDark ? "text-yellow-400" : "text-yellow-600") : muted}`}>
                  {isPaused ? "PAUSED" : "REC"}
                </span>
              </div>
              <button
                onClick={pauseResumeRecording}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors text-white ${
                  isPaused ? "bg-green-500 hover:bg-green-600" : isDark ? "bg-yellow-600 hover:bg-yellow-500" : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={stopRecording}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-colors text-white ${isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-700 hover:bg-gray-800"}`}
              >
                <Square className="w-4 h-4 fill-white" />
                Stop Recording
              </button>
            </div>
          )}

          {state === "stopped" && (
            <div className="space-y-2">
              <p className={`text-center text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>Done — {formatTime(duration)}</p>
              <button
                onClick={downloadRecording}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Download (.{fileExt})
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

      <button
        onClick={() => setIsExpanded((v) => !v)}
        title={state === "recording" ? `${isPaused ? "Paused" : "Recording"} — ${formatTime(duration)}` : "Screen Recorder"}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl border-2 font-semibold text-sm transition-all duration-300 ${
          state === "recording"
            ? isPaused
              ? "bg-yellow-400 text-white border-yellow-300"
              : "bg-red-500 text-white border-red-400 animate-pulse"
            : "bg-purple-600 hover:bg-purple-700 text-white border-purple-400"
        }`}
      >
        <Video className="w-4 h-4" />
        {state === "recording" ? <span className="font-mono font-bold">{formatTime(duration)}</span> : <span>Record</span>}
      </button>
    </div>
  );
};

export default MobileRecorder;
