---
layout: doc
title: "GSAP帧序列动画"
description: "通过Python生成帧序列与GSAP滚动动画，滚动驱动帧序列展示"
category: 技术笔记
tags:
  - GSAP
---

# GSAP帧序列：记录下我滴超极漂
::: tip
终于学会了小时候梦寐以求的超级漂，尽管目前漂的还是很差，但至少能看了。
:::
<script setup>
    import XuLie from '../../.vitepress/theme/components/Xulie.vue'
</script>

## 效果展示 - 向下滚动

<XuLie />

## ⚙️ 技术实现

::: code-group

```python [main.py]
# 使用 python 进行图片压缩
from PIL import Image
import os


def compress_to_webp(input_path, output_path, quality=80, max_size=None):
    try:
        with Image.open(input_path) as img:
            # 调整大小（如果需要）
            if max_size:
                img.thumbnail(max_size, Image.LANCZOS)

            # 确保输出路径使用.webp扩展名
            if not output_path.lower().endswith('.webp'):
                output_path = os.path.splitext(output_path)[0] + '.webp'

            # 保存为WebP格式
            img.save(
                output_path,
                format='WEBP',
                quality=quality,
                method=6  # 默认方法，平衡压缩速度和质量
            )

            # 获取压缩前后文件大小
            original_size = os.path.getsize(input_path)
            compressed_size = os.path.getsize(output_path)
            compression_ratio = (original_size - compressed_size) / original_size * 100

            print(f"压缩完成: {input_path} -> {output_path}")
            print(f"原始大小: {original_size / 1024:.2f} KB")
            print(f"压缩后大小: {compressed_size / 1024:.2f} KB")
            print(f"压缩率: {compression_ratio:.2f}%")

            return output_path
    except Exception as e:
        print(f"图像压缩失败: {e}")
        return None


def batch_compress_to_webp(input_dir, output_dir, quality=80, max_size=None):
    """
    批量将目录中的所有图像文件压缩为WebP格式

    参数:
        input_dir (str): 输入目录路径
        output_dir (str): 输出目录路径
        quality (int): 压缩质量(1-100)，默认80
        max_size (tuple): 最大尺寸(宽,高)，可选
    """
    # 支持的图像格式
    supported_formats = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff')

    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)

    # 遍历输入目录中的所有文件
    for filename in os.listdir(input_dir):
        # 检查文件是否是支持的图像格式
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(input_dir, filename)

            # 将输出文件名改为.webp扩展名
            output_filename = os.path.splitext(filename)[0] + '.webp'
            output_path = os.path.join(output_dir, output_filename)

            # 压缩图像为WebP格式
            compress_to_webp(input_path, output_path, quality, max_size)


if __name__ == '__main__':
    # 配置参数
    input_directory = r'E:\pyData\pythonProject5\frames'  # 输入目录
    output_directory = r'E:\pyData\pythonProject5\framesOut'  # 输出目录
    compression_quality = 60  # WebP压缩质量 (1-100)

    # 执行批量压缩
    print("开始批量压缩图像为WebP格式...")
    batch_compress_to_webp(
        input_dir=input_directory,
        output_dir=output_directory,
        quality=compression_quality
    )
    print("批量压缩完成!")
```

```vue [XuLie.vue]
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
      scrub: 0.5 // 平滑滚动效果
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

```
:::


