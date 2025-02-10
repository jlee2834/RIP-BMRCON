import { isWithin24hours } from "../other/isWithin24hours.js";
export async function getActivity(BMToken, Arkan, Guardian, BMID) {
    const responses = [];
    await FetchActivity(
        `https://api.battlemetrics.com/activity?tagTypeMode=and&filter[types][blacklist]=event:query&filter[players]=${BMID}&include=organization,user&page[size]=1000&access_token=${BMToken}`
    );

    const cheatingReports = [];
    const cheatingReports24h = [];
    const teamingReports = [];
    const teamingReports24h = [];
    const otherReports = [];
    const otherReports24h = [];

    let kills = 0;
    let kills24h = 0;
    let deaths = 0;
    let deaths24h = 0;

    let noRecoil = 0;
    let noRecoil24h = 0;
    let aimbot = 0;
    let aimbot24h = 0;

    let guardianCheat = 0;
    let guardianCheat24h = 0;
    let guardianFlood = 0;
    let guardianFlood24h = 0;

    for (const response of responses) {
        for (const activity of response) {
            const messageType = activity.attributes.messageType;
            const data = activity.attributes.data;
            const within24hours = isWithin24hours(new Date(activity.attributes.timestamp));

            if (messageType == "rustLog:playerReport") {
                if (data.forPlayerId == BMID) {
                    const report = (data.reason.replace("[cheat]", "").replace("[spam]", "").replace("[abusive]", "") + " " + data.message).toLowerCase();

                    if (cheatingWords.some((word) => report.includes(word))) {
                        if (!cheatingReports.includes(data.fromPlayerId)) {
                            cheatingReports.push(data.fromPlayerId);
                        }

                        if (within24hours) {
                            if (!cheatingReports24h.includes(data.fromPlayerId)) {
                                cheatingReports24h.push(data.fromPlayerId);
                            }
                        }
                    } else if (teamingWords.some((word) => report.includes(word))) {
                        if (!teamingReports.includes(data.fromPlayerId)) {
                            teamingReports.push(data.fromPlayerId);
                        }

                        if (within24hours) {
                            if (!teamingReports24h.includes(data.fromPlayerId)) {
                                teamingReports24h.push(data.fromPlayerId);
                            }
                        }
                    } else if (data.reportType == "cheat") {
                        if (!cheatingReports.includes(data.fromPlayerId)) {
                            cheatingReports.push(data.fromPlayerId);
                        }

                        if (within24hours) {
                            if (!cheatingReports24h.includes(data.fromPlayerId)) {
                                cheatingReports24h.push(data.fromPlayerId);
                            }
                        }
                    } else {
                        if (!otherReports.includes(data.fromPlayerId)) {
                            otherReports.push(data.fromPlayerId);
                        }

                        if (within24hours) {
                            if (!otherReports24h.includes(data.fromPlayerId)) {
                                otherReports24h.push(data.fromPlayerId);
                            }
                        }
                    }
                }
            } else if (messageType == "rustLog:playerDeath:PVP") {
                if (data.killer_id == BMID) {
                    kills++;
                    if (within24hours) {
                        kills24h++;
                    }
                } else if (data.player_id == BMID) {
                    deaths++;
                    if (within24hours) {
                        deaths24h++;
                    }
                }
            } else if (messageType == "unknown") {
                const message = activity.attributes.message;

                if (Arkan) {
                    if (message.startsWith("[Arkan] No Recoil probable violation")) {
                        noRecoil++;
                        if (within24hours) {
                            noRecoil24h++;
                        }
                    } else if (message.startsWith("[Arkan] AIMBOT probable violation")) {
                        aimbot++;
                        if (within24hours) {
                            aimbot24h++;
                        }
                    }
                }

                if (Guardian) {
                    if (message.includes(" for AntiCheat(")) {
                        guardianCheat++;
                        if (within24hours) {
                            guardianCheat24h++;
                        }
                    } else if (message.includes(" for AntiFlood")) {
                        guardianFlood++;
                        if (within24hours) {
                            guardianFlood24h++;
                        }
                    }
                }
            }
        }
    }

    let kd;
    let kd24h;

    if (deaths == 0) {
        if (kills > 0) {
            kd = kills;
        } else {
            kd = "-";
        }
    } else {
        kd = Math.round((kills / deaths) * 100) / 100;
    }

    if (deaths24h == 0) {
        if (kills24h > 0) {
            kd24h = kills24h;
        } else {
            kd24h = "-";
        }
    } else {
        kd24h = Math.round((kills24h / deaths24h) * 100) / 100;
    }

    return {
        cheatingReports: cheatingReports.length,
        cheatingReports24h: cheatingReports24h.length,
        teamingReports: teamingReports.length,
        teamingReports24h: teamingReports24h.length,
        otherReports: otherReports.length,
        otherReports24h: otherReports24h.length,

        kills: kills,
        kills24h: kills24h,
        deaths: deaths,
        deaths24h: deaths24h,
        kd: kd,
        kd24h: kd24h,

        noRecoil: Arkan ? noRecoil : undefined,
        noRecoil24h: Arkan ? noRecoil24h : undefined,
        aimbot: Arkan ? aimbot : undefined,
        aimbot24h: Arkan ? aimbot24h : undefined,

        guardianCheat: Guardian ? guardianCheat : undefined,
        guardianCheat24h: Guardian ? guardianCheat24h : undefined,
        guardianFlood: Guardian ? guardianFlood : undefined,
        guardianFlood24h: Guardian ? guardianFlood24h : undefined,
    };

    async function FetchActivity(url) {
        const response = await fetch(url);
        if (!response.ok) return;

        const data = await response.json();

        responses.push(data.data);

        if (data.links.next) {
            await FetchActivity(data.links.next + `&access_token=${BMToken}`);
        }
    }
}

const teamingWords = [
    " team",
    "teaming",
    "teamming", // common typo
    "limit",
    "rule",
    "alliance",
    "max",
    "group",
    "duo",
    "trio",
    "quad",
    "squad",
    "man",
];

const cheatingWords = ["cheat", "hack", "aim", "wallhack", "wh", "esp", "fly", "head", "vision", "speed"];
