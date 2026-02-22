// GSAP Registration
if (typeof gsap !== 'undefined') {
    // gsap.registerPlugin(ScrollTrigger);
}

/**
 * UTILS & CONSTANTS
 */
const COLORS = {
    primary: '#00f0ff',
    secondary: '#ff00aa',
    background: '#0a0a0a',
    surface: '#121212',
    text: '#ffffff',
    muted: '#a0a0a0'
};

const lerp = (a, b, n) => (1 - n) * a + n * b;

/**
 * REVEAL ANIMATIONS (Reveal Up)
 */
const initReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => {
        revealObserver.observe(el);
    });
};

/**
 * PILL NAVIGATION LOGIC
 */
class PillNav {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.items = document.querySelectorAll('.pill');
        this.logo = document.getElementById('pillLogo');
        this.hamburger = document.getElementById('pillHamburger');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileLinks = document.querySelectorAll('.mobile-menu-link');
        this.lastScrollY = window.scrollY;
        this.isMobileOpen = false;

        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.addEventListener('mouseenter', (e) => this.handleHover(e, true));
            item.addEventListener('mouseleave', (e) => this.handleHover(e, false));
            item.addEventListener('click', (e) => this.handleClick(e));
        });

        this.mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.toggleMobileMenu(false);
                this.setActiveSection(link.getAttribute('href').substring(1));
            });
        });

        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Initial Active State
        this.handleScroll();
    }

    handleHover(e, isEnter) {
        if (window.innerWidth < 768) return;

        const pill = e.currentTarget;
        const circle = pill.querySelector('.hover-circle');
        const label = pill.querySelector('.pill-label');
        const hoverLabel = pill.querySelector('.pill-label-hover');

        if (!circle) return;

        // Calculate Circle Geometry (R-delta mathematics for perfect fit)
        const rect = pill.getBoundingClientRect();
        const R = (rect.width * rect.width / 4 + rect.height * rect.height) / (2 * rect.height);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - rect.width * rect.width / 4))) + 1;

        gsap.set(circle, {
            width: D,
            height: D,
            bottom: -delta,
            transformOrigin: `50% ${D - delta}px`
        });

        if (isEnter) {
            gsap.to(circle, {
                scale: 1.2,
                xPercent: -50,
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto'
            });
            gsap.to(label, {
                y: -(rect.height + 8),
                duration: 0.4,
                ease: 'power3.out',
                overwrite: 'auto'
            });
            gsap.fromTo(hoverLabel,
                { y: rect.height + 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }
            );
        } else {
            gsap.to(circle, {
                scale: 0,
                xPercent: -50,
                duration: 0.3,
                ease: 'power3.in',
                overwrite: 'auto'
            });
            gsap.to(label, {
                y: 0,
                duration: 0.3,
                ease: 'power3.in',
                overwrite: 'auto'
            });
            gsap.to(hoverLabel, {
                y: rect.height + 20,
                opacity: 0,
                duration: 0.3,
                ease: 'power3.in',
                overwrite: 'auto'
            });
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Hide/Show Nav on scroll
        if (currentScrollY > 100) {
            if (currentScrollY > this.lastScrollY) {
                // Scrolling Down - Mini Mode
                this.nav.classList.add('is-mini');
                if (!this.isMobileOpen) this.nav.style.transform = 'translateX(-50%) translateY(0)';
            } else {
                // Scrolling Up
                this.nav.classList.remove('is-mini');
            }
        } else {
            this.nav.classList.remove('is-mini');
        }

        this.lastScrollY = currentScrollY;

        // Active Section Tracking
        const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'leadership', 'contact'];
        let current = '';

        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150) current = id;
            }
        });

        this.setActiveSection(current);
    }

    setActiveSection(id) {
        this.items.forEach(pill => {
            if (pill.getAttribute('data-section') === id) {
                pill.classList.add('is-active');
            } else {
                pill.classList.remove('is-active');
            }
        });

        this.mobileLinks.forEach(link => {
            if (link.getAttribute('data-section') === id) {
                link.classList.add('is-active');
            } else {
                link.classList.remove('is-active');
            }
        });
    }

    toggleMobileMenu(force) {
        this.isMobileOpen = force !== undefined ? force : !this.isMobileOpen;

        document.body.style.overflow = this.isMobileOpen ? 'hidden' : '';
        this.hamburger.classList.toggle('is-active', this.isMobileOpen);
        this.mobileMenu.classList.toggle('is-active', this.isMobileOpen);
        this.nav.classList.toggle('is-open', this.isMobileOpen);
    }

    handleClick(e) {
        const id = e.currentTarget.getAttribute('href').substring(1);
        this.setActiveSection(id);
    }
}

