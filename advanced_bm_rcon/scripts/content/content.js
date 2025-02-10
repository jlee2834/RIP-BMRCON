let pageUrl;
let waitingForElement;

async function main() {
    if (await waitUntilElementExists()) {
        createElements();
    }
}

async function waitUntilElementExists(time = 0) {
    waitingForElement = true;
    const timeout = 10000;

    if (time >= timeout) {
        waitingForElement = false;
        return false;
    }

    const container = document.querySelector("#RCONPlayerPage");
    if (container === null) {
        await delay(30);
        return await waitUntilElementExists(time + 30);
    }

    waitingForElement = false;
    return true;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function runExtension() {
    if (waitingForElement) return;
    if (window.location.href.match("rcon/players/[0-9]+/*$") === null) return;

    if (pageUrl != window.location.href) {
        main();
        pageUrl = window.location.href;
    } else if (!isExtensionInjected()) {
        main();
    }
}

function isExtensionInjected() {
    if (document.getElementsByClassName("advanced-bm-rcon").length > 0) {
        return true;
    }
    return false;
}

runExtension();
setInterval(runExtension, 1000);
