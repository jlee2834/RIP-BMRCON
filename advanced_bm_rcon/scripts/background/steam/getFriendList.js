export async function getFriendsList(SteamToken, SteamID) {
    const response = await fetch(`https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${SteamToken}&steamid=${SteamID}&relationship=friend`);
    if (!response.ok) return;

    const data = await response.json();

    if (data.friendslist === undefined) return;

    const friends = [];

    for (const friend of data.friendslist.friends) {
        friends.push(friend.steamid);
    }

    return friends;
}
