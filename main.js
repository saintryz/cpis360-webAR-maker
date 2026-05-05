(function () {
  "use strict";

  // Visual scale is tuned for a printed Hiro marker sitting on a desk.
  const SCENE_SCALE = 0.82;
  const SCENE_Y_OFFSET = 0.28;

  // Device/performance constants.
  const MOBILE_QUERY = "(max-width: 760px)";
  const LOW_POWER_CPU_CORES = 4;
  const DESKTOP_PARTICLE_COUNT = 72;
  const MOBILE_PARTICLE_COUNT = 42;
  const DESKTOP_SEGMENTS = 160;
  const MOBILE_SEGMENTS = 112;
  const DESKTOP_SPHERE_SEGMENTS = 48;
  const MOBILE_SPHERE_SEGMENTS = 32;

  // UI constants.
  const HUD_ID = "hudLabel";
  const MODE_BUTTON_ID = "modeButton";
  const HUD_HIDDEN_CLASS = "is-hidden";
  const HUD_DEFAULT_TEXT = "☀️ Hiro: Solar System · tap a planet for info · Kanji: Black Hole";
  const HUD_FOUND_BLACKHOLE_TEXT = "Marker found · Black hole locked";
  const HUD_FOUND_SOLAR_TEXT = "Marker found · tap a planet for info";
  const HUD_LOST_TEXT = "Searching for Hiro or Kanji marker";
  const HUD_HIDE_DELAY_MS = 2800;
  const SUPPORT_MESSAGE_TEXT = "Camera AR needs a browser with WebRTC camera support. Use HTTPS or localhost if your browser blocks camera access.";
  const LOCALHOST_NAMES = ["localhost", "127.0.0.1", "::1"];

  // Interaction mode constants.
  const MODES = [
    { name: "Normal", disk: 1, particles: 1, gravity: 1, glow: 1 },
    { name: "Dramatic", disk: 1.55, particles: 1.35, gravity: 1.55, glow: 1.45 },
    { name: "Calm", disk: 0.55, particles: 0.62, gravity: 0.72, glow: 0.72 }
  ];

  // Singularity constants.
  const SINGULARITY_RADIUS = 0.2;
  const SINGULARITY_COLOR = "#08020d";
  const SINGULARITY_EMISSIVE = "#190022";
  const SINGULARITY_PULSE_SPEED = 0.0018;
  const SINGULARITY_PULSE_AMOUNT = 0.05;

  // Accretion disk constants.
  const DISK_INNER_RADIUS = 0.25;
  const DISK_MIDDLE_RADIUS = 0.52;
  const DISK_OUTER_RADIUS = 0.8;
  const DISK_TEXTURE_SIZE = 512;
  const DISK_TEXTURE_STREAKS = 820;
  const DISK_COLOR_OUTER = "#b84103";
  const DISK_COLOR_MIDDLE = "#ffd018";
  const DISK_COLOR_INNER = "#fff8e7";
  const DISK_COLOR_HOT = "#ffffff";
  const DISK_ROTATION_SPEED_INNER = 0.00062;
  const DISK_ROTATION_SPEED_OUTER = 0.00031;
  const DISK_GLOW_ROTATION_SPEED = 0.00024;
  const DISK_TILT_X = -82;
  const DISK_TILT_Z = 12;
  const DISK_INNER_OPACITY = 0.94;
  const DISK_OUTER_OPACITY = 0.82;
  const DISK_GLOW_OPACITY = 0.24;
  const DISK_OVERLAP_SCALE = 0.92;
  const DISK_GLOW_INNER_SCALE = 0.88;
  const DISK_GLOW_OUTER_SCALE = 1.08;
  const DISK_TEXTURE_CENTER_RADIUS = 4;
  const DISK_TEXTURE_OUTER_HOT_STOP = 0.28;
  const DISK_TEXTURE_INNER_HOT_STOP = 0.2;
  const DISK_TEXTURE_OUTER_MIDDLE_STOP = 0.58;
  const DISK_TEXTURE_INNER_MIDDLE_STOP = 0.48;
  const DISK_TEXTURE_OUTER_COLOR_STOP = 0.86;
  const DISK_TEXTURE_GLOW_EDGE_OPACITY = 0.12;
  const DISK_TEXTURE_STREAK_MIN_RADIUS = 0.16;
  const DISK_TEXTURE_STREAK_MAX_RADIUS = 0.96;
  const DISK_TEXTURE_STREAK_MIN_LENGTH = 0.04;
  const DISK_TEXTURE_STREAK_MAX_LENGTH = 0.22;
  const DISK_TEXTURE_STREAK_MIN_ALPHA = 0.05;
  const DISK_TEXTURE_STREAK_MAX_ALPHA = 0.22;
  const DISK_TEXTURE_STREAK_MIN_GREEN = 140;
  const DISK_TEXTURE_STREAK_MAX_GREEN = 245;
  const DISK_TEXTURE_STREAK_BLUE = 48;
  const DISK_TEXTURE_STREAK_MIN_WIDTH = 1;
  const DISK_TEXTURE_STREAK_MAX_WIDTH = 4;
  const DISK_TEXTURE_FADE_INNER = 0.1;
  const DISK_TEXTURE_FADE_MIDDLE = 0.84;
  const DISK_TEXTURE_FADE_MIDDLE_ALPHA = 0.92;

  // Glow, lensing, and jet constants.
  const HALO_RADIUS = 0.34;
  const HALO_COLOR = "#6b5cff";
  const HALO_OPACITY = 0.32;
  const LENS_RADIUS = 0.96;
  const LENS_COLOR = "#75a7ff";
  const LENS_OPACITY = 0.075;
  const LENS_RING_OPACITY = 0.16;
  const LENS_ROTATION_SPEED = -0.00012;
  const JET_HEIGHT = 0.82;
  const JET_RADIUS = 0.055;
  const JET_COLOR = "#78ccff";
  const JET_OPACITY = 0.18;
  const JET_PULSE_SPEED = 0.0022;
  const JET_PULSE_AMOUNT = 0.08;

  // Particle constants.
  const PARTICLE_MIN_RADIUS = 0.36;
  const PARTICLE_MAX_RADIUS = 0.74;
  const PARTICLE_RESET_RADIUS = 0.29;
  const PARTICLE_MIN_SIZE = 0.012;
  const PARTICLE_MAX_SIZE = 0.037;
  const PARTICLE_MIN_SPEED = 0.00055;
  const PARTICLE_MAX_SPEED = 0.0017;
  const PARTICLE_MIN_DRAIN = 0.000018;
  const PARTICLE_MAX_DRAIN = 0.000052;
  const PARTICLE_VERTICAL_WOBBLE = 0.045;
  const PARTICLE_TILT_MIN = -14;
  const PARTICLE_TILT_MAX = 14;
  const PARTICLE_OPACITY_BANDS = [0.92, 0.64, 0.4];
  const PARTICLE_COLORS = ["#ff7a18", "#ffc92b", "#fff4d0", "#8a7dff", "#66ccff"];
  const TRAIL_STEPS = 4;
  const TRAIL_ANGLE_GAP = 0.13;
  const TRAIL_RADIUS_GAP = 0.018;
  const TRAIL_SIZE_FADE = 0.72;
  const TRAIL_OPACITY_BASE = 0.22;
  const PARTICLE_TILT_AMOUNT = 0.08;
  const PARTICLE_TWINKLE_BASE = 0.86;
  const PARTICLE_TWINKLE_SPEED = 0.003;
  const PARTICLE_TWINKLE_AMOUNT = 0.2;
  const DEFAULT_DELTA_MS = 16.67;

  // Solar system constants.
  const SOLAR_SCENE_SCALE = 0.62;
  const SOLAR_SCENE_Y_OFFSET = 0.18;
  const SOLAR_ORBIT_TILT_X = -90;
  const SOLAR_SUN_RADIUS = 0.13;
  const SOLAR_SUN_COLOR = "#ffcc45";
  const SOLAR_SUN_EMISSIVE = "#ff8a00";
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

  // Asteroid belt (between Mars at 0.53 and Jupiter at 0.68).
  const ASTEROID_INNER_RADIUS = 0.575;
  const ASTEROID_OUTER_RADIUS = 0.645;
  const ASTEROID_HEIGHT_VARIANCE = 0.012;
  const ASTEROID_MIN_SIZE = 0.0035;
  const ASTEROID_MAX_SIZE = 0.0085;
  const ASTEROID_COUNT_DESKTOP = 180;
  const ASTEROID_COUNT_MOBILE = 90;
  const ASTEROID_MIN_SPEED = 0.00045;
  const ASTEROID_MAX_SPEED = 0.0008;
  const ASTEROID_COLOR = "#7d6e60";

  // True-scale toggle: when on, planets are scaled to their real diameter
  // ratios using Earth's current visual size as 1.0. The Sun is scaled with a
  // gentle log compression so it stays inside the orbit view.
  const TRUE_SCALE_EARTH_BASE = 0.04;
  const TRUE_SCALE_SUN_FACTOR = 8.5; // visually compressed (real ratio is 109)

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
  const PARTICLE_COUNT = IS_LOW_POWER ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT;
  const DISK_SEGMENTS = IS_LOW_POWER ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  const SPHERE_SEGMENTS = IS_LOW_POWER ? MOBILE_SPHERE_SEGMENTS : DESKTOP_SPHERE_SEGMENTS;
  const SOLAR_STAR_COUNT = IS_LOW_POWER ? SOLAR_STAR_COUNT_MOBILE : SOLAR_STAR_COUNT_DESKTOP;
  const ASTEROID_COUNT = IS_LOW_POWER ? ASTEROID_COUNT_MOBILE : ASTEROID_COUNT_DESKTOP;
  const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  AFRAME.registerComponent("blackhole-scene", {
    init: function () {
      this.three = AFRAME.THREE;
      this.modeIndex = 0;
      this.particles = [];
      this.disposables = [];
      this.hudTimer = null;
      this.tempObject = new this.three.Object3D();
      this.tempColor = new this.three.Color();

      // The root group lifts and scales the entire visualizer above the Hiro marker.
      this.root = new this.three.Group();
      this.root.position.y = SCENE_Y_OFFSET;
      this.root.scale.setScalar(SCENE_SCALE);
      this.el.object3D.add(this.root);

      this.setupUi();
      this.bindMarkerEvents();
      this.createLights();
      this.createSingularity();
      this.createAccretionDisk();
      this.createParticleField();
      this.createParticleTrails();
      this.createGlowHalo();
      this.createLensShell();
      this.createPolarJets();
    },

    setupUi: function () {
      this.hud = document.getElementById(HUD_ID);
      this.modeButton = document.getElementById(MODE_BUTTON_ID);

      if (this.modeButton) {
        this.modeButton.textContent = MODES[this.modeIndex].name;
        this.onModeClick = this.cycleMode.bind(this);
        this.modeButton.addEventListener("click", this.onModeClick);
      }

      if (!SUPPORTS_CAMERA) {
        this.showSupportMessage();
      }
    },

    bindMarkerEvents: function () {
      this.marker = this.el.closest("a-marker");

      if (!this.marker) {
        return;
      }

      this.onMarkerFound = () => {
        this.setHud(`${HUD_FOUND_BLACKHOLE_TEXT} · ${MODES[this.modeIndex].name}`, true);
      };
      this.onMarkerLost = () => {
        this.setHud(HUD_LOST_TEXT, false);
      };

      this.marker.addEventListener("markerFound", this.onMarkerFound);
      this.marker.addEventListener("markerLost", this.onMarkerLost);
    },

    createLights: function () {
      // A little local light keeps the dark-purple sphere readable in AR.
      const ambient = new this.three.AmbientLight(0x50346f, 0.9);
      const point = new this.three.PointLight(0xffa34d, 1.6, 2.4);
      point.position.set(0.18, 0.45, 0.28);

      this.root.add(ambient);
      this.root.add(point);
    },

    createSingularity: function () {
      // The central black hole is intentionally almost black with a faint purple emission.
      const geometry = this.track(new this.three.SphereGeometry(SINGULARITY_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const material = this.track(new this.three.MeshStandardMaterial({
        color: SINGULARITY_COLOR,
        emissive: SINGULARITY_EMISSIVE,
        emissiveIntensity: 0.75,
        roughness: 0.35,
        metalness: 0.15
      }));

      this.singularity = new this.three.Mesh(geometry, material);
      this.root.add(this.singularity);
    },

    createAccretionDisk: function () {
      // Two textured disk layers rotate at different speeds for turbulent, shearing motion.
      this.innerDisk = this.createDiskLayer(
        DISK_INNER_RADIUS,
        DISK_MIDDLE_RADIUS,
        this.createDiskTexture("inner"),
        DISK_INNER_OPACITY
      );
      this.outerDisk = this.createDiskLayer(
        DISK_MIDDLE_RADIUS * DISK_OVERLAP_SCALE,
        DISK_OUTER_RADIUS,
        this.createDiskTexture("outer"),
        DISK_OUTER_OPACITY
      );

      this.diskGlow = this.createDiskLayer(
        DISK_INNER_RADIUS * DISK_GLOW_INNER_SCALE,
        DISK_OUTER_RADIUS * DISK_GLOW_OUTER_SCALE,
        this.createDiskTexture("glow"),
        DISK_GLOW_OPACITY
      );

      this.root.add(this.diskGlow, this.outerDisk, this.innerDisk);
    },

    createDiskLayer: function (innerRadius, outerRadius, texture, opacity) {
      const geometry = this.track(new this.three.RingGeometry(innerRadius, outerRadius, DISK_SEGMENTS, 4));
      const material = this.track(new this.three.MeshBasicMaterial({
        map: this.track(texture),
        side: this.three.DoubleSide,
        transparent: true,
        opacity,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const disk = new this.three.Mesh(geometry, material);

      disk.rotation.x = this.three.MathUtils.degToRad(DISK_TILT_X);
      disk.rotation.z = this.three.MathUtils.degToRad(DISK_TILT_Z);

      return disk;
    },

    createDiskTexture: function (variant) {
      // Canvas textures avoid extra image files while giving the disk a noisy, plasma-like surface.
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const center = DISK_TEXTURE_SIZE / 2;
      const hotStop = variant === "outer" ? DISK_TEXTURE_OUTER_HOT_STOP : DISK_TEXTURE_INNER_HOT_STOP;
      const middleStop = variant === "outer" ? DISK_TEXTURE_OUTER_MIDDLE_STOP : DISK_TEXTURE_INNER_MIDDLE_STOP;
      const edgeOpacity = variant === "glow" ? DISK_TEXTURE_GLOW_EDGE_OPACITY : 0;

      canvas.width = DISK_TEXTURE_SIZE;
      canvas.height = DISK_TEXTURE_SIZE;
      context.clearRect(0, 0, DISK_TEXTURE_SIZE, DISK_TEXTURE_SIZE);

      const gradient = context.createRadialGradient(center, center, DISK_TEXTURE_CENTER_RADIUS, center, center, center);
      gradient.addColorStop(0, DISK_COLOR_HOT);
      gradient.addColorStop(hotStop, DISK_COLOR_INNER);
      gradient.addColorStop(middleStop, DISK_COLOR_MIDDLE);
      gradient.addColorStop(DISK_TEXTURE_OUTER_COLOR_STOP, DISK_COLOR_OUTER);
      gradient.addColorStop(1, `rgba(184, 65, 3, ${edgeOpacity})`);

      context.fillStyle = gradient;
      context.fillRect(0, 0, DISK_TEXTURE_SIZE, DISK_TEXTURE_SIZE);
      context.globalCompositeOperation = "screen";

      for (let i = 0; i < DISK_TEXTURE_STREAKS; i += 1) {
        const radius = randomBetween(center * DISK_TEXTURE_STREAK_MIN_RADIUS, center * DISK_TEXTURE_STREAK_MAX_RADIUS);
        const angle = randomBetween(0, TWO_PI);
        const length = randomBetween(DISK_TEXTURE_STREAK_MIN_LENGTH, DISK_TEXTURE_STREAK_MAX_LENGTH);
        const brightness = randomBetween(DISK_TEXTURE_STREAK_MIN_ALPHA, DISK_TEXTURE_STREAK_MAX_ALPHA);

        context.beginPath();
        context.arc(center, center, radius, angle, angle + length);
        context.strokeStyle = `rgba(255, ${Math.floor(randomBetween(DISK_TEXTURE_STREAK_MIN_GREEN, DISK_TEXTURE_STREAK_MAX_GREEN))}, ${DISK_TEXTURE_STREAK_BLUE}, ${brightness})`;
        context.lineWidth = randomBetween(DISK_TEXTURE_STREAK_MIN_WIDTH, DISK_TEXTURE_STREAK_MAX_WIDTH);
        context.stroke();
      }

      context.globalCompositeOperation = "destination-in";
      const fade = context.createRadialGradient(center, center, center * DISK_TEXTURE_FADE_INNER, center, center, center);
      fade.addColorStop(0, "rgba(255, 255, 255, 1)");
      fade.addColorStop(DISK_TEXTURE_FADE_MIDDLE, `rgba(255, 255, 255, ${DISK_TEXTURE_FADE_MIDDLE_ALPHA})`);
      fade.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = fade;
      context.fillRect(0, 0, DISK_TEXTURE_SIZE, DISK_TEXTURE_SIZE);
      context.globalCompositeOperation = "source-over";

      const texture = new this.three.CanvasTexture(canvas);
      if (this.three.SRGBColorSpace) {
        texture.colorSpace = this.three.SRGBColorSpace;
      } else {
        texture.encoding = this.three.sRGBEncoding;
      }
      texture.needsUpdate = true;

      return texture;
    },

    createParticleField: function () {
      // Instanced particles are much cheaper than dozens of separate sphere meshes on mobile AR.
      const geometry = this.track(new this.three.SphereGeometry(1, 10, 10));
      const bandCounts = this.getParticleBandCounts();

      this.particleMeshes = PARTICLE_OPACITY_BANDS.map((opacity, band) => {
        const material = this.track(new this.three.MeshBasicMaterial({
          transparent: true,
          opacity,
          blending: this.three.AdditiveBlending,
          depthWrite: false,
          vertexColors: true
        }));
        const mesh = new this.three.InstancedMesh(geometry, material, bandCounts[band]);
        mesh.instanceMatrix.setUsage(this.three.DynamicDrawUsage);
        this.root.add(mesh);

        return mesh;
      });

      const bandIndexes = PARTICLE_OPACITY_BANDS.map(() => 0);

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const band = i % PARTICLE_OPACITY_BANDS.length;
        const instanceIndex = bandIndexes[band];
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];

        this.particleMeshes[band].setColorAt(instanceIndex, this.tempColor.set(color));
        this.particles.push(this.createParticleState(band, instanceIndex, color));
        bandIndexes[band] += 1;
      }

      for (const mesh of this.particleMeshes) {
        if (mesh.instanceColor) {
          mesh.instanceColor.needsUpdate = true;
        }
      }
    },

    createParticleTrails: function () {
      // Faded trailing instances make the particles read as spiraling infall instead of simple dots.
      const geometry = this.track(new this.three.SphereGeometry(1, 8, 8));
      const bandCounts = this.getParticleBandCounts();

      this.trailMeshes = PARTICLE_OPACITY_BANDS.map((opacity, band) => {
        return Array.from({ length: TRAIL_STEPS }, (_, step) => {
          const material = this.track(new this.three.MeshBasicMaterial({
            transparent: true,
            opacity: TRAIL_OPACITY_BASE * opacity * (1 - step / (TRAIL_STEPS + 1)),
            blending: this.three.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
          }));
          const mesh = new this.three.InstancedMesh(geometry, material, bandCounts[band]);
          mesh.instanceMatrix.setUsage(this.three.DynamicDrawUsage);
          this.root.add(mesh);

          return mesh;
        });
      });

      for (const particle of this.particles) {
        for (let step = 0; step < TRAIL_STEPS; step += 1) {
          this.trailMeshes[particle.band][step].setColorAt(particle.instanceIndex, this.tempColor.set(particle.color));
        }
      }

      for (const band of this.trailMeshes) {
        for (const mesh of band) {
          if (mesh.instanceColor) {
            mesh.instanceColor.needsUpdate = true;
          }
        }
      }
    },

    createParticleState: function (band, instanceIndex, color) {
      return {
        band,
        instanceIndex,
        color,
        angle: randomBetween(0, TWO_PI),
        radius: randomBetween(PARTICLE_MIN_RADIUS, PARTICLE_MAX_RADIUS),
        speed: randomBetween(PARTICLE_MIN_SPEED, PARTICLE_MAX_SPEED),
        drain: randomBetween(PARTICLE_MIN_DRAIN, PARTICLE_MAX_DRAIN),
        size: randomBetween(PARTICLE_MIN_SIZE, PARTICLE_MAX_SIZE),
        tilt: this.three.MathUtils.degToRad(randomBetween(PARTICLE_TILT_MIN, PARTICLE_TILT_MAX)),
        wobblePhase: randomBetween(0, TWO_PI),
        wobbleSpeed: randomBetween(0.001, 0.0025)
      };
    },

    getParticleBandCounts: function () {
      return PARTICLE_OPACITY_BANDS.map((_, band) => {
        let count = 0;

        for (let i = 0; i < PARTICLE_COUNT; i += 1) {
          if (i % PARTICLE_OPACITY_BANDS.length === band) {
            count += 1;
          }
        }

        return count;
      });
    },

    createGlowHalo: function () {
      // The soft purple/blue halo is a transparent additive sphere surrounding the singularity.
      const geometry = this.track(new this.three.SphereGeometry(HALO_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const material = this.track(new this.three.MeshBasicMaterial({
        color: HALO_COLOR,
        transparent: true,
        opacity: HALO_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));

      this.halo = new this.three.Mesh(geometry, material);
      this.root.add(this.halo);
    },

    createLensShell: function () {
      // Layered transparent shells and rings suggest gravitational lensing without debug-like wireframes.
      const shellGeometry = this.track(new this.three.SphereGeometry(LENS_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const shellMaterial = this.track(new this.three.MeshBasicMaterial({
        color: LENS_COLOR,
        side: this.three.BackSide,
        transparent: true,
        opacity: LENS_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const ringMaterial = this.track(new this.three.MeshBasicMaterial({
        color: LENS_COLOR,
        transparent: true,
        opacity: LENS_RING_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false
      }));
      const ringGeometry = this.track(new this.three.TorusGeometry(LENS_RADIUS * 0.72, 0.006, 8, DISK_SEGMENTS));

      this.lensShell = new this.three.Mesh(shellGeometry, shellMaterial);
      this.lensShell.scale.set(1, 0.62, 1);

      this.lensRingA = new this.three.Mesh(ringGeometry, ringMaterial);
      this.lensRingB = new this.three.Mesh(ringGeometry, ringMaterial.clone());
      this.track(this.lensRingB.material);
      this.lensRingA.rotation.x = this.three.MathUtils.degToRad(74);
      this.lensRingB.rotation.x = this.three.MathUtils.degToRad(106);
      this.lensRingB.rotation.z = this.three.MathUtils.degToRad(31);

      this.root.add(this.lensShell, this.lensRingA, this.lensRingB);
    },

    createPolarJets: function () {
      // Faint polar jets add an astrophysical detail while staying subtle enough for marker AR.
      const geometry = this.track(new this.three.ConeGeometry(JET_RADIUS, JET_HEIGHT, 32, 1, true));
      const material = this.track(new this.three.MeshBasicMaterial({
        color: JET_COLOR,
        transparent: true,
        opacity: JET_OPACITY,
        blending: this.three.AdditiveBlending,
        depthWrite: false,
        side: this.three.DoubleSide
      }));

      this.jetTop = new this.three.Mesh(geometry, material);
      this.jetBottom = new this.three.Mesh(geometry, material.clone());
      this.track(this.jetBottom.material);
      this.jetTop.position.y = JET_HEIGHT / 2;
      this.jetBottom.position.y = -JET_HEIGHT / 2;
      this.jetBottom.rotation.z = Math.PI;
      this.root.add(this.jetTop, this.jetBottom);
    },

    tick: function (time, delta) {
      const dt = delta || DEFAULT_DELTA_MS;
      const mode = MODES[this.modeIndex];

      this.updateSingularityPulse(time, mode);
      this.updateDisk(dt, mode);
      this.updateParticles(dt, time, mode);
      this.updateLensShell(dt, mode);
      this.updateJets(time, mode);
    },

    updateSingularityPulse: function (time, mode) {
      // Subtle breathing keeps the center alive without breaking the illusion of mass.
      const pulse = 1 + Math.sin(time * SINGULARITY_PULSE_SPEED) * SINGULARITY_PULSE_AMOUNT;
      this.singularity.scale.setScalar(pulse);
      this.halo.scale.setScalar((1 + (pulse - 1) * 1.9) * mode.glow);
      this.halo.material.opacity = HALO_OPACITY * mode.glow;
    },

    updateDisk: function (delta, mode) {
      this.innerDisk.rotation.y += delta * DISK_ROTATION_SPEED_INNER * mode.disk;
      this.outerDisk.rotation.y -= delta * DISK_ROTATION_SPEED_OUTER * mode.disk;
      this.diskGlow.rotation.y += delta * DISK_GLOW_ROTATION_SPEED * mode.disk;
      this.diskGlow.material.opacity = DISK_GLOW_OPACITY * mode.glow;
    },

    updateParticles: function (delta, time, mode) {
      for (const particle of this.particles) {
        particle.angle += delta * particle.speed * mode.particles;
        particle.radius -= delta * particle.drain * mode.gravity;

        if (particle.radius < PARTICLE_RESET_RADIUS) {
          particle.radius = PARTICLE_MAX_RADIUS;
          particle.angle = randomBetween(0, TWO_PI);
        }

        this.writeParticleInstance(particle, particle.angle, particle.radius, particle.size, time);

        for (let step = 0; step < TRAIL_STEPS; step += 1) {
          const trailAngle = particle.angle - (step + 1) * TRAIL_ANGLE_GAP;
          const trailRadius = Math.min(PARTICLE_MAX_RADIUS, particle.radius + (step + 1) * TRAIL_RADIUS_GAP);
          const trailSize = particle.size * Math.pow(TRAIL_SIZE_FADE, step + 1);

          this.writeTrailInstance(particle, step, trailAngle, trailRadius, trailSize, time);
        }
      }

      for (const mesh of this.particleMeshes) {
        mesh.instanceMatrix.needsUpdate = true;
      }

      for (const band of this.trailMeshes) {
        for (const mesh of band) {
          mesh.instanceMatrix.needsUpdate = true;
        }
      }
    },

    writeParticleInstance: function (particle, angle, radius, size, time) {
      const twinkle = PARTICLE_TWINKLE_BASE + Math.sin(time * PARTICLE_TWINKLE_SPEED + particle.wobblePhase) * PARTICLE_TWINKLE_AMOUNT;

      this.setOrbitPosition(this.tempObject.position, particle, angle, radius, time);
      this.tempObject.scale.setScalar(size * twinkle);
      this.tempObject.updateMatrix();
      this.particleMeshes[particle.band].setMatrixAt(particle.instanceIndex, this.tempObject.matrix);
    },

    writeTrailInstance: function (particle, step, angle, radius, size, time) {
      this.setOrbitPosition(this.tempObject.position, particle, angle, radius, time);
      this.tempObject.scale.setScalar(size);
      this.tempObject.updateMatrix();
      this.trailMeshes[particle.band][step].setMatrixAt(particle.instanceIndex, this.tempObject.matrix);
    },

    setOrbitPosition: function (target, particle, angle, radius, time) {
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const wobble = Math.sin(time * particle.wobbleSpeed + particle.wobblePhase) * PARTICLE_VERTICAL_WOBBLE;
      const tilt = Math.sin(angle) * Math.sin(particle.tilt) * PARTICLE_TILT_AMOUNT;

      target.set(x, wobble + tilt, z);
    },

    updateLensShell: function (delta, mode) {
      this.lensShell.rotation.y += delta * LENS_ROTATION_SPEED * mode.disk;
      this.lensShell.rotation.x += delta * LENS_ROTATION_SPEED * 0.35 * mode.disk;
      this.lensRingA.rotation.y -= delta * LENS_ROTATION_SPEED * 1.8 * mode.disk;
      this.lensRingB.rotation.y += delta * LENS_ROTATION_SPEED * 1.4 * mode.disk;
    },

    updateJets: function (time, mode) {
      const pulse = 1 + Math.sin(time * JET_PULSE_SPEED) * JET_PULSE_AMOUNT;
      const opacity = JET_OPACITY * mode.glow;

      this.jetTop.scale.set(pulse, 1, pulse);
      this.jetBottom.scale.set(pulse, 1, pulse);
      this.jetTop.material.opacity = opacity;
      this.jetBottom.material.opacity = opacity;
    },

    cycleMode: function () {
      this.modeIndex = (this.modeIndex + 1) % MODES.length;
      this.modeButton.textContent = MODES[this.modeIndex].name;
      this.setHud(`Mode: ${MODES[this.modeIndex].name}`, true);
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

    showSupportMessage: function () {
      const message = document.createElement("div");
      message.className = "support-message";
      message.textContent = SUPPORT_MESSAGE_TEXT;
      document.body.appendChild(message);
      this.supportMessage = message;
    },

    track: function (resource) {
      this.disposables.push(resource);
      return resource;
    },

    remove: function () {
      window.clearTimeout(this.hudTimer);

      if (this.modeButton && this.onModeClick) {
        this.modeButton.removeEventListener("click", this.onModeClick);
      }

      if (this.marker) {
        this.marker.removeEventListener("markerFound", this.onMarkerFound);
        this.marker.removeEventListener("markerLost", this.onMarkerLost);
      }

      if (this.supportMessage) {
        this.supportMessage.remove();
      }

      this.el.object3D.remove(this.root);

      for (const resource of this.disposables) {
        if (resource && typeof resource.dispose === "function") {
          resource.dispose();
        }
      }
    }
  });

  AFRAME.registerComponent("solar-system-scene", {
    init: function () {
      this.three = AFRAME.THREE;
      this.planets = [];
      this.pickTargets = [];
      this.disposables = [];
      this.currentDistanceScale = 1;
      this.tmpCamPos = new this.three.Vector3();
      this.tmpRootPos = new this.three.Vector3();

      // The solar system gets its own compact scale so Neptune still fits above the marker.
      this.root = new this.three.Group();
      this.root.position.y = SOLAR_SCENE_Y_OFFSET;
      this.root.scale.setScalar(SOLAR_SCENE_SCALE);
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
      this.createStarField();
      this.bindMarkerEvents();
      this.setupInfoPanel();
      this.setupControlPanel();
      this.setupPlanetPicking();
    },

    createLights: function () {
      const ambient = new this.three.AmbientLight(0x405070, 0.9);
      const sunLight = new this.three.PointLight(0xffd47a, 2.3, 3.2);

      sunLight.position.set(0, 0.18, 0);
      this.root.add(ambient, sunLight);
    },

    createSun: function () {
      // The Sun gets a swirling procedural surface, an emissive material, and
      // an outer corona shell so it reads as a bright body even in AR.
      const geometry = this.track(new this.three.SphereGeometry(SOLAR_SUN_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const sunTexture = this.createPlanetTexture("sun");
      const material = this.track(new this.three.MeshStandardMaterial({
        map: sunTexture,
        emissive: SOLAR_SUN_EMISSIVE,
        emissiveMap: sunTexture,
        emissiveIntensity: 1.4,
        roughness: 0.45
      }));

      this.sun = new this.three.Mesh(geometry, material);
      this.sunState = { mesh: this.sun, data: SOLAR_SUN_INFO };
      this.sun.userData.planetState = this.sunState;

      const coronaGeometry = this.track(new this.three.SphereGeometry(SOLAR_SUN_RADIUS * 1.35, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const coronaMaterial = this.track(new this.three.MeshBasicMaterial({
        color: "#ffb04a",
        transparent: true,
        opacity: 0.18,
        blending: this.three.AdditiveBlending,
        depthWrite: false,
        side: this.three.BackSide
      }));
      this.sunCorona = new this.three.Mesh(coronaGeometry, coronaMaterial);
      this.sun.add(this.sunCorona);

      const sunPickRadius = Math.max(SOLAR_SUN_RADIUS * PLANET_PICK_TARGET_SCALE, PLANET_PICK_TARGET_MIN_SIZE);
      const sunPickGeometry = this.track(new this.three.SphereGeometry(sunPickRadius, PLANET_PICK_TARGET_SEGMENTS, PLANET_PICK_TARGET_SEGMENTS));
      const sunPickMaterial = this.track(new this.three.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      }));
      this.sunPickTarget = new this.three.Mesh(sunPickGeometry, sunPickMaterial);
      this.sunPickTarget.name = "Sun pick target";
      this.sunPickTarget.userData.planetState = this.sunState;
      this.sun.add(this.sunPickTarget);

      this.root.add(this.sun);
    },

    createOrbitingPlanets: function () {
      this.orbitRings = [];
      for (const planetData of SOLAR_PLANETS) {
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
      // A ring of small instanced rocks between Mars and Jupiter. Each one
      // gets its own orbit radius and angular speed so the belt drifts and
      // shears realistically rather than rotating as a rigid block.
      const geometry = this.track(new this.three.SphereGeometry(1, 6, 6));
      const material = this.track(new this.three.MeshStandardMaterial({
        color: ASTEROID_COLOR,
        roughness: 0.95,
        metalness: 0.02
      }));
      const mesh = new this.three.InstancedMesh(geometry, material, ASTEROID_COUNT);
      mesh.instanceMatrix.setUsage(this.three.DynamicDrawUsage);

      this.asteroids = [];
      for (let i = 0; i < ASTEROID_COUNT; i += 1) {
        this.asteroids.push({
          angle: randomBetween(0, TWO_PI),
          radius: randomBetween(ASTEROID_INNER_RADIUS, ASTEROID_OUTER_RADIUS),
          height: randomBetween(-ASTEROID_HEIGHT_VARIANCE, ASTEROID_HEIGHT_VARIANCE),
          size: randomBetween(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE),
          speed: randomBetween(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED)
        });
      }
      this.asteroidMesh = mesh;
      this.root.add(mesh);
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
        this.setHud(HUD_FOUND_SOLAR_TEXT, true);
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
        this.sun.scale.setScalar(enabled ? TRUE_SCALE_SUN_FACTOR : 1);
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
        ["Distance from Sun", data.distance],
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
      this.root.scale.setScalar(SOLAR_SCENE_SCALE * this.currentDistanceScale);
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
      const sunBase = this.trueScale ? TRUE_SCALE_SUN_FACTOR : 1;
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

      this.el.object3D.remove(this.root);

      for (const resource of this.disposables) {
        if (resource && typeof resource.dispose === "function") {
          resource.dispose();
        }
      }
    }
  });
}());
