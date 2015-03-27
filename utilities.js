/**
 * Generate a random number between min (included) and max (included).
 * @param  {Number} min The minimum value.
 * @param  {Number} max The maximum value.
 * @return {Number}     The generated random number.
 */
var random = function (min, max) {
	return Math.random() * (max - min + 1) + min;
};

/**
 * Generate a random Integer number between min(included) and max (included).
 * @param  {Number} min The minimum value.
 * @param  {Number} max The maximum value.
 * @return {Number}     The generated random Integer number.
 */
var randomInt = function (min, max) {
	return Math.floor(random(min, max));
};


// AttackType = Slash, Piercing, Blunt, Magic, Neutral
// ArmorType  = lightArmor, heavyArmor, magicArmor, None

// Light armor receives extra damage from blunt attack (+20%), and mitigates piercing damage (-20%)
// Heavy armor receives extra damage from piercing attack (+25%), and mitigates slash and blunt damage (-10% and -30%)
// Magic armor receives extra damage from all types of attack (+10%) and mitigates magic damage (-40%)
var mitigationTable = [{
    armorName: "lightArmor",
    Slash: 1,
    Piercing: 0.8,
    Blunt: 1.2,
    Magic: 1
}, {
    armorName: "heavyArmor",
    Slash: 0.9,
    Piercing: 1.25,
    Blunt: 0.7,
    Magic: 1
}, {
    armorName: "magicArmor",
    Slash: 1.1,
    Piercing: 1.1,
    Blunt: 1.1,
    Magic: 0.6
}, {
    armorName: "None",
    Slash: 1,
    Piercing: 1,
    Blunt: 1,
    Magic: 1
}];

/**
 * Return actual damage number based on attackType and armorType.
 * @param  {Number} damageValue The damage value before attackType and armorType consideration. That is, the return value of damageRNG function.
 * @param  {Number} attackType  The attackType value.
 * @param  {Number} armorType   The armorType value.
 * @return {Number} The damage value after attackType and armorType taken into consideration.
 */
var dmgCalculator = function (damageValue, attackType, armorType) {
    //Check for Neutral attackType first
    if (attackType === "Neutral") {
        return damageValue;
    }
    
    for (i = 0; i < mitigationTable.length; i += 1) {
        if (armorType === mitigationTable[i].armorName) {
            return damageValue * mitigationTable[i][attackType]; //I'm not sure if this is valid or not
        }
    }
    
    
};

// Reinvent the wheel: that is, the Math.pow function.
var manualExp = function (number, power) {
    if (power === 0){
        result = 1;
    } else {
        var i, result = 0;
        result = number;
        for (i = 0; i < power - 1; i += 1) {
            result *= number;
        }
    }
    return result;
};

/**
 * Function for testing whether player has enough gold to buy building/item or not.
 * If the object purchased does not have price ratio and unrelated to incrementals, set priceRatio to 1.
 * @param  {Number} goldAmount          Hero's amount of gold.
 * @param  {Number} basePrice           Base price of the building/item.
 * @param  {Number} priceRatio          Price ratio of the building/item. (set to 1 if the price does not increase based on owned building/item)
 * @param  {Number} numCurrentlyOwned   Number of currently owned building/item. (unnecessary if building/item price is not incremental, set to 0 in that case to optimize time)
 * @return {Boolean}                    True if player indeed can buy the building/item. False otherwise.
 */
var canBuy = function (goldAmount, basePrice, priceRatio, numCurrentlyOwned) {
    if (goldAmount >= (basePrice * manualExp(priceRatio, numCurrentlyOwned))) {
        return true;
    } else {
        return false;
    }
};