import { openDB, type IDBPDatabase } from "idb";
import type { Track, Playlist, LibrarySettings } from "@shared/schema";

const DB_NAME = "retrospin-db";
const DB_VERSION = 1;

interface RetroSpinDB {
  tracks: {
    key: string;
    value: Track;
    indexes: { "by-addedAt": number };
  };
  playlists: {
    key: string;
    value: Playlist;
    indexes: { "by-createdAt": number };
  };
  settings: {
    key: string;
    value: LibrarySettings;
  };
}

let dbPromise: Promise<IDBPDatabase<RetroSpinDB>> | null = null;

function getDB(): Promise<IDBPDatabase<RetroSpinDB>> {
  if (!dbPromise) {
    dbPromise = openDB<RetroSpinDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("tracks")) {
          const trackStore = db.createObjectStore("tracks", { keyPath: "id" });
          trackStore.createIndex("by-addedAt", "addedAt");
        }

        if (!db.objectStoreNames.contains("playlists")) {
          const playlistStore = db.createObjectStore("playlists", { keyPath: "id" });
          playlistStore.createIndex("by-createdAt", "createdAt");
        }

        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDB();
  return db.getAllFromIndex("tracks", "by-addedAt");
}

export async function getTrack(id: string): Promise<Track | undefined> {
  const db = await getDB();
  return db.get("tracks", id);
}

export async function saveTrack(track: Track): Promise<void> {
  const db = await getDB();
  await db.put("tracks", track);
}

export async function saveTracks(tracks: Track[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("tracks", "readwrite");
  await Promise.all([
    ...tracks.map((track) => tx.store.put(track)),
    tx.done,
  ]);
}

export async function deleteTrack(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("tracks", id);
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDB();
  return db.getAllFromIndex("playlists", "by-createdAt");
}

export async function getPlaylist(id: string): Promise<Playlist | undefined> {
  const db = await getDB();
  return db.get("playlists", id);
}

export async function savePlaylist(playlist: Playlist): Promise<void> {
  const db = await getDB();
  await db.put("playlists", playlist);
}

export async function deletePlaylist(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("playlists", id);
}

export async function getSettings(): Promise<LibrarySettings | undefined> {
  const db = await getDB();
  return db.get("settings", "main");
}

export async function saveSettings(settings: LibrarySettings): Promise<void> {
  const db = await getDB();
  await db.put("settings", settings, "main");
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx1 = db.transaction("tracks", "readwrite");
  await tx1.store.clear();
  await tx1.done;

  const tx2 = db.transaction("playlists", "readwrite");
  await tx2.store.clear();
  await tx2.done;
}
