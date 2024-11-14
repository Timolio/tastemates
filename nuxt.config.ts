// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },

    css: ['~/assets/scss/main.scss'],

    runtimeConfig: {
        MONGO_URI: process.env.MONGO_URI,
        BOT_TOKEN: process.env.BOT_TOKEN,
        public: {
            tmdbApiKey: process.env.TMDB_API_KEY,
        },
    },

    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-lodash',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
    ],

    i18n: {
        vueI18n: '~/i18n.config.ts',
    },
});
