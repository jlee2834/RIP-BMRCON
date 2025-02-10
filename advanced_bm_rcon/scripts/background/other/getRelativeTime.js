const units = {
    year: 24 * 60 * 60 * 1000 * 365,
    month: (24 * 60 * 60 * 1000 * 365) / 12,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function getRelativeTime(date) {
    const elapsed = date - new Date();

    for (const unit in units) {
        if (Math.abs(elapsed) > units[unit] || unit == "second") {
            const relativeTime = rtf.format(Math.round((elapsed / units[unit]) * 10) / 10, unit);
            return relativeTime;
        }
    }
}
