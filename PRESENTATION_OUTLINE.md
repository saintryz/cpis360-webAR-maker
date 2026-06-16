# AR Planetary System Visualizer - Presentation Outline

Target length: 5 minutes plus Q&A

## Slide 1: Title

AR Planetary System Visualizer  
CPIS 360 - Introduction to Immersive Technologies

Speaker note: "Our project is a web-based AR learning prototype that lets students explore planetary systems on a desk using a phone camera and a printed marker."

## Slide 2: Problem

- Astronomy is often taught through flat diagrams.
- Flat diagrams make scale, orbit order, and spatial relationships hard to understand.
- Students need a more interactive and spatial way to explore planetary systems.

Speaker note: "The problem is not only memorizing facts. It is forming a mental model of the system as a 3D place."

## Slide 3: Users and Context

- Users: CPIS 360 students and classmates.
- Context: classroom, lab, or project case show.
- Setup: browser, phone camera, printed Hiro marker, table surface.

Speaker note: "We designed for a short demo, so the app must start quickly and explain itself clearly."

## Slide 4: UX Design Process

- Define users and context.
- Identify learning and experience goals.
- Sketch storyboard.
- Build prototype.
- Test with users through short tasks.
- Iterate based on where users hesitate.

Speaker note: "The Mission Control Project tab includes this process inside the prototype so evaluators can inspect it during the demo."

## Slide 5: Storyboard

1. Open page and allow camera.
2. Place Hiro marker on desk.
3. Planetary system appears in AR.
4. Tap, zoom, compare, and quiz.
5. Review score and explain what was learned.

Speaker note: "This flow moves from setup, to presence, to exploration, to reflection."

## Slide 6: Prototype Demo

Demo order:

1. Show onboarding and marker instructions.
2. Point camera at Hiro marker.
3. Tap Earth or another planet to show information.
4. Drag or pinch to show interaction.
5. Switch from Solar System to Tau Ceti.
6. Open Mission Control and show Project, Compare, Missions, and Learn.
7. Complete one quiz and show score feedback.

Speaker note: "The prototype is not only visual. It includes learning tasks, assessment, progress, and feedback."

## Slide 7: AR/VE UX Principles

- Spatial awareness: marker anchoring, orbit rings, labels, reset view.
- Comfort and safety: tabletop use, calm mode, pause/play, speed control.
- Continuity: marker persistence when tracking briefly drops.
- Simplicity: direct AR first screen.
- Accessibility: Arabic/English, large controls, speech support.
- Feedback: HUD, panels, quiz states, badges, leaderboard.

## Slide 8: Ethics

- Camera permission is clear.
- Camera images are not intentionally uploaded.
- Scores are stored locally and can be cleared.
- Estimated exoplanet facts are labeled responsibly.
- Tabletop use reduces safety risks.
- Final assets and sources are credited in `ASSET_CREDITS.md`.

## Slide 9: User Testing

Tasks:

- Start AR and find the marker.
- Select a planet.
- Switch systems.
- Compare two bodies.
- Complete a quiz.

Success measures:

- Time to launch.
- Number of successful taps.
- Ability to explain one spatial relationship.
- Understanding of quiz feedback.

## Slide 10: Closing

Final message: "This project uses AR to turn astronomy from a flat diagram into an interactive spatial experience. Students can explore, compare, test themselves, and receive feedback in the same prototype."

Likely Q&A:

- Why marker-based AR? It is simple, reliable for a classroom demo, and works on common phones.
- What makes it immersive? The system is anchored in the physical space and responds to user movement and touch.
- How did you address safety? The experience is tabletop-based and includes comfort controls.
- How would you improve it next? Add more user-test results, compress the largest models, improve true-scale modes, and add optional WebXR support.
