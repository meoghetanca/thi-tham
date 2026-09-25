import React, { useCallback, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useTranslation } from "react-i18next";
import { Mic, X } from "lucide-react";

const BARS = 11;

/**
 * The app's front door: one large control that starts dictating.
 *
 * The waveform is driven by the real `mic-level` event the recording overlay
 * uses, not a canned animation — flat bars genuinely mean silence, so the
 * indicator can be trusted to show whether the microphone is hearing anything.
 */
export const HomePanel: React.FC = () => {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [levels, setLevels] = useState<number[]>(Array(BARS).fill(0));
  const smoothed = useRef<number[]>(Array(BARS).fill(0));

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const state = await invoke<boolean>("is_recording");
        if (alive) setRecording(state);
      } catch {
        // The backend can go away during shutdown; a dropped poll is harmless.
      }
    };
    poll();
    const id = setInterval(poll, 300);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const unlisten = listen<number[]>("mic-level", (event) => {
      const next = smoothed.current.map(
        (prev, i) => prev * 0.6 + (event.payload[i] || 0) * 0.4,
      );
      smoothed.current = next;
      setLevels([...next]);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    if (!recording) {
      smoothed.current = Array(BARS).fill(0);
      setLevels(Array(BARS).fill(0));
    }
  }, [recording]);

  const toggle = useCallback(async () => {
    try {
      await invoke("toggle_dictation", { postProcess: false });
    } catch (error) {
      console.error("Failed to toggle dictation:", error);
    }
  }, []);

  const cancel = useCallback(async () => {
    try {
      await invoke("cancel_operation");
    } catch (error) {
      console.error("Failed to cancel:", error);
    }
  }, []);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-8 py-10">
      <button
        type="button"
        onClick={toggle}
        aria-label={recording ? t("mic.stop") : t("mic.start")}
        aria-pressed={recording}
        className={`relative grid h-36 w-36 shrink-0 cursor-pointer place-items-center rounded-full
          transition-transform duration-150 ease-out active:scale-95
          focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-logo-primary
          ${
            recording
              ? "bg-logo-primary text-logo-stroke shadow-[0_0_0_14px_color-mix(in_srgb,var(--color-logo-primary),transparent_86%)]"
              : "bg-logo-primary/15 text-accent-strong hover:bg-logo-primary/25"
          }`}
      >
        <Mic size={52} strokeWidth={1.7} />
        {recording && (
          <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-logo-primary motion-safe:animate-ping" />
        )}
      </button>

      {recording ? (
        <div className="flex items-center gap-4 rounded-full bg-mid-gray/15 py-2.5 pe-2.5 ps-4">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-logo-primary motion-safe:animate-pulse" />
          <div
            className="flex h-7 items-center gap-[3px]"
            role="img"
            aria-label={t("home.listening")}
          >
            {levels.map((level, i) => (
              <span
                key={i}
                className="w-[3.5px] rounded-full bg-accent-strong/80"
                style={{
                  height: `${Math.max(3, Math.min(28, level * 90))}px`,
                  transition: "height 70ms linear",
                }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={cancel}
            aria-label={t("home.cancel")}
            className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full
              bg-mid-gray/25 text-text/70 transition hover:bg-mid-gray/40 hover:text-text
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-primary"
          >
            <X size={15} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-[15px] font-medium">{t("home.ready")}</p>
          <p className="mt-1 text-sm text-text/55">{t("home.hint")}</p>
        </div>
      )}
    </div>
  );
};
