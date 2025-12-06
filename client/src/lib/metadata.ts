import * as mm from "music-metadata-browser";
import { v4 as uuidv4 } from "uuid";
import type { Track } from "@shared/schema";

export async function extractMetadata(file: File): Promise<Track> {
  try {
    const metadata = await mm.parseBlob(file);
    const { common, format } = metadata;

    return {
      id: uuidv4(),
      title: common.title || file.name.replace(/\.mp3$/i, ""),
      artist: common.artist || "Unknown Artist",
      album: common.album || "Unknown Album",
      duration: format.duration || 0,
      fileData: file,
      addedAt: Date.now(),
    };
  } catch (error) {
    console.error("Error extracting metadata:", error);
    return {
      id: uuidv4(),
      title: file.name.replace(/\.mp3$/i, ""),
      artist: "Unknown Artist",
      album: "Unknown Album",
      duration: 0,
      fileData: file,
      addedAt: Date.now(),
    };
  }
}

export async function processFiles(files: File[]): Promise<Track[]> {
  const tracks: Track[] = [];

  for (const file of files) {
    if (file.type === "audio/mpeg" || file.name.endsWith(".mp3")) {
      const track = await extractMetadata(file);
      tracks.push(track);
    }
  }

  return tracks;
}
