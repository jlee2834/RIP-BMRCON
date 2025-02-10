import { getRelativeTime } from "../other/getRelativeTime.js";

export async function getEACBannedAltsBulk(BMToken, relatedPlayers) {
    const bannedAlts = [];
    for await (const relatedPlayer of relatedPlayers) {
        const response = await fetch(`https://api.battlemetrics.com/players/${relatedPlayer[0]}?include=identifier&access_token=${BMToken}`);

        if (!response.ok) continue;

        const data = await response.json();

        const identifier = data.included.find((include) => include.type === "identifier" && include.attributes.type === "steamID");

        if (identifier.attributes.metadata !== null && identifier.attributes.metadata.rustBans !== undefined && identifier.attributes.metadata.rustBans.banned === true) {
            bannedAlts.push({
                name: data.data.attributes.name,
                BMID: relatedPlayer[0],
                relativeTime: getRelativeTime(new Date(identifier.attributes.metadata.rustBans.lastBan)),
                sharedIPs: relatedPlayer[1],
            });
        }
    }

    return bannedAlts;
}
