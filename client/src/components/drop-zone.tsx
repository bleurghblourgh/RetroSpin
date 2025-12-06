import { useState, useCallback, useRef } from "react";
import { Upload, Music, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
  className?: string;
}

export function DropZone({ onFilesSelected, isLoading, className }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files).filter(
          (file) => file.type === "audio/mpeg" || file.name.endsWith(".mp3")
        );
        if (files.length > 0) {
          onFilesSelected(files);
        }
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files).filter(
          (file) => file.type === "audio/mpeg" || file.name.endsWith(".mp3")
        );
        if (files.length > 0) {
          onFilesSelected(files);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onFilesSelected]
  );

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center min-h-96 p-8 rounded-lg border-2 border-dashed transition-all duration-300",
        isDragActive
          ? "border-neon-cyan bg-neon-cyan/5 scale-[1.02] neon-glow-cyan"
          : "border-muted-foreground/30 hover:border-neon-purple/50 hover:bg-neon-purple/5",
        isLoading && "opacity-50 pointer-events-none",
        className
      )}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      data-testid="drop-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,.mp3"
        multiple
        onChange={handleFileInput}
        className="hidden"
        data-testid="file-input"
      />

      <div className="flex flex-col items-center gap-6 text-center">
        <div
          className={cn(
            "relative w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 transition-transform duration-300",
            isDragActive && "scale-110 animate-pulse"
          )}
        >
          {isDragActive ? (
            <Disc className="w-12 h-12 text-neon-cyan animate-spin-disk-slow" />
          ) : (
            <Music className="w-12 h-12 text-neon-purple" />
          )}
          <div className="absolute inset-0 rounded-full neon-glow-purple opacity-50" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-display font-bold tracking-wide">
            {isDragActive ? (
              <span className="text-neon-cyan neon-text-cyan">Drop your tracks</span>
            ) : (
              <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                Drop your MP3s here
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Drag and drop MP3 files to add them to your library, or click below to browse
          </p>
        </div>

        <Button
          onClick={handleBrowseClick}
          size="lg"
          className="px-8 py-6 text-base font-display tracking-wide bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-purple/90 hover:to-neon-magenta/90 text-white border-0"
          disabled={isLoading}
          data-testid="browse-files-button"
        >
          <Upload className="w-5 h-5 mr-2" />
          {isLoading ? "Processing..." : "Browse Files"}
        </Button>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-muted font-mono">.mp3</span>
          <span>Multiple files supported</span>
        </div>
      </div>

      {isDragActive && (
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10" />
      )}
    </div>
  );
}
