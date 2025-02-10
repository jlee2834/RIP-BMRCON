document.addEventListener('click', function(event) {
    if (event.target.classList.contains('ip-address')) {
        const ip = event.target.textContent;
        checkIP(ip, event.target);
    }
});

function checkIP(ip, element) {
    const apiKey = '53tf0e-r12j5r-76ymi9-995870';
    const url = `https://proxycheck.io/v2/${ip}?key=${apiKey}&vpn=1&asn=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                const ipInfo = data[ip];
                const type = ipInfo.proxy === 'yes' ? 'VPN/Proxy' : ipInfo.type;
                displayIPType(type, element);
            } else {
                console.error('Error fetching IP data:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayIPType(type, element) {
    const infoElement = document.createElement('span');
    infoElement.textContent = ` (${type})`;
    infoElement.style.color = 'red';
    element.appendChild(infoElement);
}