<script setup>
const { useWebApp, useWebAppNavigation } = await import('vue-tg');
const { initDataUnsafe } = useWebApp();

const userStore = useUserStore();
const { openTelegramLink, openLink } = useWebAppNavigation();
const { favorites, userPhoto } = storeToRefs(userStore);

const goToSearch = async () => {
    await navigateTo('/');
};

const generateLink = async () => {
    try {
        console.log(initDataUnsafe?.user?.id ?? 404);
        const response = await $fetch(
            `/api/generateLink?telegramId=${
                initDataUnsafe?.user?.id ?? 404
            }&photoUrl=${
                initDataUnsafe?.user?.photo_url ??
                'https://static-cdn4-2.vigbo.tech/u19297/22269/blog/4426958/5938479/78187796/1000-Ekaterina_Nasyrova-e480a1ec229af18e4e66b3d4e696eb2a.JPG'
            }`
        );
        return response.link;
    } catch (error) {
        console.error(error);
    }
};

const copyLink = async () => {
    const link = await generateLink();
    console.log(link);
    await navigator.clipboard.writeText(link);
};

const sendLink = async () => {
    const link = await generateLink();
    openTelegramLink(`https://t.me/share/url?url=${link}&text=@tastemate_bot`);
};
</script>

<template>
    <div class="h-full flex flex-col gap-3 p-3">
        <div class="ccontainer flex flex-col rounded-2xl grow-0">
            <div
                class="header h-full justify-between flex flex-row gap-4 items-center px-8 py-2"
            >
                <div class="flex flex-row items-center gap-4">
                    <img
                        v-if="userPhoto !== null"
                        :src="userPhoto"
                        class="avatar"
                    />
                    <div class="flex flex-col gap-2">
                        <h1 class="text-2xl font-semibold">Timolio</h1>
                    </div>
                </div>
                <div class="flex flex-row gap-2 items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        class="heart"
                    >
                        <path
                            d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"
                        />
                    </svg>
                    <div class="text-2xl heart font-bold">
                        {{ Object.keys(favorites ?? {}).length }}
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-1">
                <button
                    class="sub px-3 py-1 ml-5 rounded-l-full flex flex-row gap-2 items-center justify-between"
                    @click="sendLink"
                >
                    <div class="info mb-0.5 ml-2 font-semibold text-base">
                        Отправь ссылку
                    </div>
                    <div
                        class="info flex items-center mt-1 justify-center rounded-xl font-semibold"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"
                            />
                            <path
                                d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"
                            />
                        </svg>
                    </div>
                </button>
                <button
                    class="sub shrink-0 flex items-center justify-center size-10 rounded-r-full"
                    @click="copyLink"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6 info mr-1"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                        />
                    </svg>
                </button>
            </div>
            <div class="mx-6 mb-5 mt-1 font-semibold text-sm hint">
                <em>и узнай, насколько ваши вкусы совпадают!</em>
            </div>
        </div>
        <div
            class="ccontainer flex flex-col gap-3 grow rounded-2xl overflow-hidden"
        >
            <div class="items gap-3 px-8 py-6">
                <img
                    v-for="item in favorites"
                    class="poster rounded"
                    :src="`https://image.tmdb.org/t/p/w200${item.poster_path}`"
                    :alt="item.title"
                    @click="openLink(item.original_name)"
                />
            </div>
        </div>
        <button
            class="flex flex-row items-center search-input text-xl rounded-2xl grow-0"
            @click="goToSearch"
        >
            <div class="grow pl-3">Поиск</div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="grow-0 mr-6"
                viewBox="0 0 16 16"
            >
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.items {
    grid-template-columns: repeat(1, 1fr);
    overflow-y: auto;
    display: grid;
}

@media (min-width: 220px) {
    .items {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 350px) {
    .items {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 500px) {
    .items {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 600px) {
    .items {
        grid-template-columns: repeat(5, 1fr);
    }
}

.search-input {
    width: 100%;

    /* box-shadow: 0 0 20px var(--tg-theme-button-dtcolor); */
    /* border: 2px solid var(--tg-theme-button-dcolor); */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    color: var(--tg-theme-hint-color);
    background-color: var(--tg-theme-secondary-bg-color);

    transition: all 0.1s;
}

.search-input div {
    outline: none;
    background: none;
    padding: 8px 0px 8px 1.5rem;
}

.ccontainer .header {
    min-height: 120px;
}

.ccontainer {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    background-color: var(--tg-theme-bg-d2color);
}

.link-button {
    background-color: var(--tg-theme-button-d2color);
}

.info-container {
    background-color: var(--tg-theme-bg-d2color);
    box-shadow: 0 0 20px var(--tg-theme-button-dtcolor);
}

.sub {
    background-color: var(--tg-theme-button-dtcolor);
    box-shadow: 0 0 20px var(--tg-theme-button-dtcolor);
    align-self: flex-start;
    transition: all 0.1s;
}

.sub:active {
    transform: scale(0.95);
}

.sub .info {
    color: var(--tg-theme-button-color);
}

.avatar {
    box-shadow: 0px 0px 25px 5px var(--tg-theme-button-dtcolor);
    width: 4.5rem;
    height: 4.5rem;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.items::-webkit-scrollbar {
    width: 8px;
}

.items::-webkit-scrollbar-track {
    background: transparent;
}

.items::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

.items::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.heart {
    color: var(--tg-theme-destructive-text-color);
}

.poster {
    /* width: 70px;
    height: 105px; */
    box-shadow: 0px 0px 25px 5px var(--tg-theme-button-dtcolor);
    transition: all 0.1s;
}

.poster:hover {
    cursor: pointer;
}

.poster:active {
    transform: scale(0.95);
}
</style>
