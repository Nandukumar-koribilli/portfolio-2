import { useEffect, useRef } from 'react';

export const HeroSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId: number;
        let isVisible = false;
        const mouse = { x: 0, y: 0 };
        const rotation = { x: 0, y: 0 };
        let center = { x: 0, y: 0 };
        let scale = 0;

        // Icosahedron Vertices & Edges
        const t = (1 + Math.sqrt(5)) / 2;
        const vertices = [
            [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
            [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
            [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
        ].map(v => {
            const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            return [v[0] / mag, v[1] / mag, v[2] / mag];
        });

        const edges: [number, number][] = [];
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const d = Math.hypot(
                    vertices[i][0] - vertices[j][0],
                    vertices[i][1] - vertices[j][1],
                    vertices[i][2] - vertices[j][2]
                );
                if (d < 1.1) edges.push([i, j]);
            }
        }

        const rotate = (v: number[], ax: number, ay: number) => {
            let [x, y, z] = v;
            // Rotate X
            let ny = y * Math.cos(ax) - z * Math.sin(ax);
            let nz = y * Math.sin(ax) + z * Math.cos(ax);
            y = ny; z = nz;
            // Rotate Y
            let nx = x * Math.cos(ay) + z * Math.sin(ay);
            nz = -x * Math.sin(ay) + z * Math.cos(ay);
            x = nx; z = nz;
            return [x, y, z];
        };

        const handleResize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            center = { x: canvas.width / 2, y: canvas.height / 2 };
            scale = Math.min(canvas.width, canvas.height) * 0.35;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth) - 0.5;
            mouse.y = (e.clientY / window.innerHeight) - 0.5;
        };

        const animate = () => {
            if (!isVisible) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rotation.x += 0.005 + mouse.y * 0.02;
            rotation.y += 0.008 + mouse.x * 0.02;

            const projected = vertices.map(v => {
                const r = rotate(v, rotation.x, rotation.y);
                const perspective = 3 / (3 - r[2]);
                return [
                    center.x + r[0] * scale * perspective,
                    center.y + r[1] * scale * perspective
                ];
            });

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)'; // primary token mapping
            ctx.lineWidth = 1;
            for (const [i, j] of edges) {
                ctx.moveTo(projected[i][0], projected[i][1]);
                ctx.lineTo(projected[j][0], projected[j][1]);
            }
            ctx.stroke();

            rafId = requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) {
                if (!rafId) animate();
            } else {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }, { threshold: 0 });

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        observer.observe(container);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start">
            {/* 3D Canvas Background */}
            <div ref={containerRef} className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            <div className="z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 mt-16 md:mt-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 bg-primary/5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary text-sm font-medium tracking-wide">Available for Development Roles</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold leading-[1.1] tracking-tight">
                    Crafting Digital <br />
                    <span className="text-gradient">Experiences</span>
                </h1>

                <p className="text-lg md:text-xl text-textMuted max-w-2xl text-center leading-relaxed">
                    I'm Nandu Kumar Koribilli, a Full Stack Developer specializing in React, Next.js, and AI integrations.
                    I build scalable, secure, and beautiful web applications.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
                    <a href="#projects" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-background font-bold hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        View My Work
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </a>
                    <a href="#contact" className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/10 hover:-translate-y-1 transition-all font-medium flex items-center justify-center">
                        Contact Me
                    </a>
                </div>
            </div>
        </section>
    );
};
