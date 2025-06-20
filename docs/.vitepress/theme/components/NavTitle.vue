<template>
    <div class="title">
        <img width="50px" v-bind:src="img" alt="" />
        {{ img }}
        <img width="30px" style="position: relative; top: -2px" src="../static/xiaoxin.gif" alt="" />
    </div>
</template>

<script setup>
import sign from "../static/sign.png";
import wSign from "../static/w-sign.png";
import { useData } from "vitepress";
import { computed } from "vue";
const { isDark } = useData();
const img = computed(()=>{
    console.log(isDark.value ? wSign : sign);
    
    return isDark.value ? wSign : sign;
})
console.log("isDark", isDark.value);
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