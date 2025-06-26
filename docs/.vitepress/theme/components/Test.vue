<template>
  <div class="t-main">
    <div class="t-container" ref="containerRef">
      <div class="list" ref="listRef">
        <div class="item" v-for="v in 6"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { inject } from 'vue'
const gsap = inject('gsap')
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});

const containerRef = ref(null);
const listRef = ref(null);

onMounted(() => {
  nextTick(() => {
    init();
  });
});

const init = () => {
  // 创建时间轴
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: listRef.value,
      start: "center center",
      end: "+=2400",
      scrub: 1,
      anticipatePin: 1,
      pin: containerRef.value,
      // markers: true, // 调试显示
    },
  });
  let item = listRef.value.children;
  tl2.to(item[0], { scale: 1, duration: 0.5}, 0);
  tl2.to(listRef.value, { x: -((item.length + 1) * 800 + ((item.length + 3) * 40)) }, 0.54);
};
</script>

<style lang="scss" scoped>
.t-main {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 180px;
  padding-bottom: 150px;
  .t-container{
    width: 100%;
    .list{
      width: 100%;
      height: 65vh;
      position: relative;
      display: flex;
      align-items: center;
      gap: 40px;
      .item{
        width: 100%;
        height: 100%;
        border-radius: 10px;
        flex-shrink: 0;
        background: #0000002a;
        &:nth-child(1){
          transform: scale(1.7);
        }
      }
    }
  }
}
</style> 