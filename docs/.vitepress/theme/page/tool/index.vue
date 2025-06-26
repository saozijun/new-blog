<template>
    <div class="tool-page">
        <div class="page-header" data-fade style="--lv: 0;">
            <div>
                <h1 class="page-title">工具箱</h1>
                <div class="tool-stats">实用工具集合，持续添加中...</div>
            </div>
            <img src="../../static/xiaoxin/bixin.png" alt="">
        </div>
        
        <div class="category-tabs" data-fade style="--lv: 0.5;">
            <button 
                v-for="(category, idx) in categories" 
                :key="idx"
                :class="['category-tab', { active: currentCategory === category.id }]"
                @click="changeCategory(category.id)"
            >
                {{ category.name }}
            </button>
        </div>
        
        <div class="tools-container" data-fades style="--lv: 1;" :key="toolsContainerKey">
            <div 
                v-for="tool in filteredTools" 
                :key="tool.name" 
                class="tool-card"
                :class="{ 'external-tool': tool.isExternal }"
                @click="handleToolClick(tool)"
            >
                <div class="tool-icon" :style="{ backgroundColor: tool.iconBgColor || 'var(--vp-c-brand)' }">
                    <span v-if="!tool.iconUrl">{{ tool.shortName }}</span>
                    <img v-else :src="tool.iconUrl" alt="" />
                </div>
                <div class="tool-info">
                    <div class="tool-header">
                        <h3 class="tool-title">{{ tool.name }}</h3>
                        <span v-if="tool.isExternal" class="external-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </span>
                    </div>
                    <p class="tool-desc">{{ tool.description }}</p>
                    <div v-if="tool.tags && tool.tags.length" class="tool-tags">
                        <span v-for="(tag, tagIdx) in tool.tags" :key="tagIdx" class="tool-tag">{{ tag }}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 工具弹窗 -->
        <Transition name="fade">
            <div class="tool-dialog-overlay" v-if="activeToolComponent" @click="closeTool"></div>
        </Transition>
        
        <Transition name="slide">
            <div class="tool-dialog" v-if="activeToolComponent">
                <div class="dialog-header">
                    <h2>{{ activeToolName }}</h2>
                    <button class="close-btn" @click="closeTool">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="dialog-content">
                    <component :is="activeToolComponent"></component>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent, computed } from 'vue';

// 异步加载组件
const ImgTobase64 = defineAsyncComponent(() => 
    import('./components/ImgTobase64.vue')
);

// 分类
const categories = [
    { id: 'all', name: '全部' },
    { id: 'local', name: '内部工具' },
    { id: 'external', name: '外部工具' }
];

const currentCategory = ref('all');
const toolsContainerKey = ref(0);

// 切换分类
const changeCategory = (categoryId) => {
    currentCategory.value = categoryId;
    toolsContainerKey.value += 1;
};

// 工具列表
const tools = [
    {
        name: '图片转Base64',
        shortName: '图片',
        description: '将图片转换为Base64编码, 方便在网页中嵌入使用',
        component: markRaw(ImgTobase64),
        category: 'local',
        tags: ['图片处理', '编码转换']
    },
    {
        name: 'AI工具集',
        shortName: 'AI',
        description: 'AI工具集专注于收录和推荐国内外热门、创意、有趣、前沿的AI工具和网站。',
        externalUrl: 'https://ai-bot.cn/',
        isExternal: true,
        category: 'external',
        tags: ['AI']
    },
    {
        name: 'glTF Viewer',
        shortName: '3D',
        description: '3D模型查看工具, 可查看和测试3D模型, 支持多种格式',
        externalUrl: 'https://gltf-viewer.donmccurdy.com/',
        isExternal: true,
        category: 'external',
        tags: ['3D模型', '模型查看']
    },
    {
        name: 'Inspira UI',
        shortName: 'Inspira',
        description: '一个专为Vue3设计的动效组件库, 站点里好几个都是用的同款。',
        externalUrl: 'https://inspira-ui.com/',
        isExternal: true,
        category: 'external',
        tags: ['Vue', 'UI组件库', '炫酷组件']
    },
    {
        name: 'React Bits',
        shortName: 'React Bits',
        description: 'React设计的动效组件库、动画组件的开源资源库。',
        externalUrl: 'https://www.reactbits.dev/',
        isExternal: true,
        category: 'external',
        tags: ['React', 'UI组件库', '炫酷组件']
    },
    {
        name: 'Emoji 中文网',
        shortName: 'Emoji',
        description: 'Emoji 表情大全, 收录了所有常用表情符号，方便查找和选择。',
        externalUrl: 'https://www.emojiall.com/zh-hans/',
        isExternal: true,
        category: 'external',
        tags: ['Emoji']
    },
    {
        name: '3D 模型网',
        shortName: '模型',
        description: '超好用的3D模型网, 收录了多种类型的3D模型, 质量高, 模型可下载使用。',
        externalUrl: 'https://sketchfab.com/',
        isExternal: true,
        category: 'external',
        tags: ['3D模型','免费']
    },
    {
        name: 'JS 框架语法特性对比',
        shortName: 'JS特性对比',
        description: '各种主流框架 (Vue、React、Angular) 语言特性对比。',
        externalUrl: 'https://component-party.lainbo.com/',
        isExternal: true,
        category: 'external',
        tags: ['JS', '特性对比']
    },
    {
        name: 'CSS 生成器集合',
        shortName: ' CSS 生成器',
        description: '丰富的 CSS 生成器，各种不规则的样式生成器网站',
        externalUrl: 'https://css-generators.com/',
        isExternal: true,
        category: 'external',
        tags: ['CSS']
    }
];

