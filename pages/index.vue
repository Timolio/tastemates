<script setup>
const route = useRoute();

onMounted(async () => {
    // const startApp = initDataUnsafe?.start_param;
    const startApp = route.query?.startapp;
    console.log(startApp);
    if (!!startApp) {
        const params = JSON.parse(startApp);
        const link = `${window.location.origin}/booth?boothId=${params.boothId}&creatorId=${params.creatorId}`;
        console.log(link);
        await navigateTo(link, { external: true });
    } else {
        navigateTo('/search');
    }
});
</script>

<template></template>

<style scoped></style>
