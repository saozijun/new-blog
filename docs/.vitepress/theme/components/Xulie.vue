<template>
  <div class="main">
    <div ref="containerRef" class="sequence-container">
      <canvas ref="canvasRef" class="sequence-canvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { inject } from "vue";

// 动态导入图片资源
const imagesList = Array.from({ length: 29 }, (_, i) => {
  const index = i + 1;
  const formattedIndex = `00${index}`;
  return new URL(`../static/xulie/${formattedIndex}.jpg`, import.meta.url).href;
});

const gsap = inject("gsap");

const containerRef = ref(null);
const canvasRef = ref(null);
const context = ref(null);
const images = ref([]);
const totalFrames = ref(29); 
const imageSeq = ref({ frame: 0 });

onMounted(() => {
  nextTick(() => {
    init();
  });
});

/**
 * 加载所有图片资源
 */
const loadImages = async () => {
  const loadedImages = [];
  for (let i = 0; i < imagesList.length; i++) {
    const img = new Image();
    img.src = imagesList[i];
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = () => {
        resolve();
      };
    });
    if (img.complete) {
      loadedImages.push(img);
    }
  }
  
  images.value = loadedImages;
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
  
  gsap.to(imageSeq.value, {
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
</style>
