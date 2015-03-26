(function (angular) {
	var monData = angular.module("Monsters", []);

	monData.controller("MonsterData", function () {
		
		this.monstah = [{
			ID: 0,
			name: "Sewer Rat",
			levelReq: 1,
            flavPlayerLoseMessage: "",

			currentHealth: 10,
			maxHealth: 10,

			power: 0,
			stamina: 1,
			
            armorType: "None",

			expDrop: 1,
			goldDrop: 1
		}];
		

		this.monstah[1] = {
			ID: 1,
			name: "Rat",
			levelReq: 3,
            flavPlayerLoseMessage: "",

			currentHealth: 25,
			maxHealth: 25,

			power: 10,
			stamina: 2,
			//skill: [something],
			
            armorType: "None",

			expDrop: 3,
			goldDrop: 2
		};
		

		this.monstah[2] = {
			ID: 2,
			name: "Bad Ratz",
			levelReq: 5,

			currentHealth: 50,
			maxHealth: 50,

			power: 20,
			stamina: 3,
			
            armorType: "None",

			expDrop: 5,
			goldDrop: 5
		};
		

		this.monstah[3] = {
			ID: 3,
			name: "Bad Ratz with armor (what?)",
			levelReq: 10,
            flavPlayerLoseMessage: "",

			currentHealth: 150,
			maxHealth: 150,

			power: 30,
			stamina: 4,
			
            armorType: "lightArmor",

			expDrop: 8,
			goldDrop: 8
		};
		

		this.monstah[4] = {
			ID: 4,
			name: "Magical Mouse",
			levelReq: 12,
            flavPlayerLoseMessage: "",

			currentHealth: 100,
			maxHealth: 100,

			power: 50,
			stamina: 4,
			
            armorType: "magicArmor",

			expDrop: 10,
			goldDrop: 10
		};
		

	});
    
    var addMonster = function (monsname, monslevelReq, monsflavPlayerLoseMessage, monsmaxHealth, monspower, monsstamina, monsarmorType, monsexpDrop, monsgoldDrop) {
        //this.monstah.push({ID: this.monstah.length, name: monsname, levelReq: monslevelReq, flavPlayerLoseMessage, monsflavPlayerLoseMessage, currentHealth: monsmaxHealth, maxHealth: monsmaxHealth, power: monspower, stamina: monsstamina, armorType: monsarmorType, expDrop: monsexpDrop, goldDrop: monsgoldDrop});
    };
	
})(window.angular);