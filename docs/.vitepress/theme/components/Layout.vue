<script setup>
import DefaultTheme from "vitepress/theme";
import { toggleDark } from "../utils/Dark";
import SplashCursor from "./SplashCursor.vue";
import Progress from "./Progress.vue";
import Music from "./Music.vue";
import Lt from "./Lt.vue";
import NavTitle from "./NavTitle.vue";

toggleDark();
const { Layout } = DefaultTheme;
</script>

<template>
  <Progress />
  <Layout>
    <template #nav-bar-title-after>
      <ClientOnly>
        <NavTitle />
      </ClientOnly>
    </template>
    <template #layout-bottom>
      <Music />
      <SplashCursor />
    </template>
    <template #aside-outline-before>
      <Lt />
    </template>
  </Layout>
</template>
