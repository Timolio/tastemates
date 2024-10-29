export default function (itemId, media_type) {
    let prefix;
    if (media_type === 'movie') prefix = '1';
    else if (media_type === 'tv') prefix = '2';

    let conId = prefix + String(itemId);
    return Number(conId);
}
