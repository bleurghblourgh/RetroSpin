import { useState, useEffect, useCallback } from "react";
import { useMusic } from "@/lib/music-store";
import { DropZone } from "@/components/drop-zone";
import { LibraryView, PlaylistView } from "@/components/library-view";
import { SearchBar } from "@/components/search-bar";
import { PlaylistManager } from "@/components/playlist-manager";
import { NowPlayingCard } from "@/components/now-playing";
import { PlayerControls, MobilePlayerControls } from "@/components/player-controls";
import { MobileNowPlaying } from "@/components/now-playing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { processFiles } from "@/lib/metadata";
import { 
  getAllTracks, 
  saveTracks, 
  deleteTrack as dbDeleteTrack,
  getAllPlaylists,
  savePlaylist,
  deletePlaylist as dbDeletePlaylist
} from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { ChevronLeft, Upload } from "lucide-react";
import type { Playlist } from "@shared/schema";

export default function Home() {
  const { state, dispatch } = useMusic();
  const { tracks, playlists, currentView, selectedPlaylistId, player } = state;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileNowPlayingOpen, setIsMobileNowPlayingOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [savedTracks, savedPlaylists] = await Promise.all([
          getAllTracks(),
          getAllPlaylists(),
        ]);
        dispatch({ type: "SET_TRACKS", tracks: savedTracks });
        dispatch({ type: "SET_PLAYLISTS", playlists: savedPlaylists });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsInitialized(true);
      }
    }
    loadData();
  }, [dispatch]);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsLoading(true);
    try {
      const newTracks = await processFiles(files);
      if (newTracks.length > 0) {
        await saveTracks(newTracks);
        dispatch({ type: "ADD_TRACKS", tracks: newTracks });
        dispatch({ type: "SET_VIEW", view: "library" });
        toast({
          title: "Tracks added",
          description: `Added ${newTracks.length} track${newTracks.length > 1 ? "s" : ""} to your library`,
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        title: "Error",
        description: "Failed to process some files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  const handleRemoveTrack = useCallback(async (trackId: string) => {
    try {
      await dbDeleteTrack(trackId);
      dispatch({ type: "REMOVE_TRACK", trackId });
      
      const updatedPlaylists = playlists.map((p) => ({
        ...p,
        trackIds: p.trackIds.filter((id) => id !== trackId),
      }));
      
      for (const playlist of updatedPlaylists) {
        if (playlist.trackIds.length !== playlists.find((p) => p.id === playlist.id)?.trackIds.length) {
          await savePlaylist(playlist);
          dispatch({ type: "UPDATE_PLAYLIST", playlist });
        }
      }
      
      toast({
        title: "Track removed",
        description: "Track has been removed from your library",
      });
    } catch (error) {
      console.error("Error removing track:", error);
      toast({
        title: "Error",
        description: "Failed to remove track",
        variant: "destructive",
      });
    }
  }, [dispatch, playlists, toast]);

  const handleCreatePlaylist = useCallback(async (name: string) => {
    try {
      const playlist: Playlist = {
        id: uuidv4(),
        name,
        trackIds: [],
        createdAt: Date.now(),
      };
      await savePlaylist(playlist);
      dispatch({ type: "ADD_PLAYLIST", playlist });
      toast({
        title: "Playlist created",
        description: `"${name}" has been created`,
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, toast]);

  const handleRenamePlaylist = useCallback(async (id: string, name: string) => {
    try {
      const playlist = playlists.find((p) => p.id === id);
      if (playlist) {
        const updated = { ...playlist, name };
        await savePlaylist(updated);
        dispatch({ type: "UPDATE_PLAYLIST", playlist: updated });
        toast({
          title: "Playlist renamed",
          description: `Playlist renamed to "${name}"`,
        });
      }
    } catch (error) {
      console.error("Error renaming playlist:", error);
      toast({
        title: "Error",
        description: "Failed to rename playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, playlists, toast]);

  const handleDeletePlaylist = useCallback(async (id: string) => {
    try {
      await dbDeletePlaylist(id);
      dispatch({ type: "REMOVE_PLAYLIST", playlistId: id });
      if (selectedPlaylistId === id) {
        dispatch({ type: "SELECT_PLAYLIST", playlistId: null });
        dispatch({ type: "SET_VIEW", view: "playlist" });
      }
      toast({
        title: "Playlist deleted",
        description: "Playlist has been deleted",
      });
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, selectedPlaylistId, toast]);

  const handleSelectPlaylist = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_PLAYLIST", playlistId: id });
    if (id) {
      dispatch({ type: "SET_VIEW", view: "playlist" });
    }
  }, [dispatch]);

  const handleAddToPlaylist = useCallback(async (trackId: string, playlistId: string) => {
    try {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.trackIds.includes(trackId)) {
        const updated = {
          ...playlist,
          trackIds: [...playlist.trackIds, trackId],
        };
        await savePlaylist(updated);
        dispatch({ type: "UPDATE_PLAYLIST", playlist: updated });
        toast({
          title: "Track added",
          description: `Track added to "${playlist.name}"`,
        });
      }
    } catch (error) {
      console.error("Error adding to playlist:", error);
      toast({
        title: "Error",
        description: "Failed to add track to playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, playlists, toast]);

  const handleRemoveFromPlaylist = useCallback(async (trackId: string) => {
    if (!selectedPlaylistId) return;
    try {
      const playlist = playlists.find((p) => p.id === selectedPlaylistId);
      if (playlist) {
        const updated = {
          ...playlist,
          trackIds: playlist.trackIds.filter((id) => id !== trackId),
        };
        await savePlaylist(updated);
        dispatch({ type: "UPDATE_PLAYLIST", playlist: updated });
        toast({
          title: "Track removed",
          description: "Track removed from playlist",
        });
      }
    } catch (error) {
      console.error("Error removing from playlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove track from playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, playlists, selectedPlaylistId, toast]);

  const handleReorderPlaylist = useCallback(async (fromIndex: number, toIndex: number) => {
    if (!selectedPlaylistId) return;
    try {
      const playlist = playlists.find((p) => p.id === selectedPlaylistId);
      if (playlist) {
        const newTrackIds = [...playlist.trackIds];
        const [movedTrack] = newTrackIds.splice(fromIndex, 1);
        newTrackIds.splice(toIndex, 0, movedTrack);
        
        const updated = {
          ...playlist,
          trackIds: newTrackIds,
        };
        await savePlaylist(updated);
        dispatch({ type: "UPDATE_PLAYLIST", playlist: updated });
      }
    } catch (error) {
      console.error("Error reordering playlist:", error);
      toast({
        title: "Error",
        description: "Failed to reorder playlist",
        variant: "destructive",
      });
    }
  }, [dispatch, playlists, selectedPlaylistId, toast]);

  const selectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan animate-spin-disk mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 lg:p-6 pb-28 lg:pb-32">
      <div className="flex-1 flex flex-col min-h-0">
        {currentView === "upload" || (currentView === "library" && tracks.length === 0) ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <DropZone
              onFilesSelected={handleFilesSelected}
              isLoading={isLoading}
              className="w-full max-w-2xl"
            />
            {tracks.length > 0 && (
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => dispatch({ type: "SET_VIEW", view: "library" })}
                data-testid="view-library-button"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
            )}
          </div>
        ) : currentView === "library" ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h1 className="text-2xl font-display font-bold tracking-wide">
                Your Library
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <SearchBar />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch({ type: "SET_VIEW", view: "upload" })}
                  data-testid="add-tracks-button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Tracks
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-card rounded-lg border border-card-border">
              <LibraryView
                onRemoveTrack={handleRemoveTrack}
                onAddToPlaylist={handleAddToPlaylist}
              />
            </div>
          </div>
        ) : currentView === "playlist" ? (
          <div className="flex-1 flex flex-col min-h-0">
            {selectedPlaylist ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectPlaylist(null)}
                    data-testid="back-to-playlists"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Playlists
                  </Button>
                  <h1 className="text-2xl font-display font-bold tracking-wide truncate">
                    {selectedPlaylist.name}
                  </h1>
                </div>
                <div className="flex-1 min-h-0 bg-card rounded-lg border border-card-border">
                  <PlaylistView
                    playlist={selectedPlaylist}
                    onRemoveFromPlaylist={handleRemoveFromPlaylist}
                    onReorderPlaylist={handleReorderPlaylist}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1">
                <PlaylistManager
                  onCreatePlaylist={handleCreatePlaylist}
                  onRenamePlaylist={handleRenamePlaylist}
                  onDeletePlaylist={handleDeletePlaylist}
                  onSelectPlaylist={handleSelectPlaylist}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-6">
          <NowPlayingCard className="w-full" />
        </div>
      </div>

      <div className="hidden md:block">
        <PlayerControls />
      </div>

      <div 
        className="md:hidden" 
        onClick={() => player.currentTrack && setIsMobileNowPlayingOpen(true)}
      >
        <MobilePlayerControls />
      </div>

      <MobileNowPlaying
        isOpen={isMobileNowPlayingOpen}
        onClose={() => setIsMobileNowPlayingOpen(false)}
      />
    </div>
  );
}
