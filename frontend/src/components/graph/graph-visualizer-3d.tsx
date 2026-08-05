"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Network, RefreshCw, Layers } from "lucide-react";
import { fetchGraphVisualization } from "@/lib/api";
import { KGNode, KGEdge, KGVisualizationData } from "@/types/nexus";

function GraphNodes3D({ nodes, edges, onSelectNode }: { nodes: KGNode[]; edges: KGEdge[]; onSelectNode: (node: KGNode) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useRef<Record<string, [number, number, number]>>({});

  useEffect(() => {
    const radius = 6;
    nodes.forEach((node, i) => {
      const phi = Math.acos(-1 + (2 * i) / Math.max(1, nodes.length));
      const theta = Math.sqrt(nodes.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      nodePositions.current[node.id] = [x, y, z];
    });
  }, [nodes]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render Edges using Drei Line */}
      {edges.map((edge) => {
        const srcPos = nodePositions.current[edge.source];
        const tgtPos = nodePositions.current[edge.target];
        if (!srcPos || !tgtPos) return null;
        return (
          <Line
            key={edge.id}
            points={[srcPos, tgtPos]}
            color="#38bdf8"
            lineWidth={1}
            opacity={0.3}
            transparent
          />
        );
      })}

      {/* Render Nodes */}
      {nodes.map((node) => {
        const pos = nodePositions.current[node.id] || [0, 0, 0];
        const isDoc = node.entity_type === "Document";
        return (
          <group key={node.id} position={pos} onClick={(e) => { e.stopPropagation(); onSelectNode(node); }}>
            <mesh>
              <sphereGeometry args={[isDoc ? 0.4 : 0.25, 16, 16]} />
              <meshStandardMaterial
                color={isDoc ? "#3b82f6" : "#06b6d4"}
                emissive={isDoc ? "#1d4ed8" : "#0891b2"}
                emissiveIntensity={0.5}
                roughness={0.2}
              />
            </mesh>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.25}
              color="#f8fafc"
              anchorX="center"
              anchorY="bottom"
            >
              {node.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export interface GraphVisualizer3DProps {
  onNodeSelect?: (node: KGNode) => void;
}

export function GraphVisualizer3D({ onNodeSelect }: GraphVisualizer3DProps) {
  const [data, setData] = useState<KGVisualizationData | null>(null);
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const graphData = await fetchGraphVisualization();
        setData(graphData);
      } catch (e) {
        console.error("Failed to load GraphRAG data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectNode = (node: KGNode) => {
    setSelectedNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs gap-3">
        <RefreshCw className="h-5 w-5 animate-spin text-cyan-400" />
        <span>Synthesizing Sub-Graph Traversal Topology...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex relative bg-slate-950/80 rounded-2xl overflow-hidden">
      {/* 3D Canvas Viewport */}
      <div className="flex-1 h-full relative cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <GraphNodes3D nodes={data.nodes} edges={data.edges} onSelectNode={handleSelectNode} />
          <OrbitControls enablePan enableZoom enableRotate autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Selected Node Details Sidebar */}
      <div className="w-80 h-full border-l border-slate-800/80 bg-slate-950/90 glass-panel p-5 overflow-y-auto z-10">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          Entity Inspector
        </h3>

        {selectedNode ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 uppercase border border-blue-500/30">
                {selectedNode.entity_type}
              </span>
              <h2 className="text-base font-semibold text-slate-100">{selectedNode.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase">Connected Relationships</h4>
              {data.edges
                .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                .map((edge) => (
                  <div key={edge.id} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs space-y-1">
                    <span className="text-cyan-400 font-mono font-bold text-[11px]">{edge.relation_type}</span>
                    <p className="text-[11px] text-slate-300">{edge.description}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500 space-y-2">
            <Network className="h-8 w-8 mx-auto text-slate-600 animate-pulse" />
            <p>Click any node in the 3D viewport to inspect entity attributes & graph connections.</p>
          </div>
        )}
      </div>
    </div>
  );
}
