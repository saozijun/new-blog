import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XinC",
  description: "XinC blog",
  lastUpdated: true,
  lang: 'zh-CN',
  head:[
    ['link', { rel: 'icon', href: '/xiaoxin.gif' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '笔记', link: '/blog/blog-decoration' }
    ],
    siteTitle: false,
    sidebar: [
      {
        text: '小破站装修日记',
        items: [
          { text: '装修清单', link: '/blog/blog-decoration' },
        ]
      }
    ],
    footer: {
      copyright: `Copyright © 2025-present XinC`,
    },
    outlineTitle: "文章导航",
    lastUpdatedText: "上次更新",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
  markdown: {
    image: {
      lazyLoading: true,
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    }
  }
})