// 根据当前分类过滤工具
const filteredTools = computed(() => {
    if (currentCategory.value === 'all') {
        return tools;
    } else if (currentCategory.value === 'local') {
        return tools.filter(tool => !tool.isExternal);
    } else if (currentCategory.value === 'external') {
        return tools.filter(tool => tool.isExternal);
    }
    return tools;
});

// 当前激活的工具
const activeToolComponent = ref(null);
const activeToolName = ref('');

// 处理工具点击
const handleToolClick = (tool) => {
    if (tool.isExternal && tool.externalUrl) {
        window.open(tool.externalUrl, '_blank');
    } else {
        openTool(tool);
    }
};

// 打开工具
const openTool = (tool) => {
    activeToolComponent.value = tool.component;
    activeToolName.value = tool.name;
    document.body.style.overflow = 'hidden'; // 防止背景滚动
};

// 关闭工具
const closeTool = () => {
    activeToolComponent.value = null;
    activeToolName.value = '';
    document.body.style.overflow = ''; // 恢复背景滚动
};
</script>

<style lang="scss" scoped>
.tool-page {
    max-width: 1100px;
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
        
        .page-title {
            font-size: 2.8rem;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }
        
        .tool-stats {
            font-size: 1rem;
            color: var(--vp-c-text-2);
        }
    }
    
    .category-tabs {
        display: flex;
        gap: 12px;
        margin: 1.5rem 0;
        flex-wrap: wrap;
        
        .category-tab {
            background-color: var(--vp-c-bg-soft);
            border: 1px solid var(--vp-c-divider);
            border-radius: 20px;
            padding: 6px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--vp-c-text-2);
            
            &:hover {
                color: var(--vp-c-text-1);
                border-color: var(--vp-c-brand-light);
            }
            
            &.active {
                background-color: var(--vp-c-brand-dimm);
                color: var(--vp-c-brand);
                border-color: var(--vp-c-brand-light);
                font-weight: 500;
            }
        }
    }
    
    .tools-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
        margin: 2rem 0;
        
        .tool-card {
            position: relative;
            background-color: var(--vp-c-bg-soft);
            border-radius: 16px;
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border: 1px solid transparent;
            height: 100%;
            
            
            &.external-tool {
                border-style: dashed;
                border-color: var(--vp-c-divider);
                
                &:hover {
                    border-style: solid;
                    border-color: var(--vp-c-brand);
                }
            }
            
            .tool-icon {
                width: 54px;
                height: 54px;
                background-color: var(--vp-c-brand);
                border-radius: 12px;
                padding: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 18px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                transition: all 0.3s ease;
                flex-shrink: 0;
                overflow: hidden;
                text-align: center;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            
            .tool-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                
                .tool-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    
                    .external-badge {
                        color: var(--vp-c-text-3);
                        display: flex;
                        align-items: center;
                    }
                }
                
                .tool-title {
                    width: fit-content;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    position: relative;
                    transition: color 0.2s;
                    
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
                
                .tool-desc {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: var(--vp-c-text-2);
                    line-height: 1.6;
                    flex-grow: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-word;
                }
                
                .tool-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    
                    .tool-tag {
                        font-size: 12px;
                        padding: 4px 8px;
                        border-radius: 12px;
                        background-color: var(--vp-c-bg);
                        color: var(--vp-c-text-3);
                        border: 1px solid var(--vp-c-divider);
                    }
                }
            }
            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                border-color: var(--vp-c-brand);
                
                .tool-title {
                    color: var(--vp-c-brand);
                    
                    &:before {
                        transform: scaleX(1) !important;
                        transform-origin: bottom left;
                    }
                }
                
                .tool-icon {
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
                }
            }
        }
    }
    
    .tool-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 999;
        backdrop-filter: blur(5px);
    }
    
    .tool-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--vp-c-bg);
        border-radius: 20px;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border: 1px solid var(--vp-c-bg-soft);
        overflow: hidden;
        
        .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 24px;
            border-bottom: 1px solid var(--vp-c-divider);
            background-color: var(--vp-c-bg);
            
            h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 500;
                color: var(--vp-c-brand);
            }
            
            .close-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                background: none;
                border: none;
                cursor: pointer;
                color: var(--vp-c-text-2);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                transition: all 0.2s;
                
                &:hover {
                    color: var(--vp-c-text-1);
                    background-color: var(--vp-c-bg-soft);
                }
            }
        }
        
        .dialog-content {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
        }
    }
}

// 动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -45%);
}

@media (max-width: 768px) {
    .tool-page {
        padding: 2rem 1rem;
        
        .page-header {
            .page-title {
                font-size: 2.2rem;
            }
        }
        
        .tools-container {
            grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
        }
        
        .tool-dialog {
            width: 95%;
            max-height: 95vh;
            border-radius: 16px;
            
            .dialog-header {
                padding: 16px 20px;
            }
            
            .dialog-content {
                padding: 20px;
            }
        }
    }
}
</style>