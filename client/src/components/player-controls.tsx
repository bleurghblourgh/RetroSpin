import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Repeat1
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMusic } from "@/lib/music-store";
import { MiniEqualizer } from "@/components/equalizer";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PlayerControls() {
  const { state, togglePlay, seekTo, setVolume, nextTrack, prevTrack, dispatch } = useMusic();
  const { player } = state;
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, shuffle, repeat } = player;

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      dispatch({ type: "SET_MUTED", isMuted: false });
    }
  };

  const toggleMute = () => {
    dispatch({ type: "SET_MUTED", isMuted: !isMuted });
  };

  const toggleShuffle = () => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
  };

  const cycleRepeat = () => {
    dispatch({ type: "CYCLE_REPEAT" });
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur border-t border-border flex items-center justify-center z-50">
        <p className="text-muted-foreground text-sm font-mono">No track selected</p>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-24 bg-card/95 backdrop-blur border-t border-border z-50"
      data-testid="player-controls"
    >
      <div className="h-full max-w-screen-2xl mx-auto px-4 grid grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-md bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center flex-shrink-0">
            {isPlaying ? (
              <MiniEqualizer isPlaying={isPlaying} />
            ) : (
              <div className="w-6 h-6 rounded-full bg-neon-purple/50" />
            )}
          </div>
          <div className="min-w-0">
            <p 
              className="text-sm font-semibold truncate text-foreground"
              data-testid="current-track-title"
            >
              {currentTrack.title}
            </p>
            <p 
              className="text-xs text-muted-foreground truncate"
              data-testid="current-track-artist"
            >
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleShuffle}
                  className={cn(
                    "w-8 h-8",
                    shuffle && "text-neon-cyan"
                  )}
                  data-testid="shuffle-button"
                  aria-label="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Shuffle {shuffle ? "On" : "Off"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={prevTrack}
                  data-testid="prev-button"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>

            <Button
              size="icon"
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/90 hover:to-neon-magenta/90 text-white"
              data-testid="play-pause-button"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={nextTrack}
                  data-testid="next-button"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cycleRepeat}
                  className={cn(
                    "w-8 h-8",
                    repeat !== "off" && "text-neon-magenta"
                  )}
                  data-testid="repeat-button"
                  aria-label={`Repeat: ${repeat}`}
                >
                  {repeat === "one" ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Repeat: {repeat === "off" ? "Off" : repeat === "one" ? "One" : "All"}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
              data-testid="seek-slider"
              aria-label="Seek"
            />
            <span className="text-xs text-muted-foreground font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                data-testid="mute-button"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
            data-testid="volume-slider"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

export function MobilePlayerControls() {
  const { state, togglePlay } = useMusic();
  const { player } = state;
  const { currentTrack, isPlaying } = player;

  if (!currentTrack) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur border-t border-border z-50 md:hidden"
      data-testid="mobile-player-controls"
    >
      <div className="h-full px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center flex-shrink-0">
            {isPlaying ? (
              <MiniEqualizer isPlaying={isPlaying} />
            ) : (
              <div className="w-4 h-4 rounded-full bg-neon-purple/50" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <Button
          size="icon"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple to-neon-magenta"
          data-testid="mobile-play-pause-button"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
}
