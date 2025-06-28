<template>
  <div class="main">
    <div ref="containerRef" class="sequence-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中 {{ loadingProgress }}%</div>
      </div>
      <canvas v-show="!loading" ref="canvasRef" class="sequence-canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { inject } from "vue";

let COSURL = import.meta.env.VITE_APP_COS_URL

// 动态导入图片资源
const imagesList = Array.from({ length: 44 }, (_, i) => {
  const index = i + 1;
  const formattedIndex = `00${index}`;
  return `${COSURL}blog/xulie/${formattedIndex}.jpg`;
});

const gsap = inject("gsap");

const containerRef = ref(null);
const canvasRef = ref(null);
const context = ref(null);
const images = ref([]);
const totalFrames = ref(44); 
const imageSeq = ref({ frame: 0 });
const scrollTriggerInstance = ref(null);
const loading = ref(true);
const loadingProgress = ref(0);

onMounted(() => {
  nextTick(() => {
    init();
  });
});

onUnmounted(() => {
  // 清除 ScrollTrigger 实例
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
  
  // 清除图片资源
  images.value = [];
  
  // 清除 canvas
  if (context.value && canvasRef.value) {
    context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
});

/**
 * 加载所有图片资源
 */
const loadImages = async () => {
  const loadedImages = [];
  const totalImages = imagesList.length;
  let loadedCount = 0;
  
  for (let i = 0; i < totalImages; i++) {
    const img = new Image();
    img.src = imagesList[i];
    await new Promise(resolve => {
      img.onload = () => {
        loadedCount++;
        loadingProgress.value = Math.floor((loadedCount / totalImages) * 100);
        resolve();
      };
      img.onerror = () => {
        loadedCount++;
        loadingProgress.value = Math.floor((loadedCount / totalImages) * 100);
        resolve();
      };
    });
    if (img.complete) {
      loadedImages.push(img);
    }
  }
  
  images.value = loadedImages;
  loading.value = false;
  return loadedImages;
};

/**
 * 将当前帧渲染到画布上
 */
const renderCanvas = () => {
  if (images.value.length === 0) return;
  
  // 根据当前的 frame 值获取对应的图片，并确保索引在有效范围内
  const img = images.value[Math.max(0, Math.min(Math.floor(imageSeq.value.frame), images.value.length - 1))];
  if (!img) return;
  
  // 设置画布尺寸与图片一致
  canvasRef.value.width = img.width;
  canvasRef.value.height = img.height;
  
  // 清除画布并绘制当前帧图片
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  context.value.drawImage(img, 0, 0);
};

/**
 * 初始化图片序列动画
 */
const init = async () => {
  if (!containerRef.value || !canvasRef.value) return;
  
  context.value = canvasRef.value.getContext('2d');
  
  await loadImages();
  
  if (images.value.length === 0) return;
  
  renderCanvas();
  
  const animation = gsap.to(imageSeq.value, {
    frame: totalFrames.value - 1,
    snap: "frame", // 确保帧数为整数
    ease: "none",
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.1 // 平滑滚动效果
    },
    onUpdate: renderCanvas
  });
  
  // 保存 ScrollTrigger 实例以便在组件卸载时清除
  scrollTriggerInstance.value = animation.scrollTrigger;
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 240px;
  .sequence-container {
    width: 100%;
    height: 500vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    
    .loading-container {
      position: sticky;
      top: 50vh;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--vp-c-brand);
        animation: spin 1s ease-in-out infinite;
      }
      
      .loading-text {
        margin-top: 10px;
        font-size: 16px;
        color: #666;
      }
    }
    
    .sequence-canvas {
      position: sticky;
      top: 50vh;
      transform: translateY(-50%);
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
