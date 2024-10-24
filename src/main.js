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

// 增加灯光
const light = new THREE.DirectionalLight(0xffffff, 5); // 添加平行光
light.position.set(3, 3, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 添加环境光
scene.add(ambientLight);

// 设置相机位置
camera.position.set(-20, -270, 60);
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
// const axesHelper = new THREE.AxesHelper(300);
// scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = 0.05;

const addRing = (star, ringImg) => {
    const textLoader = new THREE.TextureLoader();
    const ringGeometry = new THREE.TorusGeometry(1.3, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
    map: textLoader.load(ringImg),
    transparent: true,
    opacity: 0.6, // 调整透明度
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2; // 旋转光环以水平放置
    star.add(ring); // 将光环添加到土星组中
}

// 增加球体
const addStar = (data) => {
    const textLoader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(data.size);
    const material = new THREE.MeshStandardMaterial({map: textLoader.load(data.img)});
    const star = new THREE.Mesh(geometry, material);
    star.position.set(data.distance, 0, 0);
    star.rotateX(90);
    return star;
}
const star_data = [
    {
        img: 'img/sun_bg.jpg',
        distance: 0,
        size: 20,
        rotVelocity: 100,
    },
    {
        img: 'img/mercury_bg.jpg',
        distance: 30,
        size: 1,
        rotVelocity: 10,
        velocity: 500
    },
    {
        img: 'img/venus_bg.jpg',
        distance: 34,
        size: 2,
        rotVelocity: 1,
        velocity: 100
    },
    {
        img: 'img/earth_bg.jpg',
        distance: 40,
        size: 3,
        rotVelocity: 10,
        velocity: 80
    },
    {
        img: 'img/mars_bg.jpg',
        distance: 48,
        size: 2,
        rotVelocity: 9,
        velocity: 60
    },
    {
        img: 'img/jupiter_bg.jpg',
        distance: 80,
        size: 12,
        rotVelocity: 60,
        velocity: 30
    },
    {
        img: 'img/saturn_bg.jpg',
        distance: 110,
        size: 9,
        rotVelocity: 50,
        velocity: 10
    },
    {
        img: 'img/uranus_bg.jpg',
        distance: 150,
        size: 8,
        rotVelocity: 40,
        velocity: 2.5
    },
    {
        img: 'img/neptune_bg.jpg',
        distance: 200,
        size: 7,
        rotVelocity: 30,
        velocity: 0.5
    }
]

const stars = [];
for (let i = 0; i < star_data.length; i++) {
    const star = addStar(star_data[i]);
    stars.push(star);
}

// 增加轨道
const addOrbit = (data, index) => {
    const planetOrbit = new THREE.Group();
    if (index) {
        const curve = new THREE.EllipseCurve(
            0, 0,            // ax, aY
            data.distance, data.distance,           // xRadius, yRadius
            0, 2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        const points = curve.getPoints(5 * data.distance);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({color: 0xffffffdd});
        const orbit = new THREE.Line(geometry, material);
        planetOrbit.add(orbit);
    }
    planetOrbit.add(stars[index]);
    scene.add(planetOrbit);
    return planetOrbit;
}
const orbits = [];
for (let i = 0; i < star_data.length; i++) {
    const orbit = addOrbit(star_data[i], i);
    orbits.push(orbit);
}

// 创建粒子
const particlesCount = 10000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    posArray[i * 3] = (Math.random() - 0.5) * 1000;
    posArray[i * 3 + 1] = 300 - Math.random() * 200
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 1000;
}
const particlesGeometry = new THREE.BufferGeometry();

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.5,
    color: 0xffffff,
    setAttenuation: true // 设置衰减
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// 渲染函数
function animate() {
    controls.update();
    requestAnimationFrame(animate);
    // 旋转
    // sun.rotation.y += stars[0].rotVelocity * 0.0002;
    orbits.forEach((orbit, index) => {
        // orbit.rotation.z += star_data[index].velocity * 0.0001;
        stars[index].rotation.y += star_data[index].rotVelocity * 0.0002;
    })
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

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1
    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    console.log(mouse);
    console.log(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    console.log(raycaster);
    // 获取raycaster直线和所有模型相交的数组集合
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);
    // camera.lookAt(intersects[0].object.position);
}
window.addEventListener('click', onMouseClick, false);