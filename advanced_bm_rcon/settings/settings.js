document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(null, (settings) => {
        if (settings.BMToken !== undefined && settings.BMToken !== "") {
            document.getElementById("BMToken").value = settings.BMToken;
            document.getElementById("SteamToken").value = settings.SteamToken;
            document.getElementById("Arkan").checked = settings.Arkan;
            document.getElementById("Guardian").checked = settings.Guardian;
            document.getElementById("RustAdmin").checked = settings.RustAdmin;
            document.getElementById("ServerArmour").checked = settings.ServerArmour;
            document.getElementById("RustStats").checked = settings.RustStats;

            if (settings.Servers !== undefined) {
                for (const server of settings.Servers) {
                    addToContainer(server.id, server.name, server.enabled);
                }
            }
        }
    });

    // inline event handler is blocked in extensions
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("refresh").addEventListener("click", refreshServers);
    document.getElementById("saveservers").addEventListener("click", saveServers);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //sendResponse("{}");
    if (request.type == "RefreshServers") {
        clearContainer();
        for (const server of request.response.data) {
            addToContainer(server.attributes.id, server.attributes.name, true);
        }
    }
});

function save() {
    const bmToken = document.getElementById("BMToken").value.trim();
    const steamToken = document.getElementById("SteamToken").value.trim();

    if (bmToken.length < 150) {
        alert("Your BattleMetrics API Token is invalid.");
        return;
    }

    if (steamToken.length != 32) {
        alert("Your Steam API Token is invalid.");
        return;
    }

    chrome.storage.local.set(
        {
            BMToken: bmToken,
            SteamToken: steamToken,
            Arkan: document.getElementById("Arkan").checked,
            Guardian: document.getElementById("Guardian").checked,
            RustAdmin: document.getElementById("RustAdmin").checked,
            ServerArmour: document.getElementById("ServerArmour").checked,
            RustStats: document.getElementById("RustStats").checked,
        },
        () => {
            alert("Settings saved successfully.");
        }
    );
}

function refreshServers() {
    chrome.storage.local.get(["BMToken"], function (settings) {
        if (!settings.BMToken) {
            alert("Save your BattleMetrics API Token first.");
            return;
        }

        chrome.runtime.sendMessage({ type: "RefreshServers" });
    });
}

function saveServers() {
    const container = document.getElementById("serverlist");

    const servers = [];

    for (const child of container.children) {
        const serverId = child.children[0].id;
        const serverName = child.children[0].innerText;
        const enabled = child.children[1].children[0].checked;

        servers.push({ id: serverId, name: serverName, enabled: enabled });
    }

    chrome.storage.local.set({ Servers: servers }, function () {
        alert("Your servers are saved successfully.");
    });
}

function addToContainer(serverId, serverName, enabled) {
    const container = document.getElementById("serverlist");

    const div = document.createElement("div");
    div.classList.add("form-group");

    const label = document.createElement("label");
    label.setAttribute("id", serverId);
    label.textContent = serverName;

    const label2 = document.createElement("label");
    label2.classList.add("switch");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    setTimeout(() => {
        checkbox.checked = enabled;
    }, 20);

    const span = document.createElement("span");
    span.classList.add("slider");

    label2.append(checkbox);
    label2.append(span);

    div.append(label);
    div.append(label2);

    container.append(div);
}

async function clearContainer() {
    const container = document.getElementById("serverlist");

    for (let i = container.childNodes.length - 1; i >= 0; i--) {
        container.childNodes[i].remove();
    }
}
