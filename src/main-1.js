// 导入three.js
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {MMDLoader} from "three/examples/jsm/loaders/MMDLoader.js";

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

const loadModel = (model) => {
    const mmDLoader = new MMDLoader(model);
    // const helper = new THREE.MMDHelper();
    mmDLoader.load(model.path, function (mesh) {
            scene.add(mesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        });
};

loadModel({path: './kq/刻晴.pmx'});

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