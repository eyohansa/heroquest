(function(angular) {
	var game = angular.module("HeroicAdventure", []);

	game.controller("CharacterCtrl", function() {
		this.day++;

		this.hero = {
			name: "Hero",
			experiencePoints: 0,
			level: 1,
			gold: 0,
			currentHealth: 10,
			maxHealth: 10,
			power: 1,
			stamina: 10,
			regen: {
				health: 3,
				stamina: 5
			}
		}
		
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
		 * Calculate the required experience points to level up.
		 * @return {integer} Required experience points to level up.
		 */
		this.getRequiredExperiencePointsToLevel = function() {
			return (this.hero.level * this.hero.level) + (10 * this.hero.level);
		}

		/**
		 *	@param actionResult The result of action taken by the player.
		 *
		 *	This function process the result of the action taken by the player.
		 */
		this.act = function(actionResult) {
			this.hero.currentHealth -= actionResult.cost.health;
			this.hero.stamina -= actionResult.cost.stamina;
			this.hero.experiencePoints += actionResult.cost.days;
			if(this.hero.experiencePoints >= this.getRequiredExperiencePointsToLevel()) {
				this.levelUp();
			}

			this.day += actionResult.cost.day;
		}

		this.rest = function() {
			this.hero.health += hero.regen.health;
			this.hero.stamina += hero.regen.stamina;
			this.day ++;
		}
	});

	game.controller("ActionCtrl", function() {
		this.explore = function() {

		}

		this.fightPracticeDoll = function() {
			return {
				cost: {
					health: 0,
					stamina: 1,
					days: 1
				},
				gain: {
					experiencePoints: 1,
					gold: 0
				}
			}
		}

		this.fightRat = function() {
			return {
				cost: {
					health: 1,
					stamina: 1,
					days: 1
				},
				gain: {
					experiencePoints: 5,
					gold: 1
				}
			}
		}

		this.fightKobold = function() {
			return {
				cost: {
					health: 2,
					stamina: 2,
					days: 1
				},
				gain: {
					experiencePoints: 10,
					gold: 3
				}
			}
		}
	});

	game.controller()
})(window.angular);