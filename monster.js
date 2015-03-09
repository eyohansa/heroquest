(function(angular) {
	var monData = angular.module("Monsters", []);

	monData.controller("MonsterData", function(){
		
		this.monstah = [{
			ID: 0,
			name: "Sewer Rat",
			levelReq: 1,

			currentHealth: 1,
			maxHealth: 1,

			power: 0,
			//skill: [something],
			
			regen: {
				health: 0
			},

			expDrop: 1,
			goldDrop: 1
		}]
		

		this.monstah[1] = {
			ID: 1,
			name: "Rat",
			levelReq: 3,

			currentHealth: 5,
			maxHealth: 10,

			power: 1,
			//skill: [something],
			
			regen: {
				health: 0
			},

			expDrop: 2,
			goldDrop: 2
		}
		

		this.monstah[2] = {
			ID: 2,
			name: "Bad Ratz",
			levelReq: 5,

			currentHealth: 15,
			maxHealth: 15,

			power: 3,
			//skill: [something],
			
			regen: {
				health: 1
			},

			expDrop: 4,
			goldDrop: 5
		}
		

		this.monstah[3] = {
			ID: 3,
			name: "Even more Bad Ratz",
			levelReq: 10,

			currentHealth: 40,
			maxHealth: 40,

			power: 5,
			//skill: [something],
			
			regen: {
				health: 3
			},

			expDrop: 10,
			goldDrop: 10
		}
		

	});
	
})(window.angular);