/**
 * PARTICLE BACKGROUND
 */
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -100, y: -100 };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse Interaction
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.x += (dx / dist) * force * 2;
                p.y += (dy / dist) * force * 2;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * GALAXY BACKGROUND (About Section)
 */
class Galaxy {
    constructor() {
        this.container = document.getElementById('galaxyContainer');
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * this.canvas.width,
                o: Math.random() * 0.8 + 0.2
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.stars.forEach(s => {
            s.z -= 1;
            if (s.z <= 0) s.z = this.canvas.width;

            const x = (s.x - cx) * (this.canvas.width / s.z) + cx;
            const y = (s.y - cy) * (this.canvas.width / s.z) + cy;
            const size = (1 - s.z / this.canvas.width) * 3;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 240, 255, ${s.o})`;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

/**
 * SEQUENCE ANIMATION (Sticky Header/Transition)
 */
class SequenceAnimation {
    constructor() {
        this.canvas = document.getElementById('sequenceCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.frameCount = 60;
        this.images = [];
        this.currentFrame = 0;

        // Note: Using placeholders since local images aren't hosted
        this.preloadImages();
    }

    preloadImages() {
        // Implementation for preloading frames if available
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleScroll() {
        const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const frameIndex = Math.min(
            this.frameCount - 1,
            Math.floor(scrollPercent * this.frameCount)
        );

        if (frameIndex !== this.currentFrame) {
            this.currentFrame = frameIndex;
            this.render();
        }
    }

    render() {
        // Render logic for frames
    }
}

/**
 * GITHUB PROJECTS GALLERY
 */
class GithubGallery {
    constructor() {
        this.container = document.getElementById('circularGallery');
        this.loading = document.getElementById('projectsLoading');
        this.username = 'Nandukumar-koribilli';
        this.priorityRepos = ['CardiAI', 'Crop-Yield-Prediction', 'Agnit-s-Aura-Chatbot'];
        this.repos = [];

        this.init();
    }

    async init() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`);
            const data = await response.json();

            // Filter out forks and repositories without description
            const validRepos = data.filter(repo => !repo.fork && repo.description);

            // Reorder to put priority repos first
            const sortedByPriority = [];
            const others = [];

            validRepos.forEach(repo => {
                if (this.priorityRepos.includes(repo.name)) sortedByPriority.push(repo);
                else others.push(repo);
            });

            this.repos = [...sortedByPriority, ...others].slice(0, 8);
            this.loading.style.display = 'none';
            this.renderGallery();
        } catch (error) {
            console.error('GitHub API Error:', error);
            this.loading.innerHTML = '<span class="error">Failed to load projects.</span>';
        }
    }

    renderGallery() {
        const gallery = document.createElement('div');
        gallery.className = 'project-cards-wrap';

        this.repos.forEach((repo, index) => {
            const card = document.createElement('a');
            card.href = repo.html_url;
            card.target = '_blank';
            card.className = 'project-card glass-card reveal-up';
            card.innerHTML = `
                <div class="project-tag">0${index + 1}</div>
                <h3 class="project-name">${repo.name.replace(/-/g, ' ')}</h3>
                <p class="project-desc">${repo.description}</p>
                <div class="project-link">
                    <span>View Repository</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </div>
            `;
            gallery.appendChild(card);
        });

        this.container.appendChild(gallery);
        initReveal(); // Re-trigger reveal for new elements
    }
}

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Logic
    new PillNav();
    new ParticleBackground();
    new Galaxy();
    new SequenceAnimation();
    new GithubGallery();

    // 2. Animations
    initReveal();

    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                let current = 0;
                const duration = 2000;
                const step = (count / (duration / 16));

                const timer = setInterval(() => {
                    current += step;
                    if (current >= count) {
                        target.innerText = count;
                        clearInterval(timer);
                    } else {
                        target.innerText = Math.floor(current);
                    }
                }, 16);

                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // 3. Hover Effects on Links
    document.querySelectorAll('a').forEach(link => {
        if (!link.classList.contains('pill')) {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, { scale: 1, duration: 0.3, ease: 'power2.out' });
            });
        }
    });
});
