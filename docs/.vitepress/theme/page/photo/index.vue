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
// 动态导入所有图片资源，创建一个包含14张图片URL的数组
const imagesList = Array.from({ length: 14 }, (_, i) => {
    const index = i + 1;
    return new URL(`../../static/photo/${index}.webp`, import.meta.url).href;
});

// --- Vue 响应式变量和模板引用 ---
let { isDark } = useData(); // 从VitePress获取暗黑模式状态
const container = ref(null); // 对应模板中的 .album-container div
const overlay = ref(null); // 对应模板中的 .fullscreen-overlay div
const textOverlay = ref(null); // 对应模板中的 .text-overlay div
const focusedItemData = ref(null); // 存储当前聚焦图片的数据（标题、日期等）

// --- Three.js 核心变量 ---
let scene, camera, renderer; // 场景、相机、渲染器
let group; // 一个组，用于容纳所有的图片平面，方便整体旋转
let autoRotateSpeed = 0.0005; // 自动旋转速度

// --- 交互状态变量 ---
let isDragging = false; // 标记是否正在拖拽
let previousMousePosition = { x: 0, y: 0 }; // 记录上一次鼠标/触摸的位置
let dragMovement = 0; // 记录拖拽的总移动距离，用于区分拖拽和点击
const raycaster = new THREE.Raycaster(); // 光线投射，用于检测鼠标悬停对象
const mouse = new THREE.Vector2(); // 存储归一化的鼠标坐标
let hoveredObject = null; // 当前鼠标悬停的图片对象
let focusedObject = null; // 当前点击聚焦的图片对象
let isFocusing = false; // 标记是否正在执行聚焦动画
let isUnfocusing = false; // 标记是否正在执行取消聚焦的动画
const cameraTargetPosition = new THREE.Vector3(); // 相机聚焦动画的目标位置
const cameraTargetLookAt = new THREE.Vector3(); // 相机聚焦动画的目标朝向点
const originalCameraState = { // 存储聚焦前相机的原始状态，用于恢复
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion()
};

// --- 图片元数据 ---
// 每个对象包含图片的URL、标题和日期
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
    if (scene) {
        // 根据暗黑模式状态切换场景背景色
        scene.background.set(newVal ? 0x1b1b1f : 0xffffff);
    }
});

// --- 初始化 Three.js 场景 ---
const init = () => {
    // 1. 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? 0x1b1b1f : 0xffffff);

    // 2. 创建相机
    const aspect = container.value.clientWidth / container.value.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 20; // 设置相机初始位置

    // 3. 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    container.value.appendChild(renderer.domElement); // 将渲染器画布添加到DOM中

    // 4. 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // 环境光
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 平行光
    directionalLight.position.set(1, 1, 5);
    scene.add(directionalLight);

    // 5. 创建组
    group = new THREE.Group();
    scene.add(group);

    // 6. 创建所有图片平面并添加到组中
    createImagePlanes();
    // 7. 添加事件监听器
    addEventListeners();
};

