<script setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { toggleDark } from "../utils/Dark";
import SplashCursor from "./SplashCursor.vue";
import ParticlesBg from "./ParticlesBg.vue";
import Music from "./Music.vue";
import Lt from "./Lt.vue";
import sign from "../static/sign.png";
import wSign from "../static/w-sign.png";
const { isDark } = useData();
toggleDark();
const { Layout } = DefaultTheme;
</script>

<template>
  <ParticlesBg />
  <Layout>
    <template #nav-bar-title-after>
      <div class="title">
        <img width="50px" :src="isDark ? wSign : sign" alt="" />
        <img width="30px" style="position: relative; top: -2px" src="../static/xiaoxin.gif" alt="" />
      </div>
    </template>
    <template #layout-bottom>
      <ClientOnly>
        <Music />
        <SplashCursor />
      </ClientOnly>
    </template>
    <template #aside-outline-before>
      <ClientOnly>
        <Lt />
      </ClientOnly>
    </template>
  </Layout>
</template>

<style scoped>
.title{
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  overflow: hidden;
}
</style>
