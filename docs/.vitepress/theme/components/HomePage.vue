<template>
  <div class="home-page">
    <header class="hero">
      <div class="sign-box">
        <Sign width="280px" />
      </div>
      <h1 class="tagline">A personal blog to share something interesting.</h1>
      <div>
        <span
          >嘘
          <img
            style="display: inline-block; position: relative; top: 6px"
            src="../static/xu.png"
            width="20px"
            alt=""
          />，偷偷告诉你，这里可能有：</span
        >
        <FlipWords
          :words="['技术尝试', '常用工具', '碎碎念', 'Bug记录']"
          :duration="3000"
        />
      </div>
      <div class="marquee-wrapper">
        <Marquee>
          <div class="lable-item" v-for="(v, i) in labelList" :key="i">
            {{ v }}
          </div>
        </Marquee>
      </div>
      <div class="loxbe-container">
        <Loxbe />
        <span>小监工</span>
      </div>
      <p class="description">... 站点装修中 ...</p>
    </header>
    <div class="note-main">
      <div class="new-note" ref="noteRef">
        <div class="note-box" ref="noteBoxRef">
          <div class="note-box-inner" ref="noteBoxInnerRef">
            <div v-for="note in notes" :key="note.id">
              <div class="note-item">
                <div class="note-image">
                  <img :src="note.image" :alt="note.title" />
                </div>
                <div class="note-content">
                  <div class="note-tags">
                    <span v-for="tag in note.tags" :key="tag" class="note-tag">{{
                      tag
                    }}</span>
                  </div>
                  <h3 class="note-title">{{ note.title }}</h3>
                  <p class="note-description">{{ note.description }}</p>
                </div>
              </div>
              <div class="note-item-bg"></div>
            </div>
          </div>
          <section ref="noteTitleRef">
            <p ref="noteT3Ref">最新笔记</p>
            <p ref="noteT5Ref">Latest notes</p>
          </section>
          <div class="note-box-footer" ref="noteBoxFooterRef">
            <p>最近更新时间：2025-06-23</p>
            <ButtonText text="查看更多" />
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div v-if="pvCount && uvCount">
        本站总访问量 {{ pvCount }} - 本站访客数 {{ uvCount }}
      </div>
    </div>
  </div>
  <span id="busuanzi_value_site_pv"></span>
  <span id="busuanzi_value_site_uv"></span>
  <div class="image-trail">
    <ImageTrail />
  </div>
</template>

<script setup>
import Sign from "./Sign.vue";
import Loxbe from "./Loxbe.vue";
import Marquee from "./Marquee.vue";
import FlipWords from "./FlipWords.vue";
import ImageTrail from "./ImageTrail.vue";
import ButtonText from "./ButtonText.vue";
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";
import { inBrowser } from "vitepress";
import bgImage from "../static/bg.jpg";

const notes = ref([
  {
    id: 1,
    title: "探索VitePress的奥秘",
    description:
      "VitePress 是一个基于 Vite 和 Vue 的静态站点生成器...",
    tags: ["VitePress", "Vue"],
    image: bgImage,
  },
  {
    id: 2,
    title: "深入理解GSAP动画",
    description:
      "GSAP (GreenSock Animation Platform) 是一个功能强大的JavaScript动画库...",
    tags: ["GSAP", "Animation"],
    image: bgImage,
  },
  {
    id: 3,
    title: "Vue 3 Composition API实践",
    description: "Composition API 是 Vue 3 的核心特性之一...",
    tags: ["Vue 3", "Composition API"],
    image: bgImage,
  },
  {
    id: 4,
    title: "用SCSS创造优雅的样式",
    description:
      "SCSS 是一个成熟、稳定且功能强大的专业级 CSS 扩展语言...",
    tags: ["SCSS", "CSS"],
    image: bgImage,
  },
  {
    id: 5,
    title: "React Hooks全面指南",
    description: "React Hooks 是 React 16.8 引入的新特性...",
    tags: ["React", "Hooks"],
    image: bgImage,
  },
  {
    id: 6,
    title: "Node.js后端开发入门",
    description:
      "Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时...",
    tags: ["Node.js", "Backend"],
    image: bgImage,
  },
]);
const labelList = ref([
  "CSS",
  "HTML",
  "Javascript",
  "Vitepress",
  "Vue",
  "React",
  "Springboot",
  "Python",
  "nodejs",
  "mapboxGl",
]);
const pvCount = ref(null);
const uvCount = ref(null);
const getPv = () => {
  const $PV = document.querySelector("#busuanzi_value_site_pv");
  const $UV = document.querySelector("#busuanzi_value_site_uv");
  pvCount.value = $PV.innerHTML;
  uvCount.value = $UV.innerHTML;
};
const noteRef = ref(null);
const noteBoxRef = ref(null);
const noteTitleRef = ref(null);
const noteBoxInnerRef = ref(null);
const noteItemRefs = ref([]);
const noteT3Ref = ref(null);
const noteT5Ref = ref(null);
const noteBoxFooterRef = ref(null);

