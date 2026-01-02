import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Node {
  id: string;
  tag: string;
  type: string;
  description: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
}

interface InteractiveGraphProps {
  graphData: {
    equipment?: Array<{
      tag: string;
      type: string;
      description: string;
    }>;
  } | null;
  className?: string;
}

export function InteractiveGraph({ graphData, className }: InteractiveGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!graphData?.equipment || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.35;

    // Create nodes with circular layout
    const newNodes: Node[] = graphData.equipment.map((eq, index) => {
      const angle = (index / graphData.equipment!.length) * 2 * Math.PI - Math.PI / 2;
      return {
        id: eq.tag,
        tag: eq.tag,
        type: eq.type,
        description: eq.description,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Create edges between sequential nodes
    const newEdges: Edge[] = [];
    for (let i = 0; i < newNodes.length - 1; i++) {
      newEdges.push({
        source: newNodes[i].id,
        target: newNodes[i + 1].id,
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [graphData]);

  const getNodeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Heat Exchanger": "hsl(var(--step-parse))",
      "Pump": "hsl(var(--step-analyze))",
      "Control Valve": "hsl(var(--step-generate))",
      "Instrument": "hsl(var(--step-validate))",
    };
    return colors[type] || "hsl(var(--primary))";
  };

  const getNodeSize = (type: string) => {
    if (type === "Heat Exchanger") return 50;
    if (type === "Pump") return 45;
    if (type === "Control Valve") return 40;
    return 35;
  };

  if (!graphData?.equipment) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <p className="text-sm text-muted-foreground">No graph data available</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative w-full h-full", className)}>
      <svg className="w-full h-full">
        {/* Connection Lines */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target;

          return (
            <g key={index}>
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray={isHighlighted ? "none" : "5,5"}
                className="transition-all duration-300"
              />
              {/* Arrow */}
              <polygon
                points={`0,-5 10,0 0,5`}
                fill={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2}) rotate(${Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x) * 180 / Math.PI})`}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const size = getNodeSize(node.type);
          const color = getNodeColor(node.type);
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(isSelected ? null : node.id)}
              className="cursor-pointer"
            >
              {/* Glow effect */}
              {(isHovered || isSelected) && (
                <circle
                  r={size + 8}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.4"
                  className="animate-pulse"
                />
              )}

              {/* Node circle */}
              <circle
                r={size}
                fill="hsl(var(--card))"
                stroke={color}
                strokeWidth={isHovered || isSelected ? 3 : 2}
                className="transition-all duration-300"
              />

              {/* Equipment icon based on type */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fill={color}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
              >
                {node.tag}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Info Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-lg p-4 shadow-lg">
          {nodes.filter(n => n.id === selectedNode).map(node => (
            <div key={node.id}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNodeColor(node.type) }}
                />
                <span className="font-mono font-semibold text-sm">{node.tag}</span>
                <span className="text-xs text-muted-foreground">- {node.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{node.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur border border-border rounded-lg p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Equipment Types</p>
        <div className="space-y-1">
          {["Heat Exchanger", "Pump", "Control Valve", "Instrument"].map(type => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getNodeColor(type) }}
              />
              <span className="text-xs text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
