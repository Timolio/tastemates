export default function (conId) {
    const strConId = String(conId);
    let media_type;
    if (strConId[0] === '1') media_type = 'movie';
    else if (strConId[0] === '2') media_type = 'tv';

    let tmdbId = Number(strConId.slice(1));
    return tmdbId, media_type;
}
