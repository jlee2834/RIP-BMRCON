chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case "GetPlayerInfo":
            handlePlayerInfo(request.response);
            break;

        case "GetPlayerSummaries":
            handlePlayerSummaries(request.response);
            break;

        case "GetActivity":
            handleActivity(request.response);
            break;

        case "GetOnlineFriends":
            ONLINEFRIENDS.innerHTML = request.response.count;

            if (request.response.friends.length > 0) {
                createElement("h4", `Online Friends (${request.response.friends.length}):`, ONLINEFRIENDSINFO);
                const div = createElement("ul", "", ONLINEFRIENDSINFO);
                for (const friend of request.response.friends) {
                    const li = createElement("li", "", div);
                    const a = createElement("a", friend.name, li);
                    a.href = `https://www.battlemetrics.com/rcon/players/${friend.BMID}`;
                }
            }

            break;

        case "GetSteamPlaytime":
            handleSteamPlaytime(request.response);
            break;

        case "GetEACBannedAlts":
            handleEACBannedAlts(request.response);
            break;

        case "GetBMBannedAlts":
            handleBMBannedAlts(request.response);
            break;

        default:
            break;
    }
});

function handleBMBannedAlts(response) {
    if (response === undefined) {
        BMBANNEDIPS.innerHTML = "Error";
        return;
    }

    BMBANNEDIPS.innerHTML = response.length;

    if (response.length > 0) {
        setStaticColor(BMBANNEDIPS, "Red");
        createElement("h4", `BM Banned IPS (${response.length}):`, BMBANNEDIPSINFO);
        const div = createElement("ul", "", BMBANNEDIPSINFO);
        for (const ban of response) {
            const li = createElement("li", "", div);
            const a = createElement("a", ban.name, li);
            a.href = `https://www.battlemetrics.com/rcon/players/${ban.BMID}`;
            createElement("span", " - ", li);
            const a2 = createElement("a", ban.reason, li);
            a2.href = `https://www.battlemetrics.com/rcon/bans/edit/${ban.banID}`;
            createElement("span", ` - IPs shared: ${ban.sharedIPs}`, li);
        }
    }
}

function handleEACBannedAlts(response) {
    if (response === undefined) {
        EACBANNEDIPS.innerHTML = "Error";
        return;
    }

    EACBANNEDIPS.innerHTML = response.length;

    if (response.length > 0) {
        setStaticColor(EACBANNEDIPS, "Red");
        createElement("h4", `EAC Banned IPS (${response.length}):`, EACBANNEDIPSINFO);
        const div = createElement("ul", "", EACBANNEDIPSINFO);
        for (const account of response) {
            const li = createElement("li", "", div);
            const a = createElement("a", account.name, li);
            a.href = `https://www.battlemetrics.com/rcon/players/${account.BMID}`;
            createElement("span", ` - ${account.relativeTime} - IPs shared: ${account.sharedIPs}`, li);
        }
    }
}

function handlePlayerInfo(response) {
    if (response.private === true) {
        SERVERSPLAYED.innerHTML = "Private";
        BMPLAYTIME.innerHTML = "Private";
        AIMTRAINPLAYTIME.innerHTML = "Private";
        setStaticColor(SERVERSPLAYED, "Red");
        setStaticColor(BMPLAYTIME, "Red");
        setStaticColor(AIMTRAINPLAYTIME, "Red");
    } else {
        SERVERSPLAYED.innerHTML = response.playtime.serverCount;
        BMPLAYTIME.innerHTML = response.playtime.bm + " hours";
        AIMTRAINPLAYTIME.innerHTML = response.playtime.aimtrain + " hours";
        setPlayTimeColor(SERVERSPLAYED, response.playtime.serverCount, 15, 25, 50);
        setPlayTimeColor(BMPLAYTIME, response.playtime.bm, 100, 250, 750);
        setPlayTimeColor(AIMTRAINPLAYTIME, response.playtime.aimtrain, 5, 25, 100);
    }

    if (settings.Servers !== undefined && settings.Servers.some((x) => x.enabled)) {
        YOURSERVERSPLAYTIME.innerHTML = response.playtime.yourServers + " hours";
        setPlayTimeColor(YOURSERVERSPLAYTIME, response.playtime.yourServers, 5, 15, 50);
    }

    if (response.playtime.inaccurate === true) {
        SERVERSPLAYED.innerHTML += " (could be more)";
        BMPLAYTIME.innerHTML += " (could be more)";
        AIMTRAINPLAYTIME.innerHTML += " (could be more)";
        YOURSERVERSPLAYTIME.innerHTML += " (could be more)";
    }

    BMACCOUNTCREATED.innerHTML = response.profileCreated;

    ONLINESERVER.innerHTML = "Current Server: " + response.session.server;
    SERVERIP.innerHTML = "IP: " + response.session.ip;
    JOINED.innerHTML = "Joined: " + response.session.joinDate;
}

