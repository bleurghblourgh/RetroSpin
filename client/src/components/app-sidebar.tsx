import { Library, ListMusic, Upload, Settings, Moon, Sun, Disc } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useMusic } from "@/lib/music-store";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { state, dispatch } = useMusic();
  const { currentView, tracks } = state;

  const navItems = [
    {
      title: "Library",
      icon: Library,
      view: "library" as const,
      badge: tracks.length > 0 ? tracks.length.toString() : undefined,
    },
    {
      title: "Playlists",
      icon: ListMusic,
      view: "playlist" as const,
    },
    {
      title: "Upload",
      icon: Upload,
      view: "upload" as const,
    },
  ];

  const handleViewChange = (view: "library" | "playlist" | "upload") => {
    dispatch({ type: "SET_VIEW", view });
    dispatch({ type: "SELECT_PLAYLIST", playlistId: null });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center neon-glow-purple">
            <Disc className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              RetroSpin
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              Hi-Fi Player
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleViewChange(item.view)}
                    className={cn(
                      "transition-colors",
                      currentView === item.view && "bg-sidebar-accent text-neon-cyan"
                    )}
                    data-testid={`nav-${item.view}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto text-xs bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 mr-2" />
                Light
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </>
            )}
          </Button>
          <span className="text-[10px] font-mono text-muted-foreground">v1.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
