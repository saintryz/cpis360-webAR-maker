# Production Roadmap

This roadmap turns the current CPIS 360 prototype into a production-grade educational AR app in realistic stages.

## Phase 1: Production Web Baseline

Status: started.

- Add dynamic viewport and safe-area handling for modern phones.
- Add Web App Manifest metadata.
- Add a service worker for the lightweight app shell.
- Keep large GLB models out of the service-worker cache to avoid filling phone storage.
- Add clear runtime messages for unsupported cameras or failed AR library loading.
- Publish current GLB files directly because GitHub Pages does not serve Git LFS objects as normal static model assets.

## Phase 2: Performance and Asset Pipeline

- Compress GLB models with Meshopt or Draco.
- Convert large textures to KTX2/Basis where possible.
- Replace oversized models with mobile-friendly LOD variants.
- Lazy-load models by system and object priority.
- Add an in-app loading progress indicator for model downloads.
- Add a low/medium/high graphics setting.

## Phase 3: Deployment Reliability

- Host large models on a CDN or storage provider designed for binary assets.
- Bundle A-Frame, AR.js, and Three.js locally or pin them through a controlled build step.
- Add GitHub Actions checks for syntax, asset presence, and broken links.
- Add smoke tests for common viewport sizes.
- Add a release checklist for classroom demos.

## Phase 4: Learning Product

- Organize content into lessons with learning objectives.
- Add citations for each scientific fact inside the app.
- Separate stylized scale from true-scale mode more explicitly.
- Add teacher mode, classroom sessions, and exportable learning reports.
- Replace local-only progress with optional account-based progress.

## Phase 5: State-of-the-Art AR

- Add WebXR hit-test placement for supported Android browsers.
- Keep marker-based AR as the reliable classroom fallback.
- Add plane detection, scale anchors, and persistent placement.
- Add multi-user classroom mode for shared missions.
- Add an AI tutor or guided voice assistant for adaptive astronomy explanations.
