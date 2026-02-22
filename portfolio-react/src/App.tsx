import { PillNav } from './components/PillNav';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { useEffect } from 'react';

function App() {
  // Global custom cursor effect
  useEffect(() => {
    const cursor = document.createElement('div');
    const glow = document.createElement('div');

    cursor.className = 'fixed w-4 h-4 rounded-full border border-primary pointer-events-none z-[9999] transition-transform duration-100 mix-blend-difference hidden md:block';
    glow.className = 'fixed w-32 h-32 rounded-full bg-primary/20 blur-[30px] pointer-events-none z-[9998] transition-all duration-500 hidden md:block';

    document.body.appendChild(cursor);
    document.body.appendChild(glow);

    let isClicking = false;

    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px) ${isClicking ? 'scale(0.8)' : 'scale(1)'}`;
      glow.style.transform = `translate(${e.clientX - 64}px, ${e.clientY - 64}px)`;
    };

    const onDown = () => { isClicking = true; cursor.style.transform = cursor.style.transform.replace('scale(1)', 'scale(0.8)'); };
    const onUp = () => { isClicking = false; cursor.style.transform = cursor.style.transform.replace('scale(0.8)', 'scale(1)'); };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cursor.remove();
      glow.remove();
    };
  }, []);

  return (
    <div className="bg-background text-textMain antialiased selection:bg-primary/30 selection:text-white relative">
      <PillNav />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
