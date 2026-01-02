import { cn } from "@/lib/utils";
import { Workflow, Github, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      "w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50",
      className
    )}>
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Workflow className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              <span className="gradient-text">pyDEXPI</span>
              <span className="text-foreground"> Copilot</span>
            </h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">AI-Powered P&ID Generation</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <FileText className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <a 
              href="https://github.com/process-intelligence-research/pyDEXPI" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="w-4 h-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
