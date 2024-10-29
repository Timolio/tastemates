import { users } from '~/server/plugins/database';

export default defineEventHandler(async event => {
    const userId = Number(event.context.params.userId);
    const query = getQuery(event);
    const itemId = Number(query.itemId);

    try {
        await users.updateOne(
            { _id: userId },
            { $pull: { favorites: itemId } }
        );

        return { success: true };
    } catch (error) {
        console.error('Error deleting like', error);
        return { success: false };
    }
});
