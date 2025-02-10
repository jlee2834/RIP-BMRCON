export async function getPlaytime(SteamToken, SteamID) {
    const response = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${SteamToken}&steamid=${SteamID}`);
    if (!response.ok) return "Error";

    const data = await response.json();

    if (Object.keys(data.response).length === 0) {
        return "Private";
    }

    if (data.response.games.every((x) => x.playtime_forever === 0)) return "Private";

    const rust = data.response.games.find((x) => x.appid === 252490);
    if (rust === undefined) return "Private";

    return Math.round((rust.playtime_forever / 60) * 10) / 10;
}
