// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    css: ['~/assets/css/main.css'],

    runtimeConfig: {
        MONGO_URI: process.env.MONGO_URI,
        public: {
            tmdbApiKey: process.env.TMDB_API_KEY,
        },
    },

    modules: ['@nuxtjs/tailwindcss', 'nuxt-lodash', '@pinia/nuxt'],
});