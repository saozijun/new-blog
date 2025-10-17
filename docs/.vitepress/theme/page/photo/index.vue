<template>
    <div ref="container" class="album-container">
        <div ref="overlay" class="fullscreen-overlay" @click="closeFocusedView"></div>
        <div ref="textOverlay" class="text-overlay" :class="{ 'visible': focusedItemData }">
            <template v-if="focusedItemData">
                <h2>{{ focusedItemData.title }}</h2>
                <p class="date">{{ focusedItemData.date }}</p>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { useData } from "vitepress";

// --- 资源导入 ---
const imagesList = Array.from({ length: 14 }, (_, i) => {
    const index = i + 1;
    return new URL(`../../static/photo/${index}.webp`, import.meta.url).href;
});

// --- Vue 响应式变量和模板引用 ---
let { isDark } = useData();
const container = ref(null);
const overlay = ref(null);
const textOverlay = ref(null);
const focusedItemData = ref(null);

// --- Three.js 核心变量 ---
let scene, camera, renderer;
let group;
let autoRotateSpeed = 0.0005;

// --- 交互状态变量 ---
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let dragMovement = 0;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null;
let focusedObject = null;
let isFocusing = false;
let isUnfocusing = false;
const cameraTargetPosition = new THREE.Vector3();
const cameraTargetLookAt = new THREE.Vector3();
const originalCameraState = {
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion()
};

// --- 新增：惯性滚动变量 ---
const inertia = { x: 0, y: 0 }; // 存储当前的惯性速度
const damping = 0.95;     // 阻尼系数，值越接近1，滚动时间越长
let lastDelta = { x: 0, y: 0 }; // 记录最后一次拖拽的delta值

// --- 新增：垂直拖动范围限制 ---
const verticalDragLimit = Math.PI / 4; // 45度 (Math.PI / 4)，总范围为90度

// --- 图片元数据 ---
const imageData = [
    { url: imagesList[0], title: '重庆 十八梯街', date: '2024-06-16' },
    { url: imagesList[1], title: '赣州方特 圆明园', date: '2023-10-04' },
    { url: imagesList[2], title: '柳州 龙潭公园', date: '2024-06-28' },
    { url: imagesList[3], title: '财院 放学晚霞', date: '2022-12-02' },
    { url: imagesList[4], title: '重庆 洪崖洞', date: '2024-06-17' },
    { url: imagesList[5], title: '广州 永庆坊-月亮桥', date: '2024-09-16' },
    { url: imagesList[6], title: '宁波 实习路景', date: '2022-03-26' },
    { url: imagesList[7], title: '杭州 西湖', date: '2021-07-28' },
    { url: imagesList[8], title: '清远 古龙峡谷漂流', date: '2025-07-19' },
    { url: imagesList[9], title: '长沙 橘子洲', date: '2024-1-10' },
    { url: imagesList[10], title: '财院 田径场风景', date: '2023-06-18' },
    { url: imagesList[11], title: '广州 越秀公园 灯会', date: '2023-06-18' },
    { url: imagesList[12], title: '广州 72家房客拍摄地', date: '2025-07-18' },
    { url: imagesList[13], title: '贵州 千户苗寨', date: '2024-06-20' }
];

// --- 监听暗黑模式变化 ---
watch(isDark, (newVal) => {
    if (scene) {
        scene.background.set(newVal ? 0x1b1b1f : 0xffffff);
    }
});

// --- 初始化 Three.js 场景 ---
const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? 0x1b1b1f : 0xffffff);

    const aspect = container.value.clientWidth / container.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    container.value.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 5);
    scene.add(directionalLight);

    group = new THREE.Group();
    scene.add(group);

    createImagePlanes();
    addEventListeners();
};

// --- 创建所有图片平面 ---
const createImagePlanes = () => {
    const textureLoader = new THREE.TextureLoader();
    const xRadius = 15;
    const yRadius = 8;
    const zRadius = 15;
    const imageSize = 4;
    const n = imageData.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const yRange = 0.9;

    imageData.forEach((item, i) => {
        textureLoader.load(item.url, (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            const geometry = new THREE.PlaneGeometry(imageSize, imageSize * (texture.image.height / texture.image.width));
            const plane = new THREE.Mesh(geometry, material);

            const y = (1 - (i / (n - 1)) * 2) * yRange;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            plane.position.set(x * xRadius, y * yRadius, z * zRadius);

            // plane.rotation.z = (Math.random() - 0.5) * Math.PI * 0.1;

            plane.userData.originalScale = plane.scale.clone();
            plane.userData.itemData = item;
            plane.userData.targetOpacity = 1.0;
            group.add(plane);
        });
    });
};

