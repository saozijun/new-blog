<template>
  <div
    class="progress-to-top"
    :class="{ 'show': showProgress }"
    @click="scrollToTop"
  >
    <svg class="progress-circle" width="50" height="50" viewBox="0 0 50 50">
      <circle class="progress-bg" cx="25" cy="25" r="22.5" />
      <circle
        ref="progressFill"
        class="progress-fill"
        cx="25"
        cy="25"
        r="22.5"
      />
    </svg>
    <svg class="arrow-icon" width="24" height="24" viewBox="0 0 24 24">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showProgress = ref(false);
const progressFill = ref(null);

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  const circleElement = progressFill.value;
  if (!circleElement) return;

  const radius = circleElement.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
  circleElement.style.strokeDashoffset = String(circumference);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    showProgress.value = window.scrollY > 200;

    if (scrollHeight > 0) {
      const scrollProgress = Math.min(window.scrollY / scrollHeight, 1);
      const offset = circumference * (1 - scrollProgress);
      circleElement.style.strokeDashoffset = String(offset);
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style lang="scss" scoped>
.progress-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 40px;
  height: 40px;
  z-index: 100;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  box-shadow: var(--vp-shadow-3);

  background-color: var(--vp-c-bg-soft-alpha);
  @supports (backdrop-filter: blur(8px)) {
    backdrop-filter: blur(8px);
  }

  opacity: 0;
  transform: scale(0.8) translateY(20px);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.show {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }
}

.progress-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 4;
}

.progress-fill {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

.arrow-icon {
  width: 22px;
  height: 22px;
  stroke: var(--vp-c-brand-1);
  stroke-width: 2;
  fill: none;
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.progress-to-top:hover .arrow-icon {
  transform: translateY(-3px);
}
</style>
