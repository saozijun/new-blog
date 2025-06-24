<template>
    <div class="tool-page">
        <div class="page-header"  data-fade style="--lv: 0;">
            <div>
                <h1 class="page-title">工具箱</h1>
                <div class="tool-stats">实用工具集合，持续添加中...</div>
            </div>
            <img src="../../static/xiaoxin/bixin.png" alt="">
        </div>
        
        <div class="tools-container"  data-fades style="--lv: 1;">
            <div v-for="(tool, index) in tools" :key="index" class="tool-card" @click="openTool(tool)">
                <div class="tool-icon">
                    {{ tool.shortName }}
                </div>
                <div class="tool-info">
                    <h3 class="tool-title">{{ tool.name }}</h3>
                    <p class="tool-desc">{{ tool.description }}</p>
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
import { ref, markRaw, defineAsyncComponent } from 'vue';

// 异步加载组件
const ImgTobase64 = defineAsyncComponent(() => 
    import('./components/ImgTobase64.vue')
);
const JsonFormatter = defineAsyncComponent(() => 
    import('./components/JsonFormatter.vue')
);
const TimestampConverter = defineAsyncComponent(() => 
    import('./components/TimestampConverter.vue')
);
const PasswordGenerator = defineAsyncComponent(() => 
    import('./components/PasswordGenerator.vue')
);

// 工具列表
const tools = [
    {
        name: '图片转Base64',
        shortName: '图片',
        description: '将图片转换为Base64编码，方便在网页中嵌入使用',
        component: markRaw(ImgTobase64)
    },
    {
        name: 'JSON格式化工具',
        shortName: 'JSON',
        description: '格式化和压缩JSON字符串，方便查看和编辑',
        component: markRaw(JsonFormatter)
    },
    {
        name: '时间戳转换',
        shortName: '时间',
        description: '在Unix时间戳和日期时间之间进行转换',
        component: markRaw(TimestampConverter)
    },
    {
        name: '随机密码生成器',
        shortName: '密码',
        description: '生成安全的随机密码，可自定义各种选项',
        component: markRaw(PasswordGenerator)
    }
];

// 当前激活的工具
const activeToolComponent = ref(null);
const activeToolName = ref('');

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
    
    .tools-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin: 2rem 0;
        
        .tool-card {
            position: relative;
            background-color: var(--vp-c-bg-soft);
            border-radius: 16px;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            border: 1px solid transparent;
            
            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                border-color: var(--vp-c-brand);
                
                .tool-title {
                    color: var(--vp-c-brand);
                    
                    &:before {
                        transform: scaleX(1);
                        transform-origin: bottom left;
                    }
                }
                
                .tool-icon {
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
                }
            }
            
            .tool-icon {
                width: 54px;
                height: 54px;
                background-color: var(--vp-c-brand);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 18px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                transition: all 0.3s ease;
            }
            
            .tool-info {
                flex: 1;
                
                .tool-title {
                    width: fit-content;
                    margin: 0 0 8px 0;
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
                    margin: 0;
                    font-size: 14px;
                    color: var(--vp-c-text-2);
                    line-height: 1.6;
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