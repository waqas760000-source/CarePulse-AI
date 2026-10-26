/**
 * CarePulse AI™ - Interactive 3D Medical Hologram Engine & 3D Card Tilt
 * Built with Three.js (WebGL) for real-time clinical visualization
 */

let scene, camera, renderer, currentGroup;
let animationFrameId;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isDragging = false, previousMouseX = 0, previousMouseY = 0;
let currentMode = 'cardio'; // 'cardio', 'neural', 'dna'
let clock;

// Initialize 3D Engine
function init3DHero() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b14, 0.04);

  // Camera setup
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  camera.position.z = 24;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Remove existing canvas if any
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0x00e5ff, 0.6);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x00f2a9, 1.5);
  dirLight1.position.set(10, 20, 15);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xff2a55, 1.2);
  dirLight2.position.set(-15, -10, -10);
  scene.add(dirLight2);

  // Floating background particle cloud
  createBackgroundParticles();

  // Load initial 3D Mode
  set3DMode('cardio');

  // Event Listeners for Interaction
  window.addEventListener('resize', onWindowResize);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  container.addEventListener('mouseleave', onMouseUp);

  // Touch support
  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: true });

  // Mode switcher triggers
  document.querySelectorAll('.three-mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.three-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      set3DMode(btn.getAttribute('data-mode'));
    });
  });

  animate();
}

// Background Particle Nebula
function createBackgroundParticles() {
  const particleCount = 280;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x00e5ff); // Cyan
  const color2 = new THREE.Color(0x6366f1); // Indigo

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

// Switch between 3D Clinical Hologram Modes
function set3DMode(mode) {
  currentMode = mode;
  if (currentGroup) {
    scene.remove(currentGroup);
  }

  currentGroup = new THREE.Group();

  if (mode === 'cardio') {
    buildCardioCore(currentGroup);
  } else if (mode === 'neural') {
    buildNeuralBrain(currentGroup);
  } else if (mode === 'dna') {
    buildDnaHelix(currentGroup);
  }

  scene.add(currentGroup);
}

// 1. 3D Cardio Core (Parametric Pulsing Heart & Biometric Orbits)
function buildCardioCore(group) {
  // Wireframe Heart-like Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(4.2, 1.1, 140, 20, 2, 3);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    wireframe: true,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x007799,
    emissiveIntensity: 0.4
  });
  const knotMesh = new THREE.Mesh(knotGeo, wireMat);
  knotMesh.name = "heartKnot";
  group.add(knotMesh);

  // Concentric Telemetry Orbit Rings
  const ringGeo1 = new THREE.RingGeometry(6.8, 6.95, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x00f2a9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.55
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.name = "ring1";
  ring1.rotation.x = Math.PI / 3;
  group.add(ring1);

  const ringGeo2 = new THREE.RingGeometry(8.2, 8.35, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xff2a55,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.name = "ring2";
  ring2.rotation.y = Math.PI / 4;
  group.add(ring2);

  // Floating Bio-Nodes
  const nodeGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(Math.cos(angle) * 7.5, Math.sin(angle) * 7.5, (Math.random() - 0.5) * 3);
    group.add(node);
  }
}

// 2. 3D Neural Triage Brain (Geodesic Synapse Network)
function buildNeuralBrain(group) {
  const icoGeo = new THREE.IcosahedronGeometry(5.2, 2);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const icoMesh = new THREE.Mesh(icoGeo, wireMat);
  group.add(icoMesh);

  // Luminous Synapse Nodes on Vertices
  const pos = icoGeo.attributes.position;
  const nodesGeo = new THREE.BufferGeometry();
  nodesGeo.setAttribute('position', pos);

  const pointsMat = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.45,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(nodesGeo, pointsMat);
  group.add(points);

  // Inner pulsing intelligence sphere
  const innerGeo = new THREE.SphereGeometry(3.0, 32, 32);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x00f2a9,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x00f2a9,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.65
  });
  const innerSphere = new THREE.Mesh(innerGeo, innerMat);
  innerSphere.name = "innerSphere";
  group.add(innerSphere);
}

