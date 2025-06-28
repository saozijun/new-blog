<template>
    <div class="archive-page">
        <div class="page-header" data-fade style="--lv: 0;">
            <div>
                <h1 class="page-title">全部文章</h1>
                <div class="post-stats">共计 {{ postLength }} 篇文章</div>
                <p style="font-size: 12px;">tip: 2024年份是我调试滴,都是2025产出!</p>
            </div>
            <img data-no-fancybox src="../../static/xiaoxin/notes.png" alt="">
        </div>
        
        <div class="timeline" data-fade style="--lv: 1;">
            <div v-for="(yearItem, index) in postList" :key="index" class="year-section">
                <div class="year-header">
                    <div class="year-label">{{ yearItem.title }}</div>
                    <div class="post-count">{{ yearItem.posts.length }} 篇</div>
                </div>
                <div class="sticky-year">
                    <img data-no-fancybox src="../../static/xiaoxin/launch.png" alt="">
                    {{ yearItem.title }}
                </div>
                <div class="post-list" data-fades style="--lv: 3;">
                    <div v-for="(post, postIndex) in yearItem.posts" :key="postIndex" class="post-item" @click="goPost(post.url)">
                        <div class="post-meta">
                            <div class="post-date">
                                <div class="date-created">
                                    <span class="date-icon">📅</span>
                                    发布于 {{ post.dateText[0] }}
                                </div>
                                <div class="date-updated" v-if="post.dateText[0] !== post.dateText[1]">
                                    <span class="date-icon">🔄</span>
                                    更新于 {{ post.dateText[1] }}
                                </div>
                            </div>
                            <div class="post-category" v-if="post.category">
                                <span class="category-icon">📂</span>
                                {{ post.category }}
                            </div>
                        </div>

                        <div class="post-content">
                            <p class="post-title">{{ post.title }}</p>
                            <div class="post-abstract" v-if="post.abstract">{{ post.abstract }}</div>
                            <div class="post-tags" v-if="post.tags && post.tags.length">
                                <span v-for="(tag, tagIndex) in post.tags" :key="tagIndex" class="post-tag">
                                    <span class="tag-icon">#</span>{{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { data } from '../../utils/post.data'
import { postsYearData } from '../../utils/post'
import { useRouter } from 'vitepress';
const router = useRouter();

let postLength = ref(0)
let posts = ref({})
let postList = ref([])

const getPost = () => {
  let _list = []
  for (const key in posts.value) {
    _list.push({
      title: key,
      posts: posts.value[key]
    })
  }
  postList.value = _list.reverse()
}

const getPostLength = () => {
  let length = 0
  postList.value.forEach((item) => {
    length += item.posts.length
  })
  postLength.value = length
}

const useMockData = () => {
    const mockData = [
        {
            title: '2025',
            posts: [
                {
                    url: '/mock-post-1',
                    dateText: ['2025-03-15', '2025-03-16'],
                    category: '技术',
                    title: '深入探索Vue 3组合式API',
                    abstract: '本文将带你深入了解Vue 3中强大的组合式API，探索其如何帮助我们组织更清晰、更可维护的代码。',
                    tags: ['Vue', 'JavaScript', '前端开发']
                },
                {
                    url: '/mock-post-2',
                    dateText: ['2025-02-20', '2025-02-20'],
                    category: '生活',
                    title: '我的2025年旅行计划',
                    abstract: '记录我想去的地方，以及为实现这些旅行计划所做的准备。',
                    tags: ['旅行', '生活', '计划']
                }
            ]
        },
        {
            title: '2024',
            posts: [
                {
                    url: '/mock-post-3',
                    dateText: ['2024-11-10', '2024-11-12'],
                    category: '技术',
                    title: 'VitePress搭建个人博客指南',
                    abstract: '从零开始，一步步教你如何使用VitePress快速搭建一个美观、高效的个人博客网站。',
                    tags: ['VitePress', 'Vue', '博客']
                },
                {
                    url: '/mock-post-4',
                    dateText: ['2024-08-05', '2024-08-05'],
                    category: '学习',
                    title: '如何高效学习一门新语言',
                    abstract: '分享一些个人关于学习新编程语言的经验和技巧，希望能帮助你更快入门。',
                    tags: ['学习方法', '编程']
                },
                {
                    url: '/mock-post-5',
                    dateText: ['2024-05-20', '2024-05-20'],
                    category: '技术',
                    title: 'CSS Grid布局奇妙之旅',
                    abstract: '探索CSS Grid布局的强大功能，并通过实例展示如何创建复杂的响应式布局。',
                    tags: ['CSS', 'Web布局', '前端开发']
                }
            ]
        },
        {
            title: '2023',
            posts: [
                 {
                    url: '/mock-post-6',
                    dateText: ['2023-07-18', '2023-07-19'],
                    category: '随笔',
                    title: '关于写作的思考',
                    abstract: '为什么写作，写作给我带来了什么，以及如何更好地写作。',
                    tags: ['写作', '思考']
                },
            ]
        }
    ];
    postList.value = mockData;
    getPostLength();
};


