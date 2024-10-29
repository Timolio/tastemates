import { media, users } from '../plugins/database';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { userId } = body;

    if (!userId) {
        return { success: false };
    }

    try {
        const user = await users.findOne({ _id: userId });

        if (!user) {
            return { success: false };
        }

        const { favorites: favoritesIds, photo_base64 } = user;

        // const response = await $fetch(
        //     `https://api.telegram.org/file/bot${
        //         useRuntimeConfig().BOT_TOKEN
        //     }/${photo_url}`,
        //     { responseType: 'arrayBuffer' }
        // );

        // const userPhoto = Buffer.from(response).toString('base64');

        // console.log(typeof response, response);

        let favorites;
        if (favoritesIds.length === 0) {
            favorites = [];
        } else {
            favorites = await media
                .find({ _id: { $in: favoritesIds } })
                .toArray();
        }

        return {
            success: true,
            userFavorites: favorites,
            userPhoto: photo_base64,
        };
    } catch (error) {
        console.error('DB Error', error);
        return { success: false };
    }
});
