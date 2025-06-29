import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Sign from "./components/Sign.vue"
import Message from './utils/message'
import busuanzi from 'busuanzi.pure.js'
import gsap from 'gsap'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'virtual:group-icons.css'
import { bindFancybox, destroyFancybox } from './utils/ImgViewer' // 图片查看器
import './style/custom.scss'
import './style/init.scss'
import './style/dark.css'
import './style/fancybox.scss'
import './style/code.scss'

export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  Layout: Layout,
  async enhanceApp({ app, router }) {
    app.component('Sign', Sign)
    // 添加全局Message方法
    app.config.globalProperties.$message = Message
    
    if (inBrowser) {
      let scrollTriggerModule = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(scrollTriggerModule.default)

      app.provide('gsap', gsap)
      // 提供 Message 给组件使用
      app.provide('message', Message)
      console.log('router',router);
      
      router.onBeforeRouteChange = () => {
        NProgress.start()
        destroyFancybox() // 销毁图片查看器
      }
      router.onAfterRouteChange = () => {
        NProgress.done()
        bindFancybox() // 绑定图片查看器
        busuanzi.fetch()
      }
    }
  },
  setup() {
    onMounted(() => {
      bindFancybox()
    })
    onUnmounted(() => {
      destroyFancybox()
    })
  }
}