function handlePlayerSummaries(response) {
    STEAMPROFILEVISIBILITY.innerHTML = response.visibility;
    if (response.visibility === "Not Configured") {
        setStaticColor(STEAMPROFILEVISIBILITY, "Red");
    }
    STEAMPROFILECREATED.innerHTML = response.profileCreated;
    PROFILEPICTURE.src = response.avatar;
}

function handleActivity(response) {
    KILLS.innerHTML = `${response.kills} (${response.kills24h} last 24h)`;
    DEATHS.innerHTML = `${response.deaths} (${response.deaths24h} last 24h)`;

    KD.innerHTML = `${response.kd} (${response.kd24h} last 24h)`;
    if (typeof response.kd === "number") {
        if (typeof response.kd24h === "string") {
            setColor(KD, response.kd, 1.5, 3, 4, 5);
        } else {
            setColor(KD, Math.max(response.kd, response.kd24h), 1.5, 3, 4, 5);
        }
    } else {
        setStaticColor(KD, "LimeGreen");
    }

    CHEATINGREPORTS.innerHTML = `${response.cheatingReports} (${response.cheatingReports24h} last 24h)`;
    setColor(CHEATINGREPORTS, response.cheatingReports, 0, 3, 5);
    TEAMINGREPORTS.innerHTML = `${response.teamingReports} (${response.teamingReports24h} last 24h)`;
    setColor(TEAMINGREPORTS, response.teamingReports, 0, 1, 2);
    OTHERREPORTS.innerHTML = `${response.otherReports} (${response.otherReports24h} last 24h)`;
    setColor(OTHERREPORTS, response.otherReports, 0, 1, 2);

    if (response.aimbot !== undefined) {
        ARKANAIMBOT.innerHTML = `${response.aimbot} (${response.aimbot24h} last 24h)`;
        setColor(ARKANAIMBOT, response.aimbot, 0, 1, 2);
        ARKANNORECOIL.innerHTML = `${response.noRecoil} (${response.noRecoil24h} last 24h)`;
        setColor(ARKANNORECOIL, response.noRecoil, 0, 3, 5);
    }
    if (response.guardianCheat !== undefined) {
        GUARDIANANTICHEAT.innerHTML = `${response.guardianCheat} (${response.guardianCheat24h} last 24h)`;
        setColor(GUARDIANANTICHEAT, response.guardianCheat, 0, 1, 3);
        GUARDIANANTIFLOOD.innerHTML = `${response.guardianFlood} (${response.guardianFlood24h} last 24h)`;
        setColor(GUARDIANANTIFLOOD, response.guardianFlood, 0, 1, 3);
    }
}

function handleSteamPlaytime(response) {
    if (typeof response === "string") {
        setStaticColor(STEAMPLAYTIME, "Red");
        STEAMPLAYTIME.innerHTML = response;
    } else {
        setPlayTimeColor(STEAMPLAYTIME, response, 200, 500, 1000);
        STEAMPLAYTIME.innerHTML = response + " hours";
    }
}
