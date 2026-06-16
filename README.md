# AR Planetary System Visualizer

A CPIS 360 Web AR prototype for exploring planetary systems through marker-based AR, object interaction, quizzes, progress, and Mission Control dashboards.

## Run Locally

Use the included static server so the browser treats the page as a local web app:

```bash
npm start
```

Then open:

```text
http://localhost:8123/
```

If port `8123` is already busy, run `node serve.js 8124` and open `http://localhost:8124/` instead.

Allow camera access when the browser asks. Print or display the Hiro marker from the onboarding link, place it flat on a desk, and point the camera at it.

## Check Before Demo

Run the syntax check:

```bash
npm run check
```

Then test on the actual presentation phone with the Hiro marker, camera permission, and internet access for the CDN libraries.

## Production Baseline

This project now includes the first layer of production hardening:

- safe-area and dynamic viewport support for modern phones
- Web App Manifest metadata for installable browser/PWA behavior
- a lightweight service worker that caches only the app shell, not the large GLB models
- a boot-time AR dependency check that shows a clear message if CDN libraries fail
- direct binary model publishing so GitHub Pages can serve GLB files

See `PRODUCTION_ROADMAP.md` for the next upgrade phases.

## Demo Flow

1. Open the app and show the onboarding instructions.
2. Point the camera at the Hiro marker.
3. Tap a planet to open its information panel.
4. Drag, pinch, pause/play, change speed, toggle labels, and reset view.
5. Switch between the Solar System and Tau Ceti.
6. Open Mission Control to show Project, Missions, Badges, Compare, Simulator, and Learn.
7. Complete a quiz and save a leaderboard score.

## Submission Files

- `PROJECT_REPORT.md`: report content for problem statement, UX design process, ethics, and prototype explanation.
- `PRESENTATION_OUTLINE.md`: case-show slide outline, speaker notes, demo flow, and Q&A prep.
- `ASSET_CREDITS.md`: runtime libraries, model credits, model licenses, and NASA/JPL learning sources.
- `PRODUCTION_ROADMAP.md`: next steps for moving from course prototype to production app.
- `index.html`, `main.js`, `style.css`: prototype source.
- `serve.js`: tiny local server.
- `.gitattributes`: marks binary assets so GitHub Pages serves model files directly.

## GitHub Upload Notes

This repository contains large `.glb` model files. GitHub Pages does not serve Git LFS model objects as normal static files, so the models are committed directly as binary assets. The largest file is `uranus.glb` at about 83 MB, which is below GitHub's 100 MB per-file limit but may load slowly on older phones.

The repository license covers the project code and documentation. Third-party models and libraries keep their original licenses, listed in `ASSET_CREDITS.md`.

## Notes

The app loads A-Frame, AR.js, and a Three.js GLTF loader from CDNs, so the demo device needs internet access unless those libraries are hosted locally. The camera experience works best in a modern mobile browser using `localhost` or HTTPS.
