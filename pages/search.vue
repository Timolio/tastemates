<script setup>
import _ from 'lodash';
const { useWebApp, useWebAppBackButton } = await import('vue-tg');
import { useUserStore } from '~/stores/userStore';

const { initDataUnsafe } = useWebApp();
const { hideBackButton } = useWebAppBackButton();

const route = useRoute();
const query = ref('');
const results = ref([]);
const userStore = useUserStore();
const status = ref(0);
const searchElement = ref();
const { favorites, userPhoto } = storeToRefs(userStore);

const searchTMDB = async () => {
    if (query.value.length < 2) {
        results.value = [];
        return;
    }

    try {
        results.value = [];
        status.value = 1;
        const data = await $fetch(`https://api.themoviedb.org/3/search/multi`, {
            params: {
                query: query.value,
                include_adult: true,
                language: initDataUnsafe?.user?.language_code ?? 'ru',
                page: 1,
            },
            headers: {
                accept: 'application/json',
                Authorization:
                    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGZlZWJjZWFiNWZmNTBjNzVkN2QyMGU4ZDFiMGQwMyIsIm5iZiI6MTcyOTc5ODQ5NS45Njc2MDIsInN1YiI6IjY3MWE5ZjA0MjdiZDU3ZDkxZjYyNzAyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PFMVhoE0874O8Os2QZaYGkvKwk7hsbNVE_1J7dJsMYQ',
            },
        });

        console.log(data.results);

        results.value = data.results
            .filter(
                result =>
                    result.media_type === 'movie' || result.media_type === 'tv'
            )
            .slice(0, 10);
        if (results.value.length === 0) {
            status.value = 2;
            return;
        }
        status.value = 0;
    } catch (error) {
        console.error('Error fetching data from TMDb:', error);
    }
};

const searchInput = _.debounce(searchTMDB, 600);

const goToProfile = async () => {
    await navigateTo('/profile');
};

onMounted(async () => {
    hideBackButton();
    searchElement.value.focus();
});
</script>

<template>
    <div class="h-full flex flex-col gap-2 p-2">
        <div class="w-full header-container flex rounded-2xl">
            <div
                class="header w-full rounded-2xl flex flex-row py-2 px-8 items-center justify-between"
            >
                <div class="flex flex-row gap-4 items-center">
                    <img
                        v-if="userPhoto !== null"
                        :src="userPhoto"
                        class="avatar"
                    />
                    <div class="flex flex-col gap-2">
                        <h1 class="text-2xl font-semibold">Timolio</h1>
                        <button
                            class="p-1 px-3 pr-2 flex flex-row gap-0.5 profile-button items-center"
                            @click="goToProfile"
                        >
                            <span class="mb-0.5 font-medium"> Профиль </span>
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 10 10"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polyline
                                    points="2,2 6,5 2,8"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </button>
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
        </div>
        <div
            class="flex flex-row items-center search-input text-xl rounded-2xl"
        >
            <input
                type="text"
                v-model="query"
                ref="searchElement"
                @input="searchInput"
                placeholder="Поиск"
                class="grow pl-3"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="grow-0 mr-6 hint"
                viewBox="0 0 16 16"
            >
                <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                />
            </svg>
        </div>
        <div class="ccontainer flex flex-col grow rounded-2xl">
            <!-- <div class="m-2 mb-4"></div> -->
            <div
                v-if="status === 0"
                :class="['results-container grow rounded-b-3xl px-8']"
            >
                <div v-if="query.length > 1">
                    <p class="mt-4 mb-2" v-if="results.length > 0">
                        Фильмы и сериалы
                    </p>
                    <ResultItem
                        v-for="result in results"
                        :result="result"
                        :is-favorite="
                            conId(result.id, result.media_type) in
                            userStore.favorites
                        "
                    />
                </div>
            </div>
            <div
                v-else-if="status === 1"
                class="grow flex items-center justify-center"
            >
                <svg
                    class="animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="36"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </div>
            <div v-else-if="status === 2">Ничего не найдено</div>
        </div>
    </div>
</template>

<style scoped>
.results-container {
    overflow-y: auto;
}

.results-container::-webkit-scrollbar {
    width: 8px;
}

.results-container::-webkit-scrollbar-track {
    background: transparent;
}

.results-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

.results-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.profile-button {
    background-color: var(--tg-theme-button-dtcolor);
    font-size: 0.8rem;
    border-radius: 5rem;
    color: var(--tg-theme-button-color);
    transition: all 0.1s;
}

.profile-button:hover {
    transform: scale(0.95);
}

.ccontainer {
    width: 100%;

    /* height: 100%; */
    /* box-shadow: 0px -10px 40px 30px rgba(0, 0, 0, 0.3); */
    /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); */
    background-color: var(--tg-theme-section-bg-dcolor);
    /* border-top-left-radius: 1.75rem; */
    /* border-top-right-radius: 1.75rem; */
    overflow: hidden;
}

.header {
    background-color: var(--tg-theme-section-bg-dcolor);
}

.heart {
    color: var(--tg-theme-destructive-text-color);
}

.search-input {
    width: 100%;

    /* box-shadow: 0 0 20px var(--tg-theme-button-dtcolor); */
    /* border: 2px solid var(--tg-theme-button-dcolor); */
    /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); */
    color: var(--tg-theme-text-color);
    background-color: var(--tg-theme-section-bg-lcolor);

    transition: all 0.1s;
}

.search-input input {
    outline: none;
    background: none;
    padding: 8px 0px 8px 1.5rem;
    z-index: 1000;
}

.header-container {
    min-height: 120px;
    /* background-image: linear-gradient(
        to top right,
        var(--tg-theme-button-color),
        var(--tg-theme-button-dcolor),
        var(--tg-theme-button-d2color)
    ); */
    /* box-shadow: 0 0 20px var(--tg-theme-button-dtcolor); */
    /* box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); */
}

.avatar {
    box-shadow: 0px 0px 25px 5px var(--tg-theme-button-dtcolor);
    width: 4.5rem;
    height: 4.5rem;
    background-color: #f5f5f5;
    border-radius: 50%;
}

.header-container.opened .avatar {
    width: 8rem;
    height: 8rem;
}
</style>
