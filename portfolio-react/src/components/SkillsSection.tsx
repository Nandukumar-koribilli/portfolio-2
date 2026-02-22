import { useRef, useEffect } from "react";
import gsap from "gsap";

export const SkillsSection = () => {
    const marqueeRef1 = useRef<HTMLDivElement>(null);
    const marqueeRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!marqueeRef1.current || !marqueeRef2.current) return;

        // Infinite Marquee animations using GSAP
        gsap.to(marqueeRef1.current, {
            xPercent: -50,
            ease: "none",
            duration: 30,
            repeat: -1,
        });

        gsap.to(marqueeRef2.current, {
            xPercent: 50,
            ease: "none",
            duration: 35,
            repeat: -1,
        });
    }, []);

    const row1 = ["JavaScript", "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "MongoDB", "Docker"];
    const row2 = ["Python", "Machine Learning", "FastAPI", "TensorFlow", "TailwindCSS", "Figma", "AWS", "Git"];

    return (
        <section id="skills" className="relative py-32 bg-background overflow-hidden snap-start">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10 mb-16">
                <div className="flex items-center gap-4 reveal-up">
                    <span className="text-primary font-display font-medium text-lg">02</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">
                        Technical <span className="text-gradient">Arsenal</span>
                    </h2>
                    <div className="flex-1 h-px bg-white/10 ml-4 hidden md:block"></div>
                </div>
            </div>

            <div className="w-full relative flex flex-col gap-8 -rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Marquee Row 1 */}
                <div className="relative flex overflow-hidden group">
                    <div ref={marqueeRef1} className="flex gap-8 px-4 w-max whitespace-nowrap">
                        {[...row1, ...row1, ...row1].map((skill, i) => (
                            <div
                                key={`${skill}-${i}`}
                                className="flex font-display font-bold text-4xl sm:text-6xl lg:text-8xl items-center text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/20 hover:text-primary transition-colors cursor-default"
                                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
                            >
                                {skill}
                                <span className="mx-8 text-white/10 text-4xl">•</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marquee Row 2 (Reverse) */}
                <div className="relative flex overflow-hidden group justify-end">
                    <div ref={marqueeRef2} className="flex gap-8 px-4 w-max whitespace-nowrap flex-row-reverse -translate-x-1/2">
                        {[...row2, ...row2, ...row2].map((skill, i) => (
                            <div
                                key={`${skill}-${i}-rev`}
                                className="flex font-display font-bold text-4xl sm:text-6xl lg:text-8xl items-center text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/20 hover:text-secondary transition-colors cursor-default"
                                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
                            >
                                <span className="mx-8 text-white/10 text-4xl">•</span>
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
