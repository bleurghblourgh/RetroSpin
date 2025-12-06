import { cn } from "@/lib/utils";

interface SpinningDiskProps {
  isPlaying: boolean;
  trackTitle?: string;
  artist?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SpinningDisk({
  isPlaying,
  trackTitle,
  artist,
  size = "lg",
  className,
}: SpinningDiskProps) {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const labelSizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const spindleSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative rounded-full neon-glow-purple transition-all duration-500",
          sizeClasses[size],
          isPlaying ? "animate-spin-disk" : ""
        )}
        style={{
          animationPlayState: isPlaying ? "running" : "paused",
        }}
        data-testid="spinning-disk"
      >
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950"
        />

        <div className="absolute inset-1 rounded-full vinyl-grooves" />

        <div className="absolute inset-0 rounded-full disk-shine pointer-events-none" />

        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-neon-purple/80 to-neon-magenta/60 flex items-center justify-center overflow-hidden",
            labelSizeClasses[size]
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {size === "lg" && trackTitle && (
            <div className="relative z-10 text-center px-2">
              <p className="text-[8px] font-mono text-white/90 truncate max-w-16 leading-tight">
                {trackTitle}
              </p>
              {artist && (
                <p className="text-[6px] font-mono text-white/60 truncate max-w-14 leading-tight">
                  {artist}
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-inner",
            spindleSizeClasses[size]
          )}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30" />
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="px-2 py-0.5 bg-card rounded text-[10px] font-mono tracking-wider text-neon-cyan border border-neon-cyan/30">
          Hi-Fi
        </span>
        <span className="px-2 py-0.5 bg-card rounded text-[10px] font-mono tracking-wider text-neon-magenta border border-neon-magenta/30">
          STEREO
        </span>
        {isPlaying && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-card rounded text-[10px] font-mono tracking-wider text-red-500 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </span>
        )}
      </div>
    </div>
  );
}
