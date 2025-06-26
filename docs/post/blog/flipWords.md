---
layout: doc
title: 文字轮播渐入渐出
description: 轮播文字显示，移出和移入有一种模糊效果！看起来杠杠高级 💪
category: 组件
tags:
  - Vue
  - 炫酷组件
---

<script setup>
    import FlipWords from '../../.vitepress/theme/components/FlipWords.vue'
</script>

# 文字轮播渐入渐出

# 效果展示

我的站点酷嘛~ 👉 <FlipWords :words="['酷！酷！酷！','超级酷！', '酷毙了！', '酷到爆了！']" :duration="3000" />

::: details 点我查看组件代码

```js [FlipWords.vue]
<template>
  <div class="word-container">
    <Transition
      @after-enter="$emit('animationStart')"
      @after-leave="$emit('animationComplete')"
    >
      <div v-show="isVisible" :class="['word-wrapper', props.class]">
        <template
          v-for="(wordObj, wordIndex) in splitWords"
          :key="wordObj.word + wordIndex"
        >
          <span
            class="word"
            :style="{
              animationDelay: `${wordIndex * 0.3}s`,
            }"
          >
            <span
              v-for="(letter, letterIndex) in wordObj.letters"
              :key="wordObj.word + letterIndex"
              class="letter"
              :style="{
                animationDelay: `${wordIndex * 0.3 + letterIndex * 0.05}s`,
              }"
            >
              {{ letter }}
            </span>
            <span class="space">&nbsp;</span>
          </span>
        </template>
      </div>
    </Transition>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

interface Props {
  words: string[];
  duration?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  class: "",
});

defineEmits(["animationStart", "animationComplete"]);

const currentWord = ref(props.words[0]);
const isVisible = ref(true);
const timeoutId = ref<number | null>(null);

function startAnimation() {
  isVisible.value = false;

  setTimeout(() => {
    const currentIndex = props.words.indexOf(currentWord.value);
    const nextWord = props.words[currentIndex + 1] || props.words[0];
    currentWord.value = nextWord;
    isVisible.value = true;
  }, 600);
}

const splitWords = computed(() => {
  return currentWord.value.split(" ").map((word) => ({
    word,
    letters: word.split(""),
  }));
});

function startTimeout() {
  timeoutId.value = window.setTimeout(() => {
    startAnimation();
  }, props.duration);
}

onMounted(() => {
  startTimeout();
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
});

watch(isVisible, (newValue) => {
  if (newValue) {
    startTimeout();
  }
});
</script>

<style scoped>
.word-container {
  position: relative;
  display: inline-block;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.word-wrapper {
  position: relative;
  z-index: 10;
  display: inline-block;
  text-align: left;
  color: #212121;
}

.dark .word-wrapper {
  color: #f5f5f5; /* text-neutral-100 */
}

.word {
  display: inline-block;
  white-space: nowrap;
  opacity: 0;
  animation: fadeInWord 0.3s ease forwards;
}

.letter {
  display: inline-block;
  opacity: 0;
  animation: fadeInLetter 0.2s ease forwards;
}

.space {
  display: inline-block;
}

.v-enter-active {
  animation: enterWord 0.6s ease-in-out forwards;
}

.v-leave-active {
  animation: leaveWord 0.6s ease-in-out forwards;
}

@keyframes fadeInWord {
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeInLetter {
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes enterWord {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes leaveWord {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(2);
    filter: blur(8px);
  }
}

</style>
```

:::
