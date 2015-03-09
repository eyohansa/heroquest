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
			currentStamina: 10,
			maxStamina: 10,
			regen: {
				health: 2,
				stamina: 3
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

		// Hero's health and stamina regen. Regen is set at every second.
		var TIME_SECOND_CONSTANT=1000; //1 second equal to 1000
		var regen = $interval(function() {

			// Add HP if HP is less than max HP
			if (injectTemp.hero.currentHealth < injectTemp.hero.maxHealth) {
				injectTemp.hero.currentHealth += injectTemp.hero.regen.health;
			}

			// Add stamina if stamina is less than max stamina
			if (injectTemp.hero.currentStamina < injectTemp.hero.maxStamina) {
				injectTemp.hero.currentStamina += injectTemp.hero.regen.stamina;
			}
			
			// Checks for overflow in HP due to regen
			if (injectTemp.hero.currentHealth >= injectTemp.hero.maxHealth) {
				injectTemp.hero.currentHealth = injectTemp.hero.maxHealth;
			}
			
			// Checks for overflow in stamina due to regen
			if (injectTemp.hero.currentStamina >= injectTemp.hero.maxStamina) {
				injectTemp.hero.currentStamina = injectTemp.hero.maxStamina;
			}

			injectTemp.day++
		}, TIME_SECOND_CONSTANT);
		
	}]);

	game.controller("ActionCtrl", function() {
		
		/////// Notification Functions
		
		this.victoryMessage = {
			textMessage: "",
			canShow: false
		}
		
		this.setVictoryMessage = function(message){
			this.victoryMessage.textMessage = message;
			this.victoryMessage.canShow = true;
		}
		
		this.eraseVictoryMessage = function(){
			this.victoryMessage.textMessage = "";
			this.victoryMessage.canShow = false;
		}
		
		/////// Exploration Functions
		
		this.explore = function() {

		}

		/////// Battle Functions
		
		this.battle = function(charHero, monsData) {
			//Use 1 stamina for attack
			charHero.currentStamina -= 1;
			
			//Check if hero stamina is depleted. If hero tries to attack with stamina at 0, nothing will happen.
			if(charHero.currentStamina >= 0){
			
				//Damage both side of combatants
				charHero.currentHealth -= monsData.power;
				monsData.currentHealth -= charHero.power;
				
				// Check if enemy is dead
				if (monsData.currentHealth <= 0){
					charHero.experiencePoints += monsData.expDrop;
					charHero.gold += monsData.goldDrop;
					monsData.currentHealth = monsData.maxHealth;
					this.setVictoryMessage("You defeated "+monsData.name+". You gained "+monsData.expDrop+" exp and "+monsData.goldDrop+" gold.");
					
					// Check if hero can level up
					if (charHero.experiencePoints >= this.getRequiredExperiencePointsToLevel(charHero)){
						charHero.level += 1;
						charHero.power += 1;
						charHero.maxHealth += 2;
						charHero.maxStamina += 3;
						charHero.experiencePoints = 0;
						
						//Increase hero health and stamina regen every 3 level
						if (charHero.level%3===0){
							charHero.regen.health += 0.5;
							charHero.regen.stamina += 0.75;
						}
					}
				} else {
					this.eraseVictoryMessage();
				}
				
				// Check if player is dead
				if (charHero.currentHealth <= 0){
					charHero.currentHealth = 1;
					monsData.currentHealth = monsData.maxHealth;
				}
			} else {
				charHero.currentStamina = 0;
			}
			
		}
		
		/////// Other Functions
		
		/**
		 * Calculate the required experience points to level up.
		 * @return {integer} Required experience points to level up.
		 */
		this.getRequiredExperiencePointsToLevel = function(charHero) {
			return (charHero.level * charHero.level) + (10 * charHero.level);
		}

		
	});

})(window.angular);

