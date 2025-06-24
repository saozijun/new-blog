import { ref, watch } from 'vue';

export function useToast() {
  const message = ref('');
  const type = ref('success');
  const visible = ref(false);
  const duration = ref(2000);

  // 自动关闭计时器
  let timer = null;

  // 监听visible变化，当显示时设置自动关闭
  watch(visible, (newValue) => {
    if (newValue && duration.value > 0) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        visible.value = false;
      }, duration.value);
    }
  });

  // 显示成功提示
  const showSuccess = (msg, time = 2000) => {
    message.value = msg;
    type.value = 'success';
    duration.value = time;
    visible.value = true;
  };

  // 显示错误提示
  const showError = (msg, time = 3000) => {
    message.value = msg;
    type.value = 'error';
    duration.value = time;
    visible.value = true;
  };

  // 显示信息提示
  const showInfo = (msg, time = 2000) => {
    message.value = msg;
    type.value = 'info';
    duration.value = time;
    visible.value = true;
  };

  // 关闭提示
  const close = () => {
    visible.value = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    message,
    type,
    visible,
    duration,
    showSuccess,
    showError,
    showInfo,
    close
  };
} 