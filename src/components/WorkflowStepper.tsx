import { cn } from "@/lib/utils";
import { Check, FileText, Brain, Workflow, Shield, Download } from "lucide-react";

export type WorkflowStep = 
  | "idle"
  | "parse"
  | "analyze"
  | "generate"
  | "validate"
  | "export"
  | "complete";

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
  className?: string;
}

const steps = [
  { id: "parse", label: "Parse Input", icon: FileText, description: "Extracting requirements from NL" },
  { id: "analyze", label: "Analyze Context", icon: Brain, description: "Understanding process flow" },
  { id: "generate", label: "Generate P&ID", icon: Workflow, description: "Building diagram structure" },
  { id: "validate", label: "Validate", icon: Shield, description: "Checking completeness" },
  { id: "export", label: "Export", icon: Download, description: "Preparing DEXPI output" },
] as const;

const getStepStatus = (stepId: string, currentStep: WorkflowStep) => {
  if (currentStep === "idle") return "pending";
  if (currentStep === "complete") return "complete";
  
  const stepOrder = steps.map(s => s.id);
  const currentIndex = stepOrder.indexOf(currentStep as any);
  const stepIndex = stepOrder.indexOf(stepId as any);
  
  if (stepIndex < currentIndex) return "complete";
  if (stepIndex === currentIndex) return "active";
  return "pending";
};

export function WorkflowStepper({ currentStep, className }: WorkflowStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-border mx-10" />
        <div 
          className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-500 mx-10"
          style={{
            width: currentStep === "idle" 
              ? "0%" 
              : currentStep === "complete"
                ? "calc(100% - 80px)"
                : `calc(${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}% - ${80 - (steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 80}px)`
          }}
        />
        
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, currentStep);
          const Icon = step.icon;
          
          return (
            <div 
              key={step.id}
              className="flex flex-col items-center relative z-10 group"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  "border-2",
                  status === "complete" && "bg-primary border-primary text-primary-foreground",
                  status === "active" && "bg-primary/20 border-primary text-primary workflow-step-active",
                  status === "pending" && "bg-secondary border-border text-muted-foreground"
                )}
              >
                {status === "complete" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              <div className="mt-3 text-center">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  status === "active" ? "text-primary" : status === "complete" ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  "text-xs mt-0.5 max-w-[100px] transition-opacity",
                  status === "active" ? "text-muted-foreground opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
