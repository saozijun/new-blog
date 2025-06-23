<template>
  <div class="note-main">
    <div class="new-note" ref="noteRef">
      <div class="note-box" ref="noteBoxRef">
        <section ref="noteTitleRef">
          <p ref="noteT3Ref">最新笔记</p>
          <p ref="noteT5Ref">Latest notes</p>
        </section>
        <div class="note-box-inner" ref="noteBoxInnerRef">
          <div v-for="note in notes" :key="note.id">
            <div class="note-item">
              <div class="note-image">
                <img :src="note.image" :alt="note.title" data-no-fancybox />
              </div>
              <div class="note-content">
                <h3 class="note-title">{{ note.title }}</h3>
                <p class="note-description">{{ note.description }}</p>
                <div class="note-meta">
                  <div class="note-tags">
                    <span
                      v-for="tag in note.tags"
                      :key="tag"
                      class="note-tag"
                      >{{ tag }}</span
                    >
                  </div>
                  <p class="note-update-date">{{ note.updateDate }}</p>
                </div>
              </div>
            </div>
            <div class="note-item-bg"></div>
          </div>
        </div>
        <div class="note-box-footer" ref="noteBoxFooterRef">
          <p>最近更新时间：2025-06-23</p>
          <ButtonText text="查看更多" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonText from "./ButtonText.vue";
import { ref, onMounted, nextTick } from "vue";
import gsap from "gsap";
import { inBrowser } from "vitepress";
const props = defineProps({
  notes: {
    type: Array,
    default: () => []
  }
});

const noteRef = ref(null);
const noteBoxRef = ref(null);
const noteTitleRef = ref(null);
const noteBoxInnerRef = ref(null);
const noteT3Ref = ref(null);
const noteT5Ref = ref(null);
const noteBoxFooterRef = ref(null);

onMounted(() => {
  nextTick(async () => {
    console.log(inBrowser);
    
    if (inBrowser) {
      let gsapCj = await import("gsap/ScrollTrigger");
      console.log('gsapCj', gsapCj);
      
      const { ScrollTrigger } = gsapCj;
      gsap.registerPlugin(ScrollTrigger);
      init();
    }
  });
});

const init = () => {
  // 创建时间轴
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: noteRef.value,
      start: "top center-=50",
      end: "+=1500",
      scrub: 1,
      anticipatePin: 1,
      pin: noteRef.value,
      // markers: true, // 调试显示
    },
  });

  // 容器动画
  tl.to(noteBoxInnerRef.value, { width: 380, duration: 3 }, 0)
    .to(
      noteBoxInnerRef.value,
      {
        rotationX: 10,
        rotationY: -400,
        rotationZ: 0,
        duration: 3,
      },
      3
    )
    .to(noteBoxInnerRef.value, { height: 310, duration: 3.5 }, 0.5);
  // 使用循环为每个笔记项添加动画
  const positions = [
    { x: 440, y: 0 },
    { x: -440, y: 0 },
    { x: 0, y: 0 },
    { x: 440, y: 260 },
    { x: -440, y: 260 },
    { x: 0, y: 260 },
  ];

  let noteItem = noteBoxInnerRef.value.children;
  // 添加所有笔记项的动画
  for (let i = 0; i < noteItem.length; i++) {
    tl.to(
      noteItem[i],
      {
        opacity: 1,
        x: positions[i].x,
        y: positions[i].y,
        duration: 2,
        delay: i * 0.5,
        scale: 1,
      },
      5
    );
    tl.to(
      noteItem[i].children[1],
      { opacity: 0.2, duration: 2, scale: 1, rotationX: 10 },
      6
    );
  }

  // 标题和底部动画
  tl.to(noteT3Ref.value, { opacity: 0, scale: 0, duration: 2 }, 2)
    .to(noteT5Ref.value, { opacity: 0, scale: 0, duration: 2 }, 2)
    .to(noteT3Ref.value, { opacity: 1, y: -260, duration: 2, scale: 1 }, 5)
    .to(noteT5Ref.value, { opacity: 0.2, y: -240, duration: 3, scale: 1.8 }, 5)
    .to(noteBoxFooterRef.value, { opacity: 1, y: 420, duration: 3 }, 5)
    .to(noteBoxInnerRef.value, { background: "#0000", duration: 3 }, 5)
    .to({}, { duration: 3 }, 10);
};
</script>

<style lang="scss" scoped>
.note-main {
  width: 100%;
  margin: 0 auto;
  margin-top: 300px;
}

.new-note {
  width: 100%;
  .note-box {
    width: 100%;
    margin: 0 auto;
    height: calc(100vh - 400px);
    position: relative;

    .note-box-inner {
      width: 100%;
      height: 600px;
      border-radius: 15px;
      background-color: #0000001f;
      background: url(../static/note-bg7.jpg) no-repeat center center;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);

      > div {
        opacity: 0;
        width: 100%;
        height: 220px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        transform: scale(.5);
        // background-color: #00000028;
        .note-item {
          width: 100%;
          height: 100%;
          transition: all 0.3s ease;
          cursor: pointer;
          background-color: var(--vp-c-bg-soft);
          border-radius: 15px;
          box-shadow: 2vw 1vw 1.3vw rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          &:hover {
            box-shadow: 2vw 1vw 4vw #9ab6ad41;
            transform: translateY(-5px);
            .note-image img {
              transform: scale(1.05);
            }
          }

          .note-image {
            width: 100%;
            height: 100px;
            overflow: hidden;
            flex-shrink: 0;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
          }

          .note-content {
            padding: 12px 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }

          .note-title {
            font-size: 1rem;
            font-weight: 600;
            margin: 0.2rem 0;
            color: var(--vp-c-text-1);
            line-height: 1.2;
          }

          .note-description {
            font-size: 0.8rem;
            margin: 0;
            color: var(--vp-c-text-2);
            flex-grow: 1;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .note-meta {
            // margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .note-update-date {
            font-size: 0.7rem;
            color: var(--vp-c-text-3);
            margin: 0;
            margin-top: 4px;
          }

          .note-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
          }

          .note-tag {
            background-color: var(--vp-c-bg-mute);
            color: var(--vp-c-text-2);
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 500;
          }
        }
        .note-item-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 21px;
          left: 23px;
          opacity: 0;
          transform: scale(0);
          border-radius: 16px;
          border: 2px solid var(--vp-c-text-1);
          &::after {
            width: 100%;
            height: 100%;
            content: "";
            position: absolute;
            top: -8px;
            left: -11px;
            z-index: -1;
            border-radius: 16px;
            border: 1px solid var(--vp-c-text-1);
          }
        }
      }
    }
    section {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
      top: -50%;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      z-index: 111;
      color: #9ab6ad;
      p {
        font-size: 48px;
        line-height: 1;
        margin: 0;
        &:nth-child(2) {
          opacity: 0.5;
          color: transparent;
          background-image: linear-gradient(
            180deg,
            #9ab6ad 0%,
            transparent 100%
          );
          z-index: -2;
          background-clip: text;
          font-weight: bold;
          -webkit-background-clip: text;
          font-size: 50px;
        }
      }
    }
  }
}

.note-box-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  div {
    cursor: pointer;
  }
}
</style> 