# Nandu Kumar - Professional React Portfolio

A state-of-the-art interactive developer portfolio built with modern React, Vite, and complex WebGL/Canvas 2D animations. Migrated from a monolithic Vanilla JS architecture to a robust, component-driven React application.

## 🚀 Live Demo
Access the live deployment here: *(Insert Deployment URL)*

## ✨ Key Features & Architectural Upgrades

*   **Modern React Architecture**: Built with Vite and React 18 for blazing-fast HMR and optimized production builds.
*   **Tailwind CSS v4 Design System**: Fully utilizes the latest `@tailwindcss/vite` configuration with a semantic `@theme` dictionary for premium typography (Inter & Outfit) and glassmorphic UI elements.
*   **Component-Driven 3D Animations**:
    *   **WebGL Projects Gallery**: Extracted the complex `OGL` library circular gallery into a fully lifecycle-managed React Component (`<ProjectsSection />`) featuring memory garbage collection.
    *   **GSAP Powered Navigation**: Rewrote the dynamic geometry calculations of the pill navigation into the `<PillNav />` component using `@gsap/react`.
    *   **Canvas 2D Icosahedron**: Ported the rotating hero geometry mathematics into a React functional hook.
    *   **Sequence Engine Background**: Converted the Apple-style image scrolling sequence into a highly performant `useEffect` bound to scroll progress.
    *   **Galaxy WebGL Shader**: Packaged the raw fragment and vertex WebGL shaders into a reusable `<GalaxyBackground />` React Component.
*   **Intersection Observer Optimization**: All heavily computational WebGL and Canvas animation loops are paused natively when scrolled out of view, ensuring rock-solid 60 FPS performance.

## 🛠️ Technology Stack

-   **Frontend Framework**: React 18, Vite
-   **Styling**: Tailwind CSS v4, Custom CSS Modules
-   **3D & Mathematics**: [OGL](https://github.com/oframe/ogl) (WebGL Framework), Native Canvas 2D API
-   **Animation Engine**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
-   **State & Types**: React Hooks, TypeScript (Configuration support)

## 📦 Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nandukumar-koribilli/portfolio.git
    cd portfolio/portfolio-react
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    *The app will be available on `http://localhost:5173/` by default.*

4.  **Build for production:**
    ```bash
    npm run build
    npm run preview
    ```

## 🎨 UI/UX Design System Tokens

The application strictly adheres to a premium dark-mode aesthetic utilizing the following Tailwind `@theme` variables:
*   `--background`: `#0a0a0a` (Deep Obsidian)
*   `--surface`: `#121212` (Elevated Cards)
*   `--primary`: `#00f0ff` (Cyberpunk Cyan)
*   `--secondary`: `#ff00aa` (Neon Hot Pink)

---
*Designed & Developed by [Nandu Kumar Koribilli](https://github.com/Nandukumar-koribilli)*
