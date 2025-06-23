// composables/useScrollTrigger.js
import gsap from 'gsap'
import { inBrowser, useRoute } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'

export function useScrollTrigger(initFn) {
  const route = useRoute()

  const loadAndInit = async () => {
    if (!inBrowser) return
    const module = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(module.default)
    // 先销毁旧动画
    module.default.getAll().forEach(trigger => trigger.kill())
    nextTick(() => {
      initFn()
    })
  }

  onMounted(() => {
    loadAndInit()
  })

  watch(() => route.path, () => {
    loadAndInit()
  })
}
