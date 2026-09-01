"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface SignatureShaderCanvasProps {
  className?: string;
  isInteractive?: boolean;
}

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;

// ============================================================================
// SECTION 1: Permutation & 2D Simplex Noise
// Mathematical basis for organic pseudorandom continuous gradient motion
// ============================================================================
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ============================================================================
// SECTION 2: Fractal Brownian Motion (FBM) with 4 Rotated Octaves
// Creates rich, self-similar turbulent fluid plasma patterns
// ============================================================================
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    f += w * snoise(p);
    p = rot * p * 2.0 + vec2(100.0);
    w *= 0.5;
  }
  return f;
}

// ============================================================================
// SECTION 3: High-Frequency Film Grain Dither
// Eliminates 8-bit banding artifacts and adds tactile cinematic texture
// ============================================================================
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // ==========================================================================
  // SECTION 4: Aspect-Ratio Corrected Center UV Coordinates
  // Normalizes coordinates to [-aspect..aspect, -1..1] centered at (0,0)
  // ==========================================================================
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // ==========================================================================
  // SECTION 5: Interactive Cursor Field Deflection (Gravitational Lensing)
  // Displaces local fluid coordinates smoothly toward the cursor position
  // ==========================================================================
  vec2 mouseVec = uv - u_mouse;
  float mouseDist = length(mouseVec);
  float mouseInfluence = exp(-mouseDist * 2.8) * 0.42;
  vec2 mouseDisplacement = normalize(mouseVec + 0.001) * mouseInfluence;
  vec2 warpedUv = uv + mouseDisplacement;

  // ==========================================================================
  // SECTION 6: Multi-Stage Domain Warping (q & r vectors)
  // Evaluates nested FBM layers to produce dynamic aurora plasma filaments
  // ==========================================================================
  float t = u_time * 0.16;

  vec2 q = vec2(
    fbm(warpedUv + vec2(0.0, 0.0) + t * 0.22),
    fbm(warpedUv + vec2(5.2, 1.3) + t * 0.28)
  );

  vec2 r = vec2(
    fbm(warpedUv + 4.0 * q + vec2(1.7, 9.2) + t * 0.35),
    fbm(warpedUv + 4.0 * q + vec2(8.3, 2.8) + t * 0.30)
  );

  float f = fbm(warpedUv + 4.0 * r);

  // ==========================================================================
  // SECTION 7: Bespoke Cosmic Color Palette Blending
  // Maps scalar domain outputs into an OKLCH-aligned chromatic gradient
  // ==========================================================================
  vec3 colBase = vec3(0.02, 0.05, 0.10);      // Deep Cosmic Navy (#050d1a)
  vec3 colCyan = vec3(0.02, 0.71, 0.83);      // Cyber Cyan (#06b6d4)
  vec3 colViolet = vec3(0.55, 0.36, 0.96);    // Electric Violet (#8b5cf6)
  vec3 colAmber = vec3(0.96, 0.62, 0.04);     // Solar Amber (#f59e0b)
  vec3 colEmerald = vec3(0.06, 0.73, 0.51);   // Radiant Emerald (#10b981)

  vec3 color = mix(colBase, colCyan, clamp(length(q), 0.0, 1.0));
  color = mix(color, colViolet, clamp(length(r.x), 0.0, 1.0));
  color = mix(color, colAmber, clamp(pow(f, 2.4) * 1.8, 0.0, 1.0));

  // Interactive cursor chromatic glow
  color += colEmerald * (mouseInfluence * 0.65);
  color += colCyan * (exp(-mouseDist * 4.2) * 0.35);

  // ==========================================================================
  // SECTION 8: Procedural Grain & Contrast-Safe Vignette Pass
  // Adds tactile analog grain and soft edge falloff to protect text contrast
  // ==========================================================================
  float grain = (hash(gl_FragCoord.xy + u_time * 5.0) - 0.5) * 0.035;
  color += grain;

  // Soft vignette
  float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv));
  color *= (0.75 + 0.25 * vignette);

  // Bottom gradient transition to page background (#060c18)
  float bottomFade = smoothstep(-0.6, 0.6, uv.y);
  color = mix(vec3(0.024, 0.047, 0.094), color, bottomFade * 0.85 + 0.15);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function SignatureShaderCanvas({
  className = "",
  isInteractive = true
}: SignatureShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  // Target and current mouse positions for smooth spring interpolation
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sceneStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    quad: THREE.Mesh;
    animationFrameId: number;
    clock: THREE.Clock;
    isRunning: boolean;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Verify WebGL support
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setIsWebGLAvailable(false);
        return;
      }
    } catch {
      setIsWebGLAvailable(false);
      return;
    }

    // 2. Setup Three.js Orthographic Fullscreen Quad
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));

    // 3. Shader Material with Core Uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mouse: { value: new THREE.Vector2(0.0, 0.0) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const clock = new THREE.Clock();

    sceneStateRef.current = {
      scene,
      camera,
      renderer,
      material,
      quad,
      animationFrameId: 0,
      clock,
      isRunning: true
    };

    // 4. Mouse / Pointer Interaction
    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractive || !container) return;
      const rect = container.getBoundingClientRect();
      const minDim = Math.min(rect.width, rect.height);
      // Normalized coordinates centered at (0,0) with aspect ratio matching shader
      mouseTargetRef.current.x = (e.clientX - rect.left - 0.5 * rect.width) / minDim;
      mouseTargetRef.current.y = -(e.clientY - rect.top - 0.5 * rect.height) / minDim;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    // 5. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        renderer.setSize(newWidth, newHeight);
        material.uniforms.u_resolution.value.set(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 6. Intersection Observer for Scroll Throttling
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (sceneStateRef.current) {
          sceneStateRef.current.isRunning = entry.isIntersecting && !document.hidden;
        }
      }
    });
    intersectionObserver.observe(container);

    // 7. Background Tab Throttling
    const handleVisibilityChange = () => {
      if (sceneStateRef.current) {
        sceneStateRef.current.isRunning = !document.hidden;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 8. Animation Loop with Delta Clamping & Mouse Damping
    const animate = () => {
      const state = sceneStateRef.current;
      if (!state) return;

      if (sceneStateRef.current) {
        sceneStateRef.current.animationFrameId = requestAnimationFrame(animate);
      }

      if (!state.isRunning) return;

      const delta = Math.min(state.clock.getDelta(), 0.1);
      const elapsed = state.clock.getElapsedTime();

      // Smooth mouse interpolation (Damping)
      mouseCurrentRef.current.x = THREE.MathUtils.lerp(
        mouseCurrentRef.current.x,
        mouseTargetRef.current.x,
        delta * 6.0
      );
      mouseCurrentRef.current.y = THREE.MathUtils.lerp(
        mouseCurrentRef.current.y,
        mouseTargetRef.current.y,
        delta * 6.0
      );

      state.material.uniforms.u_time.value = elapsed;
      state.material.uniforms.u_mouse.value.set(
        mouseCurrentRef.current.x,
        mouseCurrentRef.current.y
      );

      state.renderer.render(state.scene, state.camera);
    };

    if (sceneStateRef.current) {
      sceneStateRef.current.animationFrameId = requestAnimationFrame(animate);
    }

    // 9. Clean Cleanup on Unmount
    return () => {
      if (sceneStateRef.current) {
        cancelAnimationFrame(sceneStateRef.current.animationFrameId);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      sceneStateRef.current = null;
    };
  }, [isInteractive]);

  if (!isWebGLAvailable) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-[#0c1322] via-[#090e1f] to-[#120f26] ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
