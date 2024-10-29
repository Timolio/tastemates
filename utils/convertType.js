export default function (media_type) {
    if (media_type === 'movie') {
        return 'Фильм';
    } else if (media_type === 'tv') {
        return 'Сериал';
    } else if (media_type === 'person') {
        return 'в Людях';
    }
}
