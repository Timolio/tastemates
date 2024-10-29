import { media, users } from '../plugins/database';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { userId, username } = body;

    if (!userId) {
        return { success: false };
    }

    try {
        const user = await users.findOneAndUpdate(
            { _id: userId },
            {
                $setOnInsert: {
                    favorites: [],
                },
                $set: {
                    username: username,
                },
            },
            { upsert: true, returnDocument: 'after' }
        );

        const { favorites: favoritesIds } = user;

        if (!favoritesIds || favoritesIds.length === 0) {
            return { success: true, favorites: {} };
        }

        const favorites = await media
            .find({ _id: { $in: favoritesIds } })
            .toArray();

        return { success: true, userFavorites: favorites };
    } catch (error) {
        console.error('DB Error', error);
        return { success: false };
    }
});