onMounted(() => {
  nextTick(async () => {
    setTimeout(() => {
      getPv();
    }, 500);
    if (inBrowser) {
      let gsapCj = await import("gsap/ScrollTrigger");
      const { ScrollTrigger } = gsapCj;
      gsap.registerPlugin(ScrollTrigger);
    }
    init();
  });
});
const init = () => {
  // 创建时间轴
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: noteRef.value,
      start: "top center-=100",
      end: "+=1500",
      scrub: 1,
      anticipatePin: 1,
      pin: noteRef.value,
      // markers: true, // 调试显示
    },
  });

  // 容器动画
  tl.to(noteBoxInnerRef.value, { width: 250, duration: 3 }, 0)
    .to(
      noteBoxInnerRef.value,
      {
        rotationX: 10,
        rotationY: -400,
        rotationZ: 0,
        duration: 3,
      },
      3
    )
    .to(noteBoxInnerRef.value, { height: 210, duration: 3.5 }, 0.5);

  // 特殊动画 - 初始淡入效果
  tl.to(noteItemRefs.value[4], { opacity: 0.1, duration: 3 }, 3);

  // 使用循环为每个笔记项添加动画
  const positions = [
    { x: 300, y: 0 },
    { x: -300, y: 0 },
    { x: 0, y: 0 },
    { x: 300, y: 240 },
    { x: -300, y: 240 },
    { x: 0, y: 240 },
  ];

  const durations = [1.2, 1.6, 1.8, 2, 2.5, 2.8]; // 每个项目的动画持续时间
    let noteItem = noteBoxInnerRef.value.children;
    console.log(noteItem);
    
  // 添加所有笔记项的动画
  for (let i = 0; i < noteItem.length; i++) {
    tl.to(
      noteItem[i],
      {
        opacity: 1,
        x: positions[i].x,
        y: positions[i].y,
        duration: durations[i],
      },
      5
    );
    tl.to(
      noteItem[i].children[1],
      { opacity: 0.2, duration: 2, scale: 1, rotationX: 10 },
      6
    );
  }

  // 标题和底部动画
  tl.to(noteT3Ref.value, { opacity: 0, scale: 0, duration: 2 }, 2)
    .to(noteT5Ref.value, { opacity: 0, scale: 0, duration: 2 }, 2)
    .to(noteT3Ref.value, { opacity: 1, y: -220, duration: 2, scale: 1 }, 5)
    .to(noteT5Ref.value, { opacity: 0.2, y: -220, duration: 3, scale: 1.8 }, 5)
    .to(noteBoxFooterRef.value, { opacity: 1, y: 420, duration: 3 }, 5)
    .to(noteBoxInnerRef.value, { background: "#0000", duration: 3 }, 5)
    .to({}, { duration: 3 }, 10);
};
</script>

<style lang="scss" scoped>
.home-page {
  padding-top: 40px;
  max-width: 1152px;
  margin: 0 auto;
}

