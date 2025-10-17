<template>
  <div class="home-page">
    <div class="image-trail">
      <ImageTrail />
    </div>
    <header class="hero" data-fades style="--lv: 0">
      <div class="hero-content">
        <div class="sign-box">
          <Sign />
        </div>
        <h1 class="tagline">{{ tagline }}</h1>
        <div class="subtitle">
          <span
            >嘘
            <img
              style="display: inline-block; position: relative; top: 6px"
              src="../static/xu.webp"
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
        <Loxbe />
        <div class="about-me-section">
          <div class="about-me-header">
            <div class="line"></div>
            <h2>关于我</h2>
            <div class="line"></div>
          </div>

          <div class="about-me-content">
            <div class="about-me-card">
              <div class="hobby-icons">
                <div
                  class="hobby-icon"
                  v-for="(hobby, index) in hobbies"
                  :key="index"
                >
                  <div class="icon-wrapper">
                    <span>{{ hobby.icon }}</span>
                  </div>
                  <span>{{ hobby.name }}</span>
                </div>
              </div>

              <div class="about-me-bio">
                <p>{{ bio }}</p>
              </div>

              <div class="social-links">
                <a
                  v-for="(social, index) in socialLinks"
                  :key="index"
                  :href="social.link"
                  target="_blank"
                  :title="social.name"
                >
                  {{ social.name }}
                </a>
              </div>
              <div>
                <div style="opacity: 0.5; font-size: 12px; margin-bottom: 4px">
                  - 技术栈 -
                </div>
                <Marquee>
                  <div class="lable-item" v-for="(v, i) in techStack" :key="i">
                    {{ v }}
                  </div>
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-more">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
    <div class="test-container">
      <Test :list="notes" />
    </div>
    <div class="mobile-only max-container" >
      <NotesMobile :notes="notes" />
    </div>
    <div class="desktop-only max-container">
      <NotesDesktop :notes="notes" />
    </div>
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
import Test from "./Test.vue";

import { ref, onMounted, onUnmounted } from "vue";
import { data } from "../utils/post.data";
import { bio, hobbies, socialLinks, techStack, tagline } from '../utils/home.config.js';

const notes = ref([]);
const progressHeight = ref("0px");

const handleScroll = () => {
  const totalScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  if (totalScroll <= 0) {
    progressHeight.value = "0px";
    return;
  }
  const currentScroll = window.scrollY;
  const scrollFraction = currentScroll / totalScroll;
  const mouseInnerHeight = 38; // 42px total height - 2*2px border
  const newHeight = scrollFraction * mouseInnerHeight;
  progressHeight.value = `${Math.min(newHeight, mouseInnerHeight)}px`;
};



// 获取最新的6篇文章
const getLatestPosts = () => {
  if (data && data.length) {
    notes.value = data.slice(0, 6)
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getLatestPosts();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
}

.image-trail{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 40vh;
  overflow: hidden;
  box-sizing: border-box;
}

.max-container {
  max-width: 1152px;
  margin: 0 auto;
}
.test-container {
  width: 100%;
  overflow: hidden;
}
.hero {
  width: 100%;
  min-height: calc(100vh - 53px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2rem;
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: var(--vp-c-text-1);
  width: 100%;
  max-width: 1000px;
}

.subtitle {
  color: var(--vp-c-text-2);
}

.content {
  width: 100%;
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-1);
}

.sign-box {
  width: 340px;
  margin: 0 auto;
}

.tagline {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  line-height: 1.3;
}

.description {
  display: none;
}

.about-me-section {
  width: 100%;
}

.about-me-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0 1rem;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .line {
    height: 1px;
    flex-grow: 1;
    background: linear-gradient(
      90deg,
      transparent,
      var(--vp-c-divider),
      transparent
    );
    max-width: 120px;
  }
}

.about-me-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.about-me-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .8rem;
  // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  // border: 1px solid var(--vp-c-divider);
}

.hobby-icons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.hobby-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--vp-c-brand-lighter);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    span {
      font-size: 1.5rem;
    }
  }

  span {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
  }
}

