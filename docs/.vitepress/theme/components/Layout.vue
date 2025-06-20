<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { toggleDark } from "../utils/Dark";
import SplashCursor from "./SplashCursor.vue";
import ParticlesBg from "./ParticlesBg.vue";
import Lt from "./Lt.vue";
const { isDark } = useData();
toggleDark();
const { Layout } = DefaultTheme;
</script>

<template>
  <ParticlesBg />
  <Layout>
    <template #nav-bar-title-after>
      <div style="display: flex; align-items: center; gap: 10px">
        <img width="50px" :class="{ darkImg: isDark }" src="../static/sign.svg" alt="" />
        <img width="30px" style="position: relative; top: -2px" src="../static/xiaoxin.gif" alt="" />
      </div>
    </template>
    <template #layout-bottom>
      <ClientOnly>
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
.darkImg {
  transform: translateY(-200px);
  filter: drop-shadow(#fff 0 200px);
}
</style>
