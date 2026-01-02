import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight } from "lucide-react";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}

const examples = [
  {
    title: "Heat Exchange System",
    prompt: "Design a heat exchanger system with a shell-and-tube heat exchanger (E-101), connected to a centrifugal pump (P-101) with a temperature indicator controller (TIC-101) for outlet temperature control.",
  },
  {
    title: "Storage Tank with Level Control",
    prompt: "Create a storage tank (T-101) with level control. Include a level transmitter (LT-101), level indicator controller (LIC-101), and a control valve (LV-101) on the outlet line.",
  },
  {
    title: "Distillation Column Feed",
    prompt: "Generate a distillation column feed section with a preheater (E-102), feed pump (P-102), and flow control loop (FIC-102) regulating the feed rate to the column.",
  },
];

export function ExamplePrompts({ onSelectPrompt, className }: ExamplePromptsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="w-4 h-4" />
        <span>Try an example:</span>
      </div>
      <div className="grid gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(example.prompt)}
            className="group text-left p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 hover:bg-secondary transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{example.title}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{example.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
