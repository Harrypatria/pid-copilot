import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "group p-5 rounded-xl bg-card border border-border transition-all duration-300",
      "hover:border-primary/30 hover:bg-card/80",
      className
    )}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-medium mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