.about-me-bio {
  text-align: center;
  max-width: 650px;
  margin: 0 auto;

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--vp-c-text-2);
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  a {
    width: 40px;
    font-size: 12px;
    transition: all 0.3s ease;
    &:hover {
      text-decoration: underline !important;
    }
  }
}

.loxbe-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  opacity: 0.8;
  margin-top: 1rem;
}

.marquee-wrapper {
  width: 100%;
  max-width: 100%;
  padding: 0;
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

.scroll-down-indicator {
  position: fixed;
  bottom: 1rem;
  right: 50%;
  transform: translateX(50%);
  cursor: pointer;
  z-index: 9999;
}

.mouse {
  width: 25px;
  height: 42px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 80px;
  position: relative;
  overflow: hidden;
}

.wheel {
  width: 4px;
  height: 10px;
  background: var(--vp-c-bg-soft);
  border-radius: 50px;
  position: absolute;
  top: 8px;
  left: 52%;
  transform: translateX(-50%);
  animation: scroll-wheel 2s ease-in-out infinite;
}

@keyframes scroll-wheel {
  from {
    opacity: 1;
    top: 8px;
  }
  to {
    opacity: 0;
    top: 28px;
  }
}

.page-more {
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--vp-c-text-1);
  margin-top: 10px;
  span {
    content: "";
    display: block;
    box-sizing: content-box;
    width: 20px;
    height: 20px;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0) 50%, transparent 50%);
    border-bottom: 1px solid var(--vp-c-text-1);
    border-left: 1px solid var(--vp-c-text-1);
    transform: rotate(-45deg);
    animation: arrowMove1 1s infinite;
    flex-shrink: 0;
    position: relative;

    &:nth-child(2) {
      animation: arrowMove2 1s infinite;
      top: -12px;
    }

    &:nth-child(3) {
      animation: arrowMove3 1s infinite;
      top: -24px;
    }
  }
}
@keyframes arrowMove1 {
    0% {
        transform: translateY(0) rotate(-45deg);
        opacity: 0.9;
    }

    100% {
        transform: translateY(10px) rotate(-45deg);
        opacity: 0.6;
    }
}

@keyframes arrowMove2 {
    0% {
        transform: translateY(0) rotate(-45deg);
        opacity: 0.6;
    }

    100% {
        transform: translateY(10px) rotate(-45deg);
        opacity: 0.3;
    }
}

@keyframes arrowMove3 {
    0% {
        transform: translateY(0) rotate(-45deg);
        opacity: 0.3;
    }

    100% {
        transform: translateY(10px) rotate(-45deg);
        opacity: 0;
    }
}

@media screen and (max-width: 768px) {
  .tagline {
    font-size: 1.5rem;
  }
}
.mobile-only {
  display: none;
}
.gallery-wrapper {
  height: 60vh;
  margin-top: -120px;
  position: relative;
}

@media screen and (max-width: 1244px) {
  .marquee-wrapper {
    max-width: 100%;
  }
  .tagline {
    font-size: 1.6rem;
  }
  .sign-box {
    width: 180px;
  }
  .about-me-card {
    padding: 1.2rem;
  }
}

@media screen and (max-width: 960px) {
  .test-container {
    display: none;
  }
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
  .marquee-wrapper {
    max-width: 100%;
  }
  .gallery-wrapper {
    height: 40vh;
    margin-top: -80px;
  }

  .hobby-icons {
    gap: 1rem;
  }

  .hobby-icon .icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .social-links a {
    width: 36px;
  }

  .about-me-bio p {
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 640px) {
  .marquee-wrapper {
    max-width: 100%;
  }
  .content {
    font-size: 14px;
  }
  .sign-box {
    width: 160px;
  }
  .about-me-card {
    padding: 1rem;
  }

  .hobby-icons {
    gap: 0.8rem;
  }

  .hobby-icon .icon-wrapper {
    width: 36px;
    height: 36px;

    span {
      font-size: 1.2rem;
    }
  }

  .hobby-icon span {
    font-size: 0.7rem;
  }

  .social-links {
    gap: 0.8rem;

    a {
      width: 32px;
      i {
        font-size: 1rem;
      }
    }
  }

  .about-me-bio p {
    font-size: 0.8rem;
  }
}
</style>
