# AI Fitness Assistant - Computer Science Capstone Project

An academic web application demonstrating **real-time pose-based biomechanical tracking and repetition counting** via [MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker). Developed as a Computer Science & Applied AI coursework project.

**Live site:** https://21boah.github.io/AIFA/

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

Serve the `AIFitnessAsisstant/` folder on localhost so that relative asset and page paths resolve correctly:

```bash
cd AIFitnessAsisstant

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
| Calculators | `pages/onerepmax.html`, `pages/strength_level.html` | 1RM estimation and strength-level benchmarks |
| Styling | `assets/css/common.css` | Tokenised design system: colour/type/space/motion tokens plus the shared component layer |
| Shared UI behaviour | `assets/js/ui.js` | Mobile navigation drawer, current-page highlighting and `IntersectionObserver` scroll reveal |
| Homepage demo | `assets/js/hero-demo.js` | Animated pose figure scored live by the squat model's own `atan2` angle + state machine |
| Design system source | `design-system/ai-fitness-assistant/MASTER.md` | Generated design direction (palette, typography, spacing) that `common.css` implements |

## Design System

The interface follows a **"Volt Lab"** sports-tech direction: an electric volt accent (`#D7FF3A`)
and a cyan data accent (`#5CD3F5`) on a near-black canvas (`#0A0C0F`), with viewfinder/HUD motifs
taken from the pose tracker itself. Type is Archivo (expanded cut for headlines) with
JetBrains Mono for data, labels and readouts.

All colour, spacing, typography and motion values are CSS custom properties declared once at
the top of `assets/css/common.css`. Change a token there and it propagates across all 19 pages —
avoid hardcoding hex values or pixel sizes in page-level styles.

Accessibility baseline: every text pairing meets WCAG AA contrast, all interactive controls
carry a visible focus ring and a minimum 44px target, pinch-zoom is never disabled, and all
motion is suppressed under `prefers-reduced-motion`.

## Deployment

Every push to `main` runs `.github/workflows/static.yml`, which publishes the `AIFitnessAsisstant/`
folder to GitHub Pages at https://21boah.github.io/AIFA/.

## Academic Disclaimer

This project is built for educational and research demonstration purposes. Exercise standards and 1RM estimations provide informational benchmarks.
