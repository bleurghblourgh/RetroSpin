import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme-provider";
import { MusicProvider } from "@/lib/music-store";
import { AppSidebar } from "@/components/app-sidebar";
import { KeyboardShortcutsManager } from "@/components/keyboard-shortcuts-manager";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "15rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <MusicProvider>
            <KeyboardShortcutsManager />
            <SidebarProvider style={sidebarStyle as React.CSSProperties}>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <SidebarInset className="flex-1 flex flex-col overflow-hidden">
                  <header className="flex items-center gap-2 p-2 border-b border-border md:hidden">
                    <SidebarTrigger data-testid="sidebar-trigger" />
                    <span className="font-display font-bold text-lg tracking-wider bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                      RetroSpin
                    </span>
                  </header>
                  <main className="flex-1 overflow-auto scrollbar-thin">
                    <Router />
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
            <Toaster />
          </MusicProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
