<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const route = useRoute();

const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const userStore = useUserStore();
const noUser = ref(false);

onMounted(async () => {
    const response = await userStore.fetchUser(initDataUnsafe?.user?.id ?? 505);
    console.log(response);
    if (!response) {
        noUser.value = true;
        return;
    }
    const startApp = initDataUnsafe?.start_param;
    // const startApp = route.query?.startapp;

    console.log(startApp);
    if (!!startApp) {
        const jsonString = atob(startApp);
        const params = JSON.parse(jsonString);
        const link = `/booth?boothId=${params.boothId}&creatorId=${params.creatorId}`;
        await navigateTo(link);
    } else {
        await navigateTo('/search');
    }
});
</script>

<template>
    <div v-if="noUser">
        <button
            class="bg-black p-3 m-3"
            @click="openTelegramLink('https://t.me/tastemates_bot')"
        >
            Запусти бота, и начинай пользоватся tastemates!
        </button>
    </div>
</template>

<style scoped></style>
