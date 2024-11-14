<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const route = useRoute();

const { initDataUnsafe } = useWebApp();
const { openTelegramLink } = useWebAppNavigation();

const { setLocale } = useI18n();

const userStore = useUserStore();
const noUser = ref(false);

onMounted(async () => {
    // if (!initDataUnsafe?.user) {
    //     noUser.value = true;
    //     return;
    // }

    const ru_langs = new Set([
        'be',
        'hy',
        'kk',
        'uz',
        'tk',
        'sah',
        'az',
        'ba',
        'ky',
    ]);
    const lang = ru_langs.has(initDataUnsafe?.user?.language_code)
        ? 'ru'
        : initDataUnsafe?.user?.language_code;
    setLocale(lang);

    const response = await userStore.fetchUser(initDataUnsafe?.user?.id ?? 505);
    console.log(response);
    if (!response) {
        noUser.value = true;
        return;
    }
    const startApp = initDataUnsafe?.start_param ?? route.query?.startapp;

    console.log(startApp);
    if (!!startApp) {
        const jsonString = atob(startApp);
        const params = JSON.parse(jsonString);
        const link = `/booth?boothId=${params.boothId}&creatorId=${params.creatorId}`;
        await navigateTo(link);
    } else {
        await navigateTo('/profile');
    }
});
</script>

<template>
    <div class="flex h-full flex-col justify-center items-center" v-if="noUser">
        <button
            class="no font-semibold rounded-2xl p-3 m-3"
            @click="openTelegramLink('https://t.me/tastemates_bot')"
        >
            {{ $t('start_bot') }}<br />
            {{ $t('open_bot') }}
        </button>
    </div>
</template>

<style scoped>
.no {
    background-color: var(--tg-theme-section-bg-dcolor);
}
</style>
