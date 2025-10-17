<template>
  <a href="#" :class="className" class="menu__link">{{text}}</a>
</template>

<script setup>
let props = defineProps({
  text: {
    type: String,
    default: "按钮",
  },
  className: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>

a {
  text-decoration: none;
  font-size: .9rem;
}
.menu__link {
  color: var(--vp-c-text-1);
  line-height: 2;
  position: relative;
}

.menu__link::before {
  content: '';
  width: 0;
  height: 2px;
  border-radius: 2px;
  background-color: var(--vp-c-brand);
  position: absolute;
  bottom: -.05rem;
  right: 0;
  transition: right .4s, width .4s, left .4s;
}

.menu__link:hover {
  color: var(--vp-c-brand);
  &::before {
    width: 100%;
    left: 0;
  }
}
</style>
