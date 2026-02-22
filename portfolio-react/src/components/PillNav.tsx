import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';

// We'll use standard gsap
import baseGsap from 'gsap';
baseGsap.registerPlugin(useGSAP);

const NAV_ITEMS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Contact', href: '#contact' },
];

export const PillNav = () => {
    const containerRef = useRef<HTMLElement>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { contextSafe } = useGSAP({ scope: containerRef });

    const handlePillHover = contextSafe((e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) => {
        const pill = e.currentTarget;
        const circle = pill.querySelector('.hover-circle');
        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (!circle || !label || !hoverLabel) return;

        // Calculate GSAP geometric dimensions dynamically like the original PillNav class does
        const rect = pill.getBoundingClientRect();
        const R = (rect.width * rect.width / 4 + rect.height * rect.height) / (2 * rect.height);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - rect.width * rect.width / 4))) + 1;

        baseGsap.set(circle, {
            width: D, height: D, bottom: -delta,
            transformOrigin: `50% ${D - delta}px`
        });

        if (isEnter) {
            baseGsap.to(circle, { scale: 1.2, xPercent: -50, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
            baseGsap.to(label, { y: -(rect.height + 8), duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
            baseGsap.fromTo(hoverLabel,
                { y: rect.height + 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' }
            );
        } else {
            baseGsap.to(circle, { scale: 0, xPercent: -50, duration: 0.2, ease: 'power3.out', overwrite: 'auto' });
            baseGsap.to(label, { y: 0, duration: 0.2, ease: 'power3.out', overwrite: 'auto' });
            baseGsap.to(hoverLabel, { y: rect.height + 20, opacity: 0, duration: 0.2, ease: 'power3.out', overwrite: 'auto' });
        }
    });

    return (
        <nav ref={containerRef} className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90vw] md:max-w-none flex justify-center">
            <div className="flex items-center gap-1.5 p-1.5 bg-surface/80 backdrop-blur-md rounded-full border border-white/5 shadow-2xl">

                {/* Logo */}
                <a href="#home" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white font-display font-bold shrink-0 hover:bg-white/10 transition-colors">
                    NK
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="pill relative overflow-hidden px-5 py-2.5 rounded-full text-sm font-medium text-textMuted no-underline flex items-center justify-center"
                            onMouseEnter={(e) => handlePillHover(e, true)}
                            onMouseLeave={(e) => handlePillHover(e, false)}
                        >
                            <div className="hover-circle absolute left-1/2 bg-white -z-10 rounded-full scale-0 -translate-x-1/2" />
                            <div className="relative h-5 overflow-hidden flex flex-col justify-start pointer-events-none">
                                <span className="pill-label block text-white transition-colors">{item.label}</span>
                                <span className="pill-label-hover block absolute text-background font-bold top-0 left-0 w-full text-center opacity-0">{item.label}</span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden ml-auto w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-full border border-white/10 relative z-50"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <span className={`block w-4 h-px bg-white transition-transform ${isMobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
                    <span className={`block w-4 h-px bg-white transition-transform ${isMobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-background/95 backdrop-blur-xl z-40 transition-opacity duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {NAV_ITEMS.map((item) => (
                    <a
                            key={item.label}
                            href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="text-4xl font-display font-bold text-white/50 hover:text-white transition-colors"
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};
