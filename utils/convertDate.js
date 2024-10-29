export default function (first_air_date) {
    const date = new Date(first_air_date);
    return date.getFullYear().toString();
}
