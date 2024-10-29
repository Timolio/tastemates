import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => {
        return {
            userId: null,
            favorites: {},
        };
    },
    actions: {
        toggleFavorites(item) {
            if (item.id in this.favorites) {
                delete this.favorites[item.id];
            } else {
                this.favorites[item.id] = {
                    title: item.title ?? item.name,
                    poster_path: item.poster_path,
                    date: item.first_air_date ?? item.release_date,
                };
            }
        },
        async fetchUser(userId, username) {
            this.userId = userId;
            try {
                const data = await $fetch('/api/checkUser', {
                    method: 'PUT',
                    body: { userId, username },
                });
                if (data.success) {
                    this.favorites =
                        data?.userFavorites.reduce(
                            (acc, { _id, ...movieInfo }) => {
                                acc[_id] = movieInfo;
                                return acc;
                            },
                            {}
                        ) ?? {};
                }
                console.log('fetched', this.favorites);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        },
    },
});
