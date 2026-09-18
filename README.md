# AI Fitness Assistant - Computer Science Capstone Project

An academic web application demonstrating **real-time pose-based biomechanical tracking and repetition counting** via [MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker). Developed as a Computer Science & Applied AI coursework project.

## Key Objectives & Features

- **Edge Computer Vision**: In-browser real-time skeletal tracking of 33 3D landmarks at 30+ FPS with zero external server dependencies.
- **Biomechanical Angle Analysis**: Trigonometric joint-angle calculation (`Math.atan2`) for exercise depth, extension, and form validation.
- **Finite State Machine Repetition Counting**: Robust transition models across eccentric and concentric phases to eliminate incomplete or false-positive counts.
- **Zero-Barrier Exercise Lab**: Immediate, unauthenticated access to interactive exercise models directly in modern web browsers.
- **Analytical Strength Utilities**: Scientific One-Repetition-Max (1RM) calculators (Epley, Brzycki, Lander) and strength standards.

## Requirements

- Modern desktop or mobile browser with **camera access** and **JavaScript** enabled.
- **HTTPS or localhost** for browser `getUserMedia` camera permissions.

No Node.js compilation build step is required; scripts run natively in modern web browsers using Google MediaPipe CDN distributions.

## Local Usage

Serve the repository root on localhost so that relative asset and page paths resolve correctly:

```bash
# Python 3
python -m http.server 8080

# Or Node (npx)
npx serve .
```

Open `http://localhost:8080` to launch the project overview or `dashboard.html` for the exercise lab.

## Project Structure

| Area | Location | Description |
|------|----------|-------------|
| Project Showcase | `index.html` | Academic abstract, methodology, and demo links |
| Exercise Vision Lab | `dashboard.html` | Catalog of all computer vision exercise models and tools |
| Vision Models | `exercises/` | Real-time camera pages with canvas overlays and state machines |
| Project Documentation | `pages/about.html` | Research background, system architecture, and team info |
| Methodology | `pages/howitworks.html` | Vector mathematics and state machine explanation |
| Calculators & Programs | `pages/onerepmax.html`, `pages/strength_level.html`, `pages/programs.html` | Analytical tools and periodization programs |
| Styling | `assets/css/common.css` | Tokenised design system: colour/type/space/motion tokens plus the shared component layer |
| Shared UI behaviour | `assets/js/ui.js` | Mobile navigation drawer and `IntersectionObserver` scroll reveal |
| Design system source | `design-system/ai-fitness-assistant/MASTER.md` | Generated design direction (palette, typography, spacing) that `common.css` implements |

## Design System

The interface follows a **Vibrant & Block-based** direction: energy orange (`#F97316`) and
success green (`#22C55E`) on a dark slate canvas (`#1F2937`), set in Barlow Condensed
(headings) and Barlow (body).

All colour, spacing, typography and motion values are CSS custom properties declared once at
the top of `assets/css/common.css`. Change a token there and it propagates across all 21 pages —
avoid hardcoding hex values or pixel sizes in page-level styles.

Accessibility baseline: every text pairing meets WCAG AA contrast, all interactive controls
carry a visible focus ring and a minimum 44px target, pinch-zoom is never disabled, and all
motion is suppressed under `prefers-reduced-motion`.

## Academic Disclaimer

This project is built for educational and research demonstration purposes. Exercise standards and 1RM estimations provide informational benchmarks.
