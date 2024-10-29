<script setup>
const { useWebApp } = await import('vue-tg');

const { initDataUnsafe } = useWebApp();
const route = useRoute();
const userStore = useUserStore();
const { userPhoto } = storeToRefs(userStore);

const result = ref({
    message: '',
    totalMatchPercentage: null,
    photo: null,
});

const checkLinkState = async () => {
    try {
        const response = await $fetch('/api/checkLink', {
            method: 'POST',
            body: {
                boothId: route.query?.boothId ?? null,
                creatorId: Number(route.query?.creatorId ?? null),
                telegramId: initDataUnsafe?.user?.id ?? 505,
            },
        });

        result.value = {
            message: response.message,
            totalMatchPercentage: response.totalMatchPercentage,
            photo: `data:image/jpeg;base64,${response.photo}`,
        };
        console.log(userPhoto, '-------', result.value.photo);
    } catch (error) {
        result.value.message = 'Произошла ошибка при проверке состояния ссылки';
        console.error(error);
    }
};

onMounted(() => {
    checkLinkState();
});
</script>

<template>
    <div
        class="container h-full flex flex-col gap-8 items-center justify-center"
    >
        <div v-if="!!result.totalMatchPercentage" class="flex flex-col gap-5">
            <h1 class="font-semibold text-4xl">
                <span class="text-xl">Ваше совпадение </span
                ><span class="sub rounded-xl px-3 mb-2"
                    >{{ result.totalMatchPercentage
                    }}<span class="text-3xl">%</span></span
                >
            </h1>
            <ProgressCircle
                :image1="result.photo"
                :image2="userPhoto"
                :percentage="result.totalMatchPercentage"
            />
        </div>
        <p v-else class="font-semibold text-xl">{{ result.message }}</p>
    </div>
</template>

<style scoped>
.container {
    text-align: center;
}

.sub {
    background-color: var(--tg-theme-button-d2color);
    box-shadow: 0 0 20px var(--tg-theme-button-dtcolor);
}
</style>
