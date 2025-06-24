import { createContentLoader } from 'vitepress'
import { sep, normalize } from 'path'
import { getGitTimestamp } from './fileTime'
interface Post {
  title: string // 标题
  url: string // url
  date: [number, number] // 日期：创建日期，更新日期
  dateText: [string, string] // 日期文本
  abstract: string // 摘要
  category?: string | undefined // 分类
  tags?: string[] | undefined // 标签
}
// 导出默认数据
declare const data: Post[]
export { data }

// 获取并处理所有文档数据，供首页等使用
// https://vitepress.dev/zh/guide/data-loading#createcontentloader
export default createContentLoader('post/**/*.md', {
  // 不包含原始 markdown 源
  includeSrc: false,
  // 不包含摘录
  excerpt: false,
  async transform(data) {
    const promises: Promise<Post>[] = []
    const posts: Post[] = []
    const dateOption = formatDate()

    data.forEach(({ frontmatter, url }) => {
      const {
        title,
        tags: _tags,
        category,
        description: abstract,
        firstCommit,
        lastUpdated
      } = frontmatter

      const createdDate = firstCommit ? +new Date(firstCommit) : ''
      const updatedDate = lastUpdated ? +new Date(lastUpdated) : ''
      // 链接去掉项目名
      const link = normalize(url).split(sep).filter((item) => item).join(sep)
      if (createdDate && updatedDate) {
        // 如果有手动设置的时间，直接使用
        posts.push({
          title,
          url: link,
          date: [createdDate, updatedDate],
          dateText: [dateOption.format(createdDate), dateOption.format(updatedDate)],
          abstract,
          category,
          tags: _tags
        })
      } else {
        // 如果没有时间，根据 git 时间戳获取
        const task: Promise<Post> = getGitTimestamp(`docs/${link.replace(/.html/, '')}.md`, createdDate, updatedDate).then((date) => ({
          title,
          url: link, // 由于使用了 rewrites 重定向，这里也对 url 作处理 replace(/post\//, '')
          date: [date[0], date[1]] as [number, number],
          dateText: [dateOption.format(date[0]), dateOption.format(date[1])],
          abstract,
          category,
          tags: _tags
        }))
        promises.push(task)
      }
    })

    // 等待所有异步任务完成并合并结果
    const resolvedPosts = await Promise.all(promises)
    const formattedPosts = posts.concat(resolvedPosts)

    // 按发布时间降序排列
    return formattedPosts.sort((a, b) => b.date[0] - a.date[0])
  }
})

function formatDate(hasTime?: boolean){
  let formatOption = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
  return new Intl.DateTimeFormat('zh', formatOption as Intl.DateTimeFormatOptions)
}