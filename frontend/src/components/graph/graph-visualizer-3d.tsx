"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { motion } from "framer-motion";
import { Network, RefreshCw, Layers } from "lucide-react";
import { fetchGraphVisualization } from "@/lib/api";
import { KGNode, KGEdge, KGVisualizationData } from "@/types/nexus";

interface NodePositions {
  [key: string]: THREE.Vector3;
}

function GraphScene({
  container,
  nodes,
  edges,
  onSelectNode,
}: {
  container: HTMLDivElement;
  nodes: KGNode[];
  edges: KGEdge[];
  onSelectNode: (node: KGNode) => void;
}) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(0, 2, 14);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x05070d, 0);
  container.appendChild(renderer.domElement);

  // CSS2D Renderer for labels
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(width, height);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0";
  labelRenderer.domElement.style.pointerEvents = "none";
  container.appendChild(labelRenderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.target.set(0, 0, 0);
  controls.update();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Compute positions on a sphere
  const positions: NodePositions = {};
  const radius = 6;
  nodes.forEach((node, i) => {
    const phi = Math.acos(-1 + (2 * i) / Math.max(1, nodes.length));
    const theta = Math.sqrt(nodes.length * Math.PI) * phi;
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    positions[node.id] = new THREE.Vector3(x, y, z);
  });

  const nodeMeshes: Map<string, THREE.Mesh> = new Map();
  const labelObjects: CSS2DObject[] = [];

  // Create edges
  edges.forEach((edge) => {
    const srcPos = positions[edge.source];
    const tgtPos = positions[edge.target];
    if (!srcPos || !tgtPos) return;

    const points = [srcPos.clone(), tgtPos.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  });

  // Create nodes
  const raycasterTargets: THREE.Object3D[] = [];

  nodes.forEach((node) => {
    const pos = positions[node.id] || new THREE.Vector3(0, 0, 0);
    const isDoc = node.entity_type === "Document";

    const geometry = new THREE.SphereGeometry(isDoc ? 0.4 : 0.25, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: isDoc ? 0x3b82f6 : 0x06b6d4,
      emissive: isDoc ? 0x1d4ed8 : 0x0891b2,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(pos);
    mesh.userData.nodeId = node.id;
    scene.add(mesh);
    nodeMeshes.set(node.id, mesh);
    raycasterTargets.push(mesh);

    // Label
    const labelDiv = document.createElement("div");
    labelDiv.textContent = node.name;
    labelDiv.style.color = "#f8fafc";
    labelDiv.style.fontSize = "12px";
    labelDiv.style.fontFamily = "ui-monospace, monospace";
    labelDiv.style.fontWeight = "600";
    labelDiv.style.textShadow = "0 0 8px rgba(0,0,0,0.8)";
    labelDiv.style.background = "rgba(5,7,13,0.6)";
    labelDiv.style.padding = "2px 8px";
    labelDiv.style.borderRadius = "4px";
    labelDiv.style.border = "1px solid rgba(56,189,248,0.2)";
    labelDiv.style.whiteSpace = "nowrap";
    labelDiv.style.pointerEvents = "none";

    const label = new CSS2DObject(labelDiv);
    label.position.set(pos.x, pos.y + 0.6, pos.z);
    scene.add(label);
    labelObjects.push(label);
  });

  // Raycaster for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleClick = (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(raycasterTargets);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const nodeId = hit.userData.nodeId;
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        onSelectNode(node);
      }
    }
  };
  renderer.domElement.addEventListener("click", handleClick);

  // Animation loop
  let animationId: number;
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };
  animate();

  // Resize handler
  const handleResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  };
  window.addEventListener("resize", handleResize);

  // Cleanup
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);
    controls.dispose();
    renderer.domElement.removeEventListener("click", handleClick);
    renderer.dispose();
    labelRenderer.domElement.remove();
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
    // Dispose geometries & materials
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
      if (obj instanceof THREE.Line) {
        obj.geometry?.dispose();
        obj.material?.dispose();
      }
    });
    labelObjects.forEach((l) => {
      scene.remove(l);
    });
  };
}

export interface GraphVisualizer3DProps {
  onNodeSelect?: (node: KGNode) => void;
}

export function GraphVisualizer3D({ onNodeSelect }: GraphVisualizer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<KGVisualizationData | null>(null);
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleSelectNode = useCallback(
    (node: KGNode) => {
      setSelectedNode(node);
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    },
    [onNodeSelect]
  );

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const graphData = await fetchGraphVisualization();
        if (!cancelled) setData(graphData);
      } catch (e) {
        console.error("Failed to load GraphRAG data", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    // Cleanup previous scene before creating a new one
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    cleanupRef.current = GraphScene({
      container: containerRef.current,
      nodes: data.nodes,
      edges: data.edges,
      onSelectNode: handleSelectNode,
    });

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [data, handleSelectNode]);

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
      {/* 3D Viewport */}
      <div ref={containerRef} className="flex-1 h-full relative cursor-grab active:cursor-grabbing" />

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
