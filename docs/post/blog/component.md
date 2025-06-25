---
layout: doc
title: 炫酷组件分享
description: 分享一些酷炫的组件
category: 技术
tags:
  - Vue
  - 炫酷组件
---

<script setup>
    import Loxbe from '../../.vitepress/theme/components/Loxbe.vue'
    import ImageTrail from '../../.vitepress/theme/components/ImageTrail.vue'
    import FlipWords from '../../.vitepress/theme/components/FlipWords.vue'
</script>

# 分享一些的炫酷组件

## 🙂 小监工

<Loxbe />
第一个当然是我的小监工啦~ 
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

## 🖼️ 图片路径跟随

<div :class="$style.eEqjw"> 
 <span>进来滑滑~</span>
 <ImageTrail :size="60" />
</div>

<style module>
.eEqjw {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
}
.eEqjw span {
    font-size: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--vp-c-text-1);
    opacity: 0.2;
}
</style>

::: details 点我查看组件代码

```js [ImageTrail.vue]
<template>
  <div class="content" ref="containerRef">
    <div v-for="(url, i) in items" :key="i" class="content__img" :style="{width: `${size}px`}">
      <div
        class="content__img-inner"
        :style="{ backgroundImage: `url(${url})` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import iconAntd from "../static/icons/icon-antd.svg";
import iconPet from "../static/icons/icon-pet.svg";
import iconVue from "../static/icons/icon-vue.svg";
import iconVite from "../static/icons/icon-vite.svg";
import iconSass from "../static/icons/icon-sass.svg";
import iconReact from "../static/icons/icon-react.svg";
import iconGit from "../static/icons/icon-git.svg";
import iconGsap from "../static/icons/icon-gsap.svg";
import iconAngellist from "../static/icons/icon-angellist.svg";
import iconHot from "../static/icons/icon-hot.svg";
import iconMysql from "../static/icons/icon-mysql.svg";
import iconP5js from "../static/icons/icon-p5js.svg";
import iconPs from "../static/icons/icon-ps.svg";
import iconTomcat from "../static/icons/icon-tomcat.svg";
import iconVscode from "../static/icons/icon-vscode.svg";
import iconPython from "../static/icons/icon-python.svg";
const props = defineProps({
  items: {
    type: Array,
    default: () => [iconAntd,
        iconPet,
        iconVue,
        iconVite,
        iconSass,
        iconReact,
        iconGit,
        iconGsap,
        iconAngellist,
        iconHot,
        iconMysql,
        iconP5js,
        iconPs,
        iconTomcat,
        iconVscode,
        iconPython
    ]
  },
  size: {
    type: Number,
    default: 80
  },
  variant: {
    type: Number,
    default: 8
  }
})

const containerRef = ref(null)

// 基础工具函数
const utils = {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  getLocalPointerPos: (e, rect) => {
    const clientX = e.touches?.[0]?.clientX ?? e.clientX
    const clientY = e.touches?.[0]?.clientY ?? e.clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  },
  getMouseDistance: (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

// 图片项类
class ImageItem {
  constructor(DOM_el) {
    this.DOM = {
      el: DOM_el,
      inner: DOM_el.querySelector('.content__img-inner')
    }
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 }
    this.rect = null
    this.getRect()
    this.initEvents()
  }
  
  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect()
  }
  
  initEvents() {
    const resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle)
      this.getRect()
    }
    window.addEventListener('resize', resize)
    this._cleanup = () => window.removeEventListener('resize', resize)
  }
  
  cleanup() {
    this._cleanup?.()
  }
}

// 动画轨迹基类
class ImageTrailBase {
  constructor(container, options = {}) {
    this.container = container
    this.images = [...container.querySelectorAll('.content__img')].map(img => new ImageItem(img))
    this.imagesTotal = this.images.length
    this.threshold = options.threshold ?? 80
    
    this.state = {
      imgPosition: 0,
      zIndexVal: 1,
      activeImagesCount: 0,
      isIdle: true,
      mousePos: { x: 0, y: 0 },
      lastMousePos: { x: 0, y: 0 },
      cacheMousePos: { x: 0, y: 0 }
    }

    this.initEvents()
  }

  initEvents() {
    const handlePointerMove = e => {
      const rect = this.container.getBoundingClientRect()
      this.state.mousePos = utils.getLocalPointerPos(e, rect)
    }

    const initRender = e => {
      const rect = this.container.getBoundingClientRect()
      this.state.mousePos = utils.getLocalPointerPos(e, rect)
      this.state.cacheMousePos = { ...this.state.mousePos }
      this.render()
      this.container.removeEventListener('mousemove', initRender)
      this.container.removeEventListener('touchmove', initRender)
    }

    this.container.addEventListener('mousemove', handlePointerMove)
    this.container.addEventListener('touchmove', handlePointerMove)
    this.container.addEventListener('mousemove', initRender)
    this.container.addEventListener('touchmove', initRender)

    this._cleanup = () => {
      this.container.removeEventListener('mousemove', handlePointerMove)
      this.container.removeEventListener('touchmove', handlePointerMove)
    }
  }

  render() {
    const { mousePos, lastMousePos, cacheMousePos } = this.state
    const distance = utils.getMouseDistance(mousePos, lastMousePos)
    
    cacheMousePos.x = utils.lerp(cacheMousePos.x, mousePos.x, 0.1)
    cacheMousePos.y = utils.lerp(cacheMousePos.y, mousePos.y, 0.1)

    if (distance > this.threshold) {
      this.showNextImage()
      this.state.lastMousePos = { ...mousePos }
    }
    
    if (this.state.isIdle && this.state.zIndexVal !== 1) {
      this.state.zIndexVal = 1
    }
    
    requestAnimationFrame(() => this.render())
  }

  getNextImagePosition() {
    this.state.imgPosition = this.state.imgPosition < this.imagesTotal - 1 
      ? this.state.imgPosition + 1 
      : 0
    return this.images[this.state.imgPosition]
  }

  createAnimation(img, animationConfig) {
    gsap.killTweensOf(img.DOM.el)
    return gsap.timeline({
      onStart: () => this.onImageActivated(),
      onComplete: () => this.onImageDeactivated(),
      ...animationConfig
    })
  }

  onImageActivated() {
    this.state.activeImagesCount++
    this.state.isIdle = false
  }
  
  onImageDeactivated() {
    this.state.activeImagesCount--
    if (this.state.activeImagesCount === 0) {
      this.state.isIdle = true
    }
  }

  cleanup() {
    this._cleanup?.()
    this.images.forEach(img => img.cleanup())
  }
}

// 具体变体实现
const variants = {
  1: class extends ImageTrailBase {
    showNextImage() {
      const img = this.getNextImagePosition()
      this.state.zIndexVal++
      
      this.createAnimation(img)
        .fromTo(img.DOM.el, {
          opacity: 1,
          scale: 1,
          zIndex: this.state.zIndexVal,
          x: this.state.cacheMousePos.x - img.rect.width / 2,
          y: this.state.cacheMousePos.y - img.rect.height / 2
        }, {
          duration: 0.4,
          ease: 'power1',
          x: this.state.mousePos.x - img.rect.width / 2,
          y: this.state.mousePos.y - img.rect.height / 2
        }, 0)
        .to(img.DOM.el, {
          duration: 0.4,
          ease: 'power3',
          opacity: 0,
          scale: 0.2
        }, 0.4)
    }
  },
  
  2: class extends ImageTrailBase {
    showNextImage() {
      const img = this.getNextImagePosition()
      this.state.zIndexVal++
      
      this.createAnimation(img)
        .fromTo(img.DOM.el, {
          opacity: 1, 
          scale: 0,
          zIndex: this.state.zIndexVal,
          x: this.state.cacheMousePos.x - img.rect.width / 2,
          y: this.state.cacheMousePos.y - img.rect.height / 2
        }, {
          duration: 0.4, 
          ease: 'power1', 
          scale: 1,
          x: this.state.mousePos.x - img.rect.width / 2,
          y: this.state.mousePos.y - img.rect.height / 2
        }, 0)
        .fromTo(img.DOM.inner, {
          scale: 2.8, 
          filter: 'brightness(250%)'
        }, {
          duration: 0.4, 
          ease: 'power1',
          scale: 1, 
          filter: 'brightness(100%)'
        }, 0)
        .to(img.DOM.el, {
          duration: 0.4, 
          ease: 'power2',
          opacity: 0, 
          scale: 0.2
        }, 0.45)
    }
  },
}

onMounted(() => {
  if (!containerRef.value) return
  
  const VariantClass = variants[props.variant] || variants[1]
  const instance = new VariantClass(containerRef.value)
  
  // 组件卸载时清理
  return () => instance.cleanup()
})
</script>

<style>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  background: transparent;
  overflow: visible;
}

.content__img {
  width: 80px;
  height: auto;
  aspect-ratio: 1.1;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.content__img-inner {
  background-position: 50% 50%;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  background-size: 100% 100%;
  position: absolute;
  top: calc(-1 * 20px / 2);
  left: calc(-1 * 20px / 2);
}
</style>
```

