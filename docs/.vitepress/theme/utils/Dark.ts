import { nextTick, provide, onMounted } from 'vue'
import { useData } from "vitepress";

// 判断是否能使用 startViewTransition
const enableTransitions = () => {
  return 'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

// 初始化主题状态
const initThemeState = (isDark: boolean) => {
  document.documentElement.dataset.invert = (!isDark).toString()
  document.documentElement.style.background = isDark ? '#1b1b1f' : '#ffffff'
}

// 切换动画
export const toggleDark = () => {
  // 获取当前主题状态
  const { isDark } = useData();

  // 初始化主题状态
  onMounted(() => {
    initThemeState(isDark.value)
  })

  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    // 如果不支持动效直接切换
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }
    const doc = document.documentElement
    const x_center = window.innerWidth / 2;
    const y_center = window.scrollY + window.innerHeight / 2;

    doc.style.setProperty('--origin-x', `${x_center}px`)
    doc.style.setProperty('--origin-y', `${y_center}px`)

    const topOffset = window.scrollY;
    const leftOffset = window.scrollX;
    const bottomOffset = doc.scrollHeight - (window.scrollY + window.innerHeight);
    const rightOffset = doc.scrollWidth - (window.scrollX + window.innerWidth);
    const clipPathValue = `inset(${Math.max(0, topOffset)}px ${Math.max(0, rightOffset)}px ${Math.max(0, bottomOffset)}px ${Math.max(0, leftOffset)}px)`;
    doc.style.setProperty('--clip-path', clipPathValue);

    document.documentElement.classList.add('is-transitioning')
    document.documentElement.style.background = isDark.value ? '#01022e' : '#34d0ff'

    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    transition.ready.then(() => {
      document.documentElement.dataset.invert = (!isDark.value).toString()
      document.documentElement.style.background = isDark.value ? '#01022e' : '#34d0ff'
      setTimeout(() => {
        document.documentElement.style.background = isDark.value ? '#1b1b1f' : '#ffffff'
      }, 1000)
    })

    await transition.finished
    document.documentElement.classList.remove('is-transitioning')
    doc.style.removeProperty('--origin-x')
    doc.style.removeProperty('--origin-y')
    doc.style.removeProperty('--clip-path');
  })
}