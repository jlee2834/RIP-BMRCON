import { getActivity } from "./battlemetrics/getActivity.js";
import { getBMBannedAltsBulk } from "./battlemetrics/getBMBannedAltsBulk.js";
import { getEACBannedAltsBulk } from "./battlemetrics/getEACBannedAltsBulk.js";
import { getMyServers } from "./battlemetrics/getMyServers.js";
import { getPlayerInfo } from "./battlemetrics/getPlayerInfo.js";
import { getRelatedPlayers } from "./battlemetrics/getRelatedPlayers.js";
import { getServerPlayers } from "./battlemetrics/getServerPlayers.js";
import { getFriendsList } from "./steam/getFriendList.js";
import { getPlayerSummaries } from "./steam/getPlayerSummaries.js";
import { getPlaytime } from "./steam/getPlayTime.js";

let settings;
async function loadSettings() {
    settings = await chrome.storage.local.get(["BMToken", "SteamToken", "Arkan", "Guardian", "RustAdmin", "ServerArmour", "RustStats", "Servers"]);
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    settings = undefined;
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (settings === undefined) await loadSettings();

    switch (request.type) {
        case "RefreshServers": {
            chrome.tabs.sendMessage(sender.tab.id, { type: "RefreshServers", response: await getMyServers(settings.BMToken) });
            break;
        }

        case "GetPlayerInfo": {
            const playerInfo = await getPlayerInfo(settings.BMToken, request.BMID, settings.Servers);
            if (playerInfo === undefined) return;

            chrome.tabs.sendMessage(sender.tab.id, { type: "GetPlayerInfo", response: playerInfo });

            if (playerInfo.session.online === false) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "GetOnlineFriends",
                    response: {
                        count: "-",
                        friends: [],
                    },
                });
                return;
            }

            const friendList = await getFriendsList(settings.SteamToken, request.SteamID);
            const players = await getServerPlayers(settings.BMToken, playerInfo.session.serverId);

            if (friendList === undefined) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "GetOnlineFriends",
                    response: {
                        count: "Private",
                        friends: [],
                    },
                });
            } else {
                const onlineFriends = [];

                for (const player of players) {
                    if (friendList.includes(player.SteamID)) {
                        onlineFriends.push(player);
                    }
                }

                chrome.tabs.sendMessage(sender.tab.id, {
                    type: "GetOnlineFriends",
                    response: {
                        count: onlineFriends.length,
                        friends: onlineFriends,
                    },
                });
            }

            break;
        }

        case "GetPlayerSummaries": {
            chrome.tabs.sendMessage(sender.tab.id, { type: "GetPlayerSummaries", response: await getPlayerSummaries(settings.SteamToken, request.SteamID) });
            break;
        }

        case "GetActivity": {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: "GetActivity",
                response: await getActivity(settings.BMToken, settings.Arkan, settings.Guardian, request.BMID),
            });
            break;
        }

        case "GetSteamPlaytime": {
            chrome.tabs.sendMessage(sender.tab.id, {
                type: "GetSteamPlaytime",
                response: await getPlaytime(settings.SteamToken, request.SteamID),
            });
            break;
        }

        case "GetEACBannedAlts": {
            const relatedPlayers = await getRelatedPlayers(settings.BMToken, request.BMID);
            if (relatedPlayers === undefined) return;

            chrome.tabs.sendMessage(sender.tab.id, {
                type: "GetEACBannedAlts",
                response: await getEACBannedAltsBulk(settings.BMToken, relatedPlayers),
            });
            break;
        }

        case "GetBMBannedAlts": {
            const relatedPlayers = await getRelatedPlayers(settings.BMToken, request.BMID);
            if (relatedPlayers === undefined) return;

            chrome.tabs.sendMessage(sender.tab.id, {
                type: "GetBMBannedAlts",
                response: await getBMBannedAltsBulk(settings.BMToken, relatedPlayers),
            });
            break;
        }
        default:
            break;
    }
});