:::


## 文字轮播渐入渐出
我的站点酷嘛~ 👉 <FlipWords :words="['哎 酷酷酷', '酷毙了', '酷到爆了', '真是臭不要脸~']" :duration="3000" />

::: details 点我查看组件代码

```js [FlipWords.vue]
<template>
  <div class="word-container">
    <Transition
      @after-enter="$emit('animationStart')"
      @after-leave="$emit('animationComplete')"
    >
      <div v-show="isVisible" :class="['word-wrapper', props.class]">
        <template
          v-for="(wordObj, wordIndex) in splitWords"
          :key="wordObj.word + wordIndex"
        >
          <span
            class="word"
            :style="{
              animationDelay: `${wordIndex * 0.3}s`,
            }"
          >
            <span
              v-for="(letter, letterIndex) in wordObj.letters"
              :key="wordObj.word + letterIndex"
              class="letter"
              :style="{
                animationDelay: `${wordIndex * 0.3 + letterIndex * 0.05}s`,
              }"
            >
              {{ letter }}
            </span>
            <span class="space">&nbsp;</span>
          </span>
        </template>
      </div>
    </Transition>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

interface Props {
  words: string[];
  duration?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  class: "",
});

defineEmits(["animationStart", "animationComplete"]);

const currentWord = ref(props.words[0]);
const isVisible = ref(true);
const timeoutId = ref<number | null>(null);

function startAnimation() {
  isVisible.value = false;

  setTimeout(() => {
    const currentIndex = props.words.indexOf(currentWord.value);
    const nextWord = props.words[currentIndex + 1] || props.words[0];
    currentWord.value = nextWord;
    isVisible.value = true;
  }, 600);
}

const splitWords = computed(() => {
  return currentWord.value.split(" ").map((word) => ({
    word,
    letters: word.split(""),
  }));
});

function startTimeout() {
  timeoutId.value = window.setTimeout(() => {
    startAnimation();
  }, props.duration);
}

onMounted(() => {
  startTimeout();
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
});

watch(isVisible, (newValue) => {
  if (newValue) {
    startTimeout();
  }
});
</script>

<style scoped>
.word-container {
  position: relative;
  display: inline-block;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.word-wrapper {
  position: relative;
  z-index: 10;
  display: inline-block;
  text-align: left;
  color: #212121;
}

.dark .word-wrapper {
  color: #f5f5f5; /* text-neutral-100 */
}

.word {
  display: inline-block;
  white-space: nowrap;
  opacity: 0;
  animation: fadeInWord 0.3s ease forwards;
}

.letter {
  display: inline-block;
  opacity: 0;
  animation: fadeInLetter 0.2s ease forwards;
}

.space {
  display: inline-block;
}

.v-enter-active {
  animation: enterWord 0.6s ease-in-out forwards;
}

.v-leave-active {
  animation: leaveWord 0.6s ease-in-out forwards;
}

@keyframes fadeInWord {
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeInLetter {
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes enterWord {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes leaveWord {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(2);
    filter: blur(8px);
  }
}

</style>
```

:::
