<script setup>
import DefaultTheme from "vitepress/theme";
import { toggleDark } from "../utils/Dark";
import SplashCursor from "./SplashCursor.vue";
import ParticlesBg from "./ParticlesBg.vue";
import Music from "./Music.vue";
import Lt from "./Lt.vue";
import NavTitle from "./NavTitle.vue";
import { inject, onMounted } from "vue";

toggleDark();
const { Layout } = DefaultTheme;

// 注入 message 服务
const message = inject('message');

// 示例：页面加载完成显示欢迎消息
onMounted(() => {
  if (message) {
    // 2秒后显示欢迎消息
    setTimeout(() => {
      message.success('欢迎访问我的博客！');
    }, 2000);
  }
});

// 测试不同类型的消息
const showSuccess = () => {
  message?.success('操作成功');
};

const showInfo = () => {
  message?.info('这是一条信息提示');
};

const showWarning = () => {
  message?.warning('这是一条警告信息');
};

const showError = () => {
  message?.error('操作失败');
};

const showLongDuration = () => {
  message?.info({
    message: '这条消息将显示10秒',
    duration: 10000
  });
};

const showWithClose = () => {
  message?.info({
    message: '这条消息带有关闭按钮',
    showClose: true,
    duration: 0 // 不自动关闭
  });
};

const showWithCallback = () => {
  message?.success({
    message: '操作成功，3秒后执行回调',
    onClose: () => {
      setTimeout(() => {
        message?.info('这是关闭后的回调');
      }, 500);
    }
  });
};
</script>

<template>
  <ParticlesBg />
  <Layout>
    <template #nav-bar-title-after>
      <ClientOnly>
        <NavTitle />
      </ClientOnly>
    </template>
    <template #layout-bottom>
      <ClientOnly>
        <Music />
        <SplashCursor />
      </ClientOnly>
    </template>
    <template #aside-outline-before>
      <ClientOnly>
        <Lt />
      </ClientOnly>
    </template>
  </Layout>
</template>
