import { nextTick, provide } from 'vue'
import { useData } from "vitepress";
// 判断是否能使用 startViewTransition
const enableTransitions = () => {
  return 'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}
// 切换动画
export const toggleDark = () => {
  // 获取当前主题状态
  const { isDark } = useData();
  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    //如果不支持动效直接切换
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }
    document.documentElement.style.setProperty('--darkX', x + 'px')
    document.documentElement.style.setProperty('--darkY', y + 'px')
    await document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    }).ready
  })
}