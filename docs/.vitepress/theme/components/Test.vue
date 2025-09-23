<template>
  <div class="t-main">
    <div class="t-container" ref="containerRef">
      <div class="list" ref="listRef">
        <div class="item" v-for="(item, index) in list" :key="index" @click="toPage(item.url)">
          <video v-if="item.type == 'video'" :src="item.src" muted loop autoplay playsinline></video>
          <img v-else :src="item.src" alt="" />
          <div class="mask" ref="maskRef"></div>
          <div class="text-info" ref="textInfoRef">
            <p>{{ item.title }}</p>
            <span>{{ item.desc }}</span>
          </div>
        </div>
      </div>
      <div class="text" ref="textRef">项目练习 - DEMO</div>
      <div class="text2" ref="text2Ref">
        {{ currentText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { inject } from "vue";
import t21 from "../static/test/t21.webp";
import t22 from "../static/test/t22.webp";
import t23 from "../static/test/t23.webp";
const gsap = inject("gsap");
const containerRef = ref(null);
const listRef = ref(null);
const textRef = ref(null);
const text2Ref = ref(null);
const textInfoRef = ref(null);
const maskRef = ref(null);
const currentText = ref("cesium 大屏");
let list = [{
  type: "image",
  src: t22,
  title: "cesium 大屏",
  url: "https://bay.saozijun.top/",
  desc: "使用 cesium 实现的三维大屏展示,实现了涟漪动画标点，弹窗展示; 多个定制化可视化组件, python 结合 ffmpeg 实现视频流rtmp转码",
}, {
  type: "image",
  src: t21,
  title: "cesium 模型加载及航线规划",
  url: "https://cesium.saozijun.top/",
  desc: "使用 cesium 实现的无人机模型加载及航线展示, 实现了模型的动态加载和航线的可视化展示",
}, {
  type: "image",
  src: t23,
  title: "three.js 房屋模型",
  url: "https://threedemo.saozijun.top/",
  desc: "使用 three.js 实现的房屋模型加载及展示, 实现了模型的动态加载和交互展示",
}];

onMounted(() => {
  nextTick(() => {
    init();
  });
});

const toPage = (url) => {
  window.open(url);
};

const init = () => {
  let item = listRef.value.children;
  let itemWidth = item[1].offsetWidth; // 获取列表项宽度
  // 创建时间轴
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: listRef.value,
      start: "center center",
      end: "+=2800",
      scrub: 1,
      anticipatePin: 1,
      pin: containerRef.value,
      // markers: true, // 调试显示
      onUpdate: (self) => {
        const currentX = parseFloat(gsap.getProperty(listRef.value, "x")) || 0;
        const itemWithGap = itemWidth + 40; // item 宽度 + 间隙
        const firstItemHalfWidth = itemWidth / 2; // 第一个 item 的一半宽度
        let currentIndex;
        // 如果偏移量还未超过第一个 item 的一半，保持索引 0
        if (Math.abs(currentX) < firstItemHalfWidth) {
          currentIndex = 0;
        }
        else {
          currentIndex = Math.min(
            Math.floor(
              (Math.abs(currentX) - firstItemHalfWidth) / itemWithGap
            ) + 1,
            item.length - 1
          );
        }

        currentText.value = list[currentIndex].title;
      },
    },
  });
  tl2.to(item[0], { scale: 1, duration: 0.2 }, 0);
  tl2.to(textRef.value, { scale: 0.5, duration: 0.1 }, 0);
  tl2.to(textRef.value, { scale: 0.20, y: "-55%", duration: 0.1 }, 0.1);
  tl2.to(maskRef.value, { opacity: 1, duration: 0.1}, 0.1);
  tl2.to(textInfoRef.value, { opacity: 1, x: 0, duration: 0.1}, 0.1);
  tl2.to(text2Ref.value, { opacity: 1, y: 50, duration: 0.05 }, 0.15);
  // 计算平移值 列表项宽度 * 列表项数量 - 盒子之间间隔 * 列表项数量（需要减去一个，不然全部滑过头嘞）
  tl2.to(
    listRef.value,
    { x: -((item.length - 1) * itemWidth + (item.length - 1) * 40) },
    0.24
  );
};
</script>

<style lang="scss" scoped>
.t-main {
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 140px;
  padding-bottom: 140px;
  .t-container {
    width: 100%;
    position: relative;
    .text,
    .text2 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 8rem;
      mix-blend-mode: difference;
      pointer-events: none;
    }
    .text{
      min-width: fit-content !important;
    }
    .text2 {
      font-size: 2rem;
      width: 100%;
      height: 100%;
      align-items: flex-end;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, 100px);
    }
    .mask{
      position: absolute;
      top: -70%;
      left: -40%;
      width: 150%;
      height: 100%;
      opacity: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 90%);
      transform: rotate(134deg);
      z-index: 1;
    }
    .text-info{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 1.7rem;
      z-index: 2;
      padding: 10px 30px;
      color: #fff;
      opacity: 0;
      line-height: 1.8;
      transform: translateX(-50px);
      span{
        width: 280px;
        display: block;
        color: #dadada;
        font-size: 1rem;
      }
    }
    .list {
      width: 100%;
      height: 70vh;
      position: relative;
      display: flex;
      align-items: center;
      gap: 40px;
      .item {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        flex-shrink: 0;
        background: #0000002a;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: opacity 0.3s ease-in-out;
        &:nth-child(1) {
          transform: scale(2);
          z-index: 111;
        }
        &:hover {
          opacity: 0.95;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
      }
    }
  }
}
@media screen and (max-width: 960px) {
  .t-main {
    margin-top: 280px;
  }
}
</style>
