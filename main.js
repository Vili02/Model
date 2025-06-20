import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Рендер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x732673);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Сцена
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(10, 10, 10);

// Контроли
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 50;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Под
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x602060, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// Светлини
// Околна светлина
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Хемисфера светлина
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 1.2);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// Точки светлина около модела
const pointLight1 = new THREE.PointLight(0xffffff, 0.7);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.7);
pointLight2.position.set(-10, 10, -10);
scene.add(pointLight2);


// ЗАРЕЖДАНЕ НА STL модел от кореновата директория
const loader = new STLLoader();
loader.load('model.stl', (geometry) => {
  const material = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, side: THREE.DoubleSide });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1, 1, 1);            // уголемяване на модела
  mesh.rotation.x = -Math.PI / 2;           // изправяне (ако е легнал)
  mesh.position.y = 3; 
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  geometry.center();                        // центриране на модела

  scene.add(mesh);
  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`Зареждане: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
}, (error) => {
  console.error('Грешка при зареждане на STL:', error);
});

// Преоразмеряване
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
