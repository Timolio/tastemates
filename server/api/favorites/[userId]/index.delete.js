import { users } from '~/server/plugins/database';
import conId from '~/utils/conId.js';

export default defineEventHandler(async event => {
    const userId = Number(event.context.params.userId);
    const query = getQuery(event);
    const itemId = Number(query.itemId);
    const media_type = query.mediaType;

    try {
        await users.updateOne(
            { _id: userId },
            { $pull: { favorites: conId(itemId, media_type) } }
        );

        return { success: true };
    } catch (error) {
        console.error('Error deleting like', error);
        return { success: false };
    }
});
