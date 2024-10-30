import { booths, media, users } from '../plugins/database';

export default defineEventHandler(async event => {
    const body = await readBody(event);
    const { boothId, telegramId, creatorId } = body;

    console.log(typeof boothId, typeof telegramId, typeof creatorId);

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

    if (
        booth.openedBy.id !== telegramId &&
        creatorId !== telegramId &&
        booth.openedBy.id !== null
    ) {
        return {
            message: 'Эта ссылка уже была использована не вами.',
        };
    }

    if (telegramId == creatorId) {
        if (!booth.openedById) {
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

    const creatorUser = await users.findOne({ _id: booth.creator.id });

    if (booth.openedBy.id === telegramId) {
        return {
            message: `Вы уже открывали эту ссылку.`,
            totalMatchPercentage: booth.totalMatchPercentage,
            photo: creatorUser.photo_base64,
        };
    }

    // Шаг 1: Получаем списки любимых фильмов для пользователей
    const { favorites: creatorIds } = await users.findOne({ _id: creatorId });
    const { favorites: openedByIds } = await users.findOne({
        _id: telegramId,
    });

    // Шаг 2: Совпадение по фильмам
    const commonMovieIds = creatorIds.filter(id => openedByIds.includes(id));
    const movieMatchPercentage =
        (commonMovieIds.length /
            new Set([...creatorIds, ...openedByIds]).size) *
        100;

    // Шаг 3: Получаем ключевые слова для всех фильмов пользователя 1 и 2
    const creatorKeywords = await media
        .find({ _id: { $in: creatorIds } })
        .project({ _id: 0, keywords: 1 })
        .toArray();

    const openedByKeywords = await media
        .find({ _id: { $in: openedByIds } })
        .project({ _id: 0, keywords: 1 })
        .toArray();

    // Собираем все ключевые слова и считаем их частоту для каждого пользователя
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

    // Определяем совпадение по ключевым словам, учитывая частичное совпадение
    let commonKeywordsCount = 0;
    Object.keys(keywordFrequencyCreator).forEach(keyword => {
        if (keyword in keywordFrequencyOpenedBy) {
            // Учитываем минимальную частоту ключевого слова как частичное совпадение
            commonKeywordsCount += Math.min(
                keywordFrequencyCreator[keyword],
                keywordFrequencyOpenedBy[keyword]
            );
        }
    });

    // Рассчитываем процент совпадения по ключевым словам с нормализацией
    const keywordMatchPercentage =
        (commonKeywordsCount /
            ((totalKeywordsCreator + totalKeywordsOpenedBy) / 2)) *
        100;

    // Шаг 4: Рассчитываем общий процент совпадения с учетом веса
    const movieWeight = 0.6;
    const keywordWeight = 0.4;
    const totalMatchPercentage = Math.round(
        movieMatchPercentage * movieWeight +
            keywordMatchPercentage * keywordWeight
    );

    console.log(
        movieMatchPercentage,
        keywordMatchPercentage,
        totalMatchPercentage
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
