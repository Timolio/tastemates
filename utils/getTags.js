export default function (type, date) {
    const tags = [];
    if (type) tags.push(convertType(type));
    if (date) tags.push(convertDate(date));

    return tags.join(', ');
}
