import { convertDate } from "../other/convertDate.js";
import { getRelativeTime } from "../other/getRelativeTime.js";

export async function getPlayerInfo(BMToken, BMID, YourServers) {
    const response = await fetch(`https://api.battlemetrics.com/players/${BMID}?include=server,identifier&fields[server]=name,ip,port&access_token=${BMToken}`);
    if (!response.ok) return;

    const data = await response.json();

    const identifier = data.included.find((include) => include.type === "identifier" && include.attributes.type === "steamID");

    const currentSession = {
        server: "Offline",
        ip: "-",
        serverId: "-",
        joinDate: "-",
        online: false,
    };

    const playtime = {
        bm: 0,
        aimtrain: 0,
        serverCount: 0,
        yourServers: 0,
        inaccurate: false,
    };

    let allServerCount = 0;

    for (const server of data.included.filter((include) => include.type === "server")) {
        allServerCount++;
        if (server.relationships.game.data.id === "rust") {
            playtime.serverCount++;
            playtime.bm += server.meta.timePlayed / 3600;

            const serverName = server.attributes.name.toLowerCase();
            if (serverName.includes("ukn") || serverName.includes("aim")) {
                playtime.aimtrain += server.meta.timePlayed / 3600;
            }

            if (YourServers.some((x) => x.enabled === true && x.id == server.id)) {
                playtime.yourServers += server.meta.timePlayed / 3600;
            }

            if (server.meta.online === true) {
                currentSession.online = true;
                currentSession.serverId = server.id;
                currentSession.server = server.attributes.name;
                currentSession.ip = `client.connect ${server.attributes.ip}:${server.attributes.port}`;
                currentSession.joinDate = getRelativeTime(new Date(server.meta.lastSeen));
            }
        }
    }

    playtime.bm = playtime.bm.toFixed(1);
    playtime.aimtrain = playtime.aimtrain.toFixed(1);
    playtime.yourServers = playtime.yourServers.toFixed(1);
    if (allServerCount >= 250) {
        playtime.inaccurate = true;
    }

    return {
        profileCreated: convertDate(new Date(data.data.attributes.createdAt)),
        session: currentSession,
        playtime: playtime,
        rustBans: identifier.attributes.metadata === null ? undefined : identifier.attributes.metadata.rustBans,
        private: data.data.attributes.private,
    };
}
