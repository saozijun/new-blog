<script lang="ts" setup>
import "aplayer/dist/APlayer.min.css";
import { onMounted, ref, nextTick, onBeforeUnmount } from "vue";
import { playlist, songUrl, lyric } from "../api/search";
import { inBrowser } from "vitepress";

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

// 辅助函数
const combineTracksWithUrls = (tracks: Track[], urlData: any[]): Track[] => {
  return tracks.map((track) => {
    const data = urlData.find((i) => track.id === i.id);
    return {
      ...track,
      url: data ? data.url : "",
    };
  });
};

const createTrackList = (playlistData: any): Track[] => {
  const tracks = playlistData.tracks || [];
  return tracks.map((track: any) => ({
    id: track.id,
    name: track.name,
    artist: track.ar[0].name,
    url: "",
    cover: track.al.picUrl,
    lrc: "",
  }));
};

const getTrackIds = (tracks: Track[]): string => {
  return tracks.map((track) => track.id).join(",");
};

const fetchLyrics = async (trackId: number): Promise<string> => {
  try {
    const response: any = await lyric({ id: trackId });
    return response.lrc?.lyric || "";
  } catch (error) {
    console.error("获取歌词失败:", error);
    return "";
  }
};

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
      lrcType: 2,
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
  fetchCurrentTrackLyrics();
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

const fetchCurrentTrackLyrics = async () => {
  if (!ap.value || !audioList.value.length) return;
  
  const currentTrack = audioList.value.find(
    track => track.url === ap.value?.audio.src
  );
  
  if (!currentTrack || currentTrack.lrc !== "") return;
  
  const trackIndex = audioList.value.indexOf(currentTrack);
  if (trackIndex === -1) return;
  
  currentTrack.lrc = await fetchLyrics(currentTrack.id);
  
  // 更新播放器歌词
  ap.value.list.clear();
  ap.value.list.add([...audioList.value]);
  ap.value.list.switch(trackIndex);
  ap.value.play();
};

// 生命周期钩子
onMounted(async () => {
  try {
    // 获取播放列表数据
    const res: any = await playlist();
    const trackList = createTrackList(res.playlist);
    
    // 获取第一首歌曲的歌词
    const firstTrackId = trackList[0]?.id;
    if (firstTrackId) {
      trackList[0].lrc = await fetchLyrics(firstTrackId);
    }
    
    // 获取所有歌曲URL
    const ids = getTrackIds(trackList);
    const { data: urlsData } = await songUrl({ id: ids });
    
    // 合并歌曲数据和URL
    audioList.value = combineTracksWithUrls(trackList, urlsData);
    
    // 初始化播放器
    await initializePlayer(audioList.value);
  } catch (error) {
    console.error("初始化音乐播放器出错:", error);
  }
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
  &:hover {
    background-color: var(--vp-c-bg);
    color: #47ba86;
  }
}

:deep(.aplayer .aplayer-list ol li.aplayer-list-light) {
  background-color: var(--vp-c-bg);
  color: #47ba86;
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
