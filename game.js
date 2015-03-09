setInterval(function(){
     
},5000);

(function(angular) {
	var game = angular.module("HeroicAdventure", ['Monsters']);

	game.controller("CharacterCtrl", ['$interval', function($interval) {
		this.day++;

		this.hero = {
			name: "Rat Hater",
			experiencePoints: 0,
			level: 1,
			gold: 0,
			currentHealth: 10,
			maxHealth: 10,
			power: 1,
			stamina: 10,
			regen: {
				health: 2,
				stamina: 5
			}
		}
		
		var injectTemp = this;
		
		/**
		 * Level player up.
		 */
		this.levelUp = function() {
			console.log("You have leveled up!");
			this.hero.level++;
			this.hero.power++;
			this.hero.experiencePoints = 0;
		}

		/**
		 *	@param actionResult The result of action taken by the player.
		 *
		 *	This function process the result of the action taken by the player.
		 */
		 /*
		this.act = function(actionResult) {
			this.hero.currentHealth -= actionResult.cost.health;
			this.hero.stamina -= actionResult.cost.stamina;
			this.hero.experiencePoints += actionResult.cost.days;
			if(this.hero.experiencePoints >= this.getRequiredExperiencePointsToLevel()) {
				this.levelUp();
			}

			this.day += actionResult.cost.day;
		}
		*/

		var regen = $interval(function() {

			if (injectTemp.hero.currentHealth < injectTemp.hero.maxHealth) {
				injectTemp.hero.currentHealth += injectTemp.hero.regen.health;
			} else if (injectTemp.hero.currentHealth > injectTemp.hero.maxHealth) {
				injectTemp.hero.currentHealth = injectTemp.hero.maxHealth;
			}

			injectTemp.hero.stamina += injectTemp.hero.regen.stamina;
			injectTemp.day++
		}, 1000);
		
	}]);

	game.controller("ActionCtrl", function() {
		this.explore = function() {

		}

		/**
		 * Calculate the required experience points to level up.
		 * @return {integer} Required experience points to level up.
		 */
		this.getRequiredExperiencePointsToLevel = function(charHero) {
			return (charHero.level * charHero.level) + (10 * charHero.level);
		}

		this.battle = function(charHero, monsData) {
			charHero.currentHealth -= monsData.power;
			monsData.currentHealth -= charHero.power;
			
			// Check if enemy is dead
			if (monsData.currentHealth <= 0){
				charHero.experiencePoints += monsData.expDrop;
				charHero.gold += monsData.goldDrop;
				monsData.currentHealth = monsData.maxHealth;
				
				if (charHero.experiencePoints >= this.getRequiredExperiencePointsToLevel(charHero)){
					charHero.level++;
					charHero.power++;
					charHero.experiencePoints = 0;
				}
			}
			
			// Check if player is dead
			if (charHero.currentHealth <= 0){
				charHero.currentHealth = 1;
				monsData.currentHealth = monsData.maxHealth;
			}
			
		}
	});

	game.controller()
})(window.angular);