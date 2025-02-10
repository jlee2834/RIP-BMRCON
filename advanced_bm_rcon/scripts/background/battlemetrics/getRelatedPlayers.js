export async function getRelatedPlayers(BMToken, BMID) {
    const response = await fetch(`https://api.battlemetrics.com/players/${BMID}/relationships/related-identifiers?version=%5E0.1.0&access_token=${BMToken}`);
    if (!response.ok) return;

    const data = await response.json();

    const relatedIDs = {};

    for (const identifier of data.data) {
        for (const relatedPlayer of identifier.relationships.relatedPlayers.data) {
            if (relatedIDs[relatedPlayer.id] === undefined) {
                relatedIDs[relatedPlayer.id] = 1;
            } else {
                relatedIDs[relatedPlayer.id]++;
            }
        }
    }

    const relatedPlayers = Object.entries(relatedIDs).sort((a, b) => b[1] - a[1]);
    if (relatedPlayers.length > 10) relatedPlayers.length = 10;
    // avoiding making too many request by returning the top 10 matches only

    return relatedPlayers;
}