onMounted(() => {
  posts.value = postsYearData(data)
  getPost()
  getPostLength()
//   useMockData()
})

const goPost = (url) => {
  router.go(url)
}
</script>

<style lang="scss" scoped>
.archive-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    color: var(--vp-c-text-1);
    .page-header{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1rem 0;
        img{
            width: 70px;
            position: relative;
            top: -20px;
        }
    }
    .page-title {
        font-size: 2.8rem;
        margin-bottom: 1rem;
        letter-spacing: -0.02em;
    }
    
    .post-stats {
        font-size: 1rem;
        color: var(--vp-c-text-2);
    }
    
    .timeline {
        position: relative;
    }
    
    .year-section {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 3rem;
        
        &:last-child {
            margin-bottom: 0;
        }
        
        &:not(:last-child)::after {
            content: "";
            position: absolute;
            bottom: -2.5rem;
            left: 8px;
            width: 2px;
            height: 100%;
            background: linear-gradient(to bottom, transparent 0%, var(--vp-c-brand) 50%, transparent 100%);
            z-index: 1;
            opacity: .5;
        }
    }
    
    .sticky-year {
        position: sticky;
        top: 70px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--vp-c-brand);
        padding: 4px 10px;
        border-radius: 8px;
        margin-left: -46.5px;
        width: fit-content;
        z-index: 5;
        writing-mode: vertical-lr;
        display: flex;
        align-items: center;
        img{
            width: 26px;
            transform: rotate(90deg);
        }
    }
    
    .year-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 5px solid var(--vp-c-brand);
            box-shadow: 0 0 10px var(--vp-c-brand-light);
            z-index: 1;
            background-color: var(--vp-c-bg);
            box-shadow: 1px 1px 15px #10b981;
        }
    }
    
    .year-label {
        font-size: 1.8rem;
        font-weight: 600;
        margin-right: 1rem;
        color: var(--vp-c-brand);
    }
    
    .post-count {
        font-size: 1rem;
        padding: 0.2rem 0.8rem;
        border-radius: 15px;
        background-color: var(--vp-c-bg-soft);
        color: var(--vp-c-text-2);
    }
    
    .post-list {
        padding-bottom: 0.5rem;
        position: relative;
        top: -20px;
    }
    
    .post-item {
        position: relative;
        margin-bottom: 2rem;
        padding: 1.5rem;
        border-radius: 12px;
        background-color: var(--vp-c-bg-soft);
        // background-image: url('../../static/xiaoxin/bg.png');
        background-size: cover;
        transition: all 0.3s ease;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            
            .post-title {
                color: var(--vp-c-brand);
                &:before {
                    transform: scaleX(1);
                    transform-origin: bottom left;
                }
            }
        }
        
        &::before {
            content: '';
            position: absolute;
            left: -2.5rem;
            top: 1.8rem;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--vp-c-brand-light);
            opacity: 0.8;
        }
    }
    
    .post-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 0.8rem;
        gap: 1rem;
    }
    
    .post-date {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.85rem;
        color: var(--vp-c-text-3);
        
        .date-icon {
            margin-right: 0.3rem;
        }
        
        .date-created, .date-updated {
            display: flex;
            align-items: center;
        }
    }
    
    .post-category {
        display: flex;
        align-items: center;
        font-size: 0.85rem;
        // padding: 0.25rem 0.8rem;
        border-radius: 15px;
        background-color: var(--vp-c-bg-mute);
        color: var(--vp-c-text-2);
        
        .category-icon {
            margin-right: 0.3rem;
        }
    }
    
    .post-content {
        display: flex;
        flex-direction: column;
    }
    
    .post-title {
        width: fit-content;
        font-size: 1.2rem;
        font-weight: 600;
        text-decoration: none;
        color: var(--vp-c-text-1);
        transition: color 0.2s;
        margin-bottom: 0.8rem;
        line-height: 1.4;
        position: relative;
        &:before {
            content: "";
            position: absolute;
            height: 2px;
            bottom: 0;
            left: 0;
            width: 100%;
            transform: scaleX(0);
            transform-origin: bottom right;
            background: currentColor;
            transition: transform 0.25s ease-out;
        }
    }
    
    .post-abstract {
        font-size: 0.95rem;
        color: var(--vp-c-text-2);
        margin-bottom: 1rem;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 1.2rem;
    }
    
    .post-tag {
        font-size: 0.8rem;
        border-radius: 12px;
        background-color: var(--vp-c-bg-mute);
        color: var(--vp-c-text-2);
        transition: all 0.2s;
        
        &:hover {
            background-color: var(--vp-c-brand-dimm);
            color: var(--vp-c-brand);
        }
        
        .tag-icon {
            margin-right: 0.3rem;
        }
    }
    
    @media (max-width: 768px) {
        padding: 2rem 1rem;
        .sticky-year{
            margin-left: -49.5px;
        }
        .year-section {
            padding-left: 2.5rem;
        }
        
        .post-item {
            padding: 1.2rem;
            
            &::before {
                left: -2.2rem;
            }
        }
        
        .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
}
</style>