// --- 动画循环 (核心逻辑) ---
const animate = () => {
    requestAnimationFrame(animate);

    // 检查是否有显著的惯性
    const hasInertia = Math.abs(inertia.x) > 0.0001 || Math.abs(inertia.y) > 0.0001;

    if (!isDragging && hasInertia) {
        // --- 修改：应用惯性并限制垂直范围 ---
        const newRotationX = group.rotation.x + inertia.x;

        // 如果惯性运动到达边界，则停止该方向的惯性
        if (newRotationX > verticalDragLimit || newRotationX < -verticalDragLimit) {
            inertia.x = 0;
        }
        group.rotation.x = Math.max(-verticalDragLimit, Math.min(verticalDragLimit, newRotationX));
        group.rotation.y += inertia.y;

        // 应用阻尼
        inertia.x *= damping;
        inertia.y *= damping;
    } else if (!isDragging && !focusedObject && !isFocusing && !isUnfocusing) {
        // 自动旋转并限制垂直范围
        group.rotation.y += autoRotateSpeed;

        // --- 修改：对自动旋转也施加垂直范围限制 ---
        // const newAutoRotationX = group.rotation.x + autoRotateSpeed * 0.3;
        // group.rotation.x = Math.max(-verticalDragLimit, Math.min(verticalDragLimit, newAutoRotationX));
    }

    // 遍历所有图片平面，更新其状态
    group.children.forEach(child => {
        const targetScale = (child === hoveredObject && !focusedObject) ? 1.2 : 1.0;
        child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        if (!focusedObject) {
            const parentQuaternion = group.quaternion;
            const inverseParentQuaternion = parentQuaternion.clone().invert();
            const targetQuaternion = inverseParentQuaternion.multiply(camera.quaternion);
            child.quaternion.copy(targetQuaternion);
        }

        if (child.material.opacity !== child.userData.targetOpacity) {
            child.material.opacity += (child.userData.targetOpacity - child.material.opacity) * 0.05;
            if (Math.abs(child.material.opacity - child.userData.targetOpacity) < 0.01) {
                child.material.opacity = child.userData.targetOpacity;
            }
        }
    });

    if (isFocusing) {
        camera.position.lerp(cameraTargetPosition, 0.08);
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(camera.position, cameraTargetLookAt, camera.up)
        );
        camera.quaternion.slerp(targetQuaternion, 0.08);

        if (camera.position.distanceTo(cameraTargetPosition) < 0.05) {
            camera.position.copy(cameraTargetPosition);
            camera.quaternion.copy(targetQuaternion);
            isFocusing = false;
        }
    }

    if (isUnfocusing) {
        camera.position.lerp(originalCameraState.position, 0.08);
        camera.quaternion.slerp(originalCameraState.quaternion, 0.08);

        if (camera.position.distanceTo(originalCameraState.position) < 0.05) {
            camera.position.copy(originalCameraState.position);
            camera.quaternion.copy(originalCameraState.quaternion);
            isUnfocusing = false;
        }
    }

    renderer.render(scene, camera);
};

// --- 事件监听与处理 ---
const getEventPosition = (e) => {
    return e.touches && e.touches.length > 0 ? e.touches[0] : e;
};

const addEventListeners = () => {
    const el = container.value;
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('click', onMouseClick);
    el.addEventListener('touchstart', onMouseDown, { passive: true });
    el.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);
    el.addEventListener('wheel', onWheel);
    window.addEventListener('resize', onWindowResize);
};

const removeEventListeners = () => {
    const el = container.value;
    if (!el) return;
    el.removeEventListener('mousedown', onMouseDown);
    el.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    el.removeEventListener('click', onMouseClick);
    el.removeEventListener('touchstart', onMouseDown);
    el.removeEventListener('touchmove', onMouseMove);
    window.removeEventListener('touchend', onMouseUp);
    el.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', onWindowResize);
};

const onMouseDown = (e) => {
    isDragging = true;
    dragMovement = 0;
    const pos = getEventPosition(e);
    previousMousePosition.x = pos.clientX;
    previousMousePosition.y = pos.clientY;

    // 开始拖拽时，停止所有惯性
    inertia.x = 0;
    inertia.y = 0;
};

