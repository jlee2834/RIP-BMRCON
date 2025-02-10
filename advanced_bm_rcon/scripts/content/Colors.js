function setStaticColor(element, color) {
    element.style.color = color;
}
function setColor(element, value, greenvalue, yellowvalue, orangevalue) {
    if (value <= greenvalue) {
        element.style.color = "LimeGreen";
    } else if (value <= yellowvalue) {
        element.style.color = "Yellow";
    } else if (value <= orangevalue) {
        element.style.color = "Orange";
    } else {
        element.style.color = "Red";
    }
}

function setPlayTimeColor(element, value, redvalue, orangevalue, yellowvalue) {
    if (value <= redvalue) {
        element.style.color = "Red";
    } else if (value <= orangevalue) {
        element.style.color = "OrangeRed";
    } else if (value <= yellowvalue) {
        element.style.color = "Yellow";
    } else {
        element.style.color = "LimeGreen";
    }
}
