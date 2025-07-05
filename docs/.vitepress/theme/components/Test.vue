<template>
  <div class="t-main">
    <div class="t-container" ref="containerRef">
      <div class="list" ref="listRef">
        <div class="item" v-for="(item, index) in list" :key="index">
          <video v-if="item.type == 'video'" :src="item.src" muted loop autoplay playsinline></video>
          <img v-else :src="item.src" alt="" />
          <div class="mask" ref="maskRef"></div>
          <div class="text-info" ref="textInfoRef">
            <p>标题 {{ index + 1 }}</p>
            <span>我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述我是描述</span>
          </div>
        </div>
      </div>
      <div class="text" ref="textRef">GSAP-模块测试</div>
      <div class="text2" ref="text2Ref">
        {{ currentText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { inject } from "vue";
import t1 from "../static/test/t1.mp4";
import t2 from "../static/test/t2.webp";
import t3 from "../static/test/t3.mp4";
import t4 from "../static/test/t4.webp";
import t5 from "../static/test/t5.mp4";
import t6 from "../static/test/t6.webp";
const gsap = inject("gsap");
const containerRef = ref(null);
const listRef = ref(null);
const textRef = ref(null);
const text2Ref = ref(null);
const textInfoRef = ref(null);
const maskRef = ref(null);
const currentText = ref("图1");
let list = [{
  type: "video",
  src: t1,
}, {
  type: "image",
  src: t2,
}, {
  type: "video",
  src: t3,
}, {
  type: "image",
  src: t4,
}, {
  type: "video",
  src: t5,
}, {
  type: "image",
  src: t6,
}];

onMounted(() => {
  nextTick(() => {
    init();
  });
});

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
        // 否则，计算后续索引（减去第一个 item 的一半偏移量）
        else {
          currentIndex = Math.min(
            Math.floor(
              (Math.abs(currentX) - firstItemHalfWidth) / itemWithGap
            ) + 1,
            item.length - 1
          );
        }

        currentText.value = `图${currentIndex + 1}`;
      },
    },
  });
  tl2.to(item[0], { scale: 1, duration: 0.2 }, 0);
  tl2.to(textRef.value, { scale: 0.5, duration: 0.1 }, 0);
  tl2.to(textRef.value, { scale: 0.25, y: -350, duration: 0.1 }, 0.1);
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
  margin-top: 240px;
  padding-bottom: 150px;
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
      top: -320px;
      left: -449px;
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
      font-size: 2rem;
      z-index: 2;
      padding: 26px 40px;
      color: #fff;
      opacity: 0;
      line-height: 1.8;
      transform: translateX(-50px);
      span{
        width: 280px;
        display: block;
        color: #999;
        font-size: 1.2rem;
      }
    }
    .list {
      width: 100%;
      height: 630px;
      position: relative;
      display: flex;
      align-items: center;
      gap: 40px;
      .item {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        flex-shrink: 0;
        background: #0000002a;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        &:nth-child(1) {
          transform: scale(1.7);
          z-index: 111;
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
