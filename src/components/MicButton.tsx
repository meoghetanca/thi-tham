import React, { useCallback, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Mic, Square } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * The app's primary control: press to dictate.
 *
 * Drives `toggle_dictation`, the same action the transcribe shortcut runs, so
 * clicking here and pressing Option+Space are one code path. Recording state is
 * polled rather than pushed — the window is only open while someone is looking
 * at it, so a short interval is cheaper than wiring a dedicated event.
 */
export const MicButton: React.FC<{ expanded?: boolean }> = ({
  expanded = true,
}) => {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const state = await invoke<boolean>("is_recording");
        if (alive) setRecording(state);
      } catch {
        // Window can outlive the backend during shutdown; a failed poll is not
        // worth surfacing.
      }
    };
    poll();
    const id = setInterval(poll, 300);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const toggle = useCallback(async () => {
    setBusy(true);
    try {
      await invoke("toggle_dictation", { postProcess: false });
      setRecording((r) => !r);
    } catch (error) {
      console.error("Failed to toggle dictation:", error);
    } finally {
      setBusy(false);
    }
  }, []);

  const label = recording ? t("mic.stop") : t("mic.start");

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={label}
      aria-pressed={recording}
      title={label}
      className={`group relative flex h-11 shrink-0 items-center rounded-full
        ${expanded ? "w-full gap-2.5 px-3.5 justify-start" : "w-11 justify-center"}
        transition-transform duration-150 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary
        disabled:opacity-60 active:scale-95
        ${
          recording
            ? "bg-logo-primary text-logo-stroke shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-logo-primary),transparent_78%)]"
            : "bg-logo-primary/15 text-logo-primary hover:bg-logo-primary/25"
        }`}
    >
      <span className="flex h-11 w-[19px] shrink-0 items-center justify-center">
        {recording ? (
          <Square size={16} strokeWidth={2.5} className="fill-current" />
        ) : (
          <Mic size={19} strokeWidth={2} />
        )}
      </span>
      {expanded && (
        <span className="truncate text-sm font-medium">{label}</span>
      )}
      {recording && (
        <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-logo-primary motion-safe:animate-ping" />
      )}
    </button>
  );
};
