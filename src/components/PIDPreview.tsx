import { cn } from "@/lib/utils";
import { FileCode, Network, Table2, Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PIDPreviewProps {
  sfilesOutput: string | null;
  graphData: object | null;
  isGenerating: boolean;
  className?: string;
}

type Tab = "sfiles" | "graph" | "table";

export function PIDPreview({ sfilesOutput, graphData, isGenerating, className }: PIDPreviewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("sfiles");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (sfilesOutput) {
      navigator.clipboard.writeText(sfilesOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "sfiles" as Tab, label: "SFILES 2.0", icon: FileCode },
    { id: "graph" as Tab, label: "Graph View", icon: Network },
    { id: "table" as Tab, label: "Equipment Table", icon: Table2 },
  ];

  return (
    <div className={cn("flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden", className)}>
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-2">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-1 pr-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!sfilesOutput}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" disabled={!sfilesOutput}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 animate-pulse">
              <FileCode className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Generating P&ID output...</p>
            <div className="mt-4 flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        ) : sfilesOutput ? (
          <div className="space-y-4">
            {activeTab === "sfiles" && (
              <pre className="font-mono text-sm bg-secondary/50 rounded-lg p-4 overflow-x-auto border border-border">
                <code className="text-foreground">{sfilesOutput}</code>
              </pre>
            )}
            
            {activeTab === "graph" && (
              <div className="aspect-video bg-secondary/50 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Interactive graph visualization</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Coming with pyDEXPI integration</p>
                </div>
              </div>
            )}
            
            {activeTab === "table" && graphData && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tag</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(graphData as any).equipment?.map((eq: any, i: number) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2 px-3 font-mono text-primary">{eq.tag}</td>
                        <td className="py-2 px-3">{eq.type}</td>
                        <td className="py-2 px-3 text-muted-foreground">{eq.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4">
              <FileCode className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium text-muted-foreground mb-2">No Output Yet</h4>
            <p className="text-sm text-muted-foreground/70 max-w-sm">
              Describe your process in the chat to generate P&ID data in SFILES 2.0 format, compatible with pyDEXPI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
