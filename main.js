(function () {
  "use strict";

  // Device/performance constants.
  const MOBILE_QUERY = "(max-width: 760px)";
  const LOW_POWER_CPU_CORES = 4;
  const DESKTOP_SEGMENTS = 160;
  const MOBILE_SEGMENTS = 112;
  const DESKTOP_SPHERE_SEGMENTS = 48;
  const MOBILE_SPHERE_SEGMENTS = 32;

  // UI constants.
  const HUD_ID = "hudLabel";
  const HUD_HIDDEN_CLASS = "is-hidden";
  const HUD_DEFAULT_TEXT = "☀️ Hiro: Solar System · Kanji: Tau Ceti System · tap a planet for info";
  const HUD_LOST_TEXT = "Searching for Hiro or Kanji marker";
  const HUD_HIDE_DELAY_MS = 2800;
  const SUPPORT_MESSAGE_TEXT = "Camera AR needs a browser with WebRTC camera support. Use HTTPS or localhost if your browser blocks camera access.";
  const LOCALHOST_NAMES = ["localhost", "127.0.0.1", "::1"];

  const DEFAULT_DELTA_MS = 16.67;

  // Solar system constants. (Per-system numbers like sun radius, scene scale,
  // and asteroid-belt geometry live inside the SYSTEMS map below.)
  const SOLAR_ORBIT_TILT_X = -90;
  const SOLAR_SUN_PULSE_SPEED = 0.002;
  const SOLAR_SUN_PULSE_AMOUNT = 0.045;
  const SOLAR_ORBIT_OPACITY = 0.28;
  const SOLAR_ORBIT_COLOR = "#9eb7ff";
  const SOLAR_STAR_COUNT_DESKTOP = 56;
  const SOLAR_STAR_COUNT_MOBILE = 34;
  const SOLAR_STAR_RADIUS = 1.05;
  const SOLAR_STAR_SIZE = 0.008;
  const SOLAR_SPIN_SPEED = 0.0016;
  // realSize is the planet's diameter relative to Earth (= 1.0). Used by the
  // "true relative size" toggle. axialTilt is in radians.
  const SOLAR_PLANETS = [
    { name: "Mercury", radius: 0.22, size: 0.025, realSize: 0.38, color: "#b8aaa0",
      texture: "mercury", speed: 0.00175, spinSpeed: 0.0008,
      axialTilt: 0.0006,
      diameter: "4,879 km", yearLength: "88 Earth days", dayLength: "59 Earth days",
      distance: "57.9 million km", moons: 0,
      info: "Smallest planet and closest to the Sun. A year on Mercury lasts only 88 Earth days." },
    { name: "Venus", radius: 0.31, size: 0.036, realSize: 0.95, color: "#e6b06a",
      texture: "venus", speed: 0.00135, spinSpeed: -0.0004,
      axialTilt: 3.0962,
      diameter: "12,104 km", yearLength: "225 Earth days", dayLength: "243 Earth days",
      distance: "108.2 million km", moons: 0,
      info: "Hottest planet at about 465°C, with a thick CO₂ atmosphere. It spins backwards." },
    { name: "Earth", radius: 0.42, size: 0.04, realSize: 1.0, color: "#3b82ff",
      texture: "earth", speed: 0.00108, spinSpeed: 0.004, moon: true,
      axialTilt: 0.4101,
      diameter: "12,742 km", yearLength: "365.25 days", dayLength: "24 hours",
      distance: "149.6 million km", moons: 1,
      info: "Our home. The only known planet with life and liquid surface water." },
    { name: "Mars", radius: 0.53, size: 0.032, realSize: 0.53, color: "#d35a36",
      texture: "mars", speed: 0.00088, spinSpeed: 0.0038,
      axialTilt: 0.4396,
      diameter: "6,779 km", yearLength: "687 Earth days", dayLength: "24h 37m",
      distance: "227.9 million km", moons: 2,
      info: "The Red Planet. Home to Olympus Mons, the tallest known volcano in the Solar System." },
    { name: "Jupiter", radius: 0.68, size: 0.072, realSize: 11.21, color: "#d4a46d",
      texture: "jupiter", speed: 0.00062, spinSpeed: 0.009,
      axialTilt: 0.0546,
      diameter: "139,820 km", yearLength: "11.86 Earth years", dayLength: "9h 56m",
      distance: "778.5 million km", moons: 95,
      info: "Largest planet. A gas giant with 95+ moons and a centuries-old storm, the Great Red Spot." },
    { name: "Saturn", radius: 0.83, size: 0.064, realSize: 9.45, color: "#d9c38b",
      texture: "saturn", speed: 0.00048, spinSpeed: 0.0085, ring: true,
      axialTilt: 0.4665,
      diameter: "116,460 km", yearLength: "29.5 Earth years", dayLength: "10h 33m",
      distance: "1.43 billion km", moons: 146,
      info: "Famous for its bright rings made of ice and rock. Less dense than water." },
    { name: "Uranus", radius: 0.96, size: 0.048, realSize: 4.01, color: "#7dd3fc",
      texture: "uranus", speed: 0.00036, spinSpeed: -0.005,
      axialTilt: 1.7064,
      diameter: "50,724 km", yearLength: "84 Earth years", dayLength: "17h 14m",
      distance: "2.87 billion km", moons: 28,
      info: "An ice giant tilted ~98°, so it essentially rolls on its side as it orbits." },
    { name: "Neptune", radius: 1.08, size: 0.047, realSize: 3.88, color: "#4169e1",
      texture: "neptune", speed: 0.00029, spinSpeed: 0.0048,
      axialTilt: 0.4944,
      diameter: "49,244 km", yearLength: "165 Earth years", dayLength: "16h 6m",
      distance: "4.50 billion km", moons: 16,
      info: "Farthest planet from the Sun. Has the fastest winds in the system, up to 2,100 km/h." }
  ];
  const SOLAR_MOON_RADIUS = 0.075;
  const SOLAR_MOON_SIZE = 0.01;
  const SOLAR_MOON_SPEED = 0.0036;
  const SOLAR_MOON_COLOR = "#d9d7ce";

  // Asteroid / debris belt count (the per-system geometry — radii, sizes,
  // colors — lives inside the SYSTEMS map).
  const ASTEROID_COUNT_DESKTOP = 180;
  const ASTEROID_COUNT_MOBILE = 90;

  // True-scale toggle: when on, planets are scaled to their real diameter
  // ratios using Earth's current visual size as 1.0. The star is scaled with a
  // gentle log compression so it stays inside the orbit view.
  const TRUE_SCALE_EARTH_BASE = 0.04;

  // Sun fact panel.
  const SOLAR_SUN_INFO = {
    name: "Sun",
    diameter: "1,391,400 km",
    yearLength: "—",
    dayLength: "~25 Earth days at equator",
    distance: "0 km (centre of system)",
    moons: 0,
    info: "A G-type main-sequence star and the heart of the Solar System. ~99.86% of the system's mass; surface temperature ~5,500°C."
  };

  // Tau Ceti System (G8V star ~12 light-years away with 4 confirmed super-Earths).
  const TAU_CETI_PLANETS = [
    { name: "Tau Ceti g", radius: 0.22, size: 0.028, realSize: 1.17, color: "#c97a4f",
      texture: "tauCetiG", speed: 0.0022, spinSpeed: 0.003,
      axialTilt: 0.18,
      diameter: "~14,900 km (estimated)", yearLength: "20 Earth days", dayLength: "Unknown",
      distance: "0.133 AU (~20 million km)", moons: 0,
      info: "Innermost confirmed planet. A scorched super-Earth orbiting close to Tau Ceti." },
    { name: "Tau Ceti h", radius: 0.34, size: 0.029, realSize: 1.19, color: "#b86045",
      texture: "tauCetiH", speed: 0.0016, spinSpeed: 0.0028,
      axialTilt: 0.22,
      diameter: "~15,200 km (estimated)", yearLength: "49 Earth days", dayLength: "Unknown",
      distance: "0.243 AU (~36 million km)", moons: 0,
      info: "A warm super-Earth, just inside the inner edge of the habitable zone." },
    { name: "Tau Ceti e", radius: 0.56, size: 0.046, realSize: 1.81, color: "#5e8fbf",
      texture: "tauCetiE", speed: 0.0011, spinSpeed: 0.0024,
      axialTilt: 0.4,
      diameter: "~23,000 km (estimated)", yearLength: "168 Earth days", dayLength: "Unknown",
      distance: "0.538 AU (~80 million km)", moons: 0,
      info: "Inner habitable zone. Could host liquid water depending on its atmosphere." },
    { name: "Tau Ceti f", radius: 0.92, size: 0.045, realSize: 1.83, color: "#7896b8",
      texture: "tauCetiF", speed: 0.00048, spinSpeed: 0.0022,
      axialTilt: 0.34,
      diameter: "~23,300 km (estimated)", yearLength: "642 Earth days", dayLength: "Unknown",
      distance: "1.334 AU (~200 million km)", moons: 0,
      info: "Outer habitable zone. Likely cold, but with a thick atmosphere it could be habitable." }
  ];
  const TAU_CETI_STAR_INFO = {
    name: "Tau Ceti",
    diameter: "~1,098,000 km (0.79 solar radii)",
    yearLength: "—",
    dayLength: "~34 Earth days at equator",
    distance: "Centre of system · 11.9 light-years from Earth",
    moons: 0,
    info: "A G8V yellow dwarf, slightly cooler and dimmer than the Sun. The closest solitary G-type star to Earth and a long-time SETI target."
  };

  // Project Hail Mary ships, stationed near Tau Ceti e (the habitable-zone
  // planet they're studying in the book). Coordinates are static — the planets
  // orbit past, the ships hold their position.
  //
  // To swap the procedural ship for an external 3D model:
  //   1. Host a .glb / .gltf model on a public URL (GitHub Pages, jsDelivr,
  //      Sketchfab download → re-uploaded somewhere CORS-permissive, etc.)
  //   2. Paste the URL into modelUrl below.
  //   3. Tweak modelScale (one number) and modelRotation ([x, y, z] radians)
  //      to fit the scene. The procedural ship is ~0.08 long, so models
  //      typically need scales between 0.001 and 0.05.
  // If modelUrl is empty or the load fails, the procedural ship renders.
  const TAU_CETI_SHIPS = [
    {
      name: "Hail Mary",
      kind: "hailMary",
      position: [-0.045, 0.045, 0.5],
      pickRadius: 0.06,
      modelUrl: "./source/Project%20Hail%20Mary.glb",
      modelScale: 0.002,
      modelRotation: [0, 0, 0],
      info: {
        name: "Hail Mary",
        diameter: "~47 m long (with radiators)",
        distance: "Stationed near Tau Ceti e",
        info: "Earth's interstellar emergency mission, captained by Dr. Ryland Grace. A spin-drive ship powered by astrophage, with a centrifuge for artificial gravity and two big radiators to dump waste heat."
      }
    },
    {
      name: "Blip-A",
      kind: "blipA",
      position: [0.06, 0.06, 0.51],
      pickRadius: 0.07,
      modelUrl: "", // e.g. "https://cdn.jsdelivr.net/gh/<user>/<repo>/models/blip-a.glb"
      modelScale: 0.02,
      modelRotation: [0, 0, 0],
      info: {
        name: "Blip-A",
        diameter: "~210 m across (xenonite hull)",
        distance: "Stationed near Tau Ceti e",
        info: "An Eridian starship made of xenonite — far tougher than any human alloy. No windows: Eridians sense the world by sound. Crewed by Rocky, the engineer who befriends Grace."
      }
    }
  ];

  // System definitions consumed by the planetary-system component. Each entry
  // describes the central star, its planets, and the surrounding debris ring.
  const SYSTEMS = {
    solar: {
      foundText: "Solar System · tap a planet for info",
      sceneScale: 0.62,
      sceneYOffset: 0.18,
      star: {
        info: null, // filled below to break the circular reference at parse time
        texture: "sun",
        radius: 0.13,
        emissive: "#ff8a00",
        coronaColor: "#ffb04a",
        coronaOpacity: 0.18,
        ambientColor: 0x405070,
        pointColor: 0xffd47a,
        pointIntensity: 2.3,
        pointDistance: 3.2,
        trueScaleFactor: 8.5
      },
      planets: null,
      asteroidBelt: {
        innerRadius: 0.575,
        outerRadius: 0.645,
        heightVariance: 0.012,
        minSize: 0.0035,
        maxSize: 0.0085,
        minSpeed: 0.00045,
        maxSpeed: 0.0008,
        color: "#7d6e60"
      }
    },
    tauCeti: {
      foundText: "Tau Ceti System · tap a planet for info",
      sceneScale: 0.62,
      // Star sits centered on the Kanji marker; planets orbit in the marker plane.
      sceneYOffset: 0,
      star: {
        info: null,
        texture: "tauCetiStar",
        radius: 0.115,
        emissive: "#ff7a18",
        coronaColor: "#ffb86b",
        coronaOpacity: 0.2,
        ambientColor: 0x4a4860,
        pointColor: 0xffc680,
        pointIntensity: 2.0,
        pointDistance: 3.0,
        trueScaleFactor: 6.7
      },
      planets: null,
      // Tau Ceti has a debris disk with ~10× the dust of the Solar System,
      // extending past the outermost planet.
      asteroidBelt: {
        innerRadius: 1.05,
        outerRadius: 1.32,
        heightVariance: 0.022,
        minSize: 0.003,
        maxSize: 0.0075,
        minSpeed: 0.00035,
        maxSpeed: 0.00065,
        color: "#9a8b7a"
      }
    }
  };
  SYSTEMS.solar.star.info = SOLAR_SUN_INFO;
  SYSTEMS.solar.planets = SOLAR_PLANETS;
  SYSTEMS.solar.ships = [];
  SYSTEMS.tauCeti.star.info = TAU_CETI_STAR_INFO;
  SYSTEMS.tauCeti.planets = TAU_CETI_PLANETS;
  SYSTEMS.tauCeti.ships = TAU_CETI_SHIPS;

  const SOLAR_SATURN_RING_INNER = 0.08;
  const SOLAR_SATURN_RING_OUTER = 0.12;
  const SOLAR_SATURN_RING_COLOR = "#f2db9d";
  const SOLAR_SATURN_RING_OPACITY = 0.48;
  const SOLAR_SATURN_RING_TILT_X = 68;
  const SOLAR_SATURN_RING_TILT_Z = 18;
  const SOLAR_STAR_MIN_HEIGHT = -0.32;
  const SOLAR_STAR_MAX_HEIGHT = 0.55;
  const SOLAR_STAR_MIN_RADIUS_SCALE = 0.65;
  const SOLAR_STAR_OPACITY = 0.72;
  const SOLAR_STAR_ROTATION_SPEED = 0.00006;

  // Planet labels (canvas sprites that follow each planet through its orbit).
  const LABEL_CANVAS_WIDTH = 256;
  const LABEL_CANVAS_HEIGHT = 72;
  const LABEL_FONT = "bold 36px system-ui, -apple-system, 'Segoe UI', sans-serif";
  const LABEL_BG_COLOR = "rgba(4, 5, 12, 0.78)";
  const LABEL_BORDER_COLOR = "rgba(255, 255, 255, 0.32)";
  const LABEL_TEXT_COLOR = "#ffffff";
  const LABEL_RADIUS = 20;
  const LABEL_BORDER_WIDTH = 2;
  const LABEL_SPRITE_SCALE_X = 0.16;
  const LABEL_SPRITE_SCALE_Y = 0.045;
  const LABEL_HEIGHT_PADDING = 0.025;
  const PLANET_PICK_TARGET_SCALE = 2.35;
  const PLANET_PICK_TARGET_MIN_SIZE = 0.075;
  const PLANET_PICK_TARGET_SEGMENTS = 18;

  // Distance-based zoom: as the camera moves further from the marker, the
  // solar system grows so it stays comfortably readable on screen.
  const DISTANCE_REFERENCE = 1.0;
  const DISTANCE_SCALE_MIN = 0.55;
  const DISTANCE_SCALE_MAX = 2.6;
  const DISTANCE_SCALE_LERP = 0.12;

  const TWO_PI = Math.PI * 2;
  const IS_LOCAL_FILE = window.location.protocol === "file:";
  const IS_LOCALHOST = LOCALHOST_NAMES.includes(window.location.hostname);
  const IS_CAMERA_SECURE_CONTEXT = window.isSecureContext || IS_LOCAL_FILE || IS_LOCALHOST;
  const SUPPORTS_CAMERA = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && IS_CAMERA_SECURE_CONTEXT);
  const IS_SMALL_SCREEN = window.matchMedia(MOBILE_QUERY).matches;
  const IS_LOW_POWER = IS_SMALL_SCREEN || (navigator.hardwareConcurrency || LOW_POWER_CPU_CORES) <= LOW_POWER_CPU_CORES;
  const DISK_SEGMENTS = IS_LOW_POWER ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  const SPHERE_SEGMENTS = IS_LOW_POWER ? MOBILE_SPHERE_SEGMENTS : DESKTOP_SPHERE_SEGMENTS;
  const SOLAR_STAR_COUNT = IS_LOW_POWER ? SOLAR_STAR_COUNT_MOBILE : SOLAR_STAR_COUNT_DESKTOP;
  const ASTEROID_COUNT = IS_LOW_POWER ? ASTEROID_COUNT_MOBILE : ASTEROID_COUNT_DESKTOP;
  const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const randomBetween = (min, max) => min + Math.random() * (max - min);


  AFRAME.registerComponent("solar-system-scene", {
    schema: {
      // Pick which planetary system this marker shows. Defined in SYSTEMS above.
      system: { type: "string", default: "solar" }
    },
    init: function () {
      this.three = AFRAME.THREE;
      this.systemDef = SYSTEMS[this.data.system] || SYSTEMS.solar;
      this.planets = [];
      this.pickTargets = [];
      this.disposables = [];
      this.currentDistanceScale = 1;
      this.tmpCamPos = new this.three.Vector3();
      this.tmpRootPos = new this.three.Vector3();

      // Each system gets its own compact scale so the outermost planet fits above the marker.
      this.root = new this.three.Group();
      this.root.position.y = this.systemDef.sceneYOffset;
      this.root.scale.setScalar(this.systemDef.sceneScale);
      this.el.object3D.add(this.root);

      // Runtime state for the kid-facing controls. These are mutated by the
      // control-panel buttons in setupControlPanel().
      this.paused = false;
      this.speedMultiplier = PREFERS_REDUCED_MOTION ? 0.4 : 1.0;
      this.showOrbits = true;
      this.showLabels = true;
      this.trueScale = false;
      this.reducedMotion = PREFERS_REDUCED_MOTION;
      this.tmpObject = new this.three.Object3D();

      this.createLights();
      this.createSun();
      this.createOrbitingPlanets();
      this.createAsteroidBelt();
      this.createShips();
      this.createStarField();
      this.bindMarkerEvents();
      this.setupInfoPanel();
      this.setupControlPanel();
      this.setupPlanetPicking();
    },

    createLights: function () {
      const star = this.systemDef.star;
      const ambient = new this.three.AmbientLight(star.ambientColor, 0.9);
      const sunLight = new this.three.PointLight(star.pointColor, star.pointIntensity, star.pointDistance);

      sunLight.position.set(0, 0.18, 0);
      this.root.add(ambient, sunLight);
    },

    createSun: function () {
      // The central star gets a swirling procedural surface, an emissive
      // material, and an outer corona shell so it reads as a bright body in AR.
      const star = this.systemDef.star;
      const geometry = this.track(new this.three.SphereGeometry(star.radius, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const sunTexture = this.createPlanetTexture(star.texture);
      const material = this.track(new this.three.MeshStandardMaterial({
        map: sunTexture,
        emissive: star.emissive,
        emissiveMap: sunTexture,
        emissiveIntensity: 1.4,
        roughness: 0.45
      }));

      this.sun = new this.three.Mesh(geometry, material);
      this.sunState = { mesh: this.sun, data: star.info };
      this.sun.userData.planetState = this.sunState;

      const coronaGeometry = this.track(new this.three.SphereGeometry(star.radius * 1.35, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const coronaMaterial = this.track(new this.three.MeshBasicMaterial({
        color: star.coronaColor,
        transparent: true,
        opacity: star.coronaOpacity,
        blending: this.three.AdditiveBlending,
        depthWrite: false,
        side: this.three.BackSide
      }));
      this.sunCorona = new this.three.Mesh(coronaGeometry, coronaMaterial);
      this.sun.add(this.sunCorona);

      const sunPickRadius = Math.max(star.radius * PLANET_PICK_TARGET_SCALE, PLANET_PICK_TARGET_MIN_SIZE);
      const sunPickGeometry = this.track(new this.three.SphereGeometry(sunPickRadius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
      const sunPickMaterial = this.track(new this.three.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      this.sunPickTarget = new this.three.Mesh(sunPickGeometry, sunPickMaterial);
      this.sunPickTarget.name = `${this.systemDef.star.info.name} pick target`;
      this.sunPickTarget.userData.planetState = this.sunState;
      this.sun.add(this.sunPickTarget);

      this.root.add(this.sun);
    },

    createOrbitingPlanets: function () {
      this.orbitRings = [];
      for (const planetData of this.systemDef.planets) {
        const orbit = this.createOrbitRing(planetData.radius);
        const orbitGroup = new this.three.Group();

        // tiltAnchor sits on the orbit and carries the axial tilt; the planet
        // mesh inside spins on its own Y axis without affecting the tilt.
        const tiltAnchor = new this.three.Group();
        tiltAnchor.position.x = planetData.radius;
        tiltAnchor.rotation.z = planetData.axialTilt || 0;
        orbitGroup.add(tiltAnchor);

        const planet = this.createPlanet(planetData);
        tiltAnchor.add(planet);
        this.root.add(orbit, orbitGroup);
        this.orbitRings.push(orbit);

        const label = this.createPlanetLabel(planetData);
        // Label lives on the tilt anchor so it doesn't tilt or spin with the
        // planet's surface (sprites face the camera regardless).
        tiltAnchor.add(label);

        const planetState = {
          mesh: planet,
          orbitGroup,
          tiltAnchor,
          orbit,
          label,
          pickTarget: null,
          data: planetData,
          speed: planetData.speed,
          spinSpeed: planetData.spinSpeed || SOLAR_SPIN_SPEED,
          angleOffset: randomBetween(0, TWO_PI),
          moonPivot: null,
          ringMesh: null
        };

        orbitGroup.rotation.y = planetState.angleOffset;
        planet.userData.planetState = planetState;

        const pickTarget = this.createPlanetPickTarget(planetData);
        pickTarget.userData.planetState = planetState;
        // Pick target lives on tilt anchor so its position matches the planet
        // but is not affected by the planet's spin.
        tiltAnchor.add(pickTarget);
        planetState.pickTarget = pickTarget;
        this.pickTargets.push(pickTarget);

        if (planetData.ring) {
          planetState.ringMesh = this.createSaturnRing();
          tiltAnchor.add(planetState.ringMesh);
        }

        if (planetData.moon) {
          planetState.moonPivot = this.createMoon(tiltAnchor);
        }

        this.planets.push(planetState);
      }
    },

    createPlanetLabel: function (planetData) {
      // A canvas-based sprite renders the planet name in a small floating box
      // above each planet; sprites always face the camera, so the label stays
      // legible as the planet swings around its orbit.
      const canvas = document.createElement("canvas");
      canvas.width = LABEL_CANVAS_WIDTH;
      canvas.height = LABEL_CANVAS_HEIGHT;

      const ctx = canvas.getContext("2d");
      const inset = LABEL_BORDER_WIDTH;
      const w = canvas.width - inset * 2;
      const h = canvas.height - inset * 2;
      const r = LABEL_RADIUS;

      ctx.beginPath();
      ctx.moveTo(inset + r, inset);
      ctx.lineTo(inset + w - r, inset);
      ctx.quadraticCurveTo(inset + w, inset, inset + w, inset + r);
      ctx.lineTo(inset + w, inset + h - r);
      ctx.quadraticCurveTo(inset + w, inset + h, inset + w - r, inset + h);
      ctx.lineTo(inset + r, inset + h);
      ctx.quadraticCurveTo(inset, inset + h, inset, inset + h - r);
      ctx.lineTo(inset, inset + r);
      ctx.quadraticCurveTo(inset, inset, inset + r, inset);
      ctx.closePath();

      ctx.fillStyle = LABEL_BG_COLOR;
      ctx.fill();
      ctx.lineWidth = LABEL_BORDER_WIDTH;
      ctx.strokeStyle = LABEL_BORDER_COLOR;
      ctx.stroke();

      ctx.fillStyle = LABEL_TEXT_COLOR;
      ctx.font = LABEL_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(planetData.name, canvas.width / 2, canvas.height / 2 + 1);

      const texture = this.track(new this.three.CanvasTexture(canvas));
      if (this.three.SRGBColorSpace) {
        texture.colorSpace = this.three.SRGBColorSpace;
      } else {
        texture.encoding = this.three.sRGBEncoding;
      }
      texture.needsUpdate = true;

      const material = this.track(new this.three.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      }));
      const sprite = new this.three.Sprite(material);

      sprite.scale.set(LABEL_SPRITE_SCALE_X, LABEL_SPRITE_SCALE_Y, 1);
      sprite.position.y = planetData.size + LABEL_HEIGHT_PADDING;
      sprite.renderOrder = 10;

      return sprite;
    },

    createOrbitRing: function (radius) {
      // Thin torus rings show each orbital path without needing extra textures.
      const geometry = this.track(new this.three.TorusGeometry(radius, 0.002, 8, DISK_SEGMENTS));
      const material = this.track(new this.three.MeshBasicMaterial({
        color: SOLAR_ORBIT_COLOR,
        transparent: true,
        opacity: SOLAR_ORBIT_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const orbit = new this.three.Mesh(geometry, material);

      orbit.rotation.x = this.three.MathUtils.degToRad(SOLAR_ORBIT_TILT_X);
      return orbit;
    },

    createPlanet: function (planetData) {
      const geometry = this.track(new this.three.SphereGeometry(planetData.size, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const texture = planetData.texture
        ? this.createPlanetTexture(planetData.texture)
        : null;
      const material = this.track(new this.three.MeshStandardMaterial({
        map: texture,
        color: texture ? "#ffffff" : planetData.color,
        roughness: 0.7,
        metalness: 0.04
      }));

      return new this.three.Mesh(geometry, material);
    },

    createPlanetPickTarget: function (planetData) {
      const radius = Math.max(planetData.size * PLANET_PICK_TARGET_SCALE, PLANET_PICK_TARGET_MIN_SIZE);
      const geometry = this.track(new this.three.SphereGeometry(radius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
      const material = this.track(new this.three.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      const target = new this.three.Mesh(geometry, material);

      target.name = `${planetData.name} pick target`;
      return target;
    },

    createMoon: function (parent) {
      // A tiny Moon orbiting Earth helps the scale model feel immediately
      // recognizable. The MeshStandardMaterial reacts to the Sun's PointLight,
      // so the Moon naturally shows phases as it orbits.
      const moonPivot = new this.three.Group();
      const moonGeometry = this.track(new this.three.SphereGeometry(SOLAR_MOON_SIZE, 16, 16));
      const moonMaterial = this.track(new this.three.MeshStandardMaterial({
        map: this.createPlanetTexture("moon"),
        color: "#ffffff",
        roughness: 0.95
      }));
      const moon = new this.three.Mesh(moonGeometry, moonMaterial);

      moon.position.x = SOLAR_MOON_RADIUS;
      moonPivot.add(moon);
      parent.add(moonPivot);

      return moonPivot;
    },

    createPlanetTexture: function (kind) {
      // Procedural canvas textures keep the project file:// friendly (no CORS
      // issues, no extra HTTP requests) while still giving each planet a
      // distinctive appearance for kids.
      const width = 512;
      const height = 256;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const drawNoise = (alphaMin, alphaMax, count, hue) => {
        for (let i = 0; i < count; i += 1) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const r = randomBetween(0.5, 2.4);
          const a = randomBetween(alphaMin, alphaMax);
          ctx.fillStyle = `hsla(${hue}, 30%, 60%, ${a})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, TWO_PI);
          ctx.fill();
        }
      };

      const horizontalBands = (stops) => {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        for (const [stop, color] of stops) grad.addColorStop(stop, color);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      };

      const wavyBands = (baseColor, bandColors, bandCount) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < bandCount; i += 1) {
          const y = (i / bandCount) * height;
          const bandHeight = height / bandCount;
          ctx.fillStyle = bandColors[i % bandColors.length];
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= width; x += 8) {
            const wob = Math.sin((x / width) * Math.PI * 6 + i) * 4;
            ctx.lineTo(x, y + wob);
          }
          ctx.lineTo(width, y + bandHeight);
          for (let x = width; x >= 0; x -= 8) {
            const wob = Math.sin((x / width) * Math.PI * 6 + i + 1) * 4;
            ctx.lineTo(x, y + bandHeight + wob);
          }
          ctx.closePath();
          ctx.fill();
        }
      };

      switch (kind) {
        case "sun": {
          const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, height);
          grad.addColorStop(0, "#fff7c8");
          grad.addColorStop(0.4, "#ffd24a");
          grad.addColorStop(1, "#ff7a18");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 240; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(2, 14);
            ctx.fillStyle = `rgba(255, ${180 + Math.random() * 60 | 0}, 60, ${0.15 + Math.random() * 0.35})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
          }
          // Sunspot specks.
          for (let i = 0; i < 14; i += 1) {
            ctx.fillStyle = "rgba(120, 40, 0, 0.55)";
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 5), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "mercury": {
          horizontalBands([[0, "#8a7e74"], [0.5, "#b8aaa0"], [1, "#7a6e64"]]);
          // Crater dots — the most recognizable Mercury feature.
          for (let i = 0; i < 320; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(1.5, 6);
            ctx.fillStyle = `rgba(60, 50, 45, ${randomBetween(0.25, 0.6)})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
            ctx.fillStyle = `rgba(220, 210, 200, ${randomBetween(0.15, 0.3)})`;
            ctx.beginPath();
            ctx.arc(x - r * 0.4, y - r * 0.4, r * 0.4, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "venus": {
          horizontalBands([[0, "#d8a866"], [0.5, "#f5c97e"], [1, "#caa05a"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(255, 220, 160, 0.18)", "rgba(180, 130, 70, 0.22)"], 14);
          break;
        }
        case "earth": {
          // Ocean base.
          horizontalBands([[0, "#1f4ea0"], [0.5, "#2c6dd2"], [1, "#1a3f80"]]);
          // Continent blobs.
          ctx.fillStyle = "#3b8a3b";
          for (let i = 0; i < 14; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.15, height * 0.85);
            ctx.beginPath();
            const points = 9;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(8, 38);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.6;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // Polar ice.
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fillRect(0, 0, width, 12);
          ctx.fillRect(0, height - 12, width, 12);
          // Cloud wisps.
          for (let i = 0; i < 60; i += 1) {
            ctx.fillStyle = `rgba(255,255,255,${randomBetween(0.18, 0.55)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(8, 30), randomBetween(2, 6), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "mars": {
          horizontalBands([[0, "#a83a1f"], [0.5, "#d35a36"], [1, "#7a2710"]]);
          for (let i = 0; i < 220; i += 1) {
            ctx.fillStyle = `rgba(${80 + Math.random() * 70 | 0}, ${30 + Math.random() * 30 | 0}, 20, ${randomBetween(0.2, 0.45)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 7), 0, TWO_PI);
            ctx.fill();
          }
          // Polar caps.
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillRect(0, 0, width, 8);
          ctx.fillRect(0, height - 8, width, 8);
          break;
        }
        case "jupiter": {
          wavyBands("#d6a368",
            ["#f0d4a4", "#a87338", "#e6bd86", "#7a4a1a", "#d4a36a"], 16);
          // Great Red Spot.
          ctx.fillStyle = "#a8351e";
          ctx.beginPath();
          ctx.ellipse(width * 0.65, height * 0.62, 26, 14, 0.1, 0, TWO_PI);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 200, 160, 0.4)";
          ctx.beginPath();
          ctx.ellipse(width * 0.65, height * 0.62, 22, 11, 0.1, 0, TWO_PI);
          ctx.fill();
          break;
        }
        case "saturn": {
          wavyBands("#dfc187",
            ["#f3e0ad", "#c69e58", "#e6cc91", "#a8843e"], 12);
          break;
        }
        case "uranus": {
          horizontalBands([[0, "#a8e1f0"], [0.5, "#7dd3fc"], [1, "#9ad6ea"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(180, 230, 250, 0.25)", "rgba(120, 180, 210, 0.18)"], 6);
          break;
        }
        case "neptune": {
          horizontalBands([[0, "#3a5fcf"], [0.5, "#4169e1"], [1, "#284aa3"]]);
          wavyBands("rgba(0,0,0,0)",
            ["rgba(180, 210, 255, 0.18)", "rgba(60, 100, 200, 0.22)"], 8);
          // Dark spot like Neptune's storms.
          ctx.fillStyle = "rgba(20, 30, 80, 0.7)";
          ctx.beginPath();
          ctx.ellipse(width * 0.32, height * 0.45, 18, 9, 0, 0, TWO_PI);
          ctx.fill();
          break;
        }
        case "moon": {
          horizontalBands([[0, "#c8c2b3"], [0.5, "#d9d7ce"], [1, "#aaa498"]]);
          for (let i = 0; i < 200; i += 1) {
            ctx.fillStyle = `rgba(70, 65, 60, ${randomBetween(0.25, 0.55)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(1.2, 4), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiStar": {
          // Tau Ceti is G8V — a touch cooler and more amber than the Sun.
          const grad = ctx.createRadialGradient(width / 2, height / 2, 18, width / 2, height / 2, height);
          grad.addColorStop(0, "#fff0b8");
          grad.addColorStop(0.4, "#ffba50");
          grad.addColorStop(1, "#e0631a");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 220; i += 1) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const r = randomBetween(2, 13);
            ctx.fillStyle = `rgba(255, ${160 + Math.random() * 60 | 0}, 50, ${0.15 + Math.random() * 0.32})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
          }
          for (let i = 0; i < 12; i += 1) {
            ctx.fillStyle = "rgba(110, 30, 0, 0.55)";
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(2, 5), 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiG": {
          // Innermost: scorched, lava-streaked super-Earth.
          horizontalBands([[0, "#7a3520"], [0.5, "#c97a4f"], [1, "#5e2613"]]);
          for (let i = 0; i < 280; i += 1) {
            ctx.fillStyle = `rgba(${180 + Math.random() * 60 | 0}, ${60 + Math.random() * 40 | 0}, 20, ${randomBetween(0.2, 0.5)})`;
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, randomBetween(1.5, 5), 0, TWO_PI);
            ctx.fill();
          }
          // A few bright lava cracks.
          for (let i = 0; i < 24; i += 1) {
            ctx.strokeStyle = `rgba(255, 180, 60, ${randomBetween(0.4, 0.8)})`;
            ctx.lineWidth = randomBetween(1, 2.5);
            ctx.beginPath();
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + randomBetween(-30, 30), sy + randomBetween(-12, 12));
            ctx.stroke();
          }
          break;
        }
        case "tauCetiH": {
          // Warm super-Earth with rocky cratering.
          horizontalBands([[0, "#8a3d28"], [0.5, "#b86045"], [1, "#6e2c1e"]]);
          for (let i = 0; i < 260; i += 1) {
            const r = randomBetween(1.5, 5.5);
            const x = Math.random() * width;
            const y = Math.random() * height;
            ctx.fillStyle = `rgba(50, 22, 14, ${randomBetween(0.25, 0.55)})`;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TWO_PI);
            ctx.fill();
            ctx.fillStyle = `rgba(220, 170, 140, ${randomBetween(0.15, 0.3)})`;
            ctx.beginPath();
            ctx.arc(x - r * 0.4, y - r * 0.4, r * 0.4, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiE": {
          // Inner-habitable-zone super-Earth — possible oceans + landmasses.
          horizontalBands([[0, "#264e84"], [0.5, "#5e8fbf"], [1, "#1f3f6a"]]);
          ctx.fillStyle = "#5b8a4a";
          for (let i = 0; i < 12; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.2, height * 0.8);
            ctx.beginPath();
            const points = 9;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(10, 36);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.55;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // Sparse polar ice (warm planet, only thin caps).
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillRect(0, 0, width, 6);
          ctx.fillRect(0, height - 6, width, 6);
          // Cloud wisps.
          for (let i = 0; i < 50; i += 1) {
            ctx.fillStyle = `rgba(255,255,255,${randomBetween(0.18, 0.45)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(8, 26), randomBetween(2, 5), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        case "tauCetiF": {
          // Outer-habitable-zone super-Earth — colder, slate-blue with thicker ice.
          horizontalBands([[0, "#3e5878"], [0.5, "#7896b8"], [1, "#2a3e5a"]]);
          // Thicker polar caps.
          ctx.fillStyle = "rgba(232, 240, 255, 0.92)";
          ctx.fillRect(0, 0, width, 18);
          ctx.fillRect(0, height - 18, width, 18);
          // Faint frozen continents.
          ctx.fillStyle = "rgba(180, 195, 215, 0.55)";
          for (let i = 0; i < 10; i += 1) {
            const cx = Math.random() * width;
            const cy = randomBetween(height * 0.25, height * 0.75);
            ctx.beginPath();
            const points = 8;
            for (let j = 0; j <= points; j += 1) {
              const a = (j / points) * TWO_PI;
              const r = randomBetween(8, 28);
              const x = cx + Math.cos(a) * r;
              const y = cy + Math.sin(a) * r * 0.6;
              if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          }
          // High thin clouds.
          for (let i = 0; i < 40; i += 1) {
            ctx.fillStyle = `rgba(220, 235, 255, ${randomBetween(0.14, 0.34)})`;
            ctx.beginPath();
            ctx.ellipse(Math.random() * width, Math.random() * height, randomBetween(10, 28), randomBetween(2, 5), Math.random() * Math.PI, 0, TWO_PI);
            ctx.fill();
          }
          break;
        }
        default:
          ctx.fillStyle = "#888";
          ctx.fillRect(0, 0, width, height);
      }

      // Soft brightness noise on every body so it never reads as a flat color.
      drawNoise(0.04, 0.1, 60, 30);

      const texture = this.track(new this.three.CanvasTexture(canvas));
      if (this.three.SRGBColorSpace) {
        texture.colorSpace = this.three.SRGBColorSpace;
      } else {
        texture.encoding = this.three.sRGBEncoding;
      }
      texture.needsUpdate = true;
      return texture;
    },

    createAsteroidBelt: function () {
      // A ring of small instanced rocks. In the Solar System this is the
      // main belt between Mars and Jupiter; in Tau Ceti this becomes the
      // dusty debris disk that lies just outside the outermost planet.
      const belt = this.systemDef.asteroidBelt;
      const geometry = this.track(new this.three.SphereGeometry(1, 6, 6));
      const material = this.track(new this.three.MeshStandardMaterial({
        color: belt.color,
        roughness: 0.95,
        metalness: 0.02
      }));
      const mesh = new this.three.InstancedMesh(geometry, material, ASTEROID_COUNT);
      mesh.instanceMatrix.setUsage(this.three.DynamicDrawUsage);

      this.asteroids = [];
      for (let i = 0; i < ASTEROID_COUNT; i += 1) {
        this.asteroids.push({
          angle: randomBetween(0, TWO_PI),
          radius: randomBetween(belt.innerRadius, belt.outerRadius),
          height: randomBetween(-belt.heightVariance, belt.heightVariance),
          size: randomBetween(belt.minSize, belt.maxSize),
          speed: randomBetween(belt.minSpeed, belt.maxSpeed)
        });
      }
      this.asteroidMesh = mesh;
      this.root.add(mesh);
    },

    createShips: function () {
      // Story-driven extras: in Tau Ceti, Project Hail Mary parks the Hail
      // Mary and the Blip-A near Tau Ceti e. Solar has no ships, so this
      // method short-circuits.
      this.ships = [];
      const shipDefs = this.systemDef.ships;
      if (!shipDefs || shipDefs.length === 0) {
        return;
      }
      const T = this.three;
      for (const shipDef of shipDefs) {
        const mesh = this.createShipMesh(shipDef);
        if (!mesh) {
          continue;
        }
        mesh.position.fromArray(shipDef.position);

        // Invisible pick sphere covers the whole ship so taps register easily.
        const pickRadius = Math.max(shipDef.pickRadius || 0.06, PLANET_PICK_TARGET_MIN_SIZE);
        const pickGeo = this.track(new T.SphereGeometry(pickRadius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
        const pickMat = this.track(new T.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false
        }));
        const pickTarget = new T.Mesh(pickGeo, pickMat);
        pickTarget.position.fromArray(shipDef.position);
        pickTarget.name = `${shipDef.name} pick target`;

        const shipState = {
          mesh,
          pickTarget,
          data: shipDef.info,
          centrifuge: mesh.userData.centrifuge || null,
          loadedModel: null
        };
        mesh.userData.planetState = shipState;
        pickTarget.userData.planetState = shipState;

        this.ships.push(shipState);
        this.root.add(mesh, pickTarget);

        // If a GLB URL is configured, try to load it. On success, the loaded
        // model takes over and the procedural mesh is hidden. On failure, the
        // procedural mesh stays visible (graceful fallback for offline / CORS).
        if (shipDef.modelUrl) {
          this.tryLoadShipModel(shipState, shipDef);
        }
      }
    },

    createShipMesh: function (shipDef) {
      if (shipDef.kind === "hailMary") {
        return this.createHailMaryMesh();
      }
      if (shipDef.kind === "blipA") {
        return this.createBlipAMesh();
      }
      return null;
    },

    tryLoadShipModel: function (shipState, shipDef) {
      const T = this.three;
      const LoaderCtor = T.GLTFLoader || (typeof THREE !== "undefined" && THREE.GLTFLoader);
      if (!LoaderCtor) {
        // Bundled three.js doesn't expose GLTFLoader — keep the procedural mesh.
        console.warn("GLTFLoader unavailable; using procedural ship for", shipDef.name);
        return;
      }

      const loader = new LoaderCtor();
      loader.load(
        shipDef.modelUrl,
        (gltf) => {
          const model = gltf && (gltf.scene || (gltf.scenes && gltf.scenes[0]));
          if (!model) {
            return;
          }
          model.position.fromArray(shipDef.position);
          if (typeof shipDef.modelScale === "number") {
            model.scale.setScalar(shipDef.modelScale);
          }
          if (Array.isArray(shipDef.modelRotation)) {
            model.rotation.set(
              shipDef.modelRotation[0] || 0,
              shipDef.modelRotation[1] || 0,
              shipDef.modelRotation[2] || 0
            );
          }
          // Replace the procedural mesh with the loaded model. Pick target stays
          // unchanged so taps still register.
          shipState.mesh.visible = false;
          shipState.loadedModel = model;
          shipState.centrifuge = null; // GLB owns its own animation, if any
          this.root.add(model);
        },
        undefined,
        (err) => {
          console.warn(`Failed to load ${shipDef.name} model from ${shipDef.modelUrl}:`, err);
          // Procedural mesh remains visible — no further action needed.
        }
      );
    },

    createHailMaryMesh: function () {
      const T = this.three;
      const ship = new T.Group();

      const hullMat = this.track(new T.MeshStandardMaterial({
        color: "#e1ddcf", roughness: 0.55, metalness: 0.35
      }));
      const detailMat = this.track(new T.MeshStandardMaterial({
        color: "#a4a098", roughness: 0.6, metalness: 0.55
      }));
      const engineMat = this.track(new T.MeshStandardMaterial({
        color: "#5a5862", roughness: 0.4, metalness: 0.85
      }));
      const radiatorMat = this.track(new T.MeshStandardMaterial({
        color: "#1f2230", roughness: 0.85, metalness: 0.1,
        emissive: "#5a1a08", emissiveIntensity: 0.4,
        side: T.DoubleSide
      }));
      const windowMat = this.track(new T.MeshBasicMaterial({
        color: "#fff0b0", transparent: true, opacity: 0.85,
        blending: T.AdditiveBlending, depthWrite: false
      }));
      const glowMat = this.track(new T.MeshBasicMaterial({
        color: "#ffb24d", transparent: true, opacity: 0.5,
        blending: T.AdditiveBlending, depthWrite: false
      }));

      // Spine — main structural cylinder along the ship's +Z forward axis.
      const spineLen = 0.08;
      const spine = new T.Mesh(
        this.track(new T.CylinderGeometry(0.004, 0.004, spineLen, 14, 1)),
        hullMat
      );
      spine.rotation.x = Math.PI / 2;
      ship.add(spine);

      // Front cupola (control deck).
      const cupola = new T.Mesh(
        this.track(new T.SphereGeometry(0.0085, 14, 12)),
        hullMat
      );
      cupola.position.z = spineLen / 2;
      ship.add(cupola);
      const cupolaWindow = new T.Mesh(
        this.track(new T.SphereGeometry(0.0055, 12, 10)),
        windowMat
      );
      cupolaWindow.position.z = spineLen / 2 + 0.003;
      cupolaWindow.scale.set(0.95, 0.55, 0.45);
      ship.add(cupolaWindow);

      // Centrifuge — three-arm crew section that slowly rotates around the spine.
      const centrifuge = new T.Group();
      centrifuge.position.z = -0.005;

      const hub = new T.Mesh(
        this.track(new T.CylinderGeometry(0.0075, 0.0075, 0.014, 14, 1)),
        detailMat
      );
      hub.rotation.x = Math.PI / 2;
      centrifuge.add(hub);

      const armRadius = 0.024;
      for (let i = 0; i < 3; i += 1) {
        const armGroup = new T.Group();
        armGroup.rotation.z = (i / 3) * TWO_PI;

        const strut = new T.Mesh(
          this.track(new T.CylinderGeometry(0.0016, 0.0016, armRadius, 8, 1)),
          detailMat
        );
        strut.rotation.z = -Math.PI / 2;
        strut.position.x = armRadius / 2;
        armGroup.add(strut);

        const capsuleGeo = T.CapsuleGeometry
          ? this.track(new T.CapsuleGeometry(0.0058, 0.018, 6, 12))
          : this.track(new T.CylinderGeometry(0.0058, 0.0058, 0.0296, 14, 1));
        const capsule = new T.Mesh(capsuleGeo, hullMat);
        capsule.rotation.x = Math.PI / 2;
        capsule.position.x = armRadius + 0.005;
        armGroup.add(capsule);

        // Capsule window strip on the "outer" face of the capsule.
        const windowStrip = new T.Mesh(
          this.track(new T.PlaneGeometry(0.014, 0.0014)),
          windowMat
        );
        windowStrip.position.set(armRadius + 0.005, 0.006, 0);
        windowStrip.rotation.x = -Math.PI / 2;
        armGroup.add(windowStrip);

        centrifuge.add(armGroup);
      }
      ship.add(centrifuge);

      // Radiator vanes — two big flat fins running along the ship body.
      const radiatorGeo = this.track(new T.PlaneGeometry(0.045, 0.022));
      for (const side of [-1, 1]) {
        const radiator = new T.Mesh(radiatorGeo, radiatorMat);
        radiator.rotation.x = Math.PI / 2;
        radiator.position.set(side * 0.018, 0, -spineLen / 2 + 0.025);
        ship.add(radiator);
      }

      // Engine bell + nozzles at the rear (-Z).
      const bell = new T.Mesh(
        this.track(new T.CylinderGeometry(0.013, 0.016, 0.014, 16, 1)),
        engineMat
      );
      bell.position.z = -spineLen / 2 - 0.007;
      bell.rotation.x = Math.PI / 2;
      ship.add(bell);

      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * TWO_PI + Math.PI / 4;
        const nozzle = new T.Mesh(
          this.track(new T.CylinderGeometry(0.0035, 0.0055, 0.01, 10, 1)),
          engineMat
        );
        nozzle.position.set(Math.cos(angle) * 0.008, Math.sin(angle) * 0.008, -spineLen / 2 - 0.018);
        nozzle.rotation.x = Math.PI / 2;
        ship.add(nozzle);
      }

      const driveGlow = new T.Mesh(
        this.track(new T.SphereGeometry(0.014, 14, 12)),
        glowMat
      );
      driveGlow.position.z = -spineLen / 2 - 0.024;
      driveGlow.scale.set(1, 1, 1.7);
      ship.add(driveGlow);

      ship.userData.centrifuge = centrifuge;
      return ship;
    },

    createBlipAMesh: function () {
      const T = this.three;
      const ship = new T.Group();

      // Xenonite reads as warm, semi-translucent amber in the book. We fake
      // that with a slightly metallic standard material plus a faint emissive.
      const xenoniteMat = this.track(new T.MeshStandardMaterial({
        color: "#f0e0b0", roughness: 0.35, metalness: 0.3,
        emissive: "#3a2814", emissiveIntensity: 0.18
      }));
      const ridgeMat = this.track(new T.MeshStandardMaterial({
        color: "#c8a868", roughness: 0.55, metalness: 0.45
      }));
      const portMat = this.track(new T.MeshStandardMaterial({
        color: "#7a5a30", roughness: 0.7, metalness: 0.5
      }));

      // Main hull — flat oblate spheroid (the canonical Eridian "coffee bean").
      const hull = new T.Mesh(
        this.track(new T.SphereGeometry(0.045, 28, 20)),
        xenoniteMat
      );
      hull.scale.set(1.0, 0.32, 0.95);
      ship.add(hull);

      // Equatorial seam ridge — Eridian hulls are described as segmented.
      const seam = new T.Mesh(
        this.track(new T.TorusGeometry(0.0445, 0.0028, 8, 40)),
        ridgeMat
      );
      seam.rotation.x = Math.PI / 2;
      ship.add(seam);

      // A second, smaller belt ridge above the seam to add detail.
      const beltUpper = new T.Mesh(
        this.track(new T.TorusGeometry(0.04, 0.0014, 6, 36)),
        ridgeMat
      );
      beltUpper.rotation.x = Math.PI / 2;
      beltUpper.position.y = 0.005;
      ship.add(beltUpper);

      // Pole bumps at top and bottom — engine ports / sensor cluster.
      for (const side of [-1, 1]) {
        const polarBump = new T.Mesh(
          this.track(new T.SphereGeometry(0.012, 16, 12)),
          ridgeMat
        );
        polarBump.position.y = side * 0.013;
        polarBump.scale.set(1, 0.55, 1);
        ship.add(polarBump);

        const polarPort = new T.Mesh(
          this.track(new T.CylinderGeometry(0.005, 0.0065, 0.004, 14, 1)),
          portMat
        );
        polarPort.position.y = side * 0.0165;
        ship.add(polarPort);
      }

      // Rim ports — four equally-spaced docking / drive ports around the rim.
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * TWO_PI;
        const port = new T.Mesh(
          this.track(new T.CylinderGeometry(0.005, 0.0065, 0.005, 12, 1)),
          portMat
        );
        port.position.set(Math.cos(angle) * 0.045, 0, Math.sin(angle) * 0.045);
        port.rotation.z = Math.PI / 2;
        port.lookAt(0, 0, 0);
        ship.add(port);
      }

      return ship;
    },

    createSaturnRing: function () {
      const geometry = this.track(new this.three.RingGeometry(
        SOLAR_SATURN_RING_INNER,
        SOLAR_SATURN_RING_OUTER,
        DISK_SEGMENTS,
        2
      ));
      const material = this.track(new this.three.MeshBasicMaterial({
        color: SOLAR_SATURN_RING_COLOR,
        side: this.three.DoubleSide,
        transparent: true,
        opacity: SOLAR_SATURN_RING_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const ring = new this.three.Mesh(geometry, material);

      ring.rotation.x = this.three.MathUtils.degToRad(SOLAR_SATURN_RING_TILT_X);
      ring.rotation.z = this.three.MathUtils.degToRad(SOLAR_SATURN_RING_TILT_Z);

      return ring;
    },

    createStarField: function () {
      // Small points around the model add depth while remaining lightweight.
      const positions = [];

      for (let i = 0; i < SOLAR_STAR_COUNT; i += 1) {
        const angle = randomBetween(0, TWO_PI);
        const height = randomBetween(SOLAR_STAR_MIN_HEIGHT, SOLAR_STAR_MAX_HEIGHT);
        const radius = randomBetween(SOLAR_STAR_RADIUS * SOLAR_STAR_MIN_RADIUS_SCALE, SOLAR_STAR_RADIUS);

        positions.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
      }

      const geometry = this.track(new this.three.BufferGeometry());
      geometry.setAttribute("position", new this.three.Float32BufferAttribute(positions, 3));

      const material = this.track(new this.three.PointsMaterial({
        color: "#ffffff",
        size: SOLAR_STAR_SIZE,
        transparent: true,
        opacity: SOLAR_STAR_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));

      this.stars = new this.three.Points(geometry, material);
      this.root.add(this.stars);
    },

    bindMarkerEvents: function () {
      this.hud = document.getElementById(HUD_ID);
      this.marker = this.el.closest("a-marker");
      this.hudTimer = null;

      if (!this.marker) {
        return;
      }

      this.onMarkerFound = () => {
        this.setHud(this.systemDef.foundText, true);
      };
      this.onMarkerLost = () => {
        this.setHud(HUD_LOST_TEXT, false);
      };

      this.marker.addEventListener("markerFound", this.onMarkerFound);
      this.marker.addEventListener("markerLost", this.onMarkerLost);
    },

    setHud: function (message, autoHide) {
      if (!this.hud) {
        return;
      }

      window.clearTimeout(this.hudTimer);
      this.hud.textContent = message || HUD_DEFAULT_TEXT;
      this.hud.classList.remove(HUD_HIDDEN_CLASS);

      if (autoHide) {
        this.hudTimer = window.setTimeout(() => {
          this.hud.classList.add(HUD_HIDDEN_CLASS);
        }, HUD_HIDE_DELAY_MS);
      }
    },

    setupInfoPanel: function () {
      const panel = document.createElement("div");
      panel.className = "planet-info";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "planet-info-close";
      closeButton.setAttribute("aria-label", "Close planet info");
      closeButton.textContent = "×";

      const name = document.createElement("h3");
      name.className = "planet-info-name";

      const stats = document.createElement("dl");
      stats.className = "planet-info-stats";

      const text = document.createElement("p");
      text.className = "planet-info-text";

      panel.appendChild(closeButton);
      panel.appendChild(name);
      panel.appendChild(stats);
      panel.appendChild(text);
      document.body.appendChild(panel);

      this.infoPanel = panel;
      this.infoName = name;
      this.infoStats = stats;
      this.infoText = text;

      this.onInfoClose = () => this.hidePlanetInfo();
      closeButton.addEventListener("click", this.onInfoClose);
    },

    setupControlPanel: function () {
      // Right-side control rail with pause, speed slider, and toggles for
      // orbits / labels / true-scale / reduced-motion. Designed for kid-sized
      // tap targets (44px+).
      const panel = document.createElement("div");
      panel.className = "control-panel";
      panel.setAttribute("role", "group");
      panel.setAttribute("aria-label", "Solar system controls");

      const makeRow = (labelText) => {
        const row = document.createElement("div");
        row.className = "control-row";
        if (labelText) {
          const label = document.createElement("span");
          label.className = "control-label";
          label.textContent = labelText;
          row.appendChild(label);
        }
        return row;
      };

      const makeButton = (text, label, onClick) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "control-button";
        btn.textContent = text;
        btn.setAttribute("aria-label", label);
        btn.addEventListener("click", onClick);
        return btn;
      };

      const makeToggle = (text, ariaLabel, initial, onChange) => {
        const btn = makeButton(text, ariaLabel, () => {
          const next = !btn.classList.contains("is-on");
          btn.classList.toggle("is-on", next);
          btn.setAttribute("aria-pressed", String(next));
          onChange(next);
        });
        btn.classList.add("control-toggle");
        if (initial) {
          btn.classList.add("is-on");
          btn.setAttribute("aria-pressed", "true");
        } else {
          btn.setAttribute("aria-pressed", "false");
        }
        return btn;
      };

      // Pause / play.
      const pauseRow = makeRow();
      const pauseBtn = makeButton("⏸ Pause", "Pause or play orbits", () => {
        this.paused = !this.paused;
        pauseBtn.textContent = this.paused ? "▶ Play" : "⏸ Pause";
        pauseBtn.classList.toggle("is-on", this.paused);
      });
      pauseRow.appendChild(pauseBtn);
      panel.appendChild(pauseRow);

      // Speed slider.
      const speedRow = makeRow("Speed");
      const speedSlider = document.createElement("input");
      speedSlider.type = "range";
      speedSlider.className = "control-slider";
      speedSlider.min = "0.1";
      speedSlider.max = "10";
      speedSlider.step = "0.1";
      speedSlider.value = String(this.speedMultiplier);
      speedSlider.setAttribute("aria-label", "Orbit speed multiplier");
      const speedValue = document.createElement("span");
      speedValue.className = "control-value";
      speedValue.textContent = `${this.speedMultiplier.toFixed(1)}×`;
      speedSlider.addEventListener("input", () => {
        const v = parseFloat(speedSlider.value);
        this.speedMultiplier = v;
        speedValue.textContent = `${v.toFixed(1)}×`;
      });
      speedRow.appendChild(speedSlider);
      speedRow.appendChild(speedValue);
      panel.appendChild(speedRow);

      // Toggles.
      const togglesRow = makeRow();
      togglesRow.classList.add("control-row-toggles");
      togglesRow.appendChild(makeToggle("Orbits", "Toggle orbit rings", true, (on) => this.setOrbitsVisible(on)));
      togglesRow.appendChild(makeToggle("Names", "Toggle planet name labels", true, (on) => this.setLabelsVisible(on)));
      togglesRow.appendChild(makeToggle("True size", "Toggle true relative size mode", false, (on) => this.setTrueScale(on)));
      togglesRow.appendChild(makeToggle("Calm", "Toggle reduced-motion calm mode", PREFERS_REDUCED_MOTION, (on) => this.setReducedMotion(on)));
      panel.appendChild(togglesRow);

      document.body.appendChild(panel);
      this.controlPanel = panel;
      this.pauseButton = pauseBtn;
      this.speedSlider = speedSlider;
      this.speedValue = speedValue;
    },

    setOrbitsVisible: function (visible) {
      this.showOrbits = visible;
      if (this.orbitRings) {
        for (const orbit of this.orbitRings) orbit.visible = visible;
      }
    },

    setLabelsVisible: function (visible) {
      this.showLabels = visible;
      for (const planet of this.planets) {
        if (planet.label) planet.label.visible = visible;
      }
    },

    setTrueScale: function (enabled) {
      // True-scale mode: sizes become proportional to real diameters using
      // Earth's current visual radius as the unit. The Sun is compressed (a
      // log factor) so it doesn't eclipse the entire orbit view.
      this.trueScale = enabled;
      const earthBase = TRUE_SCALE_EARTH_BASE;
      for (const planet of this.planets) {
        if (enabled) {
          const targetSize = earthBase * planet.data.realSize;
          const scale = targetSize / planet.data.size;
          planet.mesh.scale.setScalar(scale);
        } else {
          planet.mesh.scale.setScalar(1);
        }
      }
      if (this.sun) {
        this.sun.scale.setScalar(enabled ? this.systemDef.star.trueScaleFactor : 1);
      }
      this.setHud(
        enabled
          ? "True size on · planets are now to scale (orbits aren't!)"
          : "True size off · stylized sizes for visibility",
        true
      );
    },

    setReducedMotion: function (enabled) {
      this.reducedMotion = enabled;
      if (enabled) {
        this.speedMultiplier = Math.min(this.speedMultiplier, 0.5);
        if (this.speedSlider) this.speedSlider.value = String(this.speedMultiplier);
        if (this.speedValue) this.speedValue.textContent = `${this.speedMultiplier.toFixed(1)}×`;
      }
    },

    setupPlanetPicking: function () {
      this.raycaster = new this.three.Raycaster();
      this.pointer = new this.three.Vector2();
      this.pointerStart = { x: 0, y: 0, time: 0 };

      const scene = this.el.sceneEl;
      const attach = () => {
        const canvas = scene && scene.canvas;
        if (!canvas) {
          return;
        }
        this.pickCanvas = canvas;

        const startPress = (event) => {
          const point = this.getEventPoint(event);
          if (!point) {
            return;
          }
          this.pointerStart.x = point.x;
          this.pointerStart.y = point.y;
          this.pointerStart.time = performance.now();
        };

        const finishPress = (event) => {
          const point = this.getEventPoint(event);
          if (!point) {
            return;
          }
          const dx = point.x - this.pointerStart.x;
          const dy = point.y - this.pointerStart.y;
          const elapsed = performance.now() - this.pointerStart.time;

          // Only treat short, near-stationary presses as taps so dragging the
          // camera around the marker doesn't open the info panel.
          if (elapsed > 600 || Math.hypot(dx, dy) > 12) {
            return;
          }
          this.tryPickPlanet(point.x, point.y);
        };

        this.onPointerDown = startPress;
        this.onPointerUp = finishPress;
        canvas.addEventListener("pointerdown", this.onPointerDown);
        canvas.addEventListener("pointerup", this.onPointerUp);

        if (!window.PointerEvent) {
          this.onTouchStart = startPress;
          this.onTouchEnd = finishPress;
          this.onMouseDown = startPress;
          this.onMouseUp = finishPress;
          canvas.addEventListener("touchstart", this.onTouchStart);
          canvas.addEventListener("touchend", this.onTouchEnd);
          canvas.addEventListener("mousedown", this.onMouseDown);
          canvas.addEventListener("mouseup", this.onMouseUp);
        }
      };

      if (scene && scene.hasLoaded) {
        attach();
      } else if (scene) {
        scene.addEventListener("loaded", attach, { once: true });
      }
    },

    getEventPoint: function (event) {
      if (typeof event.clientX === "number") {
        return { x: event.clientX, y: event.clientY };
      }
      const touch = event.changedTouches && event.changedTouches[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
      return null;
    },

    tryPickPlanet: function (clientX, clientY) {
      const canvas = this.pickCanvas;
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!canvas || !camera || this.planets.length === 0) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, camera);
      const meshes = [];

      if (this.sunPickTarget) {
        meshes.push(this.sunPickTarget);
      }
      if (this.sun) {
        meshes.push(this.sun);
      }
      for (const planet of this.planets) {
        if (planet.pickTarget) {
          meshes.push(planet.pickTarget);
        }
        meshes.push(planet.mesh);
      }
      if (this.ships) {
        // Ship visible meshes are Groups, so only the invisible pick sphere
        // participates in the (non-recursive) raycast — it covers the ship.
        for (const ship of this.ships) {
          if (ship.pickTarget) {
            meshes.push(ship.pickTarget);
          }
        }
      }

      const hits = this.raycaster.intersectObjects(meshes, false);

      if (hits.length === 0) {
        return;
      }
      const hit = hits[0].object;
      const state = hit.userData && hit.userData.planetState;
      if (state) {
        this.showPlanetInfo(state);
      }
    },

    showPlanetInfo: function (planetState) {
      if (!this.infoPanel) {
        return;
      }
      const data = planetState.data;
      this.infoName.textContent = data.name;
      this.infoText.textContent = data.info || "";

      // Rebuild the definition list each time so the rows reflect the body
      // currently being shown (Sun has no year, planets do, etc.).
      while (this.infoStats.firstChild) this.infoStats.removeChild(this.infoStats.firstChild);
      const rows = [
        ["Diameter", data.diameter],
        ["Distance", data.distance],
        ["Year length", data.yearLength],
        ["Day length", data.dayLength],
        ["Moons", typeof data.moons === "number" ? String(data.moons) : data.moons]
      ];
      for (const [label, value] of rows) {
        if (value === undefined || value === null || value === "") continue;
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        this.infoStats.appendChild(dt);
        this.infoStats.appendChild(dd);
      }
      this.infoPanel.classList.add("is-visible");
    },

    hidePlanetInfo: function () {
      if (!this.infoPanel) {
        return;
      }
      this.infoPanel.classList.remove("is-visible");
    },

    updateDistanceScale: function () {
      const camera = this.el.sceneEl && this.el.sceneEl.camera;
      if (!camera) {
        return;
      }

      camera.getWorldPosition(this.tmpCamPos);
      this.root.getWorldPosition(this.tmpRootPos);
      const distance = this.tmpCamPos.distanceTo(this.tmpRootPos);
      if (!distance || !isFinite(distance)) {
        return;
      }

      // Scale grows linearly with camera distance so the system stays large
      // and readable when you back away, and shrinks when you move in close.
      const factor = this.three.MathUtils.clamp(
        distance / DISTANCE_REFERENCE,
        DISTANCE_SCALE_MIN,
        DISTANCE_SCALE_MAX
      );
      this.currentDistanceScale += (factor - this.currentDistanceScale) * DISTANCE_SCALE_LERP;
      this.root.scale.setScalar(this.systemDef.sceneScale * this.currentDistanceScale);
    },

    tick: function (time, delta) {
      if (!this.el.object3D.visible) {
        return;
      }

      const rawDt = delta || DEFAULT_DELTA_MS;
      const speed = this.paused ? 0 : this.speedMultiplier;
      const dt = rawDt * speed;

      // Sun pulse uses real time so it never freezes (the "pulse" is just a
      // gentle ambient effect, not part of the orbital simulation). Reduced
      // motion mutes it; true-scale mode bumps the base size up so the pulse
      // multiplies on top of the larger scale.
      const pulseAmt = this.reducedMotion ? SOLAR_SUN_PULSE_AMOUNT * 0.25 : SOLAR_SUN_PULSE_AMOUNT;
      const pulse = 1 + Math.sin(time * SOLAR_SUN_PULSE_SPEED) * pulseAmt;
      const sunBase = this.trueScale ? this.systemDef.star.trueScaleFactor : 1;
      this.sun.scale.setScalar(sunBase * pulse);
      this.sun.rotation.y += dt * SOLAR_SPIN_SPEED;
      this.stars.rotation.y += rawDt * SOLAR_STAR_ROTATION_SPEED;

      for (const planet of this.planets) {
        planet.orbitGroup.rotation.y += dt * planet.speed;
        planet.mesh.rotation.y += dt * planet.spinSpeed;

        if (planet.moonPivot) {
          planet.moonPivot.rotation.y += dt * SOLAR_MOON_SPEED;
        }
      }

      if (this.ships) {
        // Centrifuge spin makes Hail Mary's crew section read as alive even
        // while the ship itself stays put.
        for (const ship of this.ships) {
          if (ship.centrifuge) {
            ship.centrifuge.rotation.z += dt * 0.0009;
          }
        }
      }

      this.updateAsteroids(dt);
      this.updateDistanceScale();
    },

    updateAsteroids: function (dt) {
      if (!this.asteroidMesh || !this.asteroids) {
        return;
      }
      const obj = this.tmpObject;
      for (let i = 0; i < this.asteroids.length; i += 1) {
        const a = this.asteroids[i];
        a.angle += dt * a.speed;
        obj.position.set(
          Math.cos(a.angle) * a.radius,
          a.height,
          Math.sin(a.angle) * a.radius
        );
        obj.scale.setScalar(a.size);
        obj.rotation.set(a.angle, a.angle * 0.6, 0);
        obj.updateMatrix();
        this.asteroidMesh.setMatrixAt(i, obj.matrix);
      }
      this.asteroidMesh.instanceMatrix.needsUpdate = true;
    },

    track: function (resource) {
      this.disposables.push(resource);
      return resource;
    },

    remove: function () {
      window.clearTimeout(this.hudTimer);

      if (this.marker) {
        this.marker.removeEventListener("markerFound", this.onMarkerFound);
        this.marker.removeEventListener("markerLost", this.onMarkerLost);
      }

      if (this.pickCanvas) {
        if (this.onPointerDown) {
          this.pickCanvas.removeEventListener("pointerdown", this.onPointerDown);
        }
        if (this.onPointerUp) {
          this.pickCanvas.removeEventListener("pointerup", this.onPointerUp);
        }
        if (this.onTouchStart) {
          this.pickCanvas.removeEventListener("touchstart", this.onTouchStart);
        }
        if (this.onTouchEnd) {
          this.pickCanvas.removeEventListener("touchend", this.onTouchEnd);
        }
        if (this.onMouseDown) {
          this.pickCanvas.removeEventListener("mousedown", this.onMouseDown);
        }
        if (this.onMouseUp) {
          this.pickCanvas.removeEventListener("mouseup", this.onMouseUp);
        }
      }

      if (this.infoPanel) {
        this.infoPanel.remove();
      }

      // GLB-loaded ship models aren't tracked in this.disposables, so walk
      // their scene graphs and dispose geometries / materials manually.
      if (this.ships) {
        for (const ship of this.ships) {
          if (!ship.loadedModel) continue;
          ship.loadedModel.traverse((child) => {
            if (child.geometry && typeof child.geometry.dispose === "function") {
              child.geometry.dispose();
            }
            const mat = child.material;
            if (!mat) return;
            if (Array.isArray(mat)) {
              for (const m of mat) m.dispose && m.dispose();
            } else if (typeof mat.dispose === "function") {
              mat.dispose();
            }
          });
        }
      }

      this.el.object3D.remove(this.root);

      for (const resource of this.disposables) {
        if (resource && typeof resource.dispose === "function") {
          resource.dispose();
        }
      }
    }
  });
}());
