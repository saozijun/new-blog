<script setup>
import DefaultTheme from "vitepress/theme";
import { toggleDark } from "../utils/Dark";
import SplashCursor from "./SplashCursor.vue";
import ParticlesBg from "./ParticlesBg.vue";
import Music from "./Music.vue";
import Lt from "./Lt.vue";
import NavTitle from "./NavTitle.vue";
toggleDark();
const { Layout } = DefaultTheme;
</script>

<template>
  <ParticlesBg />
  <Layout>
    <template #nav-bar-title-after>
      <ClientOnly>
        <NavTitle />
      </ClientOnly>
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
