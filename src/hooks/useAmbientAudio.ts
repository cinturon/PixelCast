import { useEffect, useRef } from "react";
import { getAudioSrc } from "../utils/audio";

type UseAmbientAudioOptions = {
  enabled: boolean;
  volume: number;
  audioFile: string | null;
};

/**
 * Loops a single ambient track from `public/audio/` when enabled.
 * Pauses when disabled or when no file is selected.
 */
export function useAmbientAudio({
  enabled,
  volume,
  audioFile,
}: UseAmbientAudioOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedFileRef = useRef<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, volume));

    if (!enabled || !audioFile) {
      audio.pause();
      return;
    }

    const src = getAudioSrc(audioFile);
    if (loadedFileRef.current !== audioFile) {
      audio.pause();
      audio.src = src;
      loadedFileRef.current = audioFile;
    }

    void audio.play().catch(() => {
      /* Autoplay may be blocked until user interacts; ignore. */
    });

    return () => {
      audio.pause();
    };
  }, [enabled, volume, audioFile]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      loadedFileRef.current = null;
    };
  }, []);
}
