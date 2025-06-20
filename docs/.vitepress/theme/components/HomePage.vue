<template>
    <div class="home-page">
        <header class="hero">
            <div class="sign-box">
                <Sign width="280px" />
            </div>
            <h1 class="tagline">A personal blog to share something interesting.</h1>
            <div class="loxbe-container">
                <Loxbe/>
                <span>小监工</span>
            </div>
            <p class="description">
                站点装修中...
            </p>
        </header>
    </div>
</template>

<script setup>
import Sign from './Sign.vue'
import Loxbe from './Loxbe.vue'
</script>

<style lang="scss" scoped>
.home-page {
    padding-top: 40px;
    max-width: 1152px;
    margin: 0 auto;
}

.hero {
    text-align: center;
    padding: 4rem 0;
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
.loxbe-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}
</style>