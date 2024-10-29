<script setup>
const { useWebApp, useWebAppTheme } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const userStore = useUserStore();

onMounted(async () => {
    const root = document.documentElement;
    const style = window.getComputedStyle(root);

    root.style.setProperty(
        '--tg-theme-button-dcolor',
        adjust(style.getPropertyValue('--tg-theme-button-color') || '', -20)
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
    await userStore.fetchUser(
        initDataUnsafe?.user?.id ?? 505,
        initDataUnsafe?.user?.username ?? 'Abobolio'
    );
});
</script>

<template></template>
