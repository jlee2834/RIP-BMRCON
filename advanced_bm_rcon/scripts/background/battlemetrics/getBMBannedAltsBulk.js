export async function getBMBannedAltsBulk(BMToken, relatedPlayers) {
    const bans = [];

    for await (const relatedPlayer of relatedPlayers) {
        const response = await fetch(`https://api.battlemetrics.com/bans?filter[player]=${relatedPlayer[0]}&access_token=${BMToken}`);
        if (!response.ok) continue;

        const data = await response.json();
        
        for (const ban of data.data) {
            bans.push({
                name: ban.meta.player,
                BMID: ban.relationships.player.data.id,
                banID: ban.attributes.id,
                reason: ban.attributes.reason,
                sharedIPs: relatedPlayer[1],
            });
        }
    }

    return bans;
}
