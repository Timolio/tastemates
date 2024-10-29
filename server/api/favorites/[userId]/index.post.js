import { media, users } from '~/server/plugins/database';
import conId from '~/utils/conId.js';

export default defineEventHandler(async event => {
    const userId = Number(event.context.params.userId);
    const query = getQuery(event);
    const itemId = Number(query.itemId);
    const body = await readBody(event);
    const { original_language, media_type } = body;

    try {
        let item = await media.findOne({ _id: conId(itemId, media_type) });

        if (!item) {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization:
                        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGZlZWJjZWFiNWZmNTBjNzVkN2QyMGU4ZDFiMGQwMyIsIm5iZiI6MTcyOTc5ODQ5NS45Njc2MDIsInN1YiI6IjY3MWE5ZjA0MjdiZDU3ZDkxZjYyNzAyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.PFMVhoE0874O8Os2QZaYGkvKwk7hsbNVE_1J7dJsMYQ',
                },
            };
            const response = await $fetch(
                `https://api.themoviedb.org/3/${media_type}/${itemId}?append_to_response=keywords&language=${original_language}`,
                options
            );

            const keywords =
                response.keywords?.keywords ?? response.keywords?.results;

            item = {
                _id: conId(itemId, media_type),
                poster_path: response.poster_path,
                keywords: keywords.map(item => item.id),
                original_name:
                    response.original_title ?? response.original_name,
                original_language,
            };

            await media.insertOne(item);
        }

        await users.updateOne(
            { _id: userId },
            { $addToSet: { favorites: conId(itemId, media_type) } }
        );
        return { success: true, poster_path: item.poster_path };
    } catch (error) {
        console.error('Error adding like', error);
        return { success: false };
    }
});
