export default function (type, date) {
    const tags = [];
    if (type) tags.push(type);
    if (date) tags.push(convertDate(date));

    return tags.join(', ');
}
