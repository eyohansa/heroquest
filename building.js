(function (angular) {
	var buildingData = angular.module("Buildings", []);

	buildingData.controller("Building", function () {
		
        this.miningTown = {
            activeMiners: 0,
            totalMiners: 0,
            
            miningPlace: [{
                // Gives rock, copper and very low amount of gold.
                name: "Weird Mining Hole",
                numOwned: 0,
                numMiner: 0,
                baseGoldRate: 0.05,
                itemList: ["rock", "copper", "gold"],
                CDFpercentage: [85, 95, 100] //This is probability in CDF form. Basically, the percentage of getting rock is 85%, copper 10% and gold 5%. See http://en.wikipedia.org/wiki/Cumulative_distribution_function for more info. 
            }, {
                // Gives rock, copper, silver and low amount of gold
                name: "Sorta Scary Looking Mining Spot",
                numOwned: 0,
                numMiner: 0,
                baseGoldRate: 0.1,
                itemList: ["rock", "copper", "silver", "gold"],
                CDFpercentage: [50, 75, 90, 100]
            }, {
                // Gives copper, silver and moderate amount of gold
                name: "Decent Mining Hill",
                numOwned: 0,
                numMiner: 0,
                baseGoldRate: 0.2,
                itemList: ["copper", "silver", "gold"],
                CDFpercentage: [50, 80, 100]
            }, {
            // Gives silver and decent amount of gold
                name: "Good Mining Tunnel",
                numOwned: 0,
                numMiner: 0,
                baseGoldRate: 0.4,
                itemList: ["silver", "gold"],
                CDFpercentage: [60, 100]
            }]
        };
        
        /* All of this function commented out should be miningTown's method. Will be worked on next time.
        this.mines = function () {
            var miningAttempt, RNG, i, j, k, acquiredGold = 0;
            var acquiredItems = [];
            for (i = 0; i < this.miningPlace.length; i += 1) {
                
                // Determine number of mining attempts: checks if number of miners are too many or too little based on number of owned mines.
                if (this.miningPlace[i].numMiner > (3 * this.miningPlace[i].numOwned)) {
                    miningAttempt = 3 * this.miningPlace[i].numOwned;
                } else {
                    miningAttempt = this.miningPlace[i].numMiner;
                }
                
                // Roll the RNG
                for (j = 0; j < miningAttempt; j += 1) {
                    RNG = random(0, 1);
                    for (k = 0; k < this.miningPlace[i].CDFpercentage.length; k += 1) {
                        //Check what item is received from mining based on RNG roll. however, for gold acquirement, the function is a bit different.
                        if (RNG < this.miningPlace[i].CDFpercentage[k] && this.miningPlace[i].itemList[k] !== "gold") {
                            acquiredItems.push(this.miningPlace[i].itemList[k]);
                        } else if (this.miningPlace[i].itemList[k] === "gold") {
                            acquiredGold += this.miningPlace[i].baseGoldRate;
                        }
                        
                    }
                }
            }
            acquiredItems.push(acquiredGold); // Put number of gold acquired at the end of the acquiredItems array
            return acquiredItems;
        };
        
        this.reduceMiners = function (mineName) {
            this.miningPlace[mineName].numMiner -= 1;
            this.activeMiners -= 1;
        };
        
        this.addMiners = function (mineName) {
            this.miningPlace[mineName].numMiner += 1;
            this.activeMiners += 1;
        };
        
        this.hireMiners = function () {
            this.totalMiners += 1;
        };
        
        this.fireMiners = function () {
            this.totalMiners -= 1;
            // Also, remove miners from random mines if activeMiners === totalMiners.
        };
        */

	});
    	
})(window.angular);