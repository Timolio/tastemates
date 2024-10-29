import { v4 as uuidv4 } from 'uuid';
import { booths } from '../plugins/database';

export default defineEventHandler(async event => {
    const query = getQuery(event);
    const { telegramId, photoUrl } = query;

    if (!telegramId) {
        throw createError('An error occured');
    }

    let existingBooth = await booths.findOne({
        'creator.id': Number(telegramId),
        'openedBy.id': null,
    });

    let boothId;
    if (existingBooth) {
        boothId = existingBooth._id;
    } else {
        boothId = uuidv4();
        await booths.insertOne({
            _id: boothId,
            creator: { id: Number(telegramId), photoUrl },
            openedBy: {
                id: null,
            },
            createdAt: new Date(),
        });
    }

    return {
        link: `https://t.me/tastemate_bot/start?startapp=${encodeURIComponent(
            JSON.stringify({ boothId, creatorId: telegramId })
        )}`,
        // link: `localhost:3000?startapp=${encodeURIComponent(
        //     JSON.stringify({ boothId, creatorId: telegramId })
        // )}`,
    };
});
