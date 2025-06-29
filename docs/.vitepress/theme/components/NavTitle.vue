<template>
    <div class="title">
        <img width="50px" :src="theme == 'dark' ? wSign : sign" alt="" />
        <img width="30px" style="position: relative; top: -2px" src="../static/xiaoxin.gif" alt="" />
    </div>
</template>

<script setup>
import sign from "../static/sign.png";
import wSign from "../static/w-sign.png";
import { useData, inBrowser } from "vitepress";
import { computed } from "vue";
const { isDark } = useData();
const theme = computed(() => (inBrowser ? isDark.value ? 'dark' : 'light' : undefined))
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  overflow: hidden;
}
</style>