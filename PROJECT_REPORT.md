# AR Planetary System Visualizer - Project Report

Course: CPIS 360 - Introduction to Immersive Technologies  
Project type: Web AR educational prototype  
Tools: HTML, CSS, JavaScript, A-Frame, AR.js, Three.js, GLB 3D models

Supporting files: `README.md`, `PRESENTATION_OUTLINE.md`, and `ASSET_CREDITS.md`

## 1. Clear Problem Statement

Students often learn astronomy from flat diagrams, slides, or lists of facts. This makes it difficult to understand spatial relationships such as orbit order, relative scale, distance, and how objects move around a central star. The problem is not only remembering facts, but building a mental model of a planetary system as a place.

This project addresses that problem with a marker-based AR prototype. When the user points a phone camera at a printed Hiro marker, a 3D planetary system appears on the table. Students can move around it, zoom, rotate, tap objects, compare bodies, answer quizzes, and track progress. The goal is to make astronomy more immersive, interactive, and spatially understandable.

## 2. Immersive Technology Concepts

Immersion: The planetary system is presented as a live 3D object inside the user's physical environment instead of as a separate flat page.

Presence: The system is anchored to a printed marker, so users feel that the planets are located on the desk in front of them. Marker persistence keeps the scene stable when tracking briefly drops.

Interactivity: Users can tap planets and ships, drag to reposition, pinch to zoom, switch between the Solar System and Tau Ceti, pause or change orbit speed, toggle labels and orbit rings, take quizzes, save scores, and inspect mission progress.

## 3. UX Design Process

### Define Users and Context

Primary users are CPIS 360 students and classmates attending the course case show. The context is a short classroom or lab demo using a phone camera, a browser, and a printed Hiro marker placed flat on a desk.

User needs:

- Fast setup with clear instructions.
- A safe tabletop interaction that does not require walking around blindly.
- Readable labels and controls on mobile screens.
- A learning flow that works for first-time AR users.
- Evidence of learning through quizzes, scores, and progress.

### Identify Goals

Learning goals:

- Recognize planets, exoplanets, ships, and mission routes in an AR scene.
- Compare diameter, distance, orbit, day length, year length, and moons.
- Understand that visualized scale can be stylized for readability or switched closer to true relative size.
- Use quiz score, accuracy, badges, and saved results as measurable learning evidence.

Experience goals:

- Keep the first screen focused on the AR experience.
- Make the marker setup understandable.
- Provide immediate feedback after every major action.
- Support both Arabic and English users.

### Storyboard

| Step | User Action | System Response | UX Purpose |
| --- | --- | --- | --- |
| 1. Setup | User opens the page, allows camera access, and places the Hiro marker on the table. | Onboarding explains how to print/place the marker. | Reduce confusion and support first-time users. |
| 2. Presence | User points camera at the marker. | A 3D planetary system appears anchored to the marker. | Create spatial presence and a shared tabletop object. |
| 3. Exploration | User drags, pinches, rotates, pauses or changes speed, and taps bodies. | The system moves, zooms, shows labels, and opens information panels. | Support active learning and spatial awareness. |
| 4. Comparison | User opens Mission Control and compares two bodies. | A comparison table shows system, diameter, distance, year, day, and moons. | Help learners reason beyond memorized facts. |
| 5. Assessment | User completes a quiz and saves a score. | The app shows correct/wrong feedback, score breakdown, badges, and leaderboard. | Make learning visible and measurable. |

### Prototype

The prototype is implemented as a single-page Web AR app:

- `index.html`: AR scene, onboarding overlay, and UI buttons.
- `main.js`: A-Frame components, scene generation, interactivity, quizzes, leaderboard, progress, mission control, bilingual copy, and project brief.
- `style.css`: Mobile-first layout, overlays, controls, accessibility states, and responsive design.
- `serve.js`: Small local static server for testing on `localhost`.
- `ASSET_CREDITS.md`: Credits for libraries, 3D model sources, model licenses, and NASA/JPL learning links.

Main features:

- Marker-based AR using the Hiro marker.
- Solar System and Tau Ceti system switcher.
- 3D GLB models for several bodies and the Hail Mary ship.
- Procedural fallback visuals for planets, stars, rings, atmospheres, and effects.
- Tap-based object information panels.
- Speech support where the browser provides speech synthesis.
- Quiz mode, score breakdown, badges, leaderboard, and CSV export.
- Mission Control tabs for overview, project brief, missions, badges, comparison, simulator, and learning sources.
- Comfort controls: pause/play, speed, orbit rings, labels, true-size mode, calm mode, reset view.

### Test With Users

Suggested user test: ask 3 classmates to complete the following tasks while you observe silently.

| Task | Success Criteria | Notes to Record |
| --- | --- | --- |
| Start AR and find marker | User sees the 3D system within 1 minute. | Where did they hesitate? |
| Select Earth and read facts | User opens the Earth information panel. | Was tapping easy? |
| Switch to Tau Ceti | User changes systems using the switch button. | Was the button label clear? |
| Compare two bodies | User opens Mission Control and compares two objects. | Did the table help them explain a difference? |
| Complete a quiz | User answers a quiz and understands the score. | Did feedback feel clear? |

Iteration priorities after testing:

- If users struggle to start, make onboarding shorter and marker instructions more visible.
- If users miss tappable objects, increase label visibility and tap target size.
- If users feel motion discomfort, make calm mode more prominent.
- If users do not understand scores, simplify the score breakdown.

## 4. UX Principles for AR/VE

Spatial awareness: Orbit rings, name labels, marker anchoring, reset view, and comparison tools help users understand where objects are and how they relate.

Comfort and safety: The app uses a tabletop marker, does not require walking, includes calm mode, pause/play, speed control, and short instructions. This reduces physical risk and motion discomfort.

Continuity: The persistent marker behavior keeps the last tracked pose visible when tracking briefly drops, so the experience does not collapse immediately.

Simplicity: The first screen is the AR camera experience. Controls are direct and task-based: switch system, mission control, leaderboard, help, tap, drag, pinch.

Accessibility: The UI supports Arabic and English, uses large touch targets, keyboard-safe dialogs, readable contrast, local speech synthesis when available, and responsive layouts.

Feedback: Users receive HUD status messages, visible control states, object information panels, quiz feedback, score breakdowns, badges, progress updates, and leaderboard entries.

## 5. Ethics

Privacy: The prototype uses the camera for AR tracking. Camera permission is requested by the browser, and camera frames are processed locally in the browser. The app does not intentionally upload camera images.

Data handling: Quiz scores and progress are stored locally on the user's device using browser storage. Users can clear leaderboard data.

Accuracy and uncertainty: Planet facts should be presented responsibly. Exoplanet values are estimates and should be described as estimates, not exact final measurements.

Comfort and physical safety: Users should use the app while seated or standing still near a table. The prototype avoids room-scale movement and includes pause/calm controls.

Accessibility and inclusion: Bilingual UI, readable touch controls, and optional speech support make the prototype more inclusive for different users.

Asset ethics: Third-party 3D models, libraries, and learning links are documented in `ASSET_CREDITS.md`. Most model credits were extracted from embedded GLB metadata. The `Project Hail Mary.glb` ship model does not include embedded author/source metadata, so its source should be confirmed before making the repository public.

## 6. Conclusion

The AR Planetary System Visualizer uses immersion, presence, and interactivity to help students understand planetary systems spatially. It also follows an AR/VE UX process by defining users and context, identifying goals, storyboarding the experience, building a functional prototype, and preparing task-based user tests. The project demonstrates an educational use of AR that is interactive, measurable, and suitable for a classroom case show.
