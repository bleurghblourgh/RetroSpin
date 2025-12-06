import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from "react";
import type { Track, Playlist, PlayerState } from "@shared/schema";

interface MusicState {
  tracks: Track[];
  playlists: Playlist[];
  currentView: "library" | "playlist" | "upload";
  selectedPlaylistId: string | null;
  searchQuery: string;
  sortBy: "title" | "artist" | "album" | "addedAt";
  sortOrder: "asc" | "desc";
  player: PlayerState;
}

type MusicAction =
  | { type: "SET_TRACKS"; tracks: Track[] }
  | { type: "ADD_TRACKS"; tracks: Track[] }
  | { type: "REMOVE_TRACK"; trackId: string }
  | { type: "SET_PLAYLISTS"; playlists: Playlist[] }
  | { type: "ADD_PLAYLIST"; playlist: Playlist }
  | { type: "UPDATE_PLAYLIST"; playlist: Playlist }
  | { type: "REMOVE_PLAYLIST"; playlistId: string }
  | { type: "SET_VIEW"; view: "library" | "playlist" | "upload" }
  | { type: "SELECT_PLAYLIST"; playlistId: string | null }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_SORT"; sortBy: MusicState["sortBy"]; sortOrder: MusicState["sortOrder"] }
  | { type: "SET_CURRENT_TRACK"; track: Track | null }
  | { type: "SET_PLAYING"; isPlaying: boolean }
  | { type: "SET_CURRENT_TIME"; time: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "SET_MUTED"; isMuted: boolean }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "CYCLE_REPEAT" }
  | { type: "SET_QUEUE"; queue: Track[]; index: number }
  | { type: "NEXT_TRACK" }
  | { type: "PREV_TRACK" };

const initialState: MusicState = {
  tracks: [],
  playlists: [],
  currentView: "library",
  selectedPlaylistId: null,
  searchQuery: "",
  sortBy: "addedAt",
  sortOrder: "desc",
  player: {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    shuffle: false,
    repeat: "off",
    queue: [],
    queueIndex: 0,
  },
};

function musicReducer(state: MusicState, action: MusicAction): MusicState {
  switch (action.type) {
    case "SET_TRACKS":
      return { ...state, tracks: action.tracks };
    case "ADD_TRACKS":
      return { ...state, tracks: [...state.tracks, ...action.tracks] };
    case "REMOVE_TRACK":
      return { ...state, tracks: state.tracks.filter((t) => t.id !== action.trackId) };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.playlists };
    case "ADD_PLAYLIST":
      return { ...state, playlists: [...state.playlists, action.playlist] };
    case "UPDATE_PLAYLIST":
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.playlist.id ? action.playlist : p
        ),
      };
    case "REMOVE_PLAYLIST":
      return { ...state, playlists: state.playlists.filter((p) => p.id !== action.playlistId) };
    case "SET_VIEW":
      return { ...state, currentView: action.view };
    case "SELECT_PLAYLIST":
      return { ...state, selectedPlaylistId: action.playlistId };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.query };
    case "SET_SORT":
      return { ...state, sortBy: action.sortBy, sortOrder: action.sortOrder };
    case "SET_CURRENT_TRACK":
      return { ...state, player: { ...state.player, currentTrack: action.track } };
    case "SET_PLAYING":
      return { ...state, player: { ...state.player, isPlaying: action.isPlaying } };
    case "SET_CURRENT_TIME":
      return { ...state, player: { ...state.player, currentTime: action.time } };
    case "SET_DURATION":
      return { ...state, player: { ...state.player, duration: action.duration } };
    case "SET_VOLUME":
      return { ...state, player: { ...state.player, volume: action.volume } };
    case "SET_MUTED":
      return { ...state, player: { ...state.player, isMuted: action.isMuted } };
    case "TOGGLE_SHUFFLE":
      return { ...state, player: { ...state.player, shuffle: !state.player.shuffle } };
    case "CYCLE_REPEAT": {
      const next = state.player.repeat === "off" ? "all" : state.player.repeat === "all" ? "one" : "off";
      return { ...state, player: { ...state.player, repeat: next } };
    }
    case "SET_QUEUE":
      return { ...state, player: { ...state.player, queue: action.queue, queueIndex: action.index } };
    case "NEXT_TRACK": {
      const { queue, queueIndex, shuffle, repeat } = state.player;
      if (queue.length === 0) return state;
      let nextIndex = queueIndex + 1;
      if (shuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else if (nextIndex >= queue.length) {
        nextIndex = repeat === "all" ? 0 : queueIndex;
      }
      return {
        ...state,
        player: {
          ...state.player,
          queueIndex: nextIndex,
          currentTrack: queue[nextIndex] || null,
          currentTime: 0,
        },
      };
    }
    case "PREV_TRACK": {
      const { queue, queueIndex } = state.player;
      if (queue.length === 0) return state;
      const prevIndex = queueIndex <= 0 ? queue.length - 1 : queueIndex - 1;
      return {
        ...state,
        player: {
          ...state.player,
          queueIndex: prevIndex,
          currentTrack: queue[prevIndex] || null,
          currentTime: 0,
        },
      };
    }
    default:
      return state;
  }
}

interface MusicContextType {
  state: MusicState;
  dispatch: React.Dispatch<MusicAction>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const playTrack = useCallback((track: Track, queue?: Track[]) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (track.fileData) {
      const url = URL.createObjectURL(track.fileData);
      objectUrlRef.current = url;
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(console.error);
      }
    }

    dispatch({ type: "SET_CURRENT_TRACK", track });
    dispatch({ type: "SET_PLAYING", isPlaying: true });
    
    if (queue) {
      const index = queue.findIndex((t) => t.id === track.id);
      dispatch({ type: "SET_QUEUE", queue, index: index >= 0 ? index : 0 });
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (state.player.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      dispatch({ type: "SET_PLAYING", isPlaying: !state.player.isPlaying });
    }
  }, [state.player.isPlaying]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: "SET_CURRENT_TIME", time });
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    dispatch({ type: "SET_VOLUME", volume });
  }, []);

  const nextTrack = useCallback(() => {
    dispatch({ type: "NEXT_TRACK" });
  }, []);

  const prevTrack = useCallback(() => {
    if (state.player.currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      dispatch({ type: "SET_CURRENT_TIME", time: 0 });
    } else {
      dispatch({ type: "PREV_TRACK" });
    }
  }, [state.player.currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: "SET_CURRENT_TIME", time: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: "SET_DURATION", duration: audio.duration || 0 });
    };

    const handleEnded = () => {
      if (state.player.repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        nextTrack();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [state.player.repeat, nextTrack]);

  useEffect(() => {
    const { currentTrack, queue, queueIndex } = state.player;
    if (currentTrack && queue.length > 0 && queue[queueIndex]?.id !== currentTrack.id) {
      const track = queue[queueIndex];
      if (track?.fileData) {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        const url = URL.createObjectURL(track.fileData);
        objectUrlRef.current = url;
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play().catch(console.error);
        }
        dispatch({ type: "SET_CURRENT_TRACK", track });
      }
    }
  }, [state.player.queueIndex, state.player.queue]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.player.volume;
      audioRef.current.muted = state.player.isMuted;
    }
  }, [state.player.volume, state.player.isMuted]);

  return (
    <MusicContext.Provider
      value={{
        state,
        dispatch,
        audioRef,
        playTrack,
        togglePlay,
        seekTo,
        setVolume,
        nextTrack,
        prevTrack,
      }}
    >
      <audio ref={audioRef} preload="metadata" />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
