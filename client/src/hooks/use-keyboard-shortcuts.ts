import { useEffect, useCallback } from "react";
import { useMusic } from "@/lib/music-store";

export function useKeyboardShortcuts() {
  const { state, togglePlay, seekTo, setVolume, nextTrack, prevTrack, dispatch } = useMusic();
  const { player } = state;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInputFocused) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (player.currentTrack) {
            togglePlay();
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          if (player.currentTrack) {
            const newTime = Math.max(0, player.currentTime - 5);
            seekTo(newTime);
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          if (player.currentTrack) {
            const newTime = Math.min(player.duration, player.currentTime + 5);
            seekTo(newTime);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          {
            const newVolume = Math.min(1, player.volume + 0.05);
            setVolume(newVolume);
            if (player.isMuted) {
              dispatch({ type: "SET_MUTED", isMuted: false });
            }
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          {
            const newVolume = Math.max(0, player.volume - 0.05);
            setVolume(newVolume);
          }
          break;

        case "KeyM":
          e.preventDefault();
          dispatch({ type: "SET_MUTED", isMuted: !player.isMuted });
          break;

        case "KeyN":
          e.preventDefault();
          if (player.queue.length > 0) {
            nextTrack();
          }
          break;

        case "KeyP":
          e.preventDefault();
          if (player.queue.length > 0) {
            prevTrack();
          }
          break;

        case "KeyS":
          e.preventDefault();
          dispatch({ type: "TOGGLE_SHUFFLE" });
          break;

        case "KeyR":
          e.preventDefault();
          dispatch({ type: "CYCLE_REPEAT" });
          break;
      }
    },
    [player, togglePlay, seekTo, setVolume, nextTrack, prevTrack, dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
