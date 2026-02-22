import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Scene, Renderer, Camera, Plane, Program, Texture, Mesh } from 'ogl';

// Shader definitions for the 3D gallery
const vertex = `
  attribute vec2 uv;
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uOffset;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Apply a subtle bend to create the circular effect
    pos.z = sin(pos.x * 2.5 + uOffset) * 0.15;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(tMap, vUv);
    gl_FragColor = vec4(tex.rgb, tex.a * uAlpha);
  }
`;

interface Repo {
    id: number;
    name: string;
    description: string;
    html_url: string;
}

export const ProjectsSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const glRef = useRef<HTMLDivElement>(null);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const PRIORITY_REPOS = useMemo(() => ['CardiAI', 'Crop-Yield-Prediction', 'Agnit-s-Aura-Chatbot'], []);

    // 1. Fetch Repos
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/Nandukumar-koribilli/repos?sort=updated&per_page=100`);
                const data = await response.json();
                const filtered = data.filter((r: any) => !r.fork && r.description);

                const sorted = [...filtered].sort((a, b) => {
                    const aPri = PRIORITY_REPOS.indexOf(a.name);
                    const bPri = PRIORITY_REPOS.indexOf(b.name);
                    if (aPri !== -1 && bPri !== -1) return aPri - bPri;
                    if (aPri !== -1) return -1;
                    if (bPri !== -1) return 1;
                    return 0;
                }).slice(0, 8);

                setRepos(sorted);
            } catch (error) {
                console.error("Failed to fetch repos", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRepos();
    }, [PRIORITY_REPOS]);

    // 2. Generate Textures from Repos
    const generateTexture = useCallback((repo: Repo, index: number) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 1024;
        canvas.height = 1024;

        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
        grad.addColorStop(0, '#121212');
        grad.addColorStop(1, '#050505');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Glass reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1024, 0);
        ctx.lineTo(0, 1024);
        ctx.fill();

        // Accents
        ctx.strokeStyle = index % 2 === 0 ? '#00f0ff' : '#ff00aa';
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, 984, 984);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px Outfit';
        ctx.fillText(repo.name.toUpperCase(), 100, 400);

        ctx.font = '40px Inter';
        ctx.fillStyle = '#a0a0a0';
        const desc = repo.description.length > 100 ? repo.description.slice(0, 100) + '...' : repo.description;
        
        // Wrap description
        const words = desc.split(' ');
        let line = '';
        let y = 500;
        words.forEach(word => {
            if ((line + word).length > 30) {
                ctx.fillText(line, 100, y);
                line = word + ' ';
                y += 60;
            } else {
                line += word + ' ';
            }
        });
        ctx.fillText(line, 100, y);

        ctx.fillStyle = index % 2 === 0 ? '#00f0ff' : '#ff00aa';
        ctx.font = 'bold 30px Inter';
        ctx.fillText('CLICK TO VIEW SOURCE →', 100, 900);

        return canvas;
    }, []);

    // 3. OGL Multi-plane Scene
    useEffect(() => {
        if (isLoading || !repos.length || !glRef.current) return;

        const container = glRef.current;
        const renderer = new Renderer({ alpha: true, antialias: true });
        const gl = renderer.gl;
        container.appendChild(gl.canvas);

        const scene = new Scene();
        const camera = new Camera(gl, { fov: 35 });
        camera.position.z = 5;

        const resize = () => {
            renderer.setSize(container.clientWidth, container.clientHeight);
            camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
        };
        window.addEventListener('resize', resize, false);
        resize();

        const geometry = new Plane(gl, { width: 1.5, height: 1.5, widthSegments: 20 });
        const meshes: Mesh[] = [];

        repos.forEach((repo, i) => {
            const texture = new Texture(gl, {
                image: generateTexture(repo, i),
                generateMipmaps: false,
            });

            const program = new Program(gl, {
                vertex,
                fragment,
                uniforms: {
                    tMap: { value: texture },
                    uOffset: { value: 0 },
                    uAlpha: { value: 0 },
                },
                transparent: true,
            });

            const mesh = new Mesh(gl, { geometry, program });
            
            // Layout in a circular pattern or grid
            mesh.position.x = (i - (repos.length - 1) / 2) * 1.8;
            mesh.userData = { url: repo.html_url };
            
            scene.addChild(mesh);
            meshes.push(mesh);
        });

        let rafId: number;
        let mouseX = 0;
        let smoothX = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 4;
        };

        const onClick = (e: MouseEvent) => {
            const rect = gl.canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Simple click-to-link logic (could be improved with raycasting)
            meshes.forEach(m => {
                const screenPos = (m.position.x - smoothX);
                if (Math.abs(x * 5 - screenPos) < 1) {
                    window.open(m.userData.url, '_blank');
                }
            });
        };

        window.addEventListener('mousemove', onMouseMove);
        gl.canvas.addEventListener('click', onClick);

        const update = () => {
            smoothX += (mouseX - smoothX) * 0.05;
            
            meshes.forEach((mesh, i) => {
                mesh.position.x = ((i - (repos.length - 1) / 2) * 1.8) - smoothX;
                // Fade in based on distance from center
                const dist = Math.abs(mesh.position.x);
                mesh.program.uniforms.uAlpha.value = Math.max(0, 1 - dist * 0.4);
                mesh.program.uniforms.uOffset.value = smoothX * 0.5;
            });

            renderer.render({ scene, camera });
            rafId = requestAnimationFrame(update);
        };
        update();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
            container.removeChild(gl.canvas);
        };
    }, [isLoading, repos, generateTexture]);

    return (
        <section id="projects" className="relative min-h-screen py-24 bg-surface snap-start">
            <div className="max-w-6xl mx-auto px-4 relative z-10 pointer-events-none">
                <div className="flex items-center gap-4 mb-4 reveal-up">
                    <span className="text-secondary font-display font-medium text-lg">04</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">
                        Digital <span className="text-gradient-alt">Creations</span>
                    </h2>
                    <div className="flex-1 h-px bg-white/10 ml-4 hidden md:block"></div>
                </div>
                <p className="text-textMuted max-w-xl mb-12 reveal-up">
                    A selection of open-source projects fetched directly from GitHub. 
                    Interact with the WebGL gallery and explore the codebase.
                </p>
            </div>

            {/* OGL Canvas Container */}
            <div 
                ref={glRef} 
                className="w-full h-[600px] cursor-grab active:cursor-grabbing"
            />

            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface/50 backdrop-blur-sm z-20">
                    <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                    <p className="font-mono text-secondary animate-pulse text-sm">FETCHING GITHUB REPOS...</p>
                </div>
            )}
        </section>
    );
};
