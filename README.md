# AI Fitness Assistant

Real-time exercise tracking in the browser. A webcam or phone camera, Google's
[MediaPipe Pose](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker) model and a
state machine for each exercise count your reps, time your holds and flag form faults. Every frame is
processed on your own device.

**[Live site](https://21boah.github.io/AIFA/)** ·
**[Exercise Lab](https://21boah.github.io/AIFA/dashboard.html)** ·
**[Documentation](https://21boah.github.io/AIFA/pages/about.html)** ·
**[How it works](https://21boah.github.io/AIFA/pages/howitworks.html)**

> A Computer Science & Applied AI senior capstone project, built for educational demonstration.
> It is not medical or coaching advice.

![A squat tracker mid-rep: only the skeleton is drawn over the video, with the rep progress meter on the right](https://21boah.github.io/AIFA/assets/images/docs/tracker.webp)

## Contents

- [Features](#features)
- [Exercise library](#exercise-library)
- [How it works](#how-it-works)
- [Getting started](#getting-started)
- [Using a tracker](#using-a-tracker)
- [Project structure](#project-structure)
- [Adding a new exercise](#adding-a-new-exercise)
- [Routine mode](#routine-mode)
- [Testing and evaluation](#testing-and-evaluation)
- [Design system](#design-system)
- [Accessibility and privacy](#accessibility-and-privacy)
- [Deployment](#deployment)
- [Limitations](#limitations)
- [References](#references)

## Features

- **31 trackers:** 29 repetition counters and 2 timed holds, covering chest, shoulders, back, arms,
  core, legs and full-body movements.
- **Full range of motion only:** each rep must pass two thresholds in order, so half-reps and bounces never count.
- **Form checks:** the skeleton turns red on a fault and the side panel says how to fix it,
  for example "KEEP YOUR CHEST UP" or "HINGE AT THE HIPS, NOT THE KNEES".
- **Clean camera view:** while you train, only the skeleton and a rep progress meter are drawn over
  the video. There are no numbers or letters on your body.
- **Accurate on any camera:** angles are corrected for the camera's aspect ratio, and position-based
  checks are scaled by your own body, so distance from the camera doesn't matter.
- **Phone-friendly:** front and rear cameras, with mirroring handled.
- **Private by design:** no accounts, no uploads and no analytics. Video never leaves the browser.
- **Calculators:** a one-rep-max estimator (Epley) and bodyweight strength standards.

![The Exercise Lab: 31 models grouped by muscle group](https://21boah.github.io/AIFA/assets/images/docs/lab.webp)

## Exercise library

Angles are in degrees. A rep is **armed** at the first value and **counted** at the second.
The [documentation](https://21boah.github.io/AIFA/pages/about.html#reference) lists the camera setup for each tracker.

| Group | Exercise | Measures | Rep rule | Position gate · form check |
|---|---|---|---|---|
| Chest & Shoulders | Bench Press | Elbow angle | < 90 → > 160 | Lying back |
| | Shoulder Overhead Press | Elbow angle, both arms | < 100, forearms up → > 150, upper arms up and wrists above the head | Torso lean > 20 |
| | Lateral Raise | Shoulder angle (hip–shoulder–elbow) | < 35 → > 75 | Bent arms (elbow < 130); torso lean > 20 |
| | Push-Ups | Elbow angle | < 90 → > 160 | Body horizontal, feet at hip height · hips sagging or piked (body line < 155) |
| | Front Raise | Shoulder angle | < 35 → > 80 | Bent arms; torso swing (< 160) |
| | Dips | Elbow angle | < 90 → > 150 | Hands below the elbows, torso within 45 of upright |
| | Dumbbell Shrugs | Shoulder height above the hips, in shoulder widths, vs a baseline | Lift < 0.04 → > 0.10 | Bent arms (elbow < 150) |
| Back | Pull Ups | Elbow angle + head vs hands | Dead hang (> 150) → head above hands | Hands above the shoulders |
| | Lat Pull Down | Wrist height, in shoulder widths | 0.5 above → 0.1 below the shoulders | Torso lean > 30 |
| | Barbell Row | Elbow angle, nearest arm | > 150 → < 90 | Hinged forward (tilt ≥ 30) · back rounding > 35 |
| | Deadlifts | Hip + knee angle | Hip < 90 → hip > 160 and knee > 155 | Back rounding > 35 |
| | Romanian Deadlift | Hip angle | < 110 → > 165 | Back rounding > 35; knee < 130 (squatting) |
| | Single-Arm Dumbbell Row | Elbow of the working (more bent) arm | > 150 → < 90 with the upper arm back along the torso | Leaning over the bench (tilt ≥ 45) · elbow not driven back; back rounding > 35 |
| Arms | Biceps Curl | Elbow angle, each arm | > 150 → < 60, left then right | Elbows drifting (> 35); torso lean > 20 |
| | Overhead Tricep Extension | Elbow angle of each raised arm | < 60 → > 150 | Elbow above the shoulder (one arm or both) |
| | Tricep Kickback | Elbow angle, nearest arm | < 90 → > 150 | Hinged forward · upper arm off the torso (> 50) |
| | Skull Crushers | Elbow angle + upper arm from vertical | < 80, upper arms up → > 150 | Lying back, elbows pointing up · upper arms drifting (> 40) |
| Core | Situps | Hip angle | > 120 lying back → < 70 | Torso near the floor, feet at hip height · straight legs (knee > 140) |
| | Plank | Body line + torso tilt | Timer while propped up, level and body line > 150 | Lift or lower the hips |
| | Lying Leg Raises | Hip angle (shoulder–hip–ankle) | > 160 → < 110 | Lying down · bent knees (< 140) |
| | Russian Twists | Hands vs the middle of the hips, in hip widths | 0.8 to one side, then the other = 1 rep | Seated, knees above the hips |
| Legs | Squats | Knee + hip angle | Knee < 100 → knee > 160 and hip > 150 | Chest dropping (torso lean > 55) |
| | Lunges | Both knees | Front < 100, back < 135, feet split → front > 150 | Split stance · torso lean > 30 |
| | Bulgarian Split Squat | Knee of the planted front leg | < 100 → > 150 | Torso lean > 45 |
| | Wall Sit | Knee angle + torso tilt | Timer while 80–110 with the back upright | Slide down / rise up / back against the wall |
| | Calf Raises | Heel lift ÷ shin length vs a baseline | < 0.03 → > 0.08 | Bent knees (< 150) |
| | Glute Bridge | Hip angle (shoulder–hip–knee) | < 140 → > 165 with the knees bent | Lying, feet at hip height · straight legs; arching past the shoulder–knee line |
| | Step-Ups | Both legs: foot height above the floor, knees, hip | Lead foot on the box, knee < 110 → standing tall on the box (knee and hip > 160) | Torso lean > 45 |
| Full Body | Burpees | Torso tilt, knee, body line, wrists | Stand → plank → stand → jump with the hands overhead | — |
| | Jumping Jacks | Wrists vs the head; ankles apart, in shoulder widths | Open (hands overhead, feet > 1.2 apart) → closed (hands down, feet < 0.8) | — |
| | Kettlebell Swings | Hip + knee angles, arm height | Hip < 110 → hip > 165, knee > 160, arms > 70 from the torso | Squatting it (hip < 130, knee < 120); bent arms; back rounding > 35 |

A **position gate** must hold before a rep can count; until it does, the panel shows an amber cue such
as "GET INTO A PUSH-UP POSITION". **Back rounding** is how far the ear drops below the hip-to-shoulder
line, so looking ahead is never flagged.

## How it works

Every tracker runs the same pipeline on each camera frame:

1. **Camera:** frames come from `getUserMedia`, via MediaPipe's `camera_utils`.
2. **Pose model:** MediaPipe Pose (BlazePose) returns 33 landmarks with a visibility score. A joint is
   used only when its visibility is at least 0.5.
3. **Geometry:** joint angles come from three landmarks, using the two-argument arctangent. Landmark
   `x`/`y` are fractions of the frame's width and height, so `x` is rescaled by the aspect ratio first:

   ```js
   const aspect = video.videoWidth / video.videoHeight;
   let radians = Math.atan2(c.y - b.y, (c.x - b.x) * aspect)
               - Math.atan2(a.y - b.y, (a.x - b.x) * aspect);
   let angle = Math.abs(radians * 180 / Math.PI);
   if (angle > 180) angle = 360 - angle;
   ```

4. **Smoothing:** each reading is averaged over the last ~160 ms (at most 5 frames), so slower phones
   don't lag behind fast reps.
5. **Position gate:** the body must be in the exercise's position (lying back, hinged forward, hanging,
   in a split stance…) before the angles count, so a standing curl can't pass for a push-up.
6. **State machine:** the exercise's two thresholds. For a squat, a knee angle below 100° arms the rep
   (`DOWN`); standing tall again, with knees above 160° and hips above 150°, counts it (`UP`).
7. **Feedback:** the skeleton (red on a form fault), the rep progress meter, the cue panel and the rep counter.

The [documentation](https://21boah.github.io/AIFA/pages/about.html) covers the maths, the measurements
behind these choices and the evaluation in detail.

## Getting started

### Requirements

- A recent desktop or mobile browser with JavaScript and WebGL 2 (Chrome or Edge recommended).
- A webcam or phone camera.
- **HTTPS or `localhost`:** browsers only grant camera access on secure origins.
- An internet connection on first load, for the MediaPipe files (jsDelivr CDN) and fonts.

There is no build step: everything is plain HTML, CSS and JavaScript.

### Run locally

```bash
git clone https://github.com/21BoaH/AIFA.git
cd AIFA/AIFitnessAsisstant

# Python 3
python3 -m http.server 8080

# or Node
npx serve .
```

Open <http://localhost:8080> for the homepage, or <http://localhost:8080/dashboard.html> for the Exercise Lab.

### Camera tips

- **Most trackers want a side-on view.** Pull-ups, Lat Pulldown, Lateral Raise, Shoulder Press and
  Biceps Curl want you facing the camera (or, for pull-ups, your back to it). Each tracker shows its own
  setup hint.
- Keep the joints being measured in frame: for leg exercises, hips to ankles.
- Use even lighting and a plain background, with one person in view.

## Using a tracker

1. Open the **Exercise Lab** and choose an exercise.
2. Press **Start** and allow camera access.
3. Follow the cue in the side panel: amber means get ready, volt means move now, red means fix your form.
4. The progress meter on the right of the camera view fills as you approach the end of each rep.
5. Press **Stop** to end the set. Reps and hold time reset to zero for the next Start.

| Control | What it does |
|---|---|
| Start / Stop | Begin or end a set. Stop resets the count, timer and smoothing. |
| Flip Camera | Switch between front and rear cameras. |
| Hide / Show Skeleton | Toggle the overlay. Counting carries on either way. |

## Project structure

```
AIFA/
├── .github/workflows/static.yml       GitHub Pages deployment (publishes AIFitnessAsisstant/)
├── README.md
└── AIFitnessAsisstant/
    ├── index.html                     Homepage with the animated pose demo
    ├── dashboard.html                 Exercise Lab: all 31 trackers + tools
    ├── exercises/                     One self-contained page per tracker (*_web.html)
    ├── pages/
    │   ├── about.html                 Project documentation (technical report)
    │   ├── howitworks.html            Methodology explainer
    │   ├── onerepmax.html             1RM calculator
    │   └── strength_level.html        Strength standards
    ├── assets/
    │   ├── css/common.css             Design tokens and every shared component
    │   ├── js/ui.js                   Navigation, current-page highlighting, scroll reveal
    │   ├── js/hero-demo.js            Homepage demo, scored by the squat tracker's own logic
    │   ├── js/routine.js              Optional routine mode (see below)
    │   ├── js/db.js, js/auth.js       Unused prototype stubs, not loaded by any page
    │   └── images/                    Photos (WebP) and README screenshots
    ├── design-system/                 Design direction that common.css implements
    └── Presentation_Images/           Images used in the project presentation
```

## Adding a new exercise

Each tracker is a standalone page, so a new exercise starts from the existing tracker closest in shape:

| If the new exercise… | Start from |
|---|---|
| Is judged by one joint angle on both sides | `squat_web.html` |
| Only counts in a set position (lying, hinged…) | `pushUps_web.html` or `barbellRow_web.html` |
| Uses the front leg only | `bulgarianSplitSquat_web.html` |
| Uses the limb nearest the camera | `tricepKickback_web.html` |
| Is a timed hold | `wallSit_web.html` |
| Needs a baseline at Start | `calfRaises_web.html` |

Then:

1. Rename the file `exercises/<name>_web.html` and update the `<title>`, the `<h1>` and the setup hint
   (the `#progress` element).
2. In the module script, edit the state under `// Initialize variables`, the cues in `updateUI()` and the
   landmark indices, thresholds and form checks in `onResults()`. Reset any new state in `stopCamera()`.
3. Keep the conventions every tracker shares:
   - Find usable joints with `visibleSides()`, then read smoothed angles with `readAngle()` (both
     sides) or `smooth(key, jointAngle(...))` (one side). Both are aspect-corrected.
   - Use `torsoTilt()`/`readTilt()` for position gates and lean checks. While the body isn't in position,
     set `positionCue` (an amber cue) and don't touch `stage`.
   - Use `stage = 'down'` to arm a rep, and `stage = 'up'` plus `counter++` to count it. Require the full
     lockout, not just one joint passing a line.
   - Dispatch `repCompleted` with the count, so routine mode works.
   - For a form fault, set `warning` to the message in `onResults()`. `setFormWarning()` turns the
     skeleton red and shows it as a red cue.
   - Don't draw text on the canvas. The camera view is skeleton-only by design.
4. Add a card to `dashboard.html` in the right muscle group, renumber the cards, and update the group
   count, the jump-link count and the "Models" total.
5. Exercise pages use **CRLF** line endings; keep them consistent.

## Routine mode

`assets/js/routine.js` chains trackers into a routine with rest timers between exercises. No page in
the site creates routines yet; it is a hook for future programmes. To start one, store the routine and
open the first tracker with `?routine=true`:

```js
localStorage.setItem('activeRoutine', JSON.stringify([
  { name: 'Squats',   url: 'squat_web.html',       targetReps: 10, restTime: 60 },
  { name: 'Push-Ups', url: 'pushUps_web.html',     targetReps: 12, restTime: 45 },
  { name: 'Plank',    url: 'plank_web.html',       targetReps: 30 }   // seconds for timed holds
]));
localStorage.setItem('routineStep', '0');
location.href = 'exercises/squat_web.html?routine=true';
```

When a tracker's `repCompleted` count reaches `targetReps`, the routine stops the camera and shows a
rest countdown (`restTime` seconds, default 60). It then opens the next exercise, and finishes with a
completion screen.

## Testing and evaluation

The trackers were verified during development with an automated browser harness. It is not part of
this repository.

| Check | Before the fixes | Now |
|---|---|---|
| First engine suite: 33 synthetic scenarios, 16:9 camera | 20 / 33 | **33 / 33** |
| Technique suite: 73 synthetic scenarios, 16:9 camera | 36 / 73 | **73 / 73** |
| The technique suite on a 4:3 camera | — | **73 / 73** |
| Wrong movements counted as reps or hold time | 17 / 20 | **0 / 20** |
| Added trackers (8): 27 scenarios, 13 of them wrong movements, 16:9 and 4:3 | — | **27 / 27** |
| Squat reps across 3 Start/Stop sessions (real MediaPipe model) | 2 / 0 / 2 | **2 / 2 / 2** |
| Trackers still tracking after restarts (real model) | — | **31 / 31** |
| Text drawn over the camera view | Angle labels | **None** |

- **Synthetic scenarios** replace the pose model with skeletons of known joint angles and run each page's
  own code. They cover different camera shapes, a person close to the camera and twice as far, fast reps
  at ~9 fps, 20 movements that must not count (push-ups done standing, squats on the lunge page, a press
  out to a T, standing toe touches as sit-ups, a burpee without the jump…), form faults with their exact
  message, form that must not be flagged, timed holds, and Stop/Start resets.
- **Real-model runs** use the real `@mediapipe/pose` package with a fake webcam feed.

These tests prove each tracker follows its rules. They do not prove the thresholds suit every body,
because no study with real athletes has been run yet.

## Design system

The interface follows a **"Volt Lab"** sports-tech direction: an electric volt accent (`#D7FF3A`) and a
cyan data accent (`#5CD3F5`) on a near-black canvas (`#0A0C0F`), with viewfinder motifs taken from the
pose tracker itself. Type is Archivo (expanded cut for headlines) with JetBrains Mono for data, labels
and readouts.

All colour, spacing, typography and motion values are CSS custom properties declared once at the top of
`assets/css/common.css`. Change a token there and it propagates across all 29 pages; avoid hardcoding
hex values or pixel sizes in page-level styles. `design-system/ai-fitness-assistant/MASTER.md` documents
the tokens and components.

![The homepage, with the animated pose demo scored by the squat tracker's own logic](https://21boah.github.io/AIFA/assets/images/docs/home.webp)

## Accessibility and privacy

- **Contrast:** body text, labels and cues meet WCAG AA contrast on their backgrounds.
- **Keyboard:** every interactive control is reachable by keyboard and has a visible focus ring;
  pinch-zoom is never disabled.
- **Screen readers:** rep counts and cues are live regions, so they announce changes.
- **Motion:** animation is suppressed under `prefers-reduced-motion`.
- **Privacy:** inference runs locally on WebGL/WebAssembly. No video, image or landmark data is sent
  anywhere. The only network requests are for the site, its fonts and the MediaPipe model files.

## Deployment

Every push to `main` runs `.github/workflows/static.yml`, which publishes the `AIFitnessAsisstant/`
folder to GitHub Pages at <https://21boah.github.io/AIFA/>. The repository must be public, or on a plan
that supports Pages, with **Settings → Pages → Source** set to **GitHub Actions**.

## Limitations

- A single 2D camera loses accuracy when a limb moves towards or away from it, hence the side-on setups.
- Overlapping limbs, dim lighting and busy backgrounds reduce landmark confidence.
- Thresholds come from common coaching cues and have not been fitted to a measured population.
- Only one person should be in frame.
- The pose model has no landmarks along the spine, so back rounding is read from the head's position
  against the torso line; a rounded lower back with the head held up can pass.

The documentation's [limitations and future work](https://21boah.github.io/AIFA/pages/about.html#limitations)
section goes further.

## References

1. Bazarevsky, V., Grishchenko, I., Raveendran, K., Zhu, T., Zhang, F., & Grundmann, M. (2020).
   *BlazePose: On-device Real-time Body Pose tracking.* arXiv:2006.10204.
2. Lugaresi, C., et al. (2019). *MediaPipe: A Framework for Building Perception Pipelines.*
   Third Workshop on Computer Vision for AR/VR at IEEE CVPR.
3. Grishchenko, I., Bazarevsky, V., Zanfir, A., et al. (2022). *BlazePose GHUM Holistic: Real-time 3D
   Human Landmarks and Pose Estimation.* arXiv:2206.11678.
4. Baechle, T. R., & Earle, R. W. (2008). *Essentials of Strength Training and Conditioning.* NSCA,
   Human Kinetics.

## Academic disclaimer

This project is built for educational and research demonstration purposes. Rep thresholds, form checks,
strength standards and 1RM estimates are informational benchmarks, not clinical assessments.
