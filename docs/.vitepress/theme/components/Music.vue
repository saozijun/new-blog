<script lang="ts" setup>
import "aplayer/dist/APlayer.min.css";
import { onMounted, ref, nextTick, onBeforeUnmount } from "vue";
import { inBrowser } from "vitepress";
import staticMusicList from "../utils/music";

// 类型定义
interface Track {
  id: number;
  name: string;
  artist: string;
  url: string;
  cover: string;
  lrc: string;
}

interface APlayerInstance {
  container: HTMLElement;
  audio: any;
  list: {
    clear: () => void;
    add: (list: Track[]) => void;
    switch: (index: number) => void;
  };
  on: (event: string, callback: () => void) => void;
  play: () => void;
  pause: () => void;
}

// 响应式引用
const aplayer = ref<HTMLElement | null>(null);
const ap = ref<APlayerInstance | null>(null);
const isShown = ref<boolean>(false);
const audioList = ref<Track[]>([]);

const initializePlayer = async (tracks: Track[]) => {
  if (!inBrowser || !tracks.length || !tracks[0].url) return;
  
  try {
    const APlayerModule = await import("aplayer");
    const APlayer = APlayerModule.default;
    
    if (!aplayer.value) return;
    
    ap.value = new APlayer({
      container: aplayer.value,
      audio: tracks,
      fixed: true,
      autoplay: false,
      lrcType: 1,
      theme: "#47ba86",
    });
    
    setupEventListeners();
  } catch (error) {
    console.error("初始化播放器失败:", error);
  }
};

// 事件处理函数
const setupEventListeners = () => {
  if (!ap.value) return;
  
  nextTick(() => {
    const switcherElement = document.querySelector(".aplayer-miniswitcher");
    if (switcherElement) {
      switcherElement.addEventListener("click", handleSwitcherClick);
    }
    updatePlayerPosition();
  });
  
  ap.value.on("canplay", handleCanPlay);
  ap.value.on("error", handlePlayError);
};

const handleCanPlay = () => {
  // 静态数据已经包含歌词，不需要再获取
};

const handlePlayError = () => {
  // 处理播放错误（如有需要）
};

const handleSwitcherClick = () => {
  isShown.value = !isShown.value;
  updatePlayerPosition();
};

const updatePlayerPosition = () => {
  const playerBody = document.querySelector(".aplayer-body") as HTMLElement;
  if (!playerBody) return;
  
  const isNarrowScreen = document.body.clientWidth < 1000;
  playerBody.style.width = isNarrowScreen ? "calc(100% - 40px)" : "400px";
  playerBody.style.left = (isNarrowScreen && !isShown.value) ? "-66px" : "0";
};

const handleResize = () => {
  nextTick(updatePlayerPosition);
};

// 生命周期钩子
onMounted(async () => {
  try {
    // 使用静态音乐列表
    audioList.value = staticMusicList([]);
    
    // 初始化播放器
    await initializePlayer(audioList.value);
  } catch (error) {}
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  const switcherElement = document.querySelector(".aplayer-miniswitcher");
  if (switcherElement) {
    switcherElement.removeEventListener("click", handleSwitcherClick);
  }
});

// 添加窗口大小变化监听
if (inBrowser) {
  window.addEventListener("resize", handleResize);
}
</script>

<template>
  <div class="box">
    <div ref="aplayer" id="aplayer"></div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.aplayer.aplayer-fixed .aplayer-body) {
  bottom: 100px;
  left: 0;
  background: #fff0;
  overflow: hidden;
}

:deep(.aplayer .aplayer-list ol li) {
  background-color: var(--vp-c-bg);
  border-top: 1px solid #e9e9e930;
  &:first-child{
    border-top: none;
  }
  &:hover {
    background-color: var(--vp-c-green-soft);
    color: #47ba86;
  }
}
aplayer-list-author
:deep(.aplayer .aplayer-list ol li.aplayer-list-light) {
  background-color: var(--vp-c-bg);
  color: #47ba86;
}
:deep(.aplayer .aplayer-list ol li.aplayer-list-light .aplayer-list-author) {
  line-height: auto;
}
:deep(.aplayer) {
  background: none;
}

:deep(.aplayer.aplayer-fixed .aplayer-list) {
  position: relative;
  bottom: 100px;
  border: none;
}

:deep(.aplayer.aplayer-fixed .aplayer-info) {
  border-bottom: 1px solid var(--vp-c-bg-mute);
  border-top: 1px solid var(--vp-c-bg-mute);
  background-color: var(--vp-c-bg);
  opacity: .7;
}
:deep(.aplayer .aplayer-miniswitcher .aplayer-icon) {
  background-color: var(--vp-c-bg);
  opacity: .7;
}


:deep(.aplayer .aplayer-miniswitcher) {
  background: var(--vp-c-bg-mute);
}

:deep(.aplayer.aplayer-fixed .aplayer-lrc) {
  bottom: 28px;
  left: 30px;
  right: auto;
  text-shadow: none;
}

:deep(.aplayer .aplayer-lrc p) {
  color: #47ba86;
}

@media screen and (max-width: 1000px) {
  :deep(.aplayer.aplayer-fixed .aplayer-body) {
    bottom: 20px;
  }

  :deep(.aplayer.aplayer-fixed .aplayer-info) {
    background-color: var(--vp-c-bg);
    opacity: 1;
  }

  :deep(.aplayer .aplayer-list ol li) {
    &:hover {
      background: #ffffff91;
      color: #47ba86;
    }
  }
  :deep(.aplayer .aplayer-miniswitcher .aplayer-icon path) {
    fill: var(--vp-c-text-1) !important;
  }

  :deep(.aplayer.aplayer-fixed .aplayer-list) {
    bottom: 10px;
  }

  :deep(.aplayer.aplayer-fixed) {
    bottom: 10px;
  }

  :deep(.aplayer.aplayer-fixed .aplayer-lrc) {
    text-shadow: -1px -1px 0 #fff;
  }
}
</style>
