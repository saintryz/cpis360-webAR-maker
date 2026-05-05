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
  const SOLAR_PLANETS = [
    { name: "Mercury", radius: 0.22, size: 0.025, color: "#b8aaa0", speed: 0.00175,
      info: "Smallest planet and closest to the Sun. A year on Mercury lasts only 88 Earth days." },
    { name: "Venus", radius: 0.31, size: 0.036, color: "#e6b06a", speed: 0.00135,
      info: "Hottest planet at about 465°C, with a thick CO₂ atmosphere. It spins backwards." },
    { name: "Earth", radius: 0.42, size: 0.04, color: "#3b82ff", speed: 0.00108, moon: true,
      info: "Our home. The only known planet with life and liquid surface water." },
    { name: "Mars", radius: 0.53, size: 0.032, color: "#d35a36", speed: 0.00088,
      info: "The Red Planet. Home to Olympus Mons, the tallest known volcano in the Solar System." },
    { name: "Jupiter", radius: 0.68, size: 0.072, color: "#d4a46d", speed: 0.00062,
      info: "Largest planet. A gas giant with 95+ moons and a centuries-old storm, the Great Red Spot." },
    { name: "Saturn", radius: 0.83, size: 0.064, color: "#d9c38b", speed: 0.00048, ring: true,
      info: "Famous for its bright rings made of ice and rock. Less dense than water." },
    { name: "Uranus", radius: 0.96, size: 0.048, color: "#7dd3fc", speed: 0.00036,
      info: "An ice giant tilted ~98°, so it essentially rolls on its side as it orbits." },
    { name: "Neptune", radius: 1.08, size: 0.047, color: "#4169e1", speed: 0.00029,
      info: "Farthest planet from the Sun. Has the fastest winds in the system, up to 2,100 km/h." }
  ];
  const SOLAR_MOON_RADIUS = 0.075;
  const SOLAR_MOON_SIZE = 0.01;
  const SOLAR_MOON_SPEED = 0.0036;
  const SOLAR_MOON_COLOR = "#d9d7ce";
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

      this.createLights();
      this.createSun();
      this.createOrbitingPlanets();
      this.createStarField();
      this.bindMarkerEvents();
      this.setupInfoPanel();
      this.setupPlanetPicking();
    },

    createLights: function () {
      const ambient = new this.three.AmbientLight(0x405070, 0.9);
      const sunLight = new this.three.PointLight(0xffd47a, 2.3, 3.2);

      sunLight.position.set(0, 0.18, 0);
      this.root.add(ambient, sunLight);
    },

    createSun: function () {
      // The Sun is emissive and gently pulses, giving the system a clear visual anchor.
      const geometry = this.track(new this.three.SphereGeometry(SOLAR_SUN_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS));
      const material = this.track(new this.three.MeshStandardMaterial({
        color: SOLAR_SUN_COLOR,
        emissive: SOLAR_SUN_EMISSIVE,
        emissiveIntensity: 1.6,
        roughness: 0.35
      }));

      this.sun = new this.three.Mesh(geometry, material);
      this.root.add(this.sun);
    },

    createOrbitingPlanets: function () {
      for (const planetData of SOLAR_PLANETS) {
        const orbit = this.createOrbitRing(planetData.radius);
        const orbitGroup = new this.three.Group();
        const planet = this.createPlanet(planetData);

        planet.position.x = planetData.radius;
        orbitGroup.add(planet);
        this.root.add(orbit, orbitGroup);

        const label = this.createPlanetLabel(planetData);
        planet.add(label);

        const planetState = {
          mesh: planet,
          orbitGroup,
          label,
          pickTarget: null,
          data: planetData,
          speed: planetData.speed,
          angleOffset: randomBetween(0, TWO_PI),
          moonPivot: null
        };

        orbitGroup.rotation.y = planetState.angleOffset;
        planet.userData.planetState = planetState;

        const pickTarget = this.createPlanetPickTarget(planetData);
        pickTarget.userData.planetState = planetState;
        planet.add(pickTarget);
        planetState.pickTarget = pickTarget;
        this.pickTargets.push(pickTarget);

        if (planetData.ring) {
          planet.add(this.createSaturnRing());
        }

        if (planetData.moon) {
          planetState.moonPivot = this.createMoon(planet);
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
      const material = this.track(new this.three.MeshStandardMaterial({
        color: planetData.color,
        roughness: 0.55,
        metalness: 0.05
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

    createMoon: function (earth) {
      // A tiny Moon orbiting Earth helps the scale model feel immediately recognizable.
      const moonPivot = new this.three.Group();
      const moonGeometry = this.track(new this.three.SphereGeometry(SOLAR_MOON_SIZE, 16, 16));
      const moonMaterial = this.track(new this.three.MeshStandardMaterial({
        color: SOLAR_MOON_COLOR,
        roughness: 0.7
      }));
      const moon = new this.three.Mesh(moonGeometry, moonMaterial);

      moon.position.x = SOLAR_MOON_RADIUS;
      moonPivot.add(moon);
      earth.add(moonPivot);

      return moonPivot;
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

      const text = document.createElement("p");
      text.className = "planet-info-text";

      panel.appendChild(closeButton);
      panel.appendChild(name);
      panel.appendChild(text);
      document.body.appendChild(panel);

      this.infoPanel = panel;
      this.infoName = name;
      this.infoText = text;

      this.onInfoClose = () => this.hidePlanetInfo();
      closeButton.addEventListener("click", this.onInfoClose);
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
      this.infoName.textContent = planetState.data.name;
      this.infoText.textContent = planetState.data.info || "";
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

      const dt = delta || DEFAULT_DELTA_MS;
      const pulse = 1 + Math.sin(time * SOLAR_SUN_PULSE_SPEED) * SOLAR_SUN_PULSE_AMOUNT;

      this.sun.scale.setScalar(pulse);
      this.sun.rotation.y += dt * SOLAR_SPIN_SPEED;
      this.stars.rotation.y += dt * SOLAR_STAR_ROTATION_SPEED;

      for (const planet of this.planets) {
        planet.orbitGroup.rotation.y += dt * planet.speed;
        planet.mesh.rotation.y += dt * SOLAR_SPIN_SPEED;

        if (planet.moonPivot) {
          planet.moonPivot.rotation.y += dt * SOLAR_MOON_SPEED;
        }
      }

      this.updateDistanceScale();
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
