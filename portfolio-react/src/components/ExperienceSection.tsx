import { useEffect, useRef } from "react";
import gsap from "gsap";

const ROLES = [
    "Full Stack Developer",
    "AI Enthusiast",
    "UI/UX Designer",
    "Problem Solver",
];

export const ExperienceSection = () => {
    const roleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!roleRef.current) return;
        const el = roleRef.current;
        let currentIndex = 0;

        const rotateRole = () => {
            gsap.to(el, {
                y: -10,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentIndex = (currentIndex + 1) % ROLES.length;
                    if (el) {
                        el.textContent = ROLES[currentIndex];
                        gsap.fromTo(
                            el,
                            { y: 10, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.3 }
                        );
                    }
                },
            });
        };

        const interval = setInterval(rotateRole, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="experience" className="relative py-24 snap-start">
            <div className="max-w-4xl mx-auto px-4">

                <div className="flex items-center gap-4 mb-16 reveal-up">
                    <span className="text-secondary font-display font-medium text-lg">03</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">
                        Professional <span className="text-gradient">Experience</span>
                    </h2>
                    <div className="flex-1 h-px bg-white/10 ml-4 hidden md:block"></div>
                </div>

                <div className="glass-card mb-12 p-8 border-secondary/20 bg-secondary/5 reveal-up relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold">
                                As a <span ref={roleRef} className="text-secondary inline-block min-w-[200px]">{ROLES[0]}</span>
                            </h3>
                            <p className="text-textMuted mt-1">Remote / Contract</p>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold border border-secondary/20 w-fit">
                            2024 — Present
                        </div>
                    </div>

                    <ul className="space-y-4 text-textMuted text-lg relative z-10">
                        <li className="flex gap-3">
                            <span className="text-secondary font-bold">▹</span>
                            Architecting modular, scalable Next.js and React applications tailored to client specifications.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-secondary font-bold">▹</span>
                            Integrating AI workflows (LLMs, custom ML APIs) into consumer-facing platforms to boost user engagement by 40%.
                        </li>
                        <li className="flex gap-3">
                            <span className="text-secondary font-bold">▹</span>
                            Designing high-fidelity UI/UX systems in Figma, ensuring 100% WCAG accessibility compliance prior to frontend build.
                        </li>
                    </ul>

                    <div className="mt-8 flex flex-wrap justify-start gap-2">
                        {["React 19", "Next.js", "Zustand", "TailwindCSS", "Figma", "OpenAI"].map((tech) => (
                            <span key={tech} className="text-xs font-mono px-3 py-1 rounded bg-white/5 border border-white/10 text-white/70">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
