<template>
    <div class="container">
        <div class="circle" :style="circle1Style"></div>
        <div class="circle overlap" :style="circle2Style"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
        default: 50,
    },
    size: {
        type: Number,
        default: 150,
    },
});

const overlapDistance = computed(() => {
    return (props.size * (props.percentage / 100)) / 2;
});

const circle1Style = computed(() => ({
    backgroundImage: `url(${props.image1})`,
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundSize: 'cover',
    borderRadius: '50%',
    position: 'absolute',
    top: '0',
    left: `${overlapDistance.value}px`,
    zIndex: 1,
    opacity: 0.5,
}));

const circle2Style = computed(() => ({
    backgroundImage: `url(${props.image2})`,
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundSize: 'cover',
    borderRadius: '50%',
    position: 'absolute',
    top: '0',
    right: `${overlapDistance.value}px`,
    zIndex: 2,
    opacity: 0.5,
}));
</script>

<style scoped>
.container {
    position: relative;
    width: 300px; /* Достаточно, чтобы вместить два круга */
    height: 150px; /* Размер круга */
    display: flex;
    justify-content: center;
    align-items: center;
}

.circle {
    transition: left 0.3s ease, right 0.3s ease;
}

.overlap {
    position: absolute;
}
</style>
