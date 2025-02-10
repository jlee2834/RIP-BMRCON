import { getRelativeTime } from "./getRelativeTime.js";

export function convertDate(date) {
    return `${date.toLocaleDateString()} (${getRelativeTime(date)})`;
}
