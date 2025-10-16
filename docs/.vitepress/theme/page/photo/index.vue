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

// 动态导入图片资源
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
let originalState = null;
let isAnimatingBack = false;

const imageData = [
    {
        url: imagesList[0],
        title: '重庆 十八梯街',
        date: '2024-06-16'
    },
    {
        url: imagesList[1],
        title: '赣州方特 圆明园',
        date: '2023-10-04'
    },
    {
        url: imagesList[2],
        title: '柳州 龙潭公园',
        date: '2024-06-28',
    },
    {
        url: imagesList[3],
        title: '财院 放学晚霞',
        date: '2022-12-02',
    },
    {
        url: imagesList[4],
        title: '重庆 洪崖洞',
        date: '2024-06-17',
    },
    {
        url: imagesList[5],
        title: '广州 永庆坊-月亮桥',
        date: '2024-09-16',
    },
    {
        url: imagesList[6],
        title: '宁波 实习路景',
        date: '2022-03-26',
    },
    {
        url: imagesList[7],
        title: '杭州 西湖',
        date: '2021-07-28',
    },
    {
        url: imagesList[8],
        title: '清远 古龙峡谷漂流',
        date: '2025-07-19',
    },
    {
        url: imagesList[9],
        title: '长沙 橘子洲',
        date: '2024-1-10',
    },
    {
        url: imagesList[10],
        title: '财院 田径场风景',
        date: '2023-06-18',
    },
    {
        url: imagesList[11],
        title: '广州 越秀公园 灯会',
        date: '2023-06-18',
    },
    {
        url: imagesList[12],
        title: '广州 72家房客拍摄地',
        date: '2025-07-18',
    },
    {
        url: imagesList[13],
        title: '贵州 千户苗寨',
        date: '2024-06-20',
    }
];

// --- 监听暗黑模式变化 ---
watch(isDark, (newVal) => {
    if (scene) scene.background.set(newVal ? 0x1b1b1f : 0xffffff);
});

// --- 初始化场景 ---
const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? 0x1b1b1f : 0xffffff);

    const aspect = container.value.clientWidth / container.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 18;

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
    const radius = 12;
    const imageSize = 4;
    const n = imageData.length;

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    imageData.forEach((item, i) => {
        textureLoader.load(item.url, (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            const geometry = new THREE.PlaneGeometry(imageSize, imageSize * (texture.image.height / texture.image.width));
            const plane = new THREE.Mesh(geometry, material);

            const y = 1 - (i / (n - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            plane.position.set(x * radius, y * radius, z * radius);
            plane.rotation.z = (Math.random() - 0.5) * Math.PI * 0.1;

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

    if (!isDragging && !focusedObject && !isAnimatingBack) {
        group.rotation.y += autoRotateSpeed;
        group.rotation.x += autoRotateSpeed * 0.3;
    }

    group.children.forEach(child => {
        const targetScale = (child === hoveredObject && !focusedObject) ? 1.2 : 1.0;
        child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        if (!focusedObject) {
            child.lookAt(camera.position);
        }

        if (child.material.opacity !== child.userData.targetOpacity) {
            child.material.opacity += (child.userData.targetOpacity - child.material.opacity) * 0.05;
            if (Math.abs(child.material.opacity - child.userData.targetOpacity) < 0.01) {
                child.material.opacity = child.userData.targetOpacity;
            }
        }
    });

    if (focusedObject) {
        const targetPosition = new THREE.Vector3(0, 0, -8);
        targetPosition.applyMatrix4(camera.matrixWorld);
        const targetQuaternion = camera.quaternion.clone();

        focusedObject.position.lerp(targetPosition, 0.08);
        focusedObject.quaternion.slerp(targetQuaternion, 0.08);

        const distance = camera.position.distanceTo(focusedObject.position);
        const vFOV = THREE.MathUtils.degToRad(camera.fov);

        const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
        const imgHeight = focusedObject.geometry.parameters.height;
        let requiredScale = (visibleHeight * 0.6) / imgHeight;
        focusedObject.scale.lerp(new THREE.Vector3(requiredScale, requiredScale, requiredScale), 0.08);
    }
    else if (originalState) {
        const obj = originalState.object;
        obj.position.lerp(originalState.position, 0.1);
        obj.quaternion.slerp(originalState.quaternion, 0.1);
        obj.scale.lerp(originalState.scale, 0.1);

        if (obj.position.distanceTo(originalState.position) < 0.01) {
            obj.position.copy(originalState.position);
            obj.quaternion.copy(originalState.quaternion);
            obj.scale.copy(originalState.scale);
            obj.material.depthTest = true;
            obj.material.needsUpdate = true;
            group.attach(obj);
            originalState = null;
            isAnimatingBack = false;
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

    // Touch Events (FIX)
    el.addEventListener('touchstart', onMouseDown, { passive: true });
    el.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    el.addEventListener('wheel', onWheel);
    window.addEventListener('resize', onWindowResize);
};

const removeEventListeners = () => {
    const el = container.value;
    if (!el) return;
    // Mouse Events
    el.removeEventListener('mousedown', onMouseDown);
    el.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    el.removeEventListener('click', onMouseClick);

    // Touch Events (FIX)
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
};

const onMouseMove = (e) => {
    const pos = getEventPosition(e);

    if (isDragging) {
        const deltaX = pos.clientX - previousMousePosition.x;
        const deltaY = pos.clientY - previousMousePosition.y;
        dragMovement += Math.abs(deltaX) + Math.abs(deltaY);
        if (!focusedObject && !isAnimatingBack) {
            group.rotation.y += deltaX * 0.005;
            group.rotation.x += deltaY * 0.005;
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
    isDragging = false;
};

const onMouseClick = () => {
    if (dragMovement > 5) return;
    if (hoveredObject && !focusedObject && !isAnimatingBack) {
        focusedObject = hoveredObject;
        focusedItemData.value = focusedObject.userData.itemData;

        focusedObject.material.depthTest = false;
        focusedObject.material.needsUpdate = true;

        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        focusedObject.getWorldPosition(worldPosition);
        focusedObject.getWorldQuaternion(worldQuaternion);

        originalState = {
            object: focusedObject,
            position: worldPosition,
            quaternion: worldQuaternion,
            scale: focusedObject.userData.originalScale.clone(),
        };

        overlay.value.style.opacity = '1';
        overlay.value.style.pointerEvents = 'auto';

        group.children.forEach(child => {
            if (child !== focusedObject) {
                child.userData.targetOpacity = 0;
            }
        });

        scene.add(focusedObject);
    }
};

const closeFocusedView = () => {
    if (focusedObject) {
        focusedItemData.value = null;

        overlay.value.style.opacity = '0';
        overlay.value.style.pointerEvents = 'none';

        group.children.forEach(child => {
            child.userData.targetOpacity = 1.0;
        });

        focusedObject = null;
        isAnimatingBack = true;
    }
};

const onWheel = (e) => {
    if (focusedObject || isAnimatingBack) return;
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

<style>
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
    font-size: 2rem;
    margin: 0 0 8px 0;
    font-weight: 600;
}

.text-overlay .date {
    font-size: 0.9rem;
    margin-bottom: 16px;
    opacity: 0.8;
}
</style>