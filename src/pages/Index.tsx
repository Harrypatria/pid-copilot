import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowStepper, WorkflowStep } from "@/components/WorkflowStepper";
import { ChatInterface, Message } from "@/components/ChatInterface";
import { PIDPreview } from "@/components/PIDPreview";
import { ExamplePrompts } from "@/components/ExamplePrompts";
import { FeatureCard } from "@/components/FeatureCard";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  FileText, 
  Brain, 
  Shield, 
  Zap, 
  Network, 
  Download,
  Sparkles,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sampleOutput = `(E-101){shell-and-tube heat exchanger}
<1>[P-101]{centrifugal pump}
|TIC-101|[E-101.outlet]
<2>(V-101){control valve}
|[TIC-101.out]>[V-101.set]`;

const sampleGraphData = {
  equipment: [
    { tag: "E-101", type: "Heat Exchanger", description: "Shell-and-tube heat exchanger" },
    { tag: "P-101", type: "Pump", description: "Centrifugal pump for feed" },
    { tag: "V-101", type: "Control Valve", description: "Temperature control valve" },
    { tag: "TIC-101", type: "Instrument", description: "Temperature Indicator Controller" },
  ],
};

const features = [
  {
    icon: Brain,
    title: "Multi-Step Agentic Workflow",
    description: "Intelligent parsing, context analysis, and iterative generation for accurate P&ID creation.",
  },
  {
    icon: FileText,
    title: "Industry Standard Compliant",
    description: "Outputs compatible with engineering tools for seamless integration.",
  },
  {
    icon: Shield,
    title: "Automated Validation",
    description: "Built-in checks for soundness and completeness of generated diagrams.",
  },
  {
    icon: Zap,
    title: "Natural Language Input",
    description: "Describe your process in plain English and get structured P&ID output.",
  },
  {
    icon: Network,
    title: "Graph-Based Analysis",
    description: "Convert P&IDs to graph structures for advanced analytics and similarity matching.",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Export to SFILES 2.0, tabular data, or integrate directly with CAD systems.",
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("idle");
  const [sfilesOutput, setSfilesOutput] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<typeof sampleGraphData | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("auth");
    if (!isAuth) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/auth");
  };

  const simulateWorkflow = useCallback(async () => {
    const steps: WorkflowStep[] = ["parse", "analyze", "generate", "validate", "export"];
    
    for (const step of steps) {
      setCurrentStep(step);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
    }
    
    setCurrentStep("complete");
    setSfilesOutput(sampleOutput);
    setGraphData(sampleGraphData);
    
    return sampleOutput;
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowWorkflow(true);
    setCurrentStep("idle");
    setSfilesOutput(null);
    setGraphData(null);

    // Simulate AI processing
    await simulateWorkflow();

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I have analyzed your process description and generated the P&ID structure. 

Generated Components:
- Equipment identified and tagged per industry standards
- Control loops established with proper instrumentation
- Connections mapped in SFILES 2.0 format

The output is now available in the preview panel. You can:
- View the SFILES 2.0 notation
- Explore the interactive graph visualization
- Export for use with engineering tools

Would you like me to modify any component or add additional instrumentation?`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [simulateWorkflow]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          {/* Top Bar */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur px-4">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                <span className="gradient-text">Smart Drawing Intelligence</span>
              </h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </header>

          {/* Hero Section */}
          {messages.length === 0 && !showWorkflow && (
            <section className="py-16 md:py-24 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-5" />
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
              
              <div className="container relative">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
                    <Sparkles className="w-4 h-4" />
                    Powered by Generative AI
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                    Transform Natural Language into
                    <span className="gradient-text block mt-2">Smart P&ID Diagrams</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    An intelligent copilot that automates the generation of Piping and Instrumentation Diagrams 
                    from natural language descriptions, using a multi-step agentic workflow.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="hero" size="lg" onClick={() => setShowWorkflow(true)}>
                      Start Generating
                      <Zap className="w-5 h-5 ml-1" />
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <a 
                        href="https://www.patriaco.co.uk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Visit Patria & Co.
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Main Application */}
          {showWorkflow && (
            <main className="container py-6">
              {/* Workflow Stepper */}
              <div className="mb-6 p-4 rounded-xl bg-card border border-border slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground">Generation Workflow</h2>
                  {currentStep === "complete" && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <WorkflowStepper currentStep={currentStep} />
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Chat Panel */}
                <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden h-[600px] slide-up" style={{ animationDelay: "100ms" }}>
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                  
                  {messages.length === 0 && (
                    <div className="px-4 pb-4 border-t border-border bg-card/50">
                      <ExamplePrompts onSelectPrompt={handleSendMessage} className="pt-4" />
                    </div>
                  )}
                </div>

                {/* Preview Panel */}
                <div className="h-[600px] slide-up" style={{ animationDelay: "200ms" }}>
                  <PIDPreview
                    sfilesOutput={sfilesOutput}
                    graphData={graphData}
                    isGenerating={currentStep !== "idle" && currentStep !== "complete"}
                  />
                </div>
              </div>
            </main>
          )}

          {/* Footer */}
          <footer className="border-t border-border mt-16 py-8">
            <div className="container text-center">
              <p className="text-sm text-muted-foreground">
                Smart Drawing Intelligence by Patria & Co. 2026
              </p>
              <a
                href="https://www.patriaco.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                www.patriaco.co.uk
              </a>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Dr Harry Patria - Automating P&ID generation for process engineering
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