// --- 创建所有图片平面 ---
const createImagePlanes = () => {
    const textureLoader = new THREE.TextureLoader();

    const xRadius = 15; // X轴半径 (更宽)
    const yRadius = 8;  // Y轴半径 (更扁)
    const zRadius = 15; // Z轴半径 (更深)

    const imageSize = 4; // 图片平面的基本尺寸
    const n = imageData.length; // 图片总数

    // 使用黄金角度（斐波那契球体）算法，使图片在球面上均匀分布
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const yRange = 0.9;

    imageData.forEach((item, i) => {
        textureLoader.load(item.url, (texture) => {
            const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
            const geometry = new THREE.PlaneGeometry(imageSize, imageSize * (texture.image.height / texture.image.width));
            const plane = new THREE.Mesh(geometry, material);

            const y = (1 - (i / (n - 1)) * 2) * yRange;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i; // 角度
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            plane.position.set(x * xRadius, y * yRadius, z * zRadius);

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
    requestAnimationFrame(animate); // 请求下一帧动画

    // 如果没有进行拖拽、聚焦等交互，则执行自动旋转
    if (!isDragging && !focusedObject && !isFocusing && !isUnfocusing) {
        group.rotation.y += autoRotateSpeed;
        group.rotation.x += autoRotateSpeed * 0.3;
    }

    // 遍历所有图片平面，更新其状态
    group.children.forEach(child => {
        // 1. 悬停缩放效果
        const targetScale = (child === hoveredObject && !focusedObject) ? 1.2 : 1.0;
        child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // 2. 使图片平面始终朝向相机 (在非聚焦模式下)
        if (!focusedObject) {
            const parentQuaternion = group.quaternion;
            const inverseParentQuaternion = parentQuaternion.clone().invert();
            const targetQuaternion = inverseParentQuaternion.multiply(camera.quaternion);
            child.quaternion.copy(targetQuaternion);
        }

        // 3. 透明度渐变效果 (用于聚焦时隐藏其他图片)
        if (child.material.opacity !== child.userData.targetOpacity) {
            child.material.opacity += (child.userData.targetOpacity - child.material.opacity) * 0.05;
            if (Math.abs(child.material.opacity - child.userData.targetOpacity) < 0.01) {
                child.material.opacity = child.userData.targetOpacity;
            }
        }
    });

    // 4. 处理相机聚焦动画
    if (isFocusing) {
        // 使用lerp和slerp平滑地将相机移动和旋转到目标状态
        camera.position.lerp(cameraTargetPosition, 0.08);
        const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(camera.position, cameraTargetLookAt, camera.up)
        );
        camera.quaternion.slerp(targetQuaternion, 0.08);

        // 当相机接近目标时，直接设置为目标状态并结束动画
        if (camera.position.distanceTo(cameraTargetPosition) < 0.05) {
            camera.position.copy(cameraTargetPosition);
            camera.quaternion.copy(targetQuaternion);
            isFocusing = false;
        }
    }

    // 5. 处理相机取消聚焦动画
    if (isUnfocusing) {
        // 平滑地将相机恢复到原始状态
        camera.position.lerp(originalCameraState.position, 0.08);
        camera.quaternion.slerp(originalCameraState.quaternion, 0.08);

        // 当相机接近原始状态时，直接设置为原始状态并结束动画
        if (camera.position.distanceTo(originalCameraState.position) < 0.05) {
            camera.position.copy(originalCameraState.position);
            camera.quaternion.copy(originalCameraState.quaternion);
            isUnfocusing = false;
        }
    }

    // 渲染场景
    renderer.render(scene, camera);
};

// --- 事件监听与处理 ---

/**
 * 辅助函数：从鼠标或触摸事件中获取统一的位置对象
 * @param {MouseEvent | TouchEvent} e - 事件对象
 * @returns { {clientX: number, clientY: number} }
 */
const getEventPosition = (e) => {
    return e.touches && e.touches.length > 0 ? e.touches[0] : e;
};

// 注册所有事件监听器
const addEventListeners = () => {
    const el = container.value;
    // 鼠标事件
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('click', onMouseClick);

    // 触摸事件 (兼容移动端)
    el.addEventListener('touchstart', onMouseDown, { passive: true });
    el.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // 滚轮事件
    el.addEventListener('wheel', onWheel);
    // 窗口大小变化事件
    window.addEventListener('resize', onWindowResize);
};

// 移除所有事件监听器（在组件卸载时调用）
const removeEventListeners = () => {
    const el = container.value;
    if (!el) return;
    // 鼠标事件
    el.removeEventListener('mousedown', onMouseDown);
    el.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    el.removeEventListener('click', onMouseClick);

    // 触摸事件
    el.removeEventListener('touchstart', onMouseDown);
    el.removeEventListener('touchmove', onMouseMove);
    window.removeEventListener('touchend', onMouseUp);

    // 滚轮事件
    el.removeEventListener('wheel', onWheel);
    // 窗口大小变化事件
    window.removeEventListener('resize', onWindowResize);
};

// 鼠标/触摸按下事件处理
const onMouseDown = (e) => {
    isDragging = true;
    dragMovement = 0; // 重置拖拽距离
    const pos = getEventPosition(e);
    previousMousePosition.x = pos.clientX;
    previousMousePosition.y = pos.clientY;
};

// 鼠标/触摸移动事件处理
const onMouseMove = (e) => {
    const pos = getEventPosition(e);
    // --- 处理拖拽旋转 ---
    if (isDragging) {
        const deltaX = pos.clientX - previousMousePosition.x;
        const deltaY = pos.clientY - previousMousePosition.y;
        dragMovement += Math.abs(deltaX) + Math.abs(deltaY);
        if (!focusedObject && !isFocusing && !isUnfocusing) {
            group.rotation.y += deltaX * 0.005; // Y轴旋转反向
            group.rotation.x += deltaY * 0.005; // X轴旋转也反向，更符合直觉
        }
        previousMousePosition.x = pos.clientX;
        previousMousePosition.y = pos.clientY;
    }

    // --- 处理悬停检测 ---
    const rect = renderer.domElement.getBoundingClientRect();
    // 将屏幕坐标转换为Three.js的归一化设备坐标 (-1 to +1)
    mouse.x = ((pos.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((pos.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera); // 从相机发出射线
    const intersects = raycaster.intersectObjects(group.children); // 检测与组内物体的交点
    hoveredObject = intersects.length > 0 ? intersects[0].object : null; // 更新悬停对象
};

// 鼠标/触摸抬起事件处理
const onMouseUp = () => {
    isDragging = false;
};

// 点击事件处理
const onMouseClick = () => {
    // 如果拖拽距离过大，则判断为拖拽而非点击
    if (dragMovement > 5) return;
    // 如果点击到了一个物体，并且当前没有聚焦的物体，则执行聚焦
    if (hoveredObject && !focusedObject && !isFocusing && !isUnfocusing) {
        focusedObject = hoveredObject;
        focusedItemData.value = focusedObject.userData.itemData;
        isFocusing = true;
        isUnfocusing = false;

        // 1. 保存当前相机状态
        originalCameraState.position.copy(camera.position);
        originalCameraState.quaternion.copy(camera.quaternion);

        // 2. 计算相机聚焦的目标位置和朝向
        focusedObject.getWorldPosition(cameraTargetLookAt); // 目标朝向点就是图片中心

        // 计算图片平面的法向量（即正对的方向）
        const normal = new THREE.Vector3(0, 0, 1);
        normal.applyQuaternion(focusedObject.getWorldQuaternion(new THREE.Quaternion()));

        // 相机目标位置在图片法向量方向上后退一段距离
        const distance = 6;
        cameraTargetPosition.copy(cameraTargetLookAt).add(normal.multiplyScalar(distance));

        // 3. 显示遮罩和文字
        overlay.value.style.opacity = '1';
        overlay.value.style.pointerEvents = 'auto';

        // 4. 将其他图片设置为透明
        group.children.forEach(child => {
            if (child !== focusedObject) {
                child.userData.targetOpacity = 0;
            }
        });
    }
};

// 关闭聚焦视图
const closeFocusedView = () => {
    if (focusedObject) {
        focusedItemData.value = null; // 清除文本信息
        isUnfocusing = true; // 开始取消聚焦动画
        isFocusing = false;

        // 隐藏遮罩层
        overlay.value.style.opacity = '0';
        overlay.value.style.pointerEvents = 'none';

        // 恢复所有图片的透明度
        group.children.forEach(child => {
            child.userData.targetOpacity = 1.0;
        });

        focusedObject = null; // 清除聚焦对象
    }
};

// 滚轮事件处理（缩放）
const onWheel = (e) => {
    if (focusedObject || isFocusing || isUnfocusing) return; // 聚焦时不允许缩放
    camera.position.z += e.deltaY * 0.01;
    // 限制缩放范围
    camera.position.z = Math.max(5, Math.min(camera.position.z, 50));
};

// 窗口大小变化事件处理
const onWindowResize = () => {
    const el = container.value;
    if (!el) return;
    // 更新相机的宽高比和投影矩阵
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    // 更新渲染器的尺寸
    renderer.setSize(el.clientWidth, el.clientHeight);
};

// --- Vue 生命周期钩子 ---
onMounted(() => {
    if (container.value) {
        init(); // 初始化场景
        animate(); // 开始动画循环
    }
});

onUnmounted(() => {
    removeEventListeners(); // 移除事件监听
    // 彻底清理Three.js资源，防止内存泄漏
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
    /* 计算高度，减去导航栏等UI元素的高度 */
    height: calc(100vh - 153px);
    overflow: hidden;
    cursor: grab;
    /* 默认光标样式 */
    position: relative;
}

.album-container:active {
    cursor: grabbing;
    /* 拖拽时光标样式 */
}

.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    /* 初始透明 */
    opacity: 0;
    pointer-events: none;
    /* 初始不可点击 */
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
    /* 延迟0.3s出现，等待相机动画 */
    transition: opacity 0.5s ease-in-out 0.3s;
    pointer-events: none;
    /* 文字本身不响应点击 */
}

.text-overlay.visible {
    opacity: 1;
    /* 应用 .visible 类时显示 */
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