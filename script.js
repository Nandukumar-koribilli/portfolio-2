/* =============================================
   NANDU KUMAR — PORTFOLIO ENGINE
   Sequential Scroll Animation + Interactions
   ============================================= */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        TOTAL_FRAMES: 96,
        PARTICLE_COUNT: 80,
        SCROLL_SPEED_FACTOR: 0.5,
    };

    // ===== SEQUENTIAL SCROLL CANVAS ENGINE =====
    class SequenceEngine {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.frameIndex = 0;
            this.frames = [];
            this.totalFrames = CONFIG.TOTAL_FRAMES;
            this.resize();
            this.generateFrames();
            this.bindScroll();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.w = this.canvas.width;
            this.h = this.canvas.height;
        }

        // Pre-generate frames in non-blocking chunks
        generateFrames() {
            let i = 0;
            const chunkSize = 6;
            const generateChunk = () => {
                const end = Math.min(i + chunkSize, this.totalFrames);
                for (; i < end; i++) {
                    const offscreen = document.createElement('canvas');
                    offscreen.width = this.w;
                    offscreen.height = this.h;
                    const ctx = offscreen.getContext('2d');
                    this.renderFrame(ctx, i, this.w, this.h);
                    this.frames.push(offscreen);
                }
                if (this.frames.length > 0 && !this._drewFirst) {
                    this._drewFirst = true;
                    this.drawFrame(0);
                }
                if (i < this.totalFrames) {
                    setTimeout(generateChunk, 0);
                }
            };
            setTimeout(generateChunk, 0);
        }

        renderFrame(ctx, frameIndex, w, h) {
            const progress = frameIndex / this.totalFrames;

            // Background gradient that shifts with progress
            const gradient = ctx.createRadialGradient(
                w * 0.5 + Math.sin(progress * Math.PI * 4) * w * 0.2,
                h * 0.5 + Math.cos(progress * Math.PI * 3) * h * 0.15,
                0,
                w * 0.5, h * 0.5,
                Math.max(w, h) * 0.8
            );

            const hue1 = 200 + progress * 160;
            const hue2 = 260 + progress * 100;

            gradient.addColorStop(0, `hsla(${hue1}, 100%, 50%, 0.08)`);
            gradient.addColorStop(0.4, `hsla(${hue2}, 80%, 30%, 0.04)`);
            gradient.addColorStop(1, 'rgba(5, 5, 16, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Geometric rings
            const ringCount = 4;
            for (let r = 0; r < ringCount; r++) {
                const ringProgress = (progress + r * 0.25) % 1;
                const radius = 50 + ringProgress * Math.max(w, h) * 0.5;
                const alpha = Math.max(0, 0.12 - ringProgress * 0.12);
                const cx = w * 0.5 + Math.sin(progress * Math.PI * 2 + r) * 100;
                const cy = h * 0.5 + Math.cos(progress * Math.PI * 2 + r * 0.7) * 80;

                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `hsla(${hue1 + r * 30}, 100%, 60%, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Floating geometric shapes
            const shapeCount = 12;
            for (let s = 0; s < shapeCount; s++) {
                const angle = (s / shapeCount) * Math.PI * 2 + progress * Math.PI * 4;
                const dist = 100 + Math.sin(progress * Math.PI * 2 + s) * 200;
                const sx = w * 0.5 + Math.cos(angle) * dist;
                const sy = h * 0.5 + Math.sin(angle) * dist * 0.6;
                const size = 3 + Math.sin(progress * Math.PI * 6 + s * 2) * 4;
                const alpha = 0.1 + Math.sin(progress * Math.PI * 4 + s) * 0.08;

                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(angle + progress * Math.PI);

                if (s % 3 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(0, -size);
                    ctx.lineTo(size, 0);
                    ctx.lineTo(0, size);
                    ctx.lineTo(-size, 0);
                    ctx.closePath();
                    ctx.fillStyle = `hsla(${hue1 + s * 20}, 100%, 70%, ${alpha})`;
                    ctx.fill();
                } else if (s % 3 === 1) {
                    ctx.beginPath();
                    ctx.moveTo(0, -size * 1.2);
                    ctx.lineTo(size, size * 0.8);
                    ctx.lineTo(-size, size * 0.8);
                    ctx.closePath();
                    ctx.strokeStyle = `hsla(${hue2 + s * 15}, 100%, 60%, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue1 + s * 25}, 100%, 70%, ${alpha * 0.8})`;
                    ctx.fill();
                }
                ctx.restore();
            }

            // Neural network lines
            const nodeCount = 8;
            const nodes = [];
            for (let n = 0; n < nodeCount; n++) {
                const a = (n / nodeCount) * Math.PI * 2 + progress * Math.PI;
                const d = 150 + Math.sin(progress * Math.PI * 3 + n * 1.5) * 100;
                nodes.push({
                    x: w * 0.5 + Math.cos(a) * d,
                    y: h * 0.5 + Math.sin(a) * d * 0.55
                });
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[j].x - nodes[i].x, nodes[j].y - nodes[i].y);
                    if (dist < 350) {
                        const alpha = Math.max(0, 0.06 - dist / 6000);
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `hsla(${hue1}, 100%, 70%, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Dot grid overlay
            const gridSize = 60;
            for (let x = 0; x < w; x += gridSize) {
                for (let y = 0; y < h; y += gridSize) {
                    const distFromCenter = Math.hypot(x - w * 0.5, y - h * 0.5);
                    const maxDist = Math.hypot(w * 0.5, h * 0.5);
                    const intensity = 1 - distFromCenter / maxDist;
                    const wave = Math.sin(progress * Math.PI * 4 + distFromCenter * 0.01);
                    const alpha = intensity * 0.04 * (0.5 + wave * 0.5);

                    if (alpha > 0.005) {
                        ctx.beginPath();
                        ctx.arc(x, y, 1, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.fill();
                    }
                }
            }
        }

        drawFrame(index) {
            this.ctx.clearRect(0, 0, this.w, this.h);
            if (this.frames[index]) {
                this.ctx.drawImage(this.frames[index], 0, 0);
            }
        }

        bindScroll() {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollTop = window.scrollY;
                        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                        const scrollProgress = Math.min(scrollTop / docHeight, 1);
                        const newFrame = Math.min(
                            Math.floor(scrollProgress * this.totalFrames),
                            this.totalFrames - 1
                        );

                        if (newFrame !== this.frameIndex) {
                            this.frameIndex = newFrame;
                            this.drawFrame(newFrame);
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    // ===== PARTICLE SYSTEM =====
    class ParticleSystem {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: -1000, y: -1000 };
            this.resize();
            this.init();
            this.bindMouse();
            this.animate();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            const count = window.innerWidth < 768 ? 40 : CONFIG.PARTICLE_COUNT;
            this.particles = [];
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 2 + 0.5,
                    hue: 180 + Math.random() * 80,
                    alpha: Math.random() * 0.5 + 0.1,
                });
            }
        }

        bindMouse() {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.vx += (dx / dist) * force * 0.3;
                    p.vy += (dy / dist) * force * 0.3;
                }

                p.vx *= 0.99;
                p.vy *= 0.99;

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
                this.ctx.fill();
            }

            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const a = this.particles[i];
                    const b = this.particles[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.moveTo(a.x, a.y);
                        this.ctx.lineTo(b.x, b.y);
                        this.ctx.strokeStyle = `hsla(200, 100%, 70%, ${alpha})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    // ===== NAVIGATION =====
    class Navigation {
        constructor() {
            this.nav = document.getElementById('mainNav');
            this.toggle = document.getElementById('navToggle');
            this.mobile = document.getElementById('mobileMenu');
            this.links = document.querySelectorAll('.nav-link');
            this.sections = document.querySelectorAll('.section');
            this.init();
        }

        init() {
            window.addEventListener('scroll', () => this.onScroll());

            this.toggle.addEventListener('click', () => this.toggleMobile());

            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.mobile.classList.remove('active');
                    this.toggle.classList.remove('active');
                });
            });

            [...this.links, ...document.querySelectorAll('.mobile-link')].forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }

        onScroll() {
            const scrollY = window.scrollY;

            this.nav.classList.toggle('scrolled', scrollY > 50);

            let current = '';
            this.sections.forEach(section => {
                const top = section.offsetTop - 200;
                if (scrollY >= top) {
                    current = section.getAttribute('id');
                }
            });

            this.links.forEach(link => {
                link.classList.toggle('active', link.dataset.section === current);
            });

            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrollY / docHeight) * 100, 100);
            document.getElementById('scrollProgress').style.width = progress + '%';
        }

        toggleMobile() {
            this.toggle.classList.toggle('active');
            this.mobile.classList.toggle('active');
        }
    }

    // ===== REVEAL ON SCROLL =====
    class RevealEngine {
        constructor() {
            this.elements = document.querySelectorAll('.reveal-up');
            this.init();
        }

        init() {
            // Immediately reveal elements already in the viewport
            this.elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('revealed');
                }
            });

            // Observe remaining elements for scroll reveals
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px'
            });

            this.elements.forEach(el => {
                if (!el.classList.contains('revealed')) {
                    observer.observe(el);
                }
            });
        }
    }

    // ===== SKILL BAR ANIMATION =====
    class SkillAnimator {
        constructor() {
            this.bars = document.querySelectorAll('.skill-fill');
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const width = bar.dataset.width;
                        setTimeout(() => {
                            bar.style.width = width + '%';
                            bar.classList.add('animated');
                        }, 200);
                    }
                });
            }, { threshold: 0.5 });

            this.bars.forEach(bar => observer.observe(bar));
        }
    }

    // ===== STAT COUNTER =====
    class StatCounter {
        constructor() {
            this.counters = document.querySelectorAll('.stat-number');
            this.animated = new Set();
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animated.add(entry.target);
                        this.animateCount(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(el => observer.observe(el));
        }

        animateCount(el) {
            const target = parseInt(el.dataset.count);
            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(ease * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(update);
        }
    }

    // ===== ROLE TAG ROTATION =====
    class RoleRotator {
        constructor() {
            this.tag = document.getElementById('roleTag');
            this.roles = [
                'AI/ML Engineer',
                'Data Scientist',
                'Full Stack Dev',
                'Python Developer',
                'Google Ambassador',
                'Tech Leader'
            ];
            this.index = 0;
            this.startRotation();
        }

        startRotation() {
            setInterval(() => {
                this.index = (this.index + 1) % this.roles.length;
                this.tag.style.opacity = '0';
                this.tag.style.transform = 'translateY(-10px)';

                setTimeout(() => {
                    this.tag.textContent = this.roles[this.index];
                    this.tag.style.opacity = '1';
                    this.tag.style.transform = 'translateY(0)';
                }, 300);
            }, 3000);

            this.tag.style.transition = 'opacity 0.3s, transform 0.3s';
        }
    }

    // ===== MAGNETIC HOVER EFFECT ON BUTTONS =====
    class MagneticButtons {
        constructor() {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        }
    }

    // ===== CUSTOM CURSOR =====
    class CustomCursor {
        constructor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'custom-cursor-dot';
            document.body.append(this.cursor, this.cursorDot);

            this.addStyles();
            this.bind();
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .custom-cursor {
                    position: fixed;
                    width: 36px;
                    height: 36px;
                    border: 1.5px solid rgba(0, 240, 255, 0.4);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transition: transform 0.15s ease-out, width 0.3s, height 0.3s, border-color 0.3s;
                    transform: translate(-50%, -50%);
                    mix-blend-mode: difference;
                }
                .custom-cursor-dot {
                    position: fixed;
                    width: 5px;
                    height: 5px;
                    background: #00f0ff;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    transition: transform 0.05s;
                }
                .custom-cursor.hovering {
                    width: 56px;
                    height: 56px;
                    border-color: rgba(255, 0, 170, 0.5);
                }
                @media (max-width: 768px) {
                    .custom-cursor, .custom-cursor-dot { display: none; }
                }
            `;
            document.head.appendChild(style);
        }

        bind() {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
                this.cursorDot.style.left = e.clientX + 'px';
                this.cursorDot.style.top = e.clientY + 'px';
            });

            const hoverTargets = document.querySelectorAll('a, button, .glass-card, .btn');
            hoverTargets.forEach(el => {
                el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
                el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
            });
        }
    }

    // ===== GLITCH TEXT EFFECT =====
    class GlitchEffect {
        constructor() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes glitch-1 {
                    0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
                    20% { clip-path: inset(30% 0 40% 0); transform: translate(2px, 0); }
                    40% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 0); }
                    60% { clip-path: inset(10% 0 70% 0); transform: translate(1px, 0); }
                    80% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== AMBIENT GLOW FOLLOWING MOUSE =====
    class AmbientGlow {
        constructor() {
            this.glow = document.createElement('div');
            this.glow.style.cssText = `
                position: fixed;
                width: 500px;
                height: 500px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%);
                pointer-events: none;
                z-index: 1;
                transform: translate(-50%, -50%);
                transition: left 0.3s ease-out, top 0.3s ease-out;
            `;
            document.body.appendChild(this.glow);

            document.addEventListener('mousemove', (e) => {
                this.glow.style.left = e.clientX + 'px';
                this.glow.style.top = e.clientY + 'px';
            });
        }
    }

    // ===== 3D HERO BACKGROUND (Three.js) =====
    class Hero3DScene {
        constructor(container) {
            if (!window.THREE) return;

            this.container = container;
            this.mouse = { x: 0, y: 0 };
            this.clock = new THREE.Clock();

            // Scene setup
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.z = 5;

            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.setClearColor(0x000000, 0);
            container.appendChild(this.renderer.domElement);

            this.createObjects();
            this.bindEvents();
            this.animate();
        }

        createObjects() {
            // Single subtle wireframe icosahedron
            const geo = new THREE.IcosahedronGeometry(2.2, 1);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.07,
            });
            this.shape = new THREE.Mesh(geo, mat);
            this.scene.add(this.shape);
        }

        bindEvents() {
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            window.addEventListener('resize', () => {
                const w = this.container.clientWidth;
                const h = this.container.clientHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
            });
        }

        animate() {
            requestAnimationFrame(() => this.animate());
            const t = this.clock.getElapsedTime();

            this.shape.rotation.x = t * 0.08 + this.mouse.y * 0.15;
            this.shape.rotation.y = t * 0.1 + this.mouse.x * 0.15;

            this.renderer.render(this.scene, this.camera);
        }
    }

    // ===== GITHUB PROJECTS =====
    class GitHubProjects {
        constructor() {
            this.grid = document.getElementById('projectsGrid');
            this.username = 'Nandukumar-koribilli';
            this.langColors = {
                JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
                HTML: '#e34c26', CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B',
                'C++': '#f34b7d', 'C#': '#178600', Java: '#b07219', null: '#8b949e'
            };
            this.glowClasses = ['project-glow-cyan', 'project-glow-magenta', 'project-glow-purple'];
            this.excludeRepos = [
                'skills-', 'portfolio_advanced-', 'gemini_antigravity_landingpage',
                'demo', 'portfolio', 'my-portfolio', 'gaga-quiz',
                'Smart_Kisan', 'blander', 'millennium-assignment'
            ];
            this.fetchRepos();
        }

        async fetchRepos() {
            try {
                // Fetch all pages of repos
                let allRepos = [];
                let page = 1;
                let hasMore = true;
                while (hasMore) {
                    const res = await fetch(
                        `https://api.github.com/users/${this.username}/repos?per_page=100&page=${page}&sort=updated`
                    );
                    const repos = await res.json();
                    if (repos.length === 0) { hasMore = false; break; }
                    allRepos = allRepos.concat(repos);
                    if (repos.length < 100) hasMore = false;
                    page++;
                }

                // Filter: public, non-fork, non-profile-readme, non-excluded
                const filtered = allRepos.filter(r =>
                    !r.private && !r.fork && r.name !== this.username &&
                    !this.excludeRepos.includes(r.name)
                );

                // Sort by updated
                filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                this.render(filtered);

                // Update stat counter
                const statEl = document.querySelector('[data-count]');
                if (statEl && statEl.closest('.stat')) {
                    const label = statEl.closest('.stat').querySelector('.stat-label');
                    if (label && label.textContent.includes('Projects')) {
                        statEl.setAttribute('data-count', filtered.length);
                    }
                }
            } catch (err) {
                console.error('GitHub fetch error:', err);
                if (this.grid) {
                    this.grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;padding:2rem;">Could not load repos. Please refresh.</p>';
                }
            }
        }

        formatName(name) {
            return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }

        render(repos) {
            if (!this.grid) return;
            this.grid.innerHTML = '';

            repos.forEach((repo, i) => {
                const num = String(i + 1).padStart(2, '0');
                const lang = repo.language || '';
                const langColor = this.langColors[repo.language] || this.langColors[null];
                const glow = this.glowClasses[i % 3];
                const desc = repo.description || 'No description provided.';
                const stars = repo.stargazers_count || 0;
                const forks = repo.forks_count || 0;

                const card = document.createElement('div');
                card.className = 'project-card glass-card reveal-up';
                card.innerHTML = `
                    <div class="project-number">${num}</div>
                    <div class="project-content">
                        <div class="project-tags">
                            ${lang ? `<span class="project-tag">${lang}</span>` : ''}
                            ${stars > 0 ? `<span class="project-tag">⭐ ${stars}</span>` : ''}
                            ${forks > 0 ? `<span class="project-tag">🍴 ${forks}</span>` : ''}
                        </div>
                        <h3 class="project-title">${this.formatName(repo.name)}</h3>
                        <p class="project-desc">${desc}</p>
                        <div class="project-meta">
                            ${lang ? `<span class="project-lang"><span class="lang-dot" style="background:${langColor}"></span>${lang}</span>` : ''}
                            <span>Updated ${new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">View on GitHub →</a>
                    </div>
                    <div class="project-glow ${glow}"></div>
                `;
                this.grid.appendChild(card);
            });

            // Re-trigger reveal observer for new cards
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) entry.target.classList.add('revealed');
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

            this.grid.querySelectorAll('.reveal-up').forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight) {
                    el.classList.add('revealed');
                } else {
                    observer.observe(el);
                }
            });
        }
    }

    // ===== INITIALIZE EVERYTHING =====
    function init() {
        // Core engines
        const seqCanvas = document.getElementById('sequenceCanvas');
        const partCanvas = document.getElementById('particleCanvas');

        new SequenceEngine(seqCanvas);
        new ParticleSystem(partCanvas);

        // UI systems
        new Navigation();
        new RevealEngine();
        new SkillAnimator();
        new StatCounter();
        new RoleRotator();
        new MagneticButtons();
        new GlitchEffect();

        // GitHub Projects (dynamic)
        new GitHubProjects();

        // 3D Hero scene
        const hero3dContainer = document.getElementById('hero3d');
        if (hero3dContainer && window.THREE) {
            new Hero3DScene(hero3dContainer);
        }

        // Desktop-only features
        if (window.innerWidth > 768) {
            new CustomCursor();
            new AmbientGlow();
        }

        console.log('%c🚀 Nandu Kumar Portfolio Loaded',
            'color: #00f0ff; font-size: 16px; font-weight: bold;');
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
