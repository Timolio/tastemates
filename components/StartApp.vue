<script setup>
const { useWebAppViewport } = await import('vue-tg');

const { disableVerticalSwipes, expand } = useWebAppViewport();

onMounted(async () => {
    disableVerticalSwipes();
    expand();
    const root = document.documentElement;
    const style = window.getComputedStyle(root);

    root.style.setProperty(
        '--tg-theme-button-dcolor',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', -20)
    );
    root.style.setProperty(
        '--tg-theme-section-bg-dcolor',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', -5)
    );
    root.style.setProperty(
        '--tg-theme-section-bg-lcolor',
        adjust(style.getPropertyValue('--tg-theme-section-bg-color') || '', 5)
    );
    root.style.setProperty(
        '--tg-theme-button-dtcolor',
        addAlpha(style.getPropertyValue('--tg-theme-button-color') || '', 0.15)
    );
    root.style.setProperty(
        '--tg-theme-button-d2color',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', -40)
    );
    root.style.setProperty(
        '--tg-theme-bg-lcolor',
        adjust(style.getPropertyValue('--tg-theme-bg-color') || '', 10)
    );
    root.style.setProperty(
        '--tg-theme-bg-dcolor',
        adjust(style.getPropertyValue('--tg-theme-bg-color') || '', -10)
    );
    root.style.setProperty(
        '--tg-theme-bg-d2color',
        adjust(style.getPropertyValue('--tg-theme-bg-color') || '', -20)
    );
});
</script>

<template></template>
