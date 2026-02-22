import { useState, useEffect } from 'react';
import { GalaxyBackground } from './GalaxyBackground';

export const AboutSection = () => {
    const [displayText, setDisplayText] = useState('');
    const objectiveText = "A passionate Computer Science student and Full Stack Developer. I craft seamless digital experiences that solve real-world problems and push the boundaries of modern web tech.";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayText(objectiveText.slice(0, index));
            index++;
            if (index > objectiveText.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="about" className="relative min-h-[80vh] flex items-center justify-center py-24 overflow-hidden snap-start">
            <GalaxyBackground />

            <div className="z-10 max-w-5xl mx-auto px-4 w-full">
                <div className="flex items-center gap-4 mb-12">
                    <span className="text-primary font-display font-medium text-lg">01</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">
                        Defining <span className="text-gradient">Gravity</span>
                    </h2>
                    <div className="flex-1 h-px bg-white/10 ml-4 hidden md:block"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white/90">The Journey</h3>
                        <div className="glass-card p-6 h-48 border-primary/20 bg-background/40">
                            <p className="text-lg text-textMuted font-mono h-full">
                                <span className="text-primary">{'>'}</span> {displayText}
                                <span className="inline-block w-2 bg-primary h-5 ml-1 animate-pulse"></span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-6 text-center hover:bg-white/10 transition-colors">
                            <h4 className="text-3xl font-bold text-primary mb-2">10+</h4>
                            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold">Projects Built</p>
                        </div>
                        <div className="glass-card p-6 text-center hover:bg-white/10 transition-colors">
                            <h4 className="text-3xl font-bold text-secondary mb-2">3+</h4>
                            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold">Hackathons</p>
                        </div>
                        <div className="glass-card p-6 text-center hover:bg-white/10 transition-colors">
                            <h4 className="text-3xl font-bold text-white mb-2">2x</h4>
                            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold">Certifications</p>
                        </div>
                        <div className="glass-card p-6 text-center hover:bg-white/10 transition-colors">
                            <h4 className="text-3xl font-bold text-primary mb-2">∞</h4>
                            <p className="text-sm text-textMuted uppercase tracking-wider font-semibold">Lines of Code</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
