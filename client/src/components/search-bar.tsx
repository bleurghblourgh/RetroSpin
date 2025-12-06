import { Search, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useMusic } from "@/lib/music-store";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const { state, dispatch } = useMusic();
  const { searchQuery, sortBy, sortOrder } = state;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_SEARCH", query: e.target.value });
  };

  const clearSearch = () => {
    dispatch({ type: "SET_SEARCH", query: "" });
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      dispatch({ 
        type: "SET_SORT", 
        sortBy, 
        sortOrder: sortOrder === "asc" ? "desc" : "asc" 
      });
    } else {
      dispatch({ type: "SET_SORT", sortBy: newSortBy, sortOrder: "asc" });
    }
  };

  const sortLabels = {
    title: "Title",
    artist: "Artist",
    album: "Album",
    addedAt: "Recently Added",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tracks, artists, albums..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 pr-10 h-10 bg-background"
          data-testid="search-input"
        />
        {searchQuery && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7"
            onClick={clearSearch}
            data-testid="clear-search-button"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" data-testid="sort-button">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortLabels[sortBy]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleSort(key)}
              className={cn(sortBy === key && "bg-accent")}
              data-testid={`sort-${key}`}
            >
              {sortLabels[key]}
              {sortBy === key && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
