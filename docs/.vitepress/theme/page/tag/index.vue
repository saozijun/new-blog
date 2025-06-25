<template>
    <div class="tag-page">
        <div class="page-header" data-fade style="--lv: 0;">
            <div>
                <h1 class="page-title">标签列表</h1>
                <div class="post-stats">共计 {{ tagCount }} 个标签</div>
            </div>
            <img data-no-fancybox src="../../static/xiaoxin/notes.png" alt="">
        </div>
        
        <div class="tag-container">
            <div class="tag-list"  data-fades style="--lv: 3;">
                <div 
                    v-for="(tag, index) in Object.keys(posts)" 
                    :key="index" 
                    class="tag-item"
                    :class="{ active: currentTag === tag }"
                    @click="selectTag(tag)"
                >
                    <span class="tag-name">
                        <span class="tag-icon">#</span>{{ tag }}
                    </span>
                    <span class="post-count">{{ posts[tag].length }} 篇</span>
                </div>
            </div>
            
            <div class="post-container" v-if="currentTag">
                <div class="tag-header">
                    <div class="current-tag"  data-fade style="--lv: 2;">
                        <img data-no-fancybox src="../../static/xiaoxin/launch.png" alt="">
                        <span class="tag-label"># {{ currentTag }}</span>
                    </div>
                    <div  data-fade style="--lv: 2;" class="tag-post-count">{{ posts[currentTag].length }} 篇文章</div>
                </div>
                
                <div class="post-list" data-fades style="--lv: 3;" :key="tagContainerKey">
                    <div v-for="(post, postIndex) in posts[currentTag]" :key="post.title" class="post-item" @click="goPost(post.url)">
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
            
            <div class="empty-state" v-else>
                <p>请从左侧选择一个标签</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { data } from '../../utils/post.data'
import { postsTagData } from '../../utils/post'
import { useRouter } from 'vitepress';

const router = useRouter();
let posts = ref({})
let currentTag = ref('')
let tagCount = computed(() => Object.keys(posts.value).length)
const tagContainerKey = ref(0);
const selectTag = (tag) => {
    currentTag.value = tag
    tagContainerKey.value += 1;
}

onMounted(() => {
    posts.value = postsTagData(data)
    // 默认选中第一个标签，如果存在的话
    if (Object.keys(posts.value).length > 0) {
        currentTag.value = Object.keys(posts.value)[0]
    }
})

const goPost = (url) => {
    router.go(url)
}
</script>

<style lang="scss" scoped>
.tag-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
    color: var(--vp-c-text-1);
    
    .page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1rem 0;
        
        img {
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
    
    .tag-container {
        display: flex;
        gap: 2rem;
    }
    
    .tag-list {
        flex: 0 0 230px;
        border-right: 1px solid var(--vp-c-divider);
        padding-right: 1rem;
    }
    
    .tag-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.8rem .5rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        gap: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: var(--vp-c-bg-soft);
        }
        
        &.active {
            background-color: var(--vp-c-brand-dimm);
            
            .tag-name {
                color: var(--vp-c-brand);
                font-weight: 600;
            }
        }
    }
    
    .tag-name {
        display: flex;
        align-items: center;
        
        .tag-icon {
            margin-right: 0.3rem;
        }
    }
    
    .post-count {
        font-size: 0.8rem;
        color: var(--vp-c-text-2);
        background-color: var(--vp-c-bg-soft);
        padding: 0.3rem 0.8rem;
        border-radius: 10px;
    }
    
    .post-container {
        flex: 1;
    }
    
    .tag-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
    }
    
    .current-tag {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--vp-c-brand);
        
        img {
            width: 30px;
            margin-right: 0.5rem;
            position: relative;
            top: -2px;
        }
    }
    
    .tag-post-count {
        font-size: 1rem;
        padding: 0.3rem 0.8rem;
        border-radius: 15px;
        background-color: var(--vp-c-bg-soft);
        color: var(--vp-c-text-2);
    }
    
    .post-item {
        position: relative;
        margin-bottom: 2rem;
        padding: 1.5rem;
        border-radius: 12px;
        background-color: var(--vp-c-bg-soft);
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
        gap: 0.8rem;
    }
    
    .post-tag {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
        border-radius: 8px;
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
    
    .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: var(--vp-c-text-2);
        
        img {
            width: 120px;
            margin-bottom: 1.5rem;
        }
        
        p {
            font-size: 1.2rem;
        }
    }
    
    @media (max-width: 768px) {
        padding: 2rem 1rem;
        
        .tag-container {
            flex-direction: column;
        }
        
        .tag-list {
            flex: none;
            border-right: none;
            border-bottom: 1px solid var(--vp-c-divider);
            padding-right: 2rem;
            padding-bottom: .5rem;
            margin-bottom: 1.5rem;
            
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            gap: 0.8rem;

            -webkit-mask-image: linear-gradient(to right, black 85%, transparent);
            mask-image: linear-gradient(to right, black 85%, transparent);

            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        
        .tag-item {
            padding: 0.5rem 0.8rem;
            margin-bottom: 0;
            width: auto;
            flex-shrink: 0;
        }
        
        .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
}
</style>