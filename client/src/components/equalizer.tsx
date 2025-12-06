import { cn } from "@/lib/utils";

interface EqualizerProps {
  isPlaying: boolean;
  bars?: number;
  className?: string;
}

export function Equalizer({ isPlaying, bars = 5, className }: EqualizerProps) {
  const barAnimations = [
    "animate-pulse-bar-1",
    "animate-pulse-bar-2",
    "animate-pulse-bar-3",
    "animate-pulse-bar-4",
    "animate-pulse-bar-5",
  ];

  const barColors = [
    "bg-neon-cyan",
    "bg-neon-purple",
    "bg-neon-magenta",
    "bg-neon-purple",
    "bg-neon-cyan",
  ];

  return (
    <div
      className={cn(
        "flex items-end justify-center gap-1 h-8",
        className
      )}
      data-testid="equalizer"
      aria-label="Audio visualizer"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 rounded-t-full transition-all duration-150",
            barColors[i % barColors.length],
            isPlaying ? barAnimations[i % barAnimations.length] : "h-1"
          )}
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
            height: isPlaying ? undefined : "4px",
          }}
        />
      ))}
    </div>
  );
}

export function MiniEqualizer({ isPlaying, className }: { isPlaying: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-end justify-center gap-0.5 h-4",
        className
      )}
      aria-label="Playing indicator"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "w-0.5 bg-neon-cyan rounded-t-full transition-all duration-150",
            isPlaying
              ? i === 0
                ? "animate-pulse-bar-1"
                : i === 1
                ? "animate-pulse-bar-2"
                : "animate-pulse-bar-3"
              : "h-0.5"
          )}
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
            height: isPlaying ? undefined : "2px",
          }}
        />
      ))}
    </div>
  );
}
