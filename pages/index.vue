<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const route = useRoute();

const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const userStore = useUserStore();
const noUser = ref(false);

onMounted(async () => {
    // if (!initDataUnsafe?.user) {
    //     noUser.value = true;
    //     return;
    // }
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
    <div class="flex h-full flex-col justify-center items-center" v-if="noUser">
        <button
            class="no font-semibold rounded-2xl p-3 m-3"
            @click="openTelegramLink('https://t.me/tastemates_bot')"
        >
            Запусти бота, и начинай пользоватся<br />
            Открыть бота
        </button>
    </div>
</template>

<style scoped>
.no {
    background-color: var(--tg-theme-section-bg-dcolor);
}
</style>
