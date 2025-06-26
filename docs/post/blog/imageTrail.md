---
layout: doc
title: 图片路径跟随 📷
description: 跟随鼠标移动的图片拖尾效果，配置简单，二改非常方便！ 📷
category: 技术
tags:
  - Vue
  - 炫酷组件
---

<script setup>
    import ImageTrail from '../../.vitepress/theme/components/ImageTrail.vue'
</script>

# 图片路径跟随

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

## 灵感与参考

[React Bits](https://www.reactbits.dev/animations/image-trail) 