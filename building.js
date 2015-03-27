// For surpressing JSLint error message
/*global canBuy */
/*global random */
/*global manualExp */


(function (angular) {
    "use strict"; // To surpress JSLint error message
	var buildingData = angular.module("Buildings", ['HeroicAdventure']);

	buildingData.controller("BuildingCtrl", ['journalService', '$interval', 'heroInventoryService', function (journalService, $interval, heroInventoryService) {
        
        this.calculatePrice = function (basePrice, priceRatio, numOwnedProperties) {
            return basePrice * manualExp(priceRatio, numOwnedProperties);
        };
        
        this.miningTown = {
            
            activeMiners: 0,
            totalMiners: 0,
            baseMinersPriceRatio: 1.2,
            baseMinersPrice: 2,
            
            miningPlace: [{
                // Gives rock, copper and very low amount of gold.
                name: "Weird Mining Hole",
                levelReq: 1,
                numOwned: 0,
                numMiner: 0,
                basePrice: 10,
                priceRatio: 1.5,
                baseGoldRate: 0.05,
                itemList: ["rock", "copper", "gold"],
                CDFpercentage: [85, 95, 100] //This is probability in CDF form. Basically, the percentage of getting rock is 85%, copper 10% and gold 5%.
                // See http://en.wikipedia.org/wiki/Cumulative_distribution_function for more info. 
            }, {
                // Gives rock, copper, silver and low amount of gold
                name: "Sorta Scary Looking Mining Spot",
                levelReq: 5,
                numOwned: 0,
                numMiner: 0,
                basePrice: 50,
                priceRatio: 1.5,
                baseGoldRate: 0.1,
                itemList: ["rock", "copper", "silver", "gold"],
                CDFpercentage: [50, 75, 90, 100]
            }, {
                // Gives copper, silver and moderate amount of gold
                name: "Decent Mining Hill",
                levelReq: 10,
                numOwned: 0,
                numMiner: 0,
                basePrice: 500,
                priceRatio: 1.5,
                baseGoldRate: 0.4,
                itemList: ["copper", "silver", "gold"],
                CDFpercentage: [50, 80, 100]
            }, {
            // Gives silver and decent amount of gold
                name: "Good Mining Tunnel",
                levelReq: 15,
                numOwned: 0,
                numMiner: 0,
                basePrice: 10000,
                priceRatio: 1.5,
                baseGoldRate: 1.5,
                itemList: ["silver", "gold"],
                CDFpercentage: [60, 100]
            }],
            
            // Function to call for mining operation. This function will return an array of retreived items & gold.
            mines: function () {
                var miningAttempt, RNG, i, j, k, acquiredGold = 0, acquiredItems = [];
                for (i = 0; i < this.miningPlace.length; i += 1) {

                    // Determine number of mining attempts: checks if number of miners are too many or too little based on number of owned mines.
                    if (this.miningPlace[i].numMiner > (3 * this.miningPlace[i].numOwned)) {
                        miningAttempt = 3 * this.miningPlace[i].numOwned;
                    } else {
                        miningAttempt = this.miningPlace[i].numMiner;
                    }

                    // Roll the RNG
                    for (j = 0; j < miningAttempt; j += 1) {
                        RNG = randomInt(1, 100);
                        for (k = 0; k < this.miningPlace[i].CDFpercentage.length; k += 1) {
                            //Check what item is received from mining based on RNG roll. however, for gold acquirement, the function is a bit different.
                            if (RNG < this.miningPlace[i].CDFpercentage[k] && this.miningPlace[i].itemList[k] !== "gold") {
                                acquiredItems.push(this.miningPlace[i].itemList[k]);
                                break;
                            } else if (this.miningPlace[i].itemList[k] === "gold") {
                                acquiredGold += this.miningPlace[i].baseGoldRate;
                                break;
                            }

                        }
                    }
                }
                acquiredItems.push(acquiredGold); // Put number of gold acquired at the end of the acquiredItems array
                return acquiredItems;
            },
            
            // Utility function for finding index of mining place based on name of the mine (mineName).
            findMineIndex: function (mineName) {
                var i;
                
                for (i = 0; i < this.miningPlace.length; i += 1) {
                    if (mineName === this.miningPlace[i].name) {
                        return i;
                    }
                }
                
                return 0; // If no match can be found, return 0
            },
            
            // For buying a mine.
            buyMine: function (mineName) {
                var mineIndex = this.findMineIndex(mineName);
                if (canBuy(heroInventoryService[0].itemNumber, this.miningPlace[mineIndex].basePrice, this.miningPlace[mineIndex].priceRatio, this.miningPlace[mineIndex].numOwned)) {
                    heroInventoryService.reduceItemFromInventory("Gold", this.miningPlace[mineIndex].basePrice * manualExp(this.miningPlace[mineIndex].priceRatio, this.miningPlace[mineIndex].numOwned));
                    this.miningPlace[mineIndex].numOwned += 1;
                } else {
                    journalService.write("Not enough money, dude");
                }
            },

            // For removing a miner from a mine.
            removeMiners: function (mineName) {
                if (this.activeMiners > 0 && this.miningPlace[this.findMineIndex(mineName)].numMiner > 1) {
                    this.miningPlace[this.findMineIndex(mineName)].numMiner -= 1;
                    this.activeMiners -= 1;
                } else if (this.activeMiners === 0) {
                    journalService.write("You don't even have miners!");
                } else {
                    journalService.write("All of them are not working right now. Who else are you trying to remove, eh?");
                }
            },

            // For adding a miner to a mine.
            addMiners: function (mineName) {
                if (this.activeMiners < this.totalMiners) {
                    this.miningPlace[this.findMineIndex(mineName)].numMiner += 1;
                    this.activeMiners += 1;
                } else {
                    journalService.write("Hire more miner, man");
                }
            },

            // For hiring miner.
            buyMiners: function () {
                if (canBuy(heroInventoryService[0].itemNumber, this.baseMinersPrice, this.baseMinersPriceRatio, this.totalMiners)) {
                    heroInventoryService.reduceItemFromInventory("Gold", this.baseMinersPrice * manualExp(this.baseMinersPriceRatio, this.totalMiners));
                    this.totalMiners += 1;
                } else {
                    journalService.write("Not enough money, dude");
                }
            },
            
            // For firing miner.
            sellMiners: function () {
                if (this.totalMiners > 0 && this.totalMiners !== this.activeMiners) {
                    this.totalMiners -= 1;
                    heroInventoryService.addItemFromInventory("Gold", this.baseMinersPrice * manualExp(this.baseMinersPriceRatio, this.totalMiners - 1));
                } else if (this.totalMiners === this.activeMiners) {
                    journalService.write("Remove a miner from any mine first");
                } else {
                    journalService.write("Look, you don't even have a miner, what the heck are you trying to sell?");
                }
            }
        };
        
        var injectMine = this;
        var miningTick = $interval(function () {
            var result = injectMine.miningTown.mines(), i = 0;
            var rock = 0, copper = 0, silver = 0, gold = 0;
            console.log(result);
            for (i = 0; i < result.length; i += 1) {
                if (result[i] === "rock") {
                    rock += 1;
                } else if (result[i] === "copper") {
                    copper += 1;
                } else if (result[i] === "silver") {
                    silver += 1;
                } else {
                    gold += result[i];
                }
            }
            
            //Add item to hero here.
            heroInventoryService.addItemToInventory("Rock", rock);
            heroInventoryService.addItemToInventory("Copper", copper);
            heroInventoryService.addItemToInventory("Silver", silver);
            heroInventoryService.addItemToInventory("Gold", gold);
        }, 1000);

	}]);
    	
})(window.angular);