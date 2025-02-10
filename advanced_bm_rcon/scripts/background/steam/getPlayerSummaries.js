import { convertDate } from "../other/convertDate.js";

export async function getPlayerSummaries(SteamToken, SteamID) {
    const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamToken}&steamids=${SteamID}`);
    if (!response.ok) return;

    const data = await response.json();
    const player = data.response.players[0];

    let visibility = "";
    let profileCreated = "";

    if (player.profilestate == 0) {
        visibility = "Not Configured";
    } else if (player.communityvisibilitystate === 3) {
        visibility = "Public";
    } else {
        visibility = "Private";
    }

    if (player.timecreated === undefined) {
        profileCreated = "Private";
    } else {
        profileCreated = convertDate(new Date(player.timecreated * 1000));
    }

    return {
        visibility: visibility,
        profileCreated: profileCreated,
        avatar: player.avatarmedium,
    };
}
