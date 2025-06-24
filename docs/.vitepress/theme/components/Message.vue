<script setup>
import { ref, onMounted } from 'vue';

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
  }
});

// 控制显示和隐藏
const visible = ref(false);

onMounted(() => {
  // 显示元素，用于触发进入动画
  setTimeout(() => {
    visible.value = true;
  }, 0);
});

// 关闭消息
const close = () => {
  visible.value = false;
  // 等待过渡动画结束后调用销毁函数
  setTimeout(() => {
    props.onDestroy();
  }, 300);
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

// 暴露方法给父组件
defineExpose({
  close
});
</script>

<template>
  <transition name="message-fade">
    <div
      v-show="visible"
      class="message"
      :class="[`message-${type}`]"
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
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 9999;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: var(--vp-c-bg);
  transition: opacity 0.3s, transform 0.3s;
}

.message-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.message-icon {
  margin-right: 10px;
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 简单的图标实现 */
.success-icon::before {
  content: '✓';
  color: #67c23a;
}

.warning-icon::before {
  content: '!';
  color: #e6a23c;
}

.info-icon::before {
  content: 'i';
  color: var(--vp-c-brand);
  font-style: italic;
  font-family: serif;
  font-weight: bold;
}

.error-icon::before {
  content: '×';
  color: #f56c6c;
}

.message-text {
  font-size: 14px;
  flex: 1;
}

.message-close {
  margin-left: 15px;
  cursor: pointer;
  font-size: 16px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  font-size: 18px;
  line-height: 1;
  color: #909399;
}

.message-info {
  border-left: 4px solid var(--vp-c-brand);
}

.message-success {
  border-left: 4px solid #67c23a;
}

.message-warning {
  border-left: 4px solid #e6a23c;
}

.message-error {
  border-left: 4px solid #f56c6c;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 