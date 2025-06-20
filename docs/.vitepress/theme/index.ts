import { inBrowser } from 'vitepress'
import { onMounted, onUnmounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Sign from "./components/Sign.vue"
import HomePage from "./components/HomePage.vue"
import busuanzi from 'busuanzi.pure.js'

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
    app.component('HomePage', HomePage)
    app.component('Sign', Sign)
    if (inBrowser) {
      router.onBeforeRouteChange = () => {
        destroyFancybox() // 销毁图片查看器
      }
      router.onAfterRouteChange = () => {
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