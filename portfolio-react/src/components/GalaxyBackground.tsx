import { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
    className?: string;
}

export const GalaxyBackground = ({ className = '' }: GalaxyBackgroundProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.warn('WebGL2 not supported');
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);

        const vs = `#version 300 es
      in vec2 position;
      in vec2 uv;
      out vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 0, 1); }`;

        const fs = `#version 300 es
      precision highp float;
      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec2 uFocal;
      uniform vec2 uRotation;
      uniform float uStarSpeed;
      uniform float uDensity;
      uniform float uHueShift;
      uniform float uSpeed;
      uniform vec2 uMouse;
      uniform float uGlowIntensity;
      uniform float uSaturation;
      uniform bool uMouseRepulsion;
      uniform float uTwinkleIntensity;
      uniform float uRotationSpeed;
      uniform float uRepulsionStrength;
      uniform float uMouseActiveFactor;
      uniform float uAutoCenterRepulsion;
      uniform bool uTransparent;
      in vec2 vUv;
      out vec4 fragColor;

      #define NUM_LAYER 4.0
      #define STAR_COLOR_CUTOFF 0.2
      #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
      #define PERIOD 3.0

      float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
      float tris(float x) { float t = fract(x); return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0)); }
      float trisn(float x) { float t = fract(x); return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0; }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      float Star(vec2 uv, float flare) {
        float d = length(uv);
        float m = (0.05 * uGlowIntensity) / d;
        float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare * uGlowIntensity;
        uv *= MAT45;
        rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare * uGlowIntensity;
        m *= smoothstep(1.0, 0.2, d);
        return m;
      }

      vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);
        vec2 gv = fract(uv) - 0.5;
        vec2 id = floor(uv);
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 si = id + offset;
            float seed = Hash21(si);
            float size = fract(seed * 345.32);
            float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
            float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
            float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
            float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
            float grn = min(red, blu) * seed;
            vec3 base = vec3(red, grn, blu);
            float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
            hue = fract(hue + uHueShift / 360.0);
            float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
            float val = max(max(base.r, base.g), base.b);
            base = hsv2rgb(vec3(hue, sat, val));
            vec2 pad = vec2(tris(seed*34.0 + uTime*uSpeed/10.0), tris(seed*38.0 + uTime*uSpeed/30.0)) - 0.5;
            float star = Star(gv - offset - pad, flareSize);
            float twinkle = trisn(uTime*uSpeed + seed*6.2831)*0.5 + 1.0;
            twinkle = mix(1.0, twinkle, uTwinkleIntensity);
            star *= twinkle;
            col += star * size * base;
          }
        }
        return col;
      }

      void main() {
        vec2 focalPx = uFocal * uResolution.xy;
        vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
        vec2 mouseNorm = uMouse - vec2(0.5);
        if (uAutoCenterRepulsion > 0.0) {
          vec2 centerUV = vec2(0.0);
          float centerDist = length(uv - centerUV);
          vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
          uv += repulsion * 0.05;
        } else if (uMouseRepulsion) {
          vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
          float mouseDist = length(uv - mousePosUV);
          vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
          uv += repulsion * 0.05 * uMouseActiveFactor;
        } else {
          uv += mouseNorm * 0.1 * uMouseActiveFactor;
        }
        float autoRotAngle = uTime * uRotationSpeed;
        mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
        uv = autoRot * uv;
        uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
        vec3 col = vec3(0.0);
        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
          float depth = fract(i + uStarSpeed * uSpeed);
          float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
          float fade = depth * smoothstep(1.0, 0.9, depth);
          col += StarLayer(uv * scale + i * 453.32) * fade;
        }
        if (uTransparent) {
          float alpha = length(col);
          alpha = smoothstep(0.0, 0.3, alpha);
          fragColor = vec4(col, min(alpha, 1.0));
        } else {
          fragColor = vec4(col, 1.0);
        }
      }`;

        const compile = (src: string, type: number) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error('Shader error:', gl.getShaderInfoLog(s));
            }
            return s;
        };

        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(vs, gl.VERTEX_SHADER));
        gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const verts = new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(prog, 'position');
        const uvLoc = gl.getAttribLocation(prog, 'uv');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

        const u = {
            uTime: gl.getUniformLocation(prog, 'uTime'),
            uResolution: gl.getUniformLocation(prog, 'uResolution'),
            uFocal: gl.getUniformLocation(prog, 'uFocal'),
            uRotation: gl.getUniformLocation(prog, 'uRotation'),
            uStarSpeed: gl.getUniformLocation(prog, 'uStarSpeed'),
            uDensity: gl.getUniformLocation(prog, 'uDensity'),
            uHueShift: gl.getUniformLocation(prog, 'uHueShift'),
            uSpeed: gl.getUniformLocation(prog, 'uSpeed'),
            uMouse: gl.getUniformLocation(prog, 'uMouse'),
            uGlowIntensity: gl.getUniformLocation(prog, 'uGlowIntensity'),
            uSaturation: gl.getUniformLocation(prog, 'uSaturation'),
            uMouseRepulsion: gl.getUniformLocation(prog, 'uMouseRepulsion'),
            uTwinkleIntensity: gl.getUniformLocation(prog, 'uTwinkleIntensity'),
            uRotationSpeed: gl.getUniformLocation(prog, 'uRotationSpeed'),
            uRepulsionStrength: gl.getUniformLocation(prog, 'uRepulsionStrength'),
            uMouseActiveFactor: gl.getUniformLocation(prog, 'uMouseActiveFactor'),
            uAutoCenterRepulsion: gl.getUniformLocation(prog, 'uAutoCenterRepulsion'),
            uTransparent: gl.getUniformLocation(prog, 'uTransparent'),
        };

        // Defaults matching old code
        gl.uniform2fv(u.uFocal, [0.5, 0.5]);
        gl.uniform2fv(u.uRotation, [1.0, 0.0]);
        gl.uniform1f(u.uDensity, 1);
        gl.uniform1f(u.uHueShift, 140);
        gl.uniform1f(u.uSpeed, 1.0);
        gl.uniform1f(u.uGlowIntensity, 0.3);
        gl.uniform1f(u.uSaturation, 0.0);
        gl.uniform1i(u.uMouseRepulsion, 1);
        gl.uniform1f(u.uTwinkleIntensity, 0.3);
        gl.uniform1f(u.uRotationSpeed, 0.1);
        gl.uniform1f(u.uRepulsionStrength, 2);
        gl.uniform1f(u.uAutoCenterRepulsion, 0);
        gl.uniform1i(u.uTransparent, 1);

        let rafId: number;
        let isVisible = false;
        const mouseContext = {
            mouse: { x: 0.5, y: 0.5 },
            smoothMouse: { x: 0.5, y: 0.5 },
            mouseActive: 0,
            smoothMouseActive: 0
        };

        const resize = () => {
            const w = container.offsetWidth;
            const h = container.offsetHeight;
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
            gl.useProgram(prog);
            gl.uniform3f(u.uResolution, w, h, w / h);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            mouseContext.mouse.x = (e.clientX - rect.left) / rect.width;
            mouseContext.mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
            mouseContext.mouseActive = 1.0;
        };

        const handleMouseLeave = () => {
            mouseContext.mouseActive = 0.0;
        };

        const animate = (t: number) => {
            if (!isVisible) return;

            rafId = requestAnimationFrame(animate);
            gl.useProgram(prog);

            const time = t * 0.001;
            gl.uniform1f(u.uTime, time);
            gl.uniform1f(u.uStarSpeed, (time * 0.5) / 10.0);

            const lf = 0.05;
            mouseContext.smoothMouse.x += (mouseContext.mouse.x - mouseContext.smoothMouse.x) * lf;
            mouseContext.smoothMouse.y += (mouseContext.mouse.y - mouseContext.smoothMouse.y) * lf;
            mouseContext.smoothMouseActive += (mouseContext.mouseActive - mouseContext.smoothMouseActive) * lf;

            gl.uniform2f(u.uMouse, mouseContext.smoothMouse.x, mouseContext.smoothMouse.y);
            gl.uniform1f(u.uMouseActiveFactor, mouseContext.smoothMouseActive);

            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !rafId) {
                animate(performance.now());
            } else if (!isVisible && rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }, { threshold: 0 });

        resize();
        window.addEventListener('resize', resize);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);
        observer.observe(container);

        return () => {
            window.removeEventListener('resize', resize);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
            gl.deleteProgram(prog);
            gl.deleteBuffer(buf);
        };
    }, []);

    return (
        <div ref={containerRef} className={`absolute inset-0 pointer-events-auto overflow-hidden -z-20 ${className}`}>
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};
