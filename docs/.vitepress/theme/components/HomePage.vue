<template>
    <div class="home-page">
        <header class="hero">
            <div class="sign-box">
                <Sign width="280px" />
            </div>
            <h1 class="tagline">A personal blog to share something interesting.</h1>
            <div>
                <span>嘘，偷偷告诉你，这里可能有：</span>
                <FlipWords
                    :words="['技术尝试', '常用工具', '碎碎念', 'Bug记录','其他小日记']"
                    :duration="3000"
                />
            </div>
            <div class="marquee-wrapper">
                <Marquee>
                    <div class="lable-item" v-for="(v, i) in labelList" :key="i" v-bind:style="{ 
                        'background': v.background, 
                        '-webkit-background-clip': 'text',
                        'background-clip': 'text',
                        'color': 'transparent',
                        '-webkit-text-fill-color': 'transparent'
                    }">{{ v.label }}</div>
                </Marquee>
            </div>
            <div class="loxbe-container">
                <Loxbe />
                <span>小监工</span>
            </div>
            <p class="description">... 站点装修中 ...</p>
        </header>
        <div class="content">
            <!-- <div class="marquee-wrapper">
                <Marquee>
                    <div class="marquee-item" v-for="i in 5" :key="i">{{ i }}</div>
                </Marquee>
                <Marquee reverse>
                    <div class="marquee-item" v-for="i in 5" :key="i">{{ i }}</div>
                </Marquee>
            </div> -->
            <div v-if="pvCount && uvCount">
                本站总访问量 {{ pvCount }} - 
                本站访客数 {{ uvCount }}
            </div>
        </div>
    </div>
    <span id="busuanzi_value_site_pv" />
    <span id="busuanzi_value_site_uv" />
</template>

<script setup>
import Sign from "./Sign.vue";
import Loxbe from "./Loxbe.vue";
import Marquee from "./Marquee.vue";
import FlipWords from "./FlipWords.vue";

import { ref, onMounted, computed, nextTick } from "vue";
const labelList = ref([{
    label: "CSS",
    background: "linear-gradient(135deg, #264de4,rgb(117, 173, 238))",
}, {
    label: "HTML",
    background: "linear-gradient(135deg, #e34c26,rgb(245, 145, 102))",
}, {
    label: "Javascript",
    background: "linear-gradient(135deg, #f7df1e,rgb(248, 235, 118))",
}, {
    label: "Vitepress",
    background: "linear-gradient(135deg, #646cff,rgb(32, 161, 221))",
}, {
    label: "Vue",
    background: "linear-gradient(135deg, #42b883, #3fb27f)",
}, {
    label: "React",
    background: "linear-gradient(135deg, #61dafb, #60d9fb)",
}, {
    label: "Springboot",
    background: "linear-gradient(135deg, #6db33f,rgb(164, 221, 138))",
}, {
    label: "Python",
    background: "linear-gradient(135deg, #3776ab,rgb(134, 185, 226))",
}, {
    label: "nodejs",
    background: "linear-gradient(135deg, #339933, #3c9d3c)",
}, {
    label: "mapboxGl",
    background: "linear-gradient(135deg, #4264fb, #4a74ff)",
}]);
const pvCount = ref(null);
const uvCount = ref(null);
const getPv = () => {
    const $PV = document.querySelector("#busuanzi_value_site_pv");
    const $UV = document.querySelector("#busuanzi_value_site_uv");
    pvCount.value = $PV.innerHTML;
    uvCount.value = $UV.innerHTML;
};

onMounted(() => {
    nextTick(() => {
        setTimeout(() => {
            getPv();
        }, 500)
    })
})

</script>

<style lang="scss" scoped>
.home-page {
    padding-top: 40px;
    max-width: 1152px;
    margin: 0 auto;
}

.hero {
    width: 100%;
    text-align: center;
    padding: 4rem 0;
    padding-bottom: 1rem;
}

.content {
    width: 100%;
    text-align: center;
    padding: 2rem 0;
}

.section-title {
    font-size: 2rem;
    margin: 2rem 0;
    color: var(--vp-c-text-1);
    text-align: center;
}

.sign-box {
    width: 280px;
    margin: 0 auto 2rem;
}

.tagline {
    font-size: 2rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
    margin: 0 0 0.5rem;
}

.description {
    font-size: 1.2rem;
    color: var(--vp-c-text-2);
}

.loxbe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}

.marquee-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 20px;
}

#busuanzi_value_site_pv,
#busuanzi_value_site_uv {
    display: none;
}

.marquee-item {
    width: 500px;
    height: 200px;
    background-color: var(--vp-c-bg-soft);
    padding: 20px;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid #cacaca45;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        border: 1px solid var(--vp-c-brand);
    }
}

.lable-item {
    background-color: var(--vp-c-bg-soft);
    padding: 4px 20px;
    font-size: 12px;
    border-radius: 50px;
    box-shadow: 0px 3px 1px var(--vp-c-gutter);
    transition: all 0.3s ease;
    font-weight: bold;
    &:hover {
        box-shadow: 0px 1px 1px var(--vp-c-gutter);
    }
}

@media screen and (max-width: 1244px) {
    .marquee-wrapper {
        max-width: calc(100vw - 128px);
    }
}

@media screen and (max-width: 960px) {
    .marquee-wrapper {
        max-width: calc(100vw - 92px);
    }
}

@media screen and (max-width: 640px) {
    .marquee-wrapper {
        max-width: calc(100vw - 48px);
    }
}
</style>
