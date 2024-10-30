import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => {
        return {
            userId: null,
            userPhoto: null,
            favorites: [],
        };
    },
    actions: {
        toggleFavorites(item) {
            const itemConId = conId(item.id, item.media_type);
            if (itemConId in this.favorites) {
                delete this.favorites[itemConId];
            } else {
                this.favorites[itemConId] = {
                    title: item.title ?? item.name,
                    poster_path: item.poster_path,
                    date: item.first_air_date ?? item.release_date,
                };
            }
        },
        async fetchUser(userId) {
            this.userId = userId;
            try {
                const data = await $fetch('/api/checkUser', {
                    method: 'PUT',
                    body: { userId },
                });
                if (data.success) {
                    this.favorites =
                        data?.userFavorites?.reduce(
                            (acc, { _id, ...movieInfo }) => {
                                acc[_id] = movieInfo;
                                return acc;
                            },
                            {}
                        ) ?? {};

                    this.userPhoto = `data:image/jpeg;base64,${data.userPhoto}`;
                    return true;
                }
                console.log('fetched', this.favorites);
                return false;
            } catch (error) {
                console.error('Error fetching user:', error);
                return false;
            }
        },
    },
});
