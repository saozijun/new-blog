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
            data-no-fancybox
          />，偷偷告诉你，这里可能有：</span
        >
        <FlipWords
          :words="['AI探索', '常用工具', '日常笔记', 'Bug记录']"
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
    
    <!-- Desktop version (shown only on larger screens) -->
    <div class="desktop-only">
      <NotesDesktop :notes="notes" />
    </div>
    
    <!-- Mobile version (shown only on smaller screens) -->
    <div class="mobile-only">
      <NotesMobile :notes="notes" />
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
import NotesDesktop from "./NotesDesktop.vue";
import NotesMobile from "./NotesMobile.vue";
import { ref, onMounted, nextTick } from "vue";
import bgImage from "../static/note-bg3.jpg";

const notes = ref([
  {
    id: 1,
    title: "探索VitePress的奥秘",
    description: "VitePress 是一个基于 Vite 和 Vue 的静态站点生成器...",
    tags: ["VitePress", "Vue"],
    image: bgImage,
    updateDate: "2024-07-21",
  },
  {
    id: 2,
    title: "深入理解GSAP动画",
    description:
      "GSAP (GreenSock Animation Platform) 是一个功能强大的JavaScript动画库...",
    tags: ["GSAP", "Animation"],
    image: bgImage,
    updateDate: "2024-07-22",
  },
  {
    id: 3,
    title: "Vue 3 Composition API实践",
    description: "Composition API 是 Vue 3 的核心特性之一...",
    tags: ["Vue 3", "Composition API"],
    image: bgImage,
    updateDate: "2024-07-23",
  },
  {
    id: 4,
    title: "用SCSS创造优雅的样式",
    description: "SCSS 是一个成熟、稳定且功能强大的专业级 CSS 扩展语言...",
    tags: ["SCSS", "CSS"],
    image: bgImage,
    updateDate: "2024-07-24",
  },
  {
    id: 5,
    title: "React Hooks全面指南",
    description: "React Hooks 是 React 16.8 引入的新特性...",
    tags: ["React", "Hooks"],
    image: bgImage,
    updateDate: "2024-07-25",
  },
  {
    id: 6,
    title: "Node.js后端开发入门",
    description: "Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时...",
    tags: ["Node.js", "Backend"],
    image: bgImage,
    updateDate: "2024-07-26",
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

onMounted(() => {
  nextTick(async () => {
    setTimeout(() => {
      getPv();
    }, 500);
  });
});
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

// Responsive classes
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.image-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: 30vh;
  overflow: hidden;
}

// Media queries for responsive display
@media screen and (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
  
  .tagline {
    font-size: 1.5rem;
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
  .content{
    font-size: 14px;
  }
}
</style>
