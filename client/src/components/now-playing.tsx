import { ChevronDown, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { SpinningDisk } from "@/components/spinning-disk";
import { Equalizer } from "@/components/equalizer";
import { useMusic } from "@/lib/music-store";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface NowPlayingCardProps {
  className?: string;
}

export function NowPlayingCard({ className }: NowPlayingCardProps) {
  const { state, togglePlay, nextTrack, prevTrack, dispatch } = useMusic();
  const { player } = state;
  const { currentTrack, isPlaying, shuffle, repeat } = player;

  if (!currentTrack) {
    return (
      <Card className={cn("p-6 flex flex-col items-center justify-center", className)}>
        <SpinningDisk isPlaying={false} size="lg" />
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">No track playing</p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a track from your library
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn("p-6 flex flex-col items-center retro-gradient", className)}
      data-testid="now-playing-card"
    >
      <SpinningDisk
        isPlaying={isPlaying}
        trackTitle={currentTrack.title}
        artist={currentTrack.artist}
        size="lg"
      />

      <div className="mt-12 w-full text-center">
        <h2 
          className="text-xl font-display font-bold truncate"
          data-testid="now-playing-title"
        >
          {currentTrack.title}
        </h2>
        <p 
          className="text-sm text-muted-foreground mt-1 truncate"
          data-testid="now-playing-artist"
        >
          {currentTrack.artist}
        </p>
        {currentTrack.album && (
          <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
            {currentTrack.album}
          </p>
        )}
      </div>

      <Equalizer isPlaying={isPlaying} bars={7} className="mt-6" />

      <div className="flex items-center gap-4 mt-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => dispatch({ type: "TOGGLE_SHUFFLE" })}
          className={cn("w-10 h-10", shuffle && "text-neon-cyan")}
          data-testid="now-playing-shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={prevTrack}
          className="w-10 h-10"
          data-testid="now-playing-prev"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/90 hover:to-neon-magenta/90 text-white"
          data-testid="now-playing-play"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-1" />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={nextTrack}
          className="w-10 h-10"
          data-testid="now-playing-next"
        >
          <SkipForward className="w-5 h-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => dispatch({ type: "CYCLE_REPEAT" })}
          className={cn("w-10 h-10", repeat !== "off" && "text-neon-magenta")}
          data-testid="now-playing-repeat"
        >
          {repeat === "one" ? (
            <Repeat1 className="w-5 h-5" />
          ) : (
            <Repeat className="w-5 h-5" />
          )}
        </Button>
      </div>
    </Card>
  );
}

interface MobileNowPlayingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNowPlaying({ isOpen, onClose }: MobileNowPlayingProps) {
  const { state, togglePlay, nextTrack, prevTrack, seekTo, setVolume, dispatch } = useMusic();
  const { player } = state;
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, shuffle, repeat } = player;

  if (!isOpen || !currentTrack) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-up"
      data-testid="mobile-now-playing"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="close-now-playing"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Now Playing
        </span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 retro-gradient">
        <SpinningDisk
          isPlaying={isPlaying}
          trackTitle={currentTrack.title}
          artist={currentTrack.artist}
          size="lg"
        />

        <div className="mt-12 w-full text-center">
          <h2 className="text-2xl font-display font-bold truncate px-4">
            {currentTrack.title}
          </h2>
          <p className="text-base text-muted-foreground mt-2 truncate px-4">
            {currentTrack.artist}
          </p>
        </div>

        <Equalizer isPlaying={isPlaying} bars={7} className="mt-8" />
      </div>

      <div className="p-6 border-t border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(v) => seekTo(v[0])}
            className="flex-1"
          />
          <span className="text-xs font-mono text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => dispatch({ type: "TOGGLE_SHUFFLE" })}
            className={cn("w-10 h-10", shuffle && "text-neon-cyan")}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={prevTrack}
            className="w-12 h-12"
          >
            <SkipBack className="w-6 h-6" />
          </Button>

          <Button
            size="icon"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta text-white"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={nextTrack}
            className="w-12 h-12"
          >
            <SkipForward className="w-6 h-6" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => dispatch({ type: "CYCLE_REPEAT" })}
            className={cn("w-10 h-10", repeat !== "off" && "text-neon-magenta")}
          >
            {repeat === "one" ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={() => dispatch({ type: "SET_MUTED", isMuted: !isMuted })}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={(v) => setVolume(v[0])}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}
