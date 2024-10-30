import { booths, media, users } from '../plugins/database';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { boothId, telegramId, creatorId } = body;

    if (!boothId || !telegramId || !creatorId) {
        throw createError('An error occured');
    }

    const booth = await booths.findOne({
        _id: boothId,
        'creator.id': creatorId,
    });

    if (!booth) {
        console.error('Booth not found');
        throw createError('An error occured');
    }

    if (telegramId == creatorId) {
        if (!booth.openedBy.id) {
            return {
                message: 'Никто ещё не открыл эту ссылку',
            };
        } else {
            const openedByUser = await users.findOne({
                _id: booth.openedBy.id,
            });
            return {
                message: `Эту ссылку уже открыл пользователь с ID: ${booth.openedBy.id}`,
                totalMatchPercentage: booth.totalMatchPercentage,
                photo: openedByUser.photo_base64,
            };
        }
    }

    if (booth.openedBy.id === telegramId) {
        const creatorUser = await users.findOne({ _id: booth.creator.id });
        console.log(creatorUser.photo_base64);
        return {
            message: `Вы уже открывали эту ссылку.`,
            totalMatchPercentage: booth.totalMatchPercentage,
            photo: creatorUser.photo_base64,
        };
    } else if (booth.openedBy.id !== null) {
        return {
            message: 'Эта ссылка уже была использована не вами.',
        };
    }

    const creatorUser = await users.findOne({ _id: booth.creator.id });

    // Шаг 1: Получаем списки любимых фильмов для пользователей
    const { favorites: creatorIds } = await users.findOne({ _id: creatorId });
    const { favorites: openedByIds } = await users.findOne({
        _id: telegramId,
    });

    // Шаг 2: Совпадение по фильмам с нормализацией по минимальному набору
    const commonMovieIds = creatorIds.filter(id => openedByIds.includes(id));
    const minFavoriteCount = Math.min(creatorIds.length, openedByIds.length);
    const movieMatchPercentage =
        (commonMovieIds.length / minFavoriteCount) * 100;

    // Шаг 3: Получаем ключевые слова для всех фильмов пользователя 1 и 2 (не меняется)
    const creatorKeywords = await media
        .find({ _id: { $in: creatorIds } })
        .project({ _id: 0, keywords: 1 })
        .toArray();

    const openedByKeywords = await media
        .find({ _id: { $in: openedByIds } })
        .project({ _id: 0, keywords: 1 })
        .toArray();

    // Шаг 4: Подсчитываем частоту ключевых слов для каждого пользователя (не меняется)
    const keywordFrequencyCreator = countKeywordFrequency(creatorKeywords);
    const keywordFrequencyOpenedBy = countKeywordFrequency(openedByKeywords);

    // Подсчет общего числа ключевых слов у каждого пользователя
    const totalKeywordsCreator = Object.values(keywordFrequencyCreator).reduce(
        (a, b) => a + b,
        0
    );
    const totalKeywordsOpenedBy = Object.values(
        keywordFrequencyOpenedBy
    ).reduce((a, b) => a + b, 0);

    // Шаг 5: Определяем совпадение по ключевым словам с нормализацией
    let commonKeywordsCount = 0;
    Object.keys(keywordFrequencyCreator).forEach(keyword => {
        if (keyword in keywordFrequencyOpenedBy) {
            commonKeywordsCount += Math.min(
                keywordFrequencyCreator[keyword],
                keywordFrequencyOpenedBy[keyword]
            );
        }
    });

    // Рассчитываем процент совпадения по ключевым словам, нормализуя по минимальному количеству ключевых слов
    const minTotalKeywords = Math.min(
        totalKeywordsCreator,
        totalKeywordsOpenedBy
    );
    const keywordMatchPercentage =
        (commonKeywordsCount / minTotalKeywords) * 100;

    // Шаг 6: Рассчитываем общий процент совпадения с учетом веса
    const movieWeight = 0.6;
    const keywordWeight = 0.4;
    const totalMatchPercentage = Math.round(
        movieMatchPercentage * movieWeight +
            keywordMatchPercentage * keywordWeight
    );

    await booths.updateOne(
        { _id: boothId, 'creator.id': creatorId },
        {
            $set: {
                'openedBy.id': telegramId,
                totalMatchPercentage,
            },
        }
    );

    return {
        message: `Вы успешно открыли ссылку.`,
        totalMatchPercentage,
        photo: creatorUser.photo_base64,
    };
});

function countKeywordFrequency(mediaArray) {
    const frequency = {};
    mediaArray.forEach(media => {
        media.keywords.forEach(keyword => {
            if (frequency[keyword]) {
                frequency[keyword] += 1;
            } else {
                frequency[keyword] = 1;
            }
        });
    });
    return frequency;
}
