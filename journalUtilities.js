// This function returns a string of html tags, (e.g. "<tagText>text</tagText>")
// Please note that this function will not work for non-identical tags, for example: "<a href=''>text</a>"
var tagPair = function (text, tagText) {
    "use strict";
    return "<" + tagText + ">" + text + "</" + tagText + ">";
};

// For bold text
var boldText = function (textToBeBolded) {
    "use strict";
    return tagPair(textToBeBolded, "b");
};

// For strong text
var strongText = function (textToBeBolded) {
    "use strict";
    return tagPair(textToBeBolded, "strong");
};

// For italic text
var italicText = function (textToBeItalicized) {
    "use strict";
    return tagPair(textToBeItalicized, "i");
};

// For emphasizing text
var emphasizeText = function (textToBeItalicized) {
    "use strict";
    return tagPair(textToBeItalicized, "em");
};

// For underlining text
var underlineText = function (textToBeUnderlined) {
    "use strict";
    return tagPair(textToBeUnderlined, "u");
};

// For striking text
var strikeText = function (textToBeStriked) {
    "use strict";
    return tagPair(textToBeStriked, "del");
};





// For coloring text
// Please use this function for coloring text. Do not use tagPair function as it won't work 
var colorText = function (text, color) {
    "use strict";
    return "<font color=\"" + color + "\">" + text + "</font>";
};

var attackTypeColorText = function (text, attackType) {
    "use strict";
    if (attackType === "Slash") {
        return colorText(text, "red");
    } else if (attackType === "Piercing") {
        return colorText(text, "brown");
    } else if (attackType === "Blunt") {
        return colorText(text, "blue");
    } else if (attackType === "Magic") {
        return colorText(text, "purple");
    } else if (attackType === "Neutral") {
        return colorText(text, "gray");
    } else {
        return "What kind of attack did you do, huh? Fucking magic or somet.... Wait.";
    }
};

var listOfOuchMessage = ["Ouch", "Bloody hell", "Damn", "Ow", "Gah", "Argh", "WHY?!", "Blurgh"];
var randomOuchMessage = function () {
    return listOfOuchMessage[randomInt(1, listOfOuchMessage.length) - 1];
};