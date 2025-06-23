// utils/useScrollTrigger.ts
import gsap from 'gsap'
import { inBrowser, useRoute } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

let scrollTriggerModule = null
let registered = false

export function useScrollTrigger(initFn) {
  const route = useRoute()

  const loadAndInit = async () => {
    if (!inBrowser) return

    // 确保只注册一次插件
    if (!registered) {
      scrollTriggerModule = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(scrollTriggerModule.default)
      registered = true
    }

    // 清理旧动画
    scrollTriggerModule?.default?.getAll().forEach(trigger => trigger.kill())

    nextTick(() => {
      initFn()
    })
  }

  onMounted(() => {
    loadAndInit()
  })

  // 监听客户端导航路径
  watch(() => route.path, () => {
    loadAndInit()
  })
}
