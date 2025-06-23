<template>
  <div class="container" :class="className">
    <button class="button">{{ text }}</button>
    <span class="arrow first">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
        ></path>
      </svg>
    </span>
    <span class="arrow second">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
        ></path>
      </svg>
    </span>
    <span class="arrow third">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
        ></path>
      </svg>
    </span>
  </div>
</template>

<script setup>
import { ref } from "vue";
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
.button {
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.5em;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.arrow {
  fill: var(--vp-c-text-1);
  position: absolute;
  pointer-events: none;
  width: 24px;
  right: 0;
  top: 30%;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.button:hover {
  letter-spacing: 2px;
}

.button:hover ~ .second {
  opacity: 0.66;
  right: -20px;
  transition-delay: 50ms;
}

.button:hover ~ .third {
  opacity: 0.33;
  right: -40px;
  transition-delay: 100ms;
}

.second,
.third {
  opacity: 0;
}
</style>
