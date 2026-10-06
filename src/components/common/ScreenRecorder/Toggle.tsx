"use client";

// Defined at module level so its identity is stable across renders.
// If defined inside ScreenRecorder, React treats it as a NEW component type
// on every render, unmounting+remounting the button mid-click and swallowing the event.
export const Toggle: React.FC<{
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
