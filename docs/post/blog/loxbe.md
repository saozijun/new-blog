---
layout: doc
title: 我的小监工组件 👀
description: 跟随鼠标移动的小监工，不要偷懒，它会时刻盯着你~ 👀
category: 组件
tags:
  - Vue
  - 炫酷组件
---

<script setup>
    import Loxbe from '../../.vitepress/theme/components/Loxbe.vue'
</script>

# 我的小监工组件

## 🙂 小监工展示

<Loxbe />
::: details 点我查看组件代码

```js [Loxbe.vue]
<template>
  <div
    class="loxdeB"
    ref="container"
    :style="{ width: `${width}px`, height: `${height}px` }"
  >
    <div class="eEqjw" ref="face">
      <svg
        fill="none"
        height="40"
        viewBox="0 0 60 60"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 30C24 33.3137 26.6863 36 30 36C33.3137 36 36 33.3137 36 30H40C40 35.5228 35.5228 40 30 40C24.4772 40 20 35.5228 20 30H24Z"
          :fill="color"
          fill-rule="evenodd"
        ></path>
        <path
          d="M26 22C26 23.1046 25.1046 24 24 24C22.8954 24 22 23.1046 22 22C22 20.8954 22.8954 20 24 20C25.1046 20 26 20.8954 26 22Z"
          :fill="color"
        ></path>
        <path
          d="M38 22C38 23.1046 37.1046 24 36 24C34.8954 24 34 23.1046 34 22C34 20.8954 34.8954 20 36 20C37.1046 20 38 20.8954 38 22Z"
          :fill="color"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
const props = defineProps({
  width: { type: Number, default: 45 },
  height: { type: Number, default: 45 },
  bgColor: { type: String, default: "#409eff" },
  color: { type: String, default: "#203B83" },
});
const container = ref(null);
const face = ref(null);
const maxMovement = 50; // 最大移动距离
const mouseMoveHandler = ref(null); // 使用ref存储事件处理函数
const onMouseMove = (e) => {
  if (!container.value || !face.value) return; // 添加空值检查

  const containerRect = container.value.getBoundingClientRect();
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;

  // 计算鼠标与容器中心的距离
  const distanceX = e.clientX - containerCenterX;
  const distanceY = e.clientY - containerCenterY;

  // 计算距离的比例
  const containerRadius = containerRect.width / 2;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  // 根据鼠标距离计算表情的移动
  let moveX = (distanceX / window.innerWidth) * maxMovement;
  let moveY = (distanceY / window.innerHeight) * maxMovement;

  // 限制最大移动距离
  const maxDistance = containerRadius * 0.5; // 限制最大移动距离为容器半径的60%
  const currentDistance = Math.sqrt(moveX * moveX + moveY * moveY);
  if (currentDistance > maxDistance) {
    const ratio = maxDistance / currentDistance;
    moveX *= ratio;
    moveY *= ratio;
  }

  // 基于移动方向添加小幅度旋转
  let moveRotation = 0;
  if (Math.abs(moveX) > 0.5 || Math.abs(moveY) > 0.5) {
    // 根据移动方向计算旋转角度，移动越多旋转越大
    moveRotation = moveX * 1 + moveY * 1;
    // 限制最大旋转角度
    moveRotation = Math.max(-20, Math.min(20, moveRotation));
  }

  // 当鼠标接近容器边缘时，增加旋转效果
  let rotateAngle = 0;
  if (distance < containerRadius * 3) {
    const angle = Math.atan2(distanceY, distanceX);
    rotateAngle = ((angle * 180) / Math.PI) * 0.05;

    // 当鼠标非常接近容器时，让表情"贴"在边缘
    if (distance < containerRadius * 1.5) {
      const ratio = Math.min(1, distance / (containerRadius * 1.5));
      moveX *= ratio;
      moveY *= ratio;
    }
  }

  // 应用变换
  face.value.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${
    rotateAngle + moveRotation
  }deg)`;
};
onMounted(() => {
  // 确保在重新挂载时先清理可能存在的旧事件
  if (mouseMoveHandler.value) {
    window.removeEventListener("mousemove", mouseMoveHandler.value);
  }
  nextTick(() => {
    // 保存到ref中
    mouseMoveHandler.value = onMouseMove;
    window.addEventListener("mousemove", mouseMoveHandler.value);
  });
});

onUnmounted(() => {
  // 取消监听鼠标移动事件
  if (mouseMoveHandler.value) {
    window.removeEventListener("mousemove", mouseMoveHandler.value);
    mouseMoveHandler.value = null;
  }
});
</script>

<style lang="scss" scoped>
.loxdeB {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgb(66, 161, 255) 0%, #a7d6f4 100%);
}

.eEqjw {
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.1s ease-out;
}
</style>
```

:::
