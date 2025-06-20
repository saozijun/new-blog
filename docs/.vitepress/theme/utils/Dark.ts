import { nextTick, provide, onMounted } from 'vue'
import { useData } from "vitepress";

// 判断是否能使用 startViewTransition
const enableTransitions = () => {
  return 'startViewTransition' in document && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

// 动画配置
const defaultConfig = {
  perspective: 400,
  distance: 0.75,
  duration: 1.2,
}

// 初始化主题状态
const initThemeState = (isDark: boolean) => {
  document.documentElement.style.setProperty('--perspective', `${defaultConfig.perspective}vmax`)
  document.documentElement.style.setProperty('--distance', `-${defaultConfig.distance}`)
  document.documentElement.style.setProperty('--duration', `${defaultConfig.duration}s`)
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
    //如果不支持动效直接切换
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }
    document.documentElement.style.background = isDark.value ? '#01022e' : '#34d0ff'
    // 设置点击位置变量
    document.documentElement.style.setProperty('--darkX', x + 'px')
    document.documentElement.style.setProperty('--darkY', y + 'px')
    
    // 设置动画参数
    document.documentElement.style.setProperty('--perspective', `${defaultConfig.perspective}vmax`)
    document.documentElement.style.setProperty('--distance', `-${defaultConfig.distance}`)
    document.documentElement.style.setProperty('--duration', `${defaultConfig.duration}s`)
    
    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    // 在动画开始时更新背景色
    transition.ready.then(() => {
      // 切换主题数据属性和背景色
      document.documentElement.dataset.invert = (!isDark.value).toString()
      document.documentElement.style.background = isDark.value ? '#01022e' : '#34d0ff'
      setTimeout(() => {
        document.documentElement.style.background = isDark.value ? '#1b1b1f' : '#ffffff'
      }, 1000)
    })

    await transition.finished
  })
}