// 3. 3D Biometric DNA Double Helix
function buildDnaHelix(group) {
  const points1 = [];
  const points2 = [];
  const strandLength = 40;
  const radius = 3.6;

  for (let i = 0; i < strandLength; i++) {
    const angle = i * 0.35;
    const y = (i - strandLength / 2) * 0.45;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    points1.push(new THREE.Vector3(x1, y, z1));

    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;
    points2.push(new THREE.Vector3(x2, y, z2));

    // Connect base pair rungs every 2 steps
    if (i % 2 === 0) {
      const rungGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2)
      ]);
      const rungMat = new THREE.LineBasicMaterial({
        color: 0x00f2a9,
        transparent: true,
        opacity: 0.7
      });
      const rung = new THREE.Line(rungGeo, rungMat);
      group.add(rung);
    }
  }

  // Strand 1
  const curve1 = new THREE.CatmullRomCurve3(points1);
  const tubeGeo1 = new THREE.TubeGeometry(curve1, 64, 0.18, 8, false);
  const tubeMat1 = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x005577 });
  group.add(new THREE.Mesh(tubeGeo1, tubeMat1));

  // Strand 2
  const curve2 = new THREE.CatmullRomCurve3(points2);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, 64, 0.18, 8, false);
  const tubeMat2 = new THREE.MeshStandardMaterial({ color: 0xff2a55, emissive: 0x770022 });
  group.add(new THREE.Mesh(tubeGeo2, tubeMat2));

  // Glowing Base pair nodes
  const sphereGeo = new THREE.SphereGeometry(0.25, 12, 12);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  points1.forEach(pt => {
    const s = new THREE.Mesh(sphereGeo, sphereMat);
    s.position.copy(pt);
    group.add(s);
  });
}

// Animation Loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  if (currentGroup) {
    // Smooth user rotation interpolation
    currentGroup.rotation.y += (targetRotationY - currentGroup.rotation.y) * 0.05;
    currentGroup.rotation.x += (targetRotationX - currentGroup.rotation.x) * 0.05;

    // Mode-specific dynamic kinematics
    if (currentMode === 'cardio') {
      // Realistic Rhythmic Heartbeat pulse contraction (75 BPM = 1.25 Hz)
      const beatCycle = (Math.sin(elapsedTime * 4.8) + 1) * 0.5;
      const pulseScale = 1.0 + Math.pow(beatCycle, 4) * 0.16;

      const heartKnot = currentGroup.getObjectByName("heartKnot");
      if (heartKnot) {
        heartKnot.scale.set(pulseScale, pulseScale, pulseScale);
        heartKnot.rotation.y = elapsedTime * 0.4;
        heartKnot.rotation.z = Math.sin(elapsedTime * 0.6) * 0.15;
      }

      const ring1 = currentGroup.getObjectByName("ring1");
      if (ring1) ring1.rotation.z = elapsedTime * 0.6;

      const ring2 = currentGroup.getObjectByName("ring2");
      if (ring2) ring2.rotation.x = -elapsedTime * 0.5;
    } else if (currentMode === 'neural') {
      currentGroup.rotation.y = elapsedTime * 0.35;
      currentGroup.rotation.z = Math.cos(elapsedTime * 0.25) * 0.2;

      const inner = currentGroup.getObjectByName("innerSphere");
      if (inner) {
        const pulse = 1 + Math.sin(elapsedTime * 3) * 0.1;
        inner.scale.set(pulse, pulse, pulse);
      }
    } else if (currentMode === 'dna') {
      currentGroup.rotation.y = elapsedTime * 0.5;
      currentGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
    }
  }

  renderer.render(scene, camera);
}

// Window resize
function onWindowResize() {
  const container = document.getElementById('threeCanvasContainer');
  if (!container || !renderer || !camera) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Mouse & Touch Interaction
function onMouseMove(e) {
  if (isDragging) {
    const deltaX = e.clientX - previousMouseX;
    const deltaY = e.clientY - previousMouseY;
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  } else {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotationY = x * 1.2;
    targetRotationX = y * 0.8;
  }
}

function onMouseDown(e) {
  isDragging = true;
  previousMouseX = e.clientX;
  previousMouseY = e.clientY;
}

function onMouseUp() {
  isDragging = false;
}

function onTouchStart(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  }
}

function onTouchMove(e) {
  if (isDragging && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - previousMouseX;
    const deltaY = e.touches[0].clientY - previousMouseY;
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    previousMouseX = e.touches[0].clientX;
    previousMouseY = e.touches[0].clientY;
  }
}

/* ==========================================================================
   3D Card Tilt Engine with Dynamic Specular Glare
   Applies smooth 3D perspective to all cards across the web application
   ========================================================================== */
function init3DCardTilt() {
  const tiltElements = document.querySelectorAll('.card, .pricing-card, .ed-bed-card, .hero-visual-card, .step-card, .problem-box, .solution-box');

  tiltElements.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';

    // Add specular glare overlay element
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      glare.style.cssText = `
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 60%);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        mix-blend-mode: overlay;
        z-index: 2;
      `;
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(0, 229, 255, 0.2) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D Hero if canvas container exists
  if (typeof THREE !== 'undefined') {
    init3DHero();
  } else {
    // Dynamically load Three.js if not yet included in head
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      init3DHero();
    };
    document.head.appendChild(script);
  }

  // Initialize 3D Card Tilt across all pages
  init3DCardTilt();
});