const onMouseMove = (e) => {
    const pos = getEventPosition(e);
    if (isDragging) {
        const deltaX = pos.clientX - previousMousePosition.x;
        const deltaY = pos.clientY - previousMousePosition.y;
        dragMovement += Math.abs(deltaX) + Math.abs(deltaY);

        if (!focusedObject && !isFocusing && !isUnfocusing) {
            group.rotation.y += deltaX * 0.005;

            // --- 修改：计算新的X轴旋转并施加限制 ---
            const newRotationX = group.rotation.x + deltaY * 0.005;
            group.rotation.x = Math.max(-verticalDragLimit, Math.min(verticalDragLimit, newRotationX));

            // 记录最后的拖拽速度，用于惯性计算
            lastDelta.x = deltaX;
            // --- 修改：如果已达到边界，则不记录垂直拖拽速度，防止惯性“粘”在边界上 ---
            if (newRotationX >= verticalDragLimit || newRotationX <= -verticalDragLimit) {
                lastDelta.y = 0;
            } else {
                lastDelta.y = deltaY;
            }
        }
        previousMousePosition.x = pos.clientX;
        previousMousePosition.y = pos.clientY;
    }

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((pos.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((pos.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    hoveredObject = intersects.length > 0 ? intersects[0].object : null;
};

const onMouseUp = () => {
    if (isDragging) {
        // 设置初始惯性
        inertia.y = lastDelta.x * 0.005;
        inertia.x = lastDelta.y * 0.005;
        lastDelta = { x: 0, y: 0 };
    }
    isDragging = false;
};

const onMouseClick = () => {
    if (dragMovement > 5) return;
    if (hoveredObject && !focusedObject && !isFocusing && !isUnfocusing) {
        focusedObject = hoveredObject;
        focusedItemData.value = focusedObject.userData.itemData;
        isFocusing = true;
        isUnfocusing = false;

        originalCameraState.position.copy(camera.position);
        originalCameraState.quaternion.copy(camera.quaternion);

        focusedObject.getWorldPosition(cameraTargetLookAt);
        const normal = new THREE.Vector3(0, 0, 1);
        normal.applyQuaternion(focusedObject.getWorldQuaternion(new THREE.Quaternion()));
        const distance = 6;
        cameraTargetPosition.copy(cameraTargetLookAt).add(normal.multiplyScalar(distance));

        overlay.value.style.opacity = '1';
        overlay.value.style.pointerEvents = 'auto';

        group.children.forEach(child => {
            if (child !== focusedObject) {
                child.userData.targetOpacity = 0;
            }
        });
    }
};

const closeFocusedView = () => {
    if (focusedObject) {
        focusedItemData.value = null;
        isUnfocusing = true;
        isFocusing = false;

        overlay.value.style.opacity = '0';
        overlay.value.style.pointerEvents = 'none';

        group.children.forEach(child => {
            child.userData.targetOpacity = 1.0;
        });
        focusedObject = null;
    }
};

const onWheel = (e) => {
    if (focusedObject || isFocusing || isUnfocusing) return;
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(5, Math.min(camera.position.z, 50));
};

const onWindowResize = () => {
    const el = container.value;
    if (!el) return;
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(el.clientWidth, el.clientHeight);
};

// --- Vue 生命周期钩子 ---
onMounted(() => {
    if (container.value) {
        init();
        animate();
    }
});

onUnmounted(() => {
    removeEventListeners();
    if (renderer) renderer.dispose();
    if (scene) {
        scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
    }
});
</script>

<style scoped lang="scss">
.album-container {
    width: 100%;
    height: calc(100vh - 153px);
    overflow: hidden;
    cursor: grab;
    position: relative;
}

.album-container:active {
    cursor: grabbing;
}

.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    cursor: pointer;
    transition: opacity 0.5s ease-in-out;
}

.text-overlay {
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    max-width: 500px;
    box-sizing: border-box;
    width: 90%;
    padding: 20px;
    z-index: 11;
    opacity: 0;
    transition: opacity 0.5s ease-in-out 0.3s;
    pointer-events: none;
}

.text-overlay.visible {
    opacity: 1;
}

.text-overlay h2 {
    font-size: 1.5rem;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.text-overlay .date {
    font-size: 0.9rem;
    margin-bottom: 16px;
    opacity: 0.8;
}
</style>