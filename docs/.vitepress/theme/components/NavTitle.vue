<template>
    <div class="title">
        <img width="50px" v-bind:src="imgSrc" alt="" />
        <img width="30px" style="position: relative; top: -2px" src="../static/xiaoxin.gif" alt="" />
    </div>
</template>

<script setup>
import sign from "../static/sign.png";
import wSign from "../static/w-sign.png";
import { useData } from "vitepress";
import { computed, ref, onMounted, watch } from "vue";

const { isDark } = useData();
const img = computed(() => isDark.value ? wSign : sign);
const imgSrc = ref(sign); // 默认使用light模式图片

// 在客户端挂载后更新图片源
onMounted(() => {
    imgSrc.value = isDark.value ? wSign : sign;
});

// 监听暗黑模式变化
watch(isDark, (newVal) => {
    imgSrc.value = newVal ? wSign : sign;
}, { immediate: true });
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