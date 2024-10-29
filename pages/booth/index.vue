<script setup>
const { useWebApp } = await import('vue-tg');

const { initDataUnsafe } = useWebApp();
const route = useRoute();

const result = ref({
    message: '',
    totalMatchPercentage: null,
    images: [],
});

const checkLinkState = async () => {
    try {
        const response = await $fetch('/api/checkLink', {
            method: 'POST',
            body: {
                boothId: route.query?.boothId ?? null,
                creatorId: Number(route.query?.creatorId ?? null),
                telegramId: initDataUnsafe?.user?.id ?? 505,
                photoUrl:
                    initDataUnsafe?.user?.photo_url ??
                    'https://static-cdn4-2.vigbo.tech/u19297/22269/blog/4426958/5938479/78187796/1000-Ekaterina_Nasyrova-e480a1ec229af18e4e66b3d4e696eb2a.JPG',
            },
        });

        result.value = {
            message: response.message,
            totalMatchPercentage: response.totalMatchPercentage,
            images: [response.photo1, response.photo2],
        };
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
                :image1="result.images[0]"
                :image2="result.images[1]"
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
