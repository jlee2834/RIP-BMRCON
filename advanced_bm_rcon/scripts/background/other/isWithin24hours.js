export function isWithin24hours(date) {
    const timeStamp = Math.round(new Date().getTime() / 1000);
    const timeStampYesterday = timeStamp - 24 * 3600;
    return date >= new Date(timeStampYesterday * 1000).getTime();
}
