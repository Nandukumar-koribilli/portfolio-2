import { useEffect, useRef, useState } from 'react';

export const ContactSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const [images] = useState<HTMLImageElement[]>([]);
    const frameCount = 60; // Total frames for sequence

    // Custom Hook Logic for Sequence Scroll
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isVisible = false;
        let rafId: number;

        // Create a smooth scroll progress value
        const scroll = { current: 0, target: 0, ease: 0.1 };

        // Placeholder: Preload sequence images
        // Note: Since this is a local port, we assume frames exist in public/sequence/
        let loadedImages = 0;
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Fallback transparent pixel if no sequence assets exist yet
            img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`;

            // In the real app, we'd use:
            // img.src = `/sequence/${String(i).padStart(4, '0')}.webp`;

            img.onload = () => {
                loadedImages++;
                if (loadedImages === frameCount) {
                    drawFrame(0);
                }
            };
            images.push(img);
        }

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (loadedImages === frameCount) {
                drawFrame(Math.floor(scroll.current * (frameCount - 1)));
            }
        };

        const drawFrame = (index: number) => {
            if (!images[index] || !isVisible) return;

            const img = images[index];
            const scale = Math.max(
                canvas.width / img.width,
                canvas.height / img.height
            );
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Optional dark overlay
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalAlpha = 0.15; // Subtle overlay token
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            ctx.globalAlpha = 1.0;
        };

        const updateScroll = () => {
            if (!isVisible) return;
            rafId = requestAnimationFrame(updateScroll);

            scroll.current += (scroll.target - scroll.current) * scroll.ease;

            if (Math.abs(scroll.target - scroll.current) > 0.001) {
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.max(0, Math.floor(scroll.current * (frameCount - 1)))
                );
                drawFrame(frameIndex);
            }
        };

        const onScroll = () => {
            if (!isVisible) return;
            const rect = container.getBoundingClientRect();
            // Calculate scroll progress through this specific section
            const progress = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight)));
            scroll.target = progress;
        };

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible) {
                if (!rafId) updateScroll();
            } else {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }, { threshold: 0 });

        window.addEventListener('resize', setCanvasSize);
        window.addEventListener('scroll', onScroll, { passive: true });
        observer.observe(container);
        setCanvasSize();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            window.removeEventListener('scroll', onScroll);
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [images]);

    return (
        <section id="contact" ref={containerRef} className="relative h-[200vh] bg-background">
            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none -z-10"
                />

                <div className="z-10 relative px-4 max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-4 mb-8 reveal-up">
                        <span className="text-primary font-display font-medium text-lg">05</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold">
                            Let's <span className="text-gradient">Connect</span>
                        </h2>
                        <div className="flex-1 h-px bg-white/10 ml-4 hidden md:block max-w-[100px]"></div>
                    </div>

                    <p className="text-xl text-textMuted max-w-2xl mx-auto mb-12">
                        Got a project in mind? Looking for an AI/ML or Full Stack collaborator?
                        Let's build something extraordinary together.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <a href="mailto:nandukumar9980@gmail.com" className="flex flex-col items-center justify-center p-8 glass-card hover:-translate-y-2 !duration-300 group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✉️</span>
                            <span className="text-white font-bold mb-1">Email</span>
                            <span className="text-textMuted text-sm font-mono">nandukumar9980@gmail.com</span>
                        </a>

                        <a href="tel:+919390735608" className="flex flex-col items-center justify-center p-8 glass-card hover:-translate-y-2 !duration-300 group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📱</span>
                            <span className="text-white font-bold mb-1">Phone</span>
                            <span className="text-textMuted text-sm font-mono">+91-9390735608</span>
                        </a>

                        <a href="https://linkedin.com/in/nandukumar-koribilli-062ba42a2" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 glass-card hover:-translate-y-2 !duration-300 group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔗</span>
                            <span className="text-white font-bold mb-1">LinkedIn</span>
                            <span className="text-textMuted text-sm font-mono">Connect professionally</span>
                        </a>

                        <a href="https://github.com/Nandukumar-koribilli" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-8 glass-card hover:-translate-y-2 !duration-300 group">
                            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💻</span>
                            <span className="text-white font-bold mb-1">GitHub</span>
                            <span className="text-textMuted text-sm font-mono">View source code</span>
                        </a>
                    </div>
                </div>

                {/* Footer text */}
                <footer className="absolute bottom-8 text-center w-full">
                    <span className="font-display font-bold text-xl tracking-widest text-white/50 mb-2 block">NK<span className="text-primary">.</span></span>
                    <p className="text-sm text-textMuted font-mono">Designed & Built by Nandu Kumar Koribilli</p>
                    <p className="text-xs text-textMuted/50 font-mono mt-1">© 2026 — All Rights Reserved</p>
                </footer>
            </div>
        </section>
    );
};
