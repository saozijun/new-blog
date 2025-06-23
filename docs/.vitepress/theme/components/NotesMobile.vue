<template>
  <div class="notes-mobile">
    <div class="section-title">
      <h2>最新笔记</h2>
      <p>Latest notes</p>
    </div>
    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-image">
          <img :src="note.image" :alt="note.title" data-no-fancybox />
        </div>
        <div class="note-content">
          <h3 class="note-title">{{ note.title }}</h3>
          <p class="note-description">{{ note.description }}</p>
          <div class="note-meta">
            <div class="note-tags">
              <span v-for="tag in note.tags" :key="tag" class="note-tag">{{
                tag
              }}</span>
            </div>
            <p class="note-update-date">{{ note.updateDate }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="notes-footer">
      <p>最近更新时间：2025-06-23</p>
      <ButtonText text="查看更多" />
    </div>
  </div>
</template>

<script setup>
import ButtonText from "./ButtonText.vue";

const props = defineProps({
  notes: {
    type: Array,
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
.notes-mobile {
  width: 100%;
  // padding: 1rem;
  margin-top: 2rem;
}

.section-title {
  text-align: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    margin: 0;
    color: var(--vp-c-text-1);
  }
  
  p {
    font-size: 1rem;
    color: var(--vp-c-text-2);
    opacity: 0.6;
    margin: 0.2rem 0 0;
  }
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.note-card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
}

.note-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.note-content {
  padding: 1rem;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  // margin-bottom: 0.5rem;
}

.note-tag {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

.note-title {
  font-size: 1.1rem;
  margin: 0.3rem 0;
  color: var(--vp-c-text-1);
}

.note-description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.note-update-date {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.notes-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style> 