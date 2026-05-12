import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Box, ClipboardList, Home, Trophy } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 gradient-hero shadow-medium">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-smooth">
                <Box className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">NetLearn3D</h1>
                <p className="text-xs text-primary-foreground/80">Jaringan Komputer</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive("/") ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Button>
              </Link>
              <Link to="/materi">
                <Button 
                  variant={isActive("/materi") ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive("/materi") ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Materi
                </Button>
              </Link>
              <Link to="/simulasi">
                <Button 
                  variant={isActive("/simulasi") ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive("/simulasi") ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
                >
                  <Box className="w-4 h-4 mr-2" />
                  Simulasi
                </Button>
              </Link>
              <Link to="/kuis">
                <Button 
                  variant={isActive("/kuis") ? "secondary" : "ghost"}
                  size="sm"
                  className={isActive("/kuis") ? "" : "text-primary-foreground hover:bg-primary-foreground/10"}
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Kuis
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 NetLearn3D - Media Pembelajaran Jaringan Komputer</p>
            <p className="mt-1">Platform pembelajaran interaktif untuk SMA Kelas XI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
