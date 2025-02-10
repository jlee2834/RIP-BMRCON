export async function getServerPlayers(BMToken, ServerID) {
    const response = await fetch(`https://api.battlemetrics.com/servers/${ServerID}?include=player,identifier&access_token=${BMToken}`);
    if (!response.ok) return;

    const data = await response.json();

    const players = [];

    for (const identifier of data.included) {
        if (identifier.type === "identifier" && identifier.attributes.type === "steamID") {
            const SteamID = identifier.attributes.identifier;
            const BMID = identifier.relationships.player.data.id;
            const player = data.included.find((include) => include.type === "player" && include.id === BMID);

            players.push({
                SteamID: SteamID,
                BMID: BMID,
                name: player.attributes.name,
            });
        }
    }

    return players;
}
