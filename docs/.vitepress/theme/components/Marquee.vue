<template>
    <div class="marquee-container" :class="[vertical ? 'vertical' : 'horizontal', $props.class]">
        <div v-for="index in repeat" :key="index" class="marquee-track" :class="[
            vertical
                ? 'vertical-track animate-marquee-vertical'
                : 'horizontal-track animate-marquee',
            pauseOnHover ? 'pause-on-hover' : '',
        ]" :style="{ animationDirection: reverse ? 'reverse' : 'normal' }">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useData } from "vitepress";
const { isDark } = useData();
withDefaults(
    defineProps<{
        class?: string;
        reverse?: boolean;
        pauseOnHover?: boolean;
        vertical?: boolean;
        repeat?: number;
    }>(),
    {
        pauseOnHover: false,
        vertical: false,
        repeat: 4,
    }
);
</script>

<style lang="scss" scoped>
.marquee-container {
    display: flex;
    overflow: hidden;
    padding: 8px 0;
    --duration: 40s;
    --gap: 1.5rem;
    gap: var(--gap);
    position: relative;
    &::before, &::after{
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 30%;
        background: linear-gradient(to right in oklab,var(--vp-c-bg), #0000 100%);
        z-index: 1;
        pointer-events: none;
    }
    &::after{
        left: auto;
        right: 0;
        background: linear-gradient(to left in oklab, var(--vp-c-bg) 0, #0000 100%);
        
    }
}

.marquee-container.horizontal {
    flex-direction: row;
}

.marquee-container.vertical {
    flex-direction: column;
}

.marquee-track {
    display: flex;
    flex-shrink: 0;
    justify-content: space-around;
    gap: var(--gap);
}

.horizontal-track {
    flex-direction: row;
}

.vertical-track {
    flex-direction: column;
}

.animate-marquee {
    animation: marquee var(--duration) linear infinite;
}

.animate-marquee-vertical {
    animation: marquee-vertical var(--duration) linear infinite;
}

.pause-on-hover {
    animation-play-state: running;
}

.marquee-container:hover .pause-on-hover {
    animation-play-state: paused;
}

@keyframes marquee {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(calc(-100% - var(--gap)));
    }
}

@keyframes marquee-vertical {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(calc(-100% - var(--gap)));
    }
}
</style>
