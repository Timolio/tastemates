<script setup>
import _ from 'lodash';

const props = defineProps({
    result: Object,
    isFavorite: {
        type: Boolean,
        default: false,
    },
});

const isFavorite = ref(props.isFavorite);
const userStore = useUserStore();

const favoritize = async () => {
    let body;
    try {
        if (isFavorite.value) {
            body = {
                original_language: props.result?.original_language,
                media_type: props.result.media_type,
            };
        }
        const response = await $fetch(
            `/api/favorites/${userStore.userId}?itemId=${props.result.id}`,
            {
                method: isFavorite.value ? 'POST' : 'DELETE',
                body: isFavorite.value ? body : null,
            }
        );

        const updatedResult = {
            ...props.result,
            poster_path: response.poster_path,
        };

        userStore.toggleFavorites(updatedResult);
        console.log('Hello');
    } catch (error) {
        console.error('Error', error);
    }
};

const debouncedFavoritize = _.debounce(async () => {
    await favoritize();
}, 350);

const favoriteInput = async () => {
    console.log('STATE', isFavorite.value);
    isFavorite.value = !isFavorite.value;
    await debouncedFavoritize();
};

const inactiveHeart =
    'm8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z';
const activeHeart =
    'M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1';
</script>

<template>
    <div class="result-item flex flex-row gap-4 items-center">
        <img
            v-if="result.poster_path"
            class="poster grow-0 rounded"
            :src="`https://image.tmdb.org/t/p/w200${result.poster_path}`"
            :alt="result?.title ?? result?.name"
        />
        <div class="info grow">
            <h3 class="font-semibold text-lg">
                {{ result?.title ?? result?.name }}
            </h3>
            <p>
                {{
                    getTags(
                        result.media_type,
                        result?.first_air_date ?? result?.release_date
                    )
                }}
            </p>
        </div>
        <button
            :class="['grow-0 heart p-1', { active: isFavorite }]"
            @click="favoriteInput"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path :d="isFavorite ? activeHeart : inactiveHeart" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.result-item {
    display: flex;
    margin-bottom: 20px;
    color: var(--tg-theme-text-color);
}

.heart {
    color: var(--tg-theme-hint-color);
    transition: all 0.1s;
}

.heart:active {
    transform: scale(0.9);
}

.heart.active {
    color: var(--tg-theme-destructive-text-color);
}

.poster {
    width: 70px;
    height: 105px;
    box-shadow: 0px 0px 25px 5px var(--tg-theme-button-dtcolor);
}

.info {
    margin-bottom: 5px;
}
</style>
