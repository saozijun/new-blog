<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  id: String,
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'info', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  },
  showClose: {
    type: Boolean,
    default: false
  },
  onDestroy: {
    type: Function,
    default: () => {}
  },
  offset: {
    type: Number,
    default: 20
  }
});

// 控制显示和隐藏
const visible = ref(false);
// 实际偏移量
const currentOffset = ref(props.offset);
// 是否开始过渡动画
const isStartTransition = ref(false);

// 监听offset属性变化
watch(() => props.offset, (newVal) => {
  currentOffset.value = newVal;
});

let stopTimer = undefined;

// 开始定时器
const startTimer = () => {
  if (props.duration === 0) return;
  stopTimer = setTimeout(() => {
    close();
  }, props.duration);
};

// 清除定时器
const clearTimer = () => {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = undefined;
  }
};

// 关闭消息
const close = () => {
  visible.value = false;
  
  // 如果消息从未开始过渡，可以立即销毁
  nextTick(() => {
    if (!isStartTransition.value) {
      props.onDestroy();
    }
  });
};

// 键盘事件处理
const keydown = (event) => {
  if (event.code === 'Escape') {
    close();
  }
};

// 获取图标类名
const iconClass = () => {
  const typeMap = {
    success: 'success-icon',
    warning: 'warning-icon',
    info: 'info-icon',
    error: 'error-icon'
  };
  return typeMap[props.type];
};

onMounted(() => {
  startTimer();
  visible.value = true;
  
  // 添加键盘事件监听
  document.addEventListener('keydown', keydown);
});

// 暴露方法给父组件
defineExpose({
  close,
  set offset(val) {
    currentOffset.value = val;
  },
  get offset() {
    return currentOffset.value;
  }
});
</script>

<template>
  <transition
    name="message-fade"
    @before-enter="isStartTransition = true"
    @before-leave="clearTimer"
    @after-leave="onDestroy"
  >
    <div
      v-show="visible"
      :id="id"
      class="message"
      :class="[`message-${type}`]"
      :style="{ top: `${currentOffset}px` }"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="message-content">
        <span class="message-icon" :class="iconClass()"></span>
        <div class="message-text">{{ message }}</div>
        <div v-if="showClose" class="message-close" @click="close">
          <span class="close-icon">×</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.message {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  max-width: calc(100vw - 48px);
  min-width: 120px;
  padding: 14px 20px;
  border-radius: 10px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--vp-c-bg);
  backdrop-filter: blur(18px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.07);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .message {
    background: rgba(30, 30, 30, 0.92);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  }
}

.message-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.message-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

/* 简约图标设计 - Light Theme */
.success-icon {
  background-color: #d1fae5;
  color: #067647;
}
.success-icon::before { content: '✓'; }

.warning-icon {
  background-color: #fef3c7;
  color: #92400e;
}
.warning-icon::before { content: '!'; }

.info-icon {
  background-color: #dbeafe;
  color: #1e40af;
}
.info-icon::before { content: 'i'; font-style: normal; font-weight: 600; }

.error-icon {
  background-color: #fee2e2;
  color: #991b1b;
}
.error-icon::before { content: '×'; }

/* Dark Theme Icons */
@media (prefers-color-scheme: dark) {
  .success-icon {
    background-color: #064e3b;
    color: #a7f3d0;
  }
  .warning-icon {
    background-color: #78350f;
    color: #fde68a;
  }
  .info-icon {
    background-color: #1e3a8a;
    color: #bfdbfe;
  }
  .error-icon {
    background-color: #7f1d1d;
    color: #fecaca;
  }
}

.message-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  flex: 1;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .message-text {
    color: #f9fafb;
  }
}

.message-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.message-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
}

@media (prefers-color-scheme: dark) {
  .message-close {
    color: #9ca3af;
  }
  .message-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }
}

.close-icon {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

/* 高级简约的过渡动画 */
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.95);
}

.message-fade-enter-to,
.message-fade-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}

/* 悬停效果 */
.message:hover {
  transform: translate(-50%, -2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  .message:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
  }
}
</style> 