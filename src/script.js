import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { paintStars, populateStars } from './utils';

const gui = new dat.GUI();

const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();
const galaxyGeometry = new THREE.BufferGeometry();

const parameters = {
    particlesCount: 3000,
    particlesSize: 0.02,
    galaxyRadius: 5,
    branches: 5,
    spiralAngleInRadians: 1,
    insideColor: '#ff6030',
    outsideColor: '#4d39e0'
};

const galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.particlesSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});
let particlesInfo = [];

function updateGalaxy() {
    const [position, colors, newParticlesInfo] = populateStars(parameters);
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesInfo = newParticlesInfo;
}

gui.add(parameters, 'particlesCount').min(100).max(10000).step(100).onFinishChange(updateGalaxy);
gui.add(parameters, 'galaxyRadius').min(1).max(20).step(1).onFinishChange(updateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(updateGalaxy);
gui.add(parameters, 'spiralAngleInRadians').min(0.1).max(10).step(0.1).onFinishChange(updateGalaxy);
gui.add(parameters, 'particlesSize').min(0.001).max(0.1).step(0.001).onFinishChange(() => {
    galaxyMaterial.size = parameters.particlesSize;
});
gui.addColor(parameters, 'insideColor').onFinishChange(() => {
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(paintStars({particlesInfo, ...parameters}), 3));
});
gui.addColor(parameters, 'outsideColor').onFinishChange(() => {
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(paintStars({particlesInfo, ...parameters}), 3));
});

updateGalaxy();
const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 6;
camera.position.y = 3;
camera.position.z = 6;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();
    galaxy.rotation.y = elapsedTime / 500;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
