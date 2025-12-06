import { z } from "zod";

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  duration: z.number(),
  fileData: z.instanceof(Blob).optional(),
  addedAt: z.number(),
});

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  trackIds: z.array(z.string()),
  createdAt: z.number(),
});

export const librarySettingsSchema = z.object({
  volume: z.number().min(0).max(1),
  shuffle: z.boolean(),
  repeat: z.enum(["off", "one", "all"]),
  sortBy: z.enum(["title", "artist", "album", "addedAt"]),
  sortOrder: z.enum(["asc", "desc"]),
});

export type Track = z.infer<typeof trackSchema>;
export type Playlist = z.infer<typeof playlistSchema>;
export type LibrarySettings = z.infer<typeof librarySettingsSchema>;

export type InsertTrack = Omit<Track, "id" | "addedAt">;
export type InsertPlaylist = Omit<Playlist, "id" | "createdAt">;

export const insertTrackSchema = trackSchema.omit({ id: true, addedAt: true });
export const insertPlaylistSchema = playlistSchema.omit({ id: true, createdAt: true });

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  queue: Track[];
  queueIndex: number;
}

export const users = null;
export type InsertUser = { username: string; password: string };
export type User = { id: string; username: string; password: string };
