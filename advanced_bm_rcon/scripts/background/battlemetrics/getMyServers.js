export async function getMyServers(BMToken) {
    const response = await fetch(`https://api.battlemetrics.com/servers?filter[rcon]=true&page[size]=100&access_token=${BMToken}`);
    if (!response.ok) return;

    return await response.json();
}