.hero {
  width: 100%;
  text-align: center;
  padding: 4rem 0;
  padding-bottom: 1rem;
}

.content {
  width: 100%;
  text-align: center;
  padding: 2rem 0;
}

.section-title {
  font-size: 2rem;
  margin: 2rem 0;
  color: var(--vp-c-text-1);
  text-align: center;
}

.sign-box {
  width: 280px;
  margin: 0 auto 2rem;
}

.tagline {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.description {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.loxbe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.marquee-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 20px;
}

#busuanzi_value_site_pv,
#busuanzi_value_site_uv {
  display: none;
}

.marquee-item {
  width: 500px;
  height: 200px;
  background-color: var(--vp-c-bg-soft);
  padding: 20px;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #cacaca45;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid var(--vp-c-brand);
  }
}

.lable-item {
  background-color: var(--vp-c-bg-soft);
  padding: 4px 20px;
  font-size: 12px;
  border-radius: 50px;
  box-shadow: 0px 3px 1px var(--vp-c-gutter);
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    box-shadow: 0px 1px 1px var(--vp-c-gutter);
  }
}

@media screen and (max-width: 1244px) {
  .marquee-wrapper {
    max-width: calc(100vw - 128px);
  }
}

@media screen and (max-width: 960px) {
  .marquee-wrapper {
    max-width: calc(100vw - 92px);
  }
}

@media screen and (max-width: 640px) {
  .marquee-wrapper {
    max-width: calc(100vw - 48px);
  }
}
.note-main {
  width: 100%;
  margin: 0 auto;
  margin-top: 300px;
}
.new-note {
  width: 100%;
  .note-box {
    max-width: 960px;
    margin: 0 auto;
    height: calc(100vh - 400px);
    position: relative;

    .note-box-inner {
      width: 100%;
      height: 500px;
      border-radius: 15px;
      background-color: #0000001f;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      > div {
        opacity: 0;
        width: 100%;
        height: 200px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        // background-color: #00000028;
        .note-item {
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
          cursor: pointer;
          background-color: var(--vp-c-bg-soft);
          border-radius: 15px;
          box-shadow: 2vw 1vw 1.3vw rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          &:hover {
            box-shadow: 2vw 1vw 1.3vw rgba(94, 94, 94, 0.11);
            transform: translateY(-5px);
            .note-image img {
              transform: scale(1.05);
            }
          }

          .note-image {
            width: 100%;
            height: 100px;
            overflow: hidden;
            flex-shrink: 0;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
          }

          .note-content {
            padding: 12px 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }

          .note-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0.2rem 0;
            color: var(--vp-c-text-1);
            line-height: 1.2;
          }

          .note-description {
            font-size: 0.8rem;
            margin: 0;
            color: var(--vp-c-text-2);
            flex-grow: 1;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .note-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
          }

          .note-tag {
            background-color: var(--vp-c-bg-mute);
            color: var(--vp-c-text-2);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 500;
          }
        }
        .note-item-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 20px;
          left: 20px;
          opacity: 0;
          transform: scale(0);
          border-radius: 15px;
          border: 2px solid var(--vp-c-text-1);
          &::after {
            width: 95%;
            height: 95%;
            content: "";
            position: absolute;
            top: 3px;
            left: 3px;
            z-index: -1;
            border-radius: 15px;
            border: 1px solid var(--vp-c-text-1);
          }
        }
      }
    }
    section {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: -50%;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      p {
        font-size: 48px;
        line-height: 1;
        &:nth-child(2) {
          opacity: 0.1;
          color: transparent;
          background-image: linear-gradient(
            180deg,
            var(--vp-c-text-1) 0%,
            transparent 100%
          );
          z-index: -2;
          background-clip: text;
          font-weight: bold;
          -webkit-background-clip: text;
          font-size: 50px;
        }
      }
    }
  }
}

.image-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 30vh;
  // pointer-events: none;
}
.note-box-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  div {
    cursor: pointer;
  }
}
</style>
