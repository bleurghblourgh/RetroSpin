import { useState } from "react";
import { Plus, Music, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusic } from "@/lib/music-store";
import { cn } from "@/lib/utils";
import type { Playlist } from "@shared/schema";

interface PlaylistCardProps {
  playlist: Playlist;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

function PlaylistCard({ 
  playlist, 
  isSelected, 
  onSelect, 
  onRename, 
  onDelete 
}: PlaylistCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSave = () => {
    if (editName.trim()) {
      onRename(editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(playlist.name);
    setIsEditing(false);
  };

  return (
    <>
      <Card
        className={cn(
          "p-4 cursor-pointer transition-all hover-elevate",
          isSelected && "ring-2 ring-neon-purple bg-neon-purple/5"
        )}
        onClick={() => !isEditing && onSelect()}
        data-testid={`playlist-card-${playlist.id}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-neon-purple/30 to-neon-magenta/30 flex items-center justify-center flex-shrink-0">
              <Music className="w-6 h-6 text-neon-purple" />
            </div>
            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                      if (e.key === "Escape") handleCancel();
                    }}
                    data-testid={`playlist-name-input-${playlist.id}`}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7"
                    onClick={handleSave}
                    data-testid={`save-playlist-name-${playlist.id}`}
                  >
                    <Check className="w-4 h-4 text-green-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-7 h-7"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <p className="font-semibold truncate" data-testid={`playlist-name-${playlist.id}`}>
                    {playlist.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {playlist.trackIds.length} track{playlist.trackIds.length !== 1 ? "s" : ""}
                  </p>
                </>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8"
                onClick={() => setIsEditing(true)}
                data-testid={`edit-playlist-${playlist.id}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
                data-testid={`delete-playlist-${playlist.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{playlist.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid={`confirm-delete-playlist-${playlist.id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface PlaylistManagerProps {
  onCreatePlaylist: (name: string) => void;
  onRenamePlaylist: (id: string, name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onSelectPlaylist: (id: string | null) => void;
}

export function PlaylistManager({
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onSelectPlaylist,
}: PlaylistManagerProps) {
  const { state } = useMusic();
  const { playlists, selectedPlaylistId } = state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="playlist-manager">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold tracking-wide">Playlists</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" data-testid="create-playlist-button">
              <Plus className="w-4 h-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new playlist</DialogTitle>
              <DialogDescription>
                Give your playlist a name to get started.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              data-testid="new-playlist-name-input"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={!newPlaylistName.trim()}
                data-testid="confirm-create-playlist"
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No playlists yet</p>
          <p className="text-sm mt-1">Create one to organize your music</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-3 pr-4">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                isSelected={selectedPlaylistId === playlist.id}
                onSelect={() => onSelectPlaylist(playlist.id)}
                onRename={(name) => onRenamePlaylist(playlist.id, name)}
                onDelete={() => onDeletePlaylist(playlist.id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
