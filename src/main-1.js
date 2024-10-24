// 导入three.js
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(300);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = 0.05;

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial({color: 0x1abc9c});
// 创建网格
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const images = [
  'img/sun_bg.jpg',
  'img/earth_bg.jpg',
  'img/moon_bg.jpg',
  'img/mars_bg.jpg',
  'img/jupiter_bg.jpg',
  'img/uranus_bg.jpg',
];
const colors = [0xe74c3c, 0xe67e22, 0x1abc9c, 0x2ecc71, 0x3498db, 0x9b59b6]
const materials = []
for (let i = 0; i < 6; i++) {
  const textLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({map: textLoader.load(images[i])});
  // const material = new THREE.MeshBasicMaterial({color: colors[i]});
  materials.push(material);
}

const cube = new THREE.Mesh(cubeGeometry, materials);
cube.position.x = 3
console.log(cube)
scene.add(cube);

// 渲染函数
function animate() {
    controls.update();
    requestAnimationFrame(animate);
    // 渲染
    renderer.render(scene, camera);
}

animate();

// 渲染
renderer.render(scene, camera);

// 监听窗口变化
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});