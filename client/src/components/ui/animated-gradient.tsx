"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AnimatedGradientProps {
  className?: string;
  variant?: "mist" | "lava" | "vortex" | "beige";
  speed?: number;
  opacity?: number;
  interactive?: boolean;
  children?: React.ReactNode;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const BEIGE_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_touch;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Quintic polynomial smoothing for thick, viscous fluid folds
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

    float x1 = mix(a, b, u.x);
    float x2 = mix(c, d, u.x);
    return mix(x1, x2, u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.52;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.55), sin(0.55), -sin(0.55), cos(0.55));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.05 + shift;
      a *= 0.48;
    }
    return v;
  }

  // Sample fluid heightfield with viscous domain warping
  float getFluidHeight(vec2 p, float t, vec2 touchPos, float aspect) {
    // Viscous touch displacement (swirls and pushes the thick liquid outward)
    vec2 touchCoord = touchPos * vec2(aspect, 1.0);
    float touchDist = length(p - touchCoord);
    float touchImpulse = exp(-touchDist * 3.8);
    p += (p - touchCoord) * touchImpulse * 0.28;

    // Heavy multi-stage recursive domain warping (honey / molten wax folds)
    vec2 q = vec2(
      fbm(p * 0.95 + vec2(0.0, -t * 0.22)),
      fbm(p * 0.95 + vec2(t * 0.18, -t * 0.28))
    );

    vec2 r = vec2(
      fbm(p * 1.15 + 2.8 * q + vec2(1.6, -t * 0.38)),
      fbm(p * 1.15 + 2.8 * q + vec2(7.2, -t * 0.32))
    );

    vec2 s = vec2(
      fbm(p * 0.8 + 2.2 * r + vec2(-t * 0.25, 2.1)),
      fbm(p * 0.8 + 2.2 * r + vec2(3.4, -t * 0.2))
    );

    return fbm(p * 0.75 + 1.9 * s);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Slower, heavier viscous motion rate
    float t = u_time * 0.18;

    float f = getFluidHeight(uv, t, u_touch, aspect);

    // Normal approximation for thick 3D liquid surface curvature and sheen
    float eps = 0.012;
    float fRight = getFluidHeight(uv + vec2(eps, 0.0), t, u_touch, aspect);
    float fUp    = getFluidHeight(uv + vec2(0.0, eps), t, u_touch, aspect);
    vec3 normal = normalize(vec3(-(fRight - f) * 4.5, -(fUp - f) * 4.5, 1.0));

    // Directional light from top-left creating soft volumetric highlights
    vec3 lightDir = normalize(vec3(0.4, 0.7, 0.9));
    float diff = clamp(dot(normal, lightDir), 0.0, 1.0);
    float spec = pow(clamp(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 22.0);

    // Saturated, rich viscous beige palette with amber & caramel depth
    vec3 shadowBronze  = vec3(0.48, 0.32, 0.14);   // Deep viscous shadow crevice (#7A5224)
    vec3 toffeeCaramel  = vec3(0.66, 0.48, 0.24);   // Roasted toffee midtone (#A87A3D)
    vec3 goldenAmber    = vec3(0.82, 0.64, 0.35);   // Rich honey/amber fluid (#D1A359)
    vec3 warmSandBeige  = vec3(0.91, 0.82, 0.66);   // Warm beige crest (#E8D1A8)
    vec3 creamyIvory    = vec3(0.97, 0.93, 0.84);   // Liquid cream highlight (#F7EDD6)
    vec3 glossSheen     = vec3(1.00, 0.98, 0.92);   // Specular glossy reflection

    // Deep viscous wave layering with smooth bulbous folds
    float w1 = smoothstep(0.12, 0.80, f);
    float w2 = smoothstep(0.28, 0.74, f + 0.22 * sin(uv.y * 2.8 + t * 1.1));
    float w3 = smoothstep(0.52, 0.88, f);
    float shadow = smoothstep(0.50, 0.10, f);

    vec3 col = mix(toffeeCaramel, warmSandBeige, w1);
    col = mix(col, shadowBronze, shadow * 0.58);
    col = mix(col, goldenAmber, w2 * 0.65);
    col = mix(col, creamyIvory, w3 * 0.45);

    // Apply volumetric lighting and viscous liquid surface gloss
    col *= (0.75 + diff * 0.38);
    col += glossSheen * spec * 0.38;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const MIST_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_touch;

  #define TWO_PI 6.28318530718
  #define PI 3.14159265358979323846

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    float x1 = mix(a, b, u.x);
    float x2 = mix(c, d, u.x);
    return mix(x1, x2, u.y);
  }

  void main() {
      vec2 uv = v_uv;

      vec2 touchDelta = (u_touch - 0.5) * 0.15;
      uv += touchDelta * 0.2;

      // Mist preset timing parameters: speed = 39, offset = -235
      float t = u_time * 0.975 - 1.175;

      // Mist preset scale parameter: scale = 0.48
      float noise_scale = 0.00338; // .0005 + .006 * 0.48

      uv -= 0.5;
      uv *= (noise_scale * u_resolution);
      uv /= 1.5; // pixel ratio normalization
      uv += 0.5;

      // Distortion
      float n1 = noise(uv * 1.0 + t);
      float n2 = noise(uv * 2.0 - t);
      float angle = n1 * TWO_PI;
      uv.x += 0.32 * n2 * cos(angle);
      uv.y += 0.32 * n2 * sin(angle);

      // Swirl
      for (int i = 1; i <= 5; i++) {
          float fi = float(i);
          uv.x += 0.65 / fi * cos(t + fi * 1.5 * uv.y);
          uv.y += 0.65 / fi * cos(t + fi * 1.0 * uv.x);
      }

      float sh = 1.0 - uv.y;
      sh -= 0.5;
      sh /= (noise_scale * u_resolution.y);
      sh += 0.5;

      float shape_scaling = 0.104;
      float shape = smoothstep(0.45 - shape_scaling, 0.55 + shape_scaling, sh + 0.3 * (0.33 - 0.5));
      float mixer = shape;

      vec3 bg = vec3(0.0196, 0.0196, 0.0196);          // Obsidian background
      vec3 pink = vec3(1.0, 0.4, 0.7215);              // Magenta core

      float mistFocus = pow(sin(mixer * PI), 4.2);
      float fineMist = noise(uv * 3.5 - t * 1.3) * 0.4 + noise(uv * 1.5 + t * 0.85) * 0.6;
      float combinedDensity = mix(mixer, fineMist, 0.28) * mistFocus;

      vec3 col = mix(bg, pink, smoothstep(0.0, 0.85, combinedDensity));
      float highlight = smoothstep(0.42, 0.88, fineMist) * smoothstep(0.12, 0.9, mixer) * mistFocus;
      col = mix(col, pink * 1.15, highlight * 0.35);

      vec2 raySource = vec2(0.2, 1.25);
      vec2 rayDir = normalize(v_uv - raySource);
      float rayAngle = atan(rayDir.y, rayDir.x);
      
      float rays = sin(rayAngle * 6.5 + t * 0.35) * 0.35 +
                   sin(rayAngle * 12.0 - t * 0.22) * 0.25 +
                   sin(rayAngle * 24.0 + t * 0.15) * 0.15;
      rays = smoothstep(0.15, 0.82, rays * 0.5 + 0.5);

      float rayGlow = rays * smoothstep(0.15, 0.9, combinedDensity) * (1.1 - v_uv.y) * mistFocus * 0.7;
      col += pink * rayGlow * 0.38;

      float grain = random(gl_FragCoord.xy * 0.15 + t * 0.05);
      float particles = step(0.988, grain) * smoothstep(0.2, 0.9, combinedDensity);
      col += pink * particles * 0.32;

      col = pow(col, vec3(0.92));

      gl_FragColor = vec4(col, 1.0);
  }
`;

const LAVA_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_touch;

  #define PI 3.14159265359

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 2; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;
    
    float touchOffset = (u_touch.x - 0.5) * 0.2;
    float t = u_time * 0.22;
    float sway = sin(uv.x * 2.5 + u_time * 0.45 + touchOffset) * 0.07;
    
    vec2 q = vec2(0.0);
    q.x = fbm(uv * 2.0 + vec2(0.0, -t));
    q.y = fbm(uv * 2.0 + vec2(t * 0.35, -t * 0.85));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv * 2.2 + 2.8 * q + vec2(1.7, -t * 1.5));
    r.y = fbm(uv * 2.2 + 2.8 * q + vec2(8.3, -t * 1.25));
    
    float f = fbm(uv * 1.05 + 1.65 * r);
    float fire = (1.0 - (uv.y + sway)) * 1.15; 
    float noiseGlow = f * 1.65 * (1.1 - uv.y);
    float flameIntensity = fire + noiseGlow - 0.78;
    
    float flame = smoothstep(-0.25, 0.95, flameIntensity);
    float orangeGlow = smoothstep(0.12, 0.98, flameIntensity);
    float goldCore = smoothstep(0.38, 1.0, fire + f * 0.75 * (1.1 - uv.y) - 0.42);
    float smoke = smoothstep(-0.3, 0.45, flameIntensity) * (1.0 - smoothstep(0.45, 0.95, flameIntensity));
    
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 deepRed = vec3(0.55, 0.015, 0.0);
    vec3 brightOrange = vec3(0.92, 0.25, 0.0);
    vec3 goldenOrange = vec3(0.96, 0.42, 0.02);
    
    vec3 col = mix(black, deepRed, flame);
    col = mix(col, brightOrange, orangeGlow);
    col = mix(col, goldenOrange, goldCore);
    col += deepRed * smoke * 0.35;
    
    float edge = smoothstep(0.25, 0.55, f) * (1.0 - smoothstep(0.55, 0.85, f));
    col += edge * brightOrange * 0.18 * (1.0 - uv.y);
    col = pow(col, vec3(0.85));
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VORTEX_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_dark;
  uniform vec2 u_touch;

  #define PI 3.14159265358979323846

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 2; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / u_resolution.y;
    
    vec2 center = vec2(0.5) + (u_touch - 0.5) * 0.15;
    vec2 st = uv - center;
    st.x *= aspect;
    
    float t = u_time * 0.55;
    float dist = length(st);
    float angle = atan(st.y, st.x);
    
    float swirl = 3.2 / (dist + 0.3);
    angle += swirl * 0.6 * smoothstep(0.04, 0.25, dist) + t * 0.3;
    
    float rippleMask = smoothstep(0.08, 0.35, dist);
    dist += sin(angle * 2.0 - t * 1.2) * 0.015 * rippleMask * (1.0 - smoothstep(0.0, 0.9, dist));
    
    vec2 twisted = vec2(cos(angle), sin(angle)) * dist;
    twisted.x /= aspect;
    twisted += center;
    
    vec2 flowCoord = twisted * 1.5;
    vec2 q = vec2(
      fbm(flowCoord - t * 0.04),
      fbm(flowCoord + vec2(5.2, 1.3) + t * 0.02)
    );
    
    vec2 r = flowCoord + q * 0.35;
    float f = fbm(r);
    float contour = sin(f * 18.0 - t * 1.2);
    
    vec3 bgColor = mix(vec3(1.0), vec3(0.0), u_dark);
    vec3 lineColor = mix(vec3(0.0), vec3(1.0), u_dark);
    float line = smoothstep(0.965, 0.985, abs(contour));
    vec3 col = mix(bgColor, lineColor, line);
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

const FRAGMENT_SHADERS = {
  beige: BEIGE_SHADER,
  mist: MIST_SHADER,
  lava: LAVA_SHADER,
  vortex: VORTEX_SHADER,
} as const;

export function AnimatedGradient({
  className,
  variant = "beige",
  speed = 1,
  opacity = 1,
  interactive = true,
  children,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const touchState = useRef({
    currentX: 0.5,
    currentY: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    velocity: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShaderSource =
      FRAGMENT_SHADERS[variant] || FRAGMENT_SHADERS.beige;
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const darkLocation = gl.getUniformLocation(program, "u_dark");
    const touchLocation = gl.getUniformLocation(program, "u_touch");

    // Touch and pointer responsiveness across whole viewport
    const updateTargetPosition = (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / (rect.width || 1)));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / (rect.height || 1)));
      const dx = x - touchState.current.targetX;
      const dy = y - touchState.current.targetY;
      touchState.current.targetX = x;
      touchState.current.targetY = y;
      touchState.current.velocity = Math.min(2.5, touchState.current.velocity + Math.hypot(dx, dy) * 8);
    };

    const handlePointerMove = (e: Event) => {
      const pe = e as PointerEvent;
      if (interactive) {
        updateTargetPosition(pe.clientX, pe.clientY);
      }
    };

    const handleTouchMove = (e: Event) => {
      const te = e as TouchEvent;
      if (interactive && te.touches.length > 0) {
        updateTargetPosition(te.touches[0].clientX, te.touches[0].clientY);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let accumulatedTime = 0;
    let lastTimestamp = performance.now();

    const render = () => {
      const now = performance.now();
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      // Smooth touch interpolation
      touchState.current.currentX += (touchState.current.targetX - touchState.current.currentX) * 0.08;
      touchState.current.currentY += (touchState.current.targetY - touchState.current.currentY) * 0.08;
      touchState.current.velocity *= 0.94;

      const dynamicSpeed = speed + touchState.current.velocity;
      accumulatedTime += delta * dynamicSpeed;

      gl.uniform1f(timeLocation, accumulatedTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      if (touchLocation) {
        gl.uniform2f(
          touchLocation,
          touchState.current.currentX,
          touchState.current.currentY
        );
      }

      if (darkLocation) {
        const isDark =
          document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark" ||
          (!document.documentElement.classList.contains("light") &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        gl.uniform1f(darkLocation, isDark ? 1.0 : 0.0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [variant, speed, interactive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-[#FAF7F2] touch-auto",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ opacity }}
      />
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
}

export default AnimatedGradient;
