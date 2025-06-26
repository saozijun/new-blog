import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XinC",
  description: "XinC blog",
  lastUpdated: true,
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    algolia: {
      appId: 'AXM965G3FO',
      apiKey: '422c7a7d2cb55b614920197d6db1c232',
      indexName: 'xinc',
      placeholder: '请输入关键词',
      translations: {
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询条件',
            resetButtonAriaLabel: '清除查询条件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索历史',
            noRecentSearchesText: '没有搜索历史',
            saveRecentSearchButtonTitle: '保存至搜索历史',
            removeRecentSearchButtonTitle: '从搜索历史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
            searchByText: '搜索提供者'
          },
          noResultsScreen: {
            noResultsText: '无法找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为该查询应该有结果？',
            reportMissingResultsLinkText: '点击反馈'
          }
        }
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '工具', link: '/tool'},
      { text: '归档', link: '/archive'},
      { text: '标签', link: '/tag'},
      { text: '笔记', link: '/post/blog/blog-decoration', activeMatch: '/post/blog/' }
    ],
    siteTitle: false,
    sidebar: {
      "/post/blog/" :[{
        text: '小破站装修日记',
        items: [
          { text: '装修清单', link: '/post/blog/blog-decoration' },
          { text: '站点记录', link: '/post/blog/记录' },
          { text: '炫酷组件', link: '/post/blog/component' },
        ]
      }]
    },
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
    build: {
      assetsInlineLimit: 0,
    },
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
