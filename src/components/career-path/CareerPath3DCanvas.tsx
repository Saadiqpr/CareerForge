"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CAREER_LEVELS, CareerLevelData, CareerLevelId } from "./types";
import { RotateCcw, Play, Pause, Eye, Sparkles, Navigation, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerPath3DCanvasProps {
  selectedLevelId: CareerLevelId;
  onSelectLevel: (levelId: CareerLevelId) => void;
}

interface NodeMeshGroup {
  level: CareerLevelData;
  group: THREE.Group;
  coreMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  ringMesh?: THREE.Mesh;
  satellites: THREE.Mesh[];
  baseScale: number;
  currentScale: number;
  hitRadius: number;
}

export default function CareerPath3DCanvas({
  selectedLevelId,
  onSelectLevel
}: CareerPath3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // HUD & UI States
  const [hoveredLevel, setHoveredLevel] = useState<CareerLevelData | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // References to 3D controls & state for imperative camera manipulation
  const sceneStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    nodeGroups: NodeMeshGroup[];
    pathLine: THREE.Line;
    pulseMesh: THREE.Mesh;
    splineCurve: THREE.CatmullRomCurve3;
    animationFrameId: number;
    isRunning: boolean;
    isHoveringNode: boolean;
    targetCameraPos: THREE.Vector3 | null;
    targetControlsTarget: THREE.Vector3 | null;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    activeLevelId: CareerLevelId;
    clock: THREE.Clock;
  } | null>(null);

  // Keep activeLevelId synchronized in ref
  useEffect(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.activeLevelId = selectedLevelId;

      // Animate camera gently toward selected node
      const targetLevel = CAREER_LEVELS.find((l) => l.id === selectedLevelId);
      if (targetLevel && sceneStateRef.current.controls) {
        const [x, y, z] = targetLevel.position3D;
        sceneStateRef.current.targetControlsTarget = new THREE.Vector3(x, y, z);
        sceneStateRef.current.targetCameraPos = new THREE.Vector3(x, y + 1.2, z + 4.2);
      }
    }
  }, [selectedLevelId]);

  // Handle Reset Camera
  const handleResetCamera = useCallback(() => {
    if (sceneStateRef.current) {
      sceneStateRef.current.targetCameraPos = new THREE.Vector3(0, 1.8, 8.5);
      sceneStateRef.current.targetControlsTarget = new THREE.Vector3(0, 0.4, 0);
    }
  }, []);

  // Handle Toggle Auto-Rotate
  const handleToggleAutoRotate = useCallback(() => {
    setIsAutoRotate((prev) => {
      const next = !prev;
      if (sceneStateRef.current) {
        sceneStateRef.current.controls.autoRotate = next;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Check WebGL support
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    // 2. Setup Scene, Camera, Renderer
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060c18, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 3. Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 0.6;
    controls.target.set(0, 0.4, 0);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 1.2);
    dirLight2.position.set(-5, -4, -3);
    scene.add(dirLight2);

    // 5. Procedural Starfield / Ambient Dust
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 24;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 16 - 2;

      // Soft cyan, amber, violet color accents
      const randColor = Math.random();
      if (randColor < 0.33) {
        particleColors[i3] = 0.2; particleColors[i3 + 1] = 0.7; particleColors[i3 + 2] = 0.9;
      } else if (randColor < 0.66) {
        particleColors[i3] = 0.9; particleColors[i3 + 1] = 0.6; particleColors[i3 + 2] = 0.1;
      } else {
        particleColors[i3] = 0.6; particleColors[i3 + 1] = 0.3; particleColors[i3 + 2] = 0.9;
      }
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const starfield = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(starfield);

    // 6. Procedural Catmull-Rom Energy Conduit (Spline connecting the 4 levels)
    const curvePoints = CAREER_LEVELS.map(
      (level) => new THREE.Vector3(...level.position3D)
    );
    const splineCurve = new THREE.CatmullRomCurve3(curvePoints);
    splineCurve.curveType = "catmullrom";
    splineCurve.tension = 0.4;

    const tubeGeo = new THREE.TubeGeometry(splineCurve, 64, 0.04, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const pathLine = new THREE.Mesh(tubeGeo, tubeMat) as unknown as THREE.Line;
    scene.add(pathLine);

    // Pulsing energy photon moving along the path
    const pulseGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);

    // 7. Procedural Career Level 3D Nodes
    const nodeGroups: NodeMeshGroup[] = [];

    CAREER_LEVELS.forEach((level) => {
      const group = new THREE.Group();
      group.position.set(...level.position3D);

      const color = new THREE.Color(level.accentHex);
      const glowColor = new THREE.Color(level.glowHex);

      let coreGeometry: THREE.BufferGeometry;
      const baseScale = 1.0;

      switch (level.geometryType) {
        case "octahedron":
          coreGeometry = new THREE.OctahedronGeometry(0.55, 0);
          break;
        case "icosahedron":
          coreGeometry = new THREE.IcosahedronGeometry(0.6, 0);
          break;
        case "beacon":
          coreGeometry = new THREE.DodecahedronGeometry(0.68, 0);
          break;
        case "hypercube":
        default:
          coreGeometry = new THREE.OctahedronGeometry(0.72, 1);
          break;
      }

      // Core Mesh
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(coreMesh);

      // Outer Wireframe Halo
      const haloGeometry = new THREE.IcosahedronGeometry(0.85, 1);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: glowColor,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
      group.add(haloMesh);

      // Orbital Ring for nodes
      let ringMesh: THREE.Mesh | undefined;
      const ringGeo = new THREE.TorusGeometry(1.05, 0.02, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      group.add(ringMesh);

      // Satellite particles for high-tier nodes (L5, L6)
      const satellites: THREE.Mesh[] = [];
      if (level.levelNumber >= 3) {
        const satCount = level.levelNumber === 3 ? 3 : 4;
        const satGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const satMat = new THREE.MeshBasicMaterial({
          color: glowColor,
          blending: THREE.AdditiveBlending
        });

        for (let s = 0; s < satCount; s++) {
          const sat = new THREE.Mesh(satGeo, satMat);
          group.add(sat);
          satellites.push(sat);
        }
      }

      // Hit sphere for raycasting
      const hitSphereGeo = new THREE.SphereGeometry(1.2, 8, 8);
      const hitSphereMat = new THREE.MeshBasicMaterial({
        visible: false
      });
      const hitMesh = new THREE.Mesh(hitSphereGeo, hitSphereMat);
      hitMesh.userData = { levelId: level.id };
      group.add(hitMesh);

      scene.add(group);

      nodeGroups.push({
        level,
        group,
        coreMesh,
        haloMesh,
        ringMesh,
        satellites,
        baseScale,
        currentScale: 1.0,
        hitRadius: 1.2
      });
    });

    // 8. Interaction State & Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const clock = new THREE.Clock();

    sceneStateRef.current = {
      scene,
      camera,
      renderer,
      controls,
      nodeGroups,
      pathLine,
      pulseMesh,
      splineCurve,
      animationFrameId: 0,
      isRunning: true,
      isHoveringNode: false,
      targetCameraPos: null,
      targetControlsTarget: null,
      raycaster,
      mouse,
      activeLevelId: selectedLevelId,
      clock
    };

    // 9. Pointer & Touch Event Handlers
    const updateMouseCoordinates = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMouseCoordinates(e.clientX, e.clientY);
    };

    const handlePointerDown = () => {
      setIsInteracting(true);
    };

    const handlePointerUp = (e: PointerEvent) => {
      setIsInteracting(false);
      updateMouseCoordinates(e.clientX, e.clientY);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent) {
          if (parent.userData?.levelId) {
            const levelId = parent.userData.levelId as CareerLevelId;
            onSelectLevel(levelId);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 11. Intersection Observer to pause rendering when off-screen
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (sceneStateRef.current) {
          sceneStateRef.current.isRunning = entry.isIntersecting && !document.hidden;
        }
      }
    });
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      if (sceneStateRef.current) {
        sceneStateRef.current.isRunning = !document.hidden;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 12. Main Animation Loop
    let pulseT = 0;

    const animate = () => {
      const state = sceneStateRef.current;
      if (!state) return;

      state.animationFrameId = requestAnimationFrame(animate);

      if (!state.isRunning) return;

      const delta = Math.min(state.clock.getDelta(), 0.1);
      const elapsed = state.clock.getElapsedTime();

      // Update Raycasting for Hover Detection
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.scene.children, true);

      let foundHovered: CareerLevelData | null = null;
      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent) {
          if (parent.userData?.levelId) {
            const id = parent.userData.levelId as CareerLevelId;
            foundHovered = CAREER_LEVELS.find((l) => l.id === id) || null;
            break;
          }
          parent = parent.parent;
        }
        if (foundHovered) break;
      }

      setHoveredLevel(foundHovered);
      canvas.style.cursor = foundHovered ? "pointer" : "grab";

      // Animate Nodes & Satellites
      state.nodeGroups.forEach((nodeGroup) => {
        const isSelected = nodeGroup.level.id === state.activeLevelId;
        const isHovered = foundHovered?.id === nodeGroup.level.id;

        // Rotation
        nodeGroup.coreMesh.rotation.y += nodeGroup.level.rotationSpeed;
        nodeGroup.coreMesh.rotation.x += nodeGroup.level.rotationSpeed * 0.6;
        nodeGroup.haloMesh.rotation.y -= nodeGroup.level.rotationSpeed * 0.5;

        if (nodeGroup.ringMesh) {
          nodeGroup.ringMesh.rotation.z += (isSelected ? 0.02 : 0.006);
        }

        // Target Scale
        const targetScale = isSelected ? 1.3 : isHovered ? 1.2 : 1.0;
        nodeGroup.currentScale = THREE.MathUtils.lerp(
          nodeGroup.currentScale,
          targetScale,
          delta * 8
        );
        nodeGroup.group.scale.setScalar(nodeGroup.currentScale);

        // Core Emissive Glow Pulse
        const coreMat = nodeGroup.coreMesh.material as THREE.MeshStandardMaterial;
        if (coreMat) {
          const glowIntensity = isSelected
            ? 0.9 + Math.sin(elapsed * 4) * 0.3
            : isHovered
            ? 0.7 + Math.sin(elapsed * 3) * 0.2
            : 0.4;
          coreMat.emissiveIntensity = THREE.MathUtils.lerp(
            coreMat.emissiveIntensity,
            glowIntensity,
            delta * 5
          );
        }

        // Satellites orbital motion
        if (nodeGroup.satellites.length > 0) {
          const satRadius = 1.15;
          nodeGroup.satellites.forEach((sat, sIdx) => {
            const angle = elapsed * 1.5 + (sIdx * Math.PI * 2) / nodeGroup.satellites.length;
            sat.position.set(
              Math.cos(angle) * satRadius,
              Math.sin(angle * 1.5) * 0.3,
              Math.sin(angle) * satRadius
            );
          });
        }
      });

      // Animate Energy Pulse Photon along Spline
      pulseT = (pulseT + delta * 0.18) % 1;
      const pointOnCurve = state.splineCurve.getPointAt(pulseT);
      state.pulseMesh.position.copy(pointOnCurve);
      state.pulseMesh.scale.setScalar(1.0 + Math.sin(elapsed * 8) * 0.3);

      // Smooth Camera Fly-to Lerp when target set
      if (state.targetCameraPos && state.targetControlsTarget) {
        state.camera.position.lerp(state.targetCameraPos, delta * 2.8);
        state.controls.target.lerp(state.targetControlsTarget, delta * 2.8);

        if (state.camera.position.distanceTo(state.targetCameraPos) < 0.05) {
          state.targetCameraPos = null;
          state.targetControlsTarget = null;
        }
      }

      // Starfield gentle rotation
      starfield.rotation.y = elapsed * 0.02;

      // Update Controls & Render
      state.controls.update();
      state.renderer.render(state.scene, state.camera);
    };

    state.animationFrameId = requestAnimationFrame(animate);

    // 13. Cleanup on Unmount
    return () => {
      if (sceneStateRef.current) {
        cancelAnimationFrame(sceneStateRef.current.animationFrameId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);

      // Dispose Geometries & Materials
      tubeGeo.dispose();
      tubeMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      nodeGroups.forEach((ng) => {
        ng.coreMesh.geometry.dispose();
        (ng.coreMesh.material as THREE.Material).dispose();
        ng.haloMesh.geometry.dispose();
        (ng.haloMesh.material as THREE.Material).dispose();
        if (ng.ringMesh) {
          ng.ringMesh.geometry.dispose();
          (ng.ringMesh.material as THREE.Material).dispose();
        }
      });

      controls.dispose();
      renderer.dispose();
      sceneStateRef.current = null;
    };
  }, [isAutoRotate, onSelectLevel, selectedLevelId]);

  if (!isWebGLSupported) {
    return null;
  }

  const activeLevelData =
    CAREER_LEVELS.find((l) => l.id === selectedLevelId) || CAREER_LEVELS[2];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/[0.1] bg-[#060c18] shadow-2xl group select-none"
      style={{ touchAction: "none" }}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none" }}
        aria-label="Interactive 3D Career Progression Constellation. Drag to orbit, scroll to zoom, click nodes to focus."
      />

      {/* Top HUD Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-[#0c1322]/80 backdrop-blur-md border border-white/[0.1] rounded-2xl px-3 py-1.5 shadow-lg">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            3D Constellation
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            WebGL
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleAutoRotate}
            aria-label={isAutoRotate ? "Pause orbit rotation" : "Resume orbit rotation"}
            className="h-8 px-2.5 rounded-xl bg-[#0c1322]/80 backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.1] text-xs text-slate-300 flex items-center gap-1.5 shadow-lg"
          >
            {isAutoRotate ? (
              <>
                <Pause className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Pause Orbit</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Auto Orbit</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetCamera}
            aria-label="Reset 3D camera position"
            className="h-8 px-2.5 rounded-xl bg-[#0c1322]/80 backdrop-blur-md border border-white/[0.1] hover:bg-white/[0.1] text-xs text-slate-300 flex items-center gap-1.5 shadow-lg"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset View</span>
          </Button>
        </div>
      </div>

      {/* Hovered Node Tooltip / HUD Pill */}
      {hoveredLevel && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none bg-slate-900/90 backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-3 animate-fade-in z-20">
          <span
            className="h-3 w-3 rounded-full animate-ping"
            style={{ backgroundColor: hoveredLevel.accentHex }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {hoveredLevel.title}
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border ${hoveredLevel.badgeColor}`}>
                {hoveredLevel.levelCode}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Click node to zoom & inspect capabilities
            </p>
          </div>
        </div>
      )}

      {/* Bottom Level Switcher Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-[#0c1322]/90 backdrop-blur-xl border border-white/[0.1] p-1.5 rounded-2xl pointer-events-auto shadow-2xl overflow-x-auto max-w-full">
          {CAREER_LEVELS.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onSelectLevel(lvl.id)}
                aria-pressed={isSelected}
                aria-label={`Jump to level ${lvl.levelCode}: ${lvl.title}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span>{lvl.levelCode}</span>
                <span className="hidden md:inline font-normal opacity-80 text-[11px]">
                  • {lvl.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interaction Hint Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0c1322]/80 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-xl text-[11px] text-slate-400">
          <Navigation className="h-3 w-3 text-cyan-400" />
          <span>Drag to rotate • Pinch to zoom • Tap to select</span>
        </div>
      </div>
    </div>
  );
}
