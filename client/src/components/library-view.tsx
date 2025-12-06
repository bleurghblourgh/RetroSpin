import { useMemo, useState, useCallback } from "react";
import { Play, Pause, MoreHorizontal, Clock, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusic } from "@/lib/music-store";
import { MiniEqualizer } from "@/components/equalizer";
import { cn } from "@/lib/utils";
import type { Track, Playlist } from "@shared/schema";

function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface TrackRowProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
  onRemove: () => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string) => void;
}

function TrackRow({ 
  track, 
  index, 
  isPlaying, 
  isCurrent, 
  onPlay, 
  onRemove,
  playlists,
  onAddToPlaylist
}: TrackRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-4 h-14 rounded-md hover-elevate cursor-pointer transition-colors",
        isCurrent && "bg-neon-purple/10"
      )}
      onClick={onPlay}
      data-testid={`track-row-${track.id}`}
    >
      <div className="w-8 flex items-center justify-center">
        {isCurrent && isPlaying ? (
          <MiniEqualizer isPlaying className="text-neon-cyan" />
        ) : (
          <span className="text-sm text-muted-foreground group-hover:invisible">
            {index + 1}
          </span>
        )}
        <Play
          className={cn(
            "w-4 h-4 text-foreground absolute invisible group-hover:visible",
            isCurrent && isPlaying && "hidden"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isCurrent && "text-neon-cyan"
          )}
          data-testid={`track-title-${track.id}`}
        >
          {track.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist}
        </p>
      </div>

      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{track.album}</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">
          {formatDuration(track.duration)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
              data-testid={`track-menu-${track.id}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {playlists.length > 0 && (
              <>
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Add to playlist
                </DropdownMenuItem>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToPlaylist(playlist.id);
                    }}
                    data-testid={`add-to-playlist-${playlist.id}`}
                  >
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-destructive focus:text-destructive"
              data-testid={`remove-track-${track.id}`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove from library
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface LibraryViewProps {
  onRemoveTrack: (trackId: string) => void;
  onAddToPlaylist: (trackId: string, playlistId: string) => void;
}

export function LibraryView({ onRemoveTrack, onAddToPlaylist }: LibraryViewProps) {
  const { state, playTrack } = useMusic();
  const { tracks, playlists, searchQuery, sortBy, sortOrder, player } = state;

  const filteredAndSortedTracks = useMemo(() => {
    let result = [...tracks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "artist":
          comparison = a.artist.localeCompare(b.artist);
          break;
        case "album":
          comparison = a.album.localeCompare(b.album);
          break;
        case "addedAt":
          comparison = a.addedAt - b.addedAt;
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tracks, searchQuery, sortBy, sortOrder]);

  const handlePlayTrack = (track: Track) => {
    playTrack(track, filteredAndSortedTracks);
  };

  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full" data-testid="library-view">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_auto] gap-4 px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-32">
          {filteredAndSortedTracks.map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              isPlaying={player.isPlaying}
              isCurrent={player.currentTrack?.id === track.id}
              onPlay={() => handlePlayTrack(track)}
              onRemove={() => onRemoveTrack(track.id)}
              playlists={playlists}
              onAddToPlaylist={(playlistId) => onAddToPlaylist(track.id, playlistId)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface PlaylistViewProps {
  playlist: Playlist;
  onRemoveFromPlaylist: (trackId: string) => void;
  onReorderPlaylist: (fromIndex: number, toIndex: number) => void;
}

export function PlaylistView({ playlist, onRemoveFromPlaylist, onReorderPlaylist }: PlaylistViewProps) {
  const { state, playTrack } = useMusic();
  const { tracks, player } = state;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const playlistTracks = useMemo(() => {
    return playlist.trackIds
      .map((id) => tracks.find((t) => t.id === id))
      .filter((t): t is Track => t !== undefined);
  }, [playlist.trackIds, tracks]);

  const handlePlayTrack = (track: Track) => {
    playTrack(track, playlistTracks);
  };

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTargetIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = draggedIndex;
    if (fromIndex !== null && fromIndex !== toIndex) {
      onReorderPlaylist(fromIndex, toIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [draggedIndex, onReorderPlaylist]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, []);

  if (playlistTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">This playlist is empty</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add tracks from your library
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="playlist-view">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="hidden md:grid grid-cols-[2rem_2rem_1fr_1fr_auto] gap-4 px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">
          <div></div>
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-32">
          {playlistTracks.map((track, index) => (
            <div
              key={track.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "group flex items-center gap-4 px-4 h-14 rounded-md hover-elevate cursor-pointer transition-all",
                player.currentTrack?.id === track.id && "bg-neon-purple/10",
                draggedIndex === index && "opacity-50",
                dropTargetIndex === index && draggedIndex !== index && "border-t-2 border-neon-cyan"
              )}
              onClick={() => handlePlayTrack(track)}
              data-testid={`playlist-track-row-${track.id}`}
            >
              <div 
                className="w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="w-8 flex items-center justify-center">
                {player.currentTrack?.id === track.id && player.isPlaying ? (
                  <MiniEqualizer isPlaying className="text-neon-cyan" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    player.currentTrack?.id === track.id && "text-neon-cyan"
                  )}
                >
                  {track.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </p>
              </div>

              <div className="hidden md:block flex-1 min-w-0">
                <p className="text-sm text-muted-foreground truncate">{track.album}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDuration(track.duration)}
                </span>

                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromPlaylist(track.id);
                  }}
                  data-testid={`remove-from-playlist-${track.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
