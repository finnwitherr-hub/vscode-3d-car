let scene, camera, renderer, car, controls;
const canvas = document.getElementById('canvas');

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 5);
  camera.lookAt(0, 1, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Create car
  car = createCar();
  scene.add(car);

  // Mouse controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      car.rotation.y += deltaX * 0.005;
      car.rotation.x += deltaY * 0.005;
    }
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.01;
  });

  // Handle window resize
  window.addEventListener('resize', onWindowResize);

  // Start animation loop
  animate();
}

function createCar() {
  const carGroup = new THREE.Group();

  // Car body
  const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.7,
    roughness: 0.2
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.6;
  body.castShadow = true;
  body.receiveShadow = true;
  carGroup.add(body);

  // Car roof
  const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xdd0000,
    metalness: 0.7,
    roughness: 0.2
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.y = 1.7;
  roof.position.z = -0.2;
  roof.castShadow = true;
  roof.receiveShadow = true;
  carGroup.add(roof);

  // Windows
  const windowGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.8);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    metalness: 0.8,
    roughness: 0.1,
    transparent: true,
    opacity: 0.6
  });

  const windowFL = new THREE.Mesh(windowGeometry, windowMaterial);
  windowFL.position.set(-0.8, 1.5, 0.5);
  carGroup.add(windowFL);

  const windowFR = new THREE.Mesh(windowGeometry, windowMaterial);
  windowFR.position.set(0.8, 1.5, 0.5);
  carGroup.add(windowFR);

  // Wheels
  const wheelRadius = 0.5;
  const wheelThickness = 0.3;
  const wheelGeometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelThickness, 32);
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.6,
    roughness: 0.4
  });

  const wheelPositions = [
    [-0.8, wheelRadius, 1],
    [0.8, wheelRadius, 1],
    [-0.8, wheelRadius, -1],
    [0.8, wheelRadius, -1]
  ];

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    wheel.receiveShadow = true;
    carGroup.add(wheel);
  });

  // Headlights
  const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
  });

  const headlightL = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlightL.position.set(-0.6, 0.8, 1.9);
  carGroup.add(headlightL);

  const headlightR = new THREE.Mesh(headlightGeometry, headlightMaterial);
  headlightR.position.set(0.6, 0.8, 1.9);
  carGroup.add(headlightR);

  return carGroup;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Auto-rotate car slightly
  car.rotation.y += 0.002;

  renderer.render(scene, camera);
}

// Load Three.js from CDN and init
if (typeof THREE === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = init;
  document.head.appendChild(script);
} else {
  init();
}
