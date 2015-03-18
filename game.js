(function (angular) {
	var game = angular.module("HeroicAdventure", ['Monsters']);

	game.factory('journalService', function () {
		var journal = {};
		var entryQueue = [];
		var queueCap = 10;

		journal.write = function (message) {
			if (entryQueue.push(message + '<br />') > queueCap) {
				entryQueue.shift();
			}

			$("#divJournal").html(entryQueue);
		};

		journal.save = function () {
			// Game saving will be performed here.
		};

		journal.load = function () {
			// Game loading will be performed here.
		};

		return journal;
	});

	game.controller("CharacterCtrl", ['$interval', 'journalService', function ($interval, journalService) {
		this.day = 0;

		this.hero = {
			name: "Rat Hater",
			experiencePoints: 0,
			level: 1,
			gold: 0,
			currentHealth: 100,
			maxHealth: 100,
			power: 10,
			currentStamina: 15,
			maxStamina: 15,
			regen: {
				health: 10,
				stamina: 4
			}
            
            // Hero's Attack Types (can be added later). For now, damage types are Slash, Pierce, Blunt, Magic and Neutral)
            // Additionally, monster now will have their own armor type. Somewhat similar to Warcraft
            // Armor types for now are: LightArmor, HeavyArmor, magicArmor
            // Probably time to make buttons to switch between attackTypes.
            // Also, skills can be put in here, if necessary.
            attackType: [{
                attackName: "Slash",
                damageType: "Slash",
                staminaUsage: 1
            },
            {
                attackName: "Stab",
                damageType: "Piercing",
                staminaUsage: 1
            },
            {
                attackName: "Bash with Scabbard",
                damageType: "Blunt",
                staminaUsage: 1.5
            }
            ]
		};
		
		var injectTemp = this;
		
		/**
		 * Level player up.
		 */
		this.levelUp = function () {
			this.hero.level += 1;
			this.hero.power += 1;
			this.hero.experiencePoints = 0;
		};

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
		var TIME_SECOND_CONSTANT = 1000; //1 second equal to 1000
		var regen = $interval(function () {

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
		}, TIME_SECOND_CONSTANT);
		
		var daybreak = $interval(function () {
			// New day every 10s.
			injectTemp.day += 1;
		}, 10 * TIME_SECOND_CONSTANT);
	}]);

	game.controller("ActionCtrl", ['journalService', function (journalService) {
		
		/////// Notification Functions
		
        /*
		this.gameMessage = [
            {
                textMessage: "",
                canShow: false,
                style: "nop"
            },
            {
                textMessage: "",
                canShow: false,
                style: "nop"
            },
            {
                textMessage: "",
                canShow: false,
                style: "nop"
            }
        ]
		
		this.setGameMessage = function(row, message, style){
			this.gameMessage[row].textMessage = message;
			this.gameMessage[row].canShow = true;
            this.gameMessage[row].style = style;
		}
		
		this.eraseGameMessage = function(){
            for (var i=0; i<3; i++){
                this.gameMessage[i].textMessage = "";
                this.gameMessage[i].canShow = false;
                this.gameMessage[i].style = "nop";
            }
		}
        */
		
		/////// Exploration Functions
		
		this.explore = function () {

		};

		/////// Battle Functions
		
		this.battle = function (charHero, monsData) {
			
			//Check if hero stamina is depleted. If hero tries to attack with stamina at 0, nothing will happen.
			if (charHero.currentStamina >= 1) {
                
                //Use 1 stamina for attack
                charHero.currentStamina -= 1;
			
				//Damage damage to enemy first (enemy will deal damage if it is not dead)
                var tempValue = attackRNG(charHero.power * 0.5, charHero.power * 1.5);
                monsData.currentHealth -= tempValue; //Later on, this line needs to be altered to accomodate dmgCalculator function (in utilities.js)
				journalService.write("You dealt " + tempValue + " damage to " + monsData.name);
				
				// Check if enemy is dead
				if (monsData.currentHealth <= 0) {
					charHero.experiencePoints += monsData.expDrop;
					charHero.gold += monsData.goldDrop;
					monsData.currentHealth = monsData.maxHealth;
					//this.setGameMessage(1, "You defeated "+monsData.name+". You gained "+monsData.expDrop+" exp and "+monsData.goldDrop+" gold.", "nop");
					journalService.write(charHero.name + " defeated " + monsData.name + ". " + charHero.name + " gained " + monsData.expDrop + " exp and " + monsData.goldDrop + " gold.");
					
					// Check if hero can level up
					if (charHero.experiencePoints >= this.getRequiredExperiencePointsToLevel(charHero)) {
						charHero.level += 1;
						charHero.power += 5;
						charHero.maxHealth += 20;
						charHero.maxStamina += 3;
						charHero.experiencePoints = 0;
                        //this.setGameMessage(2, "You levelled up and gained +1 power, +2 health and +3 stamina");
						journalService.write(">>>>>>You levelled up and gained +5 power, +20 health and +3 stamina");
                        
						//Increase hero health and stamina regen every 3 level
						if (charHero.level % 3 === 0) {
							charHero.regen.health += 3;
							charHero.regen.stamina += 0.75;
                            //this.setGameMessage(3, "Also, you gained 0.5 health regen and 0.75 stamina regen");
                            journalService.write(">>>>>>Also, you gained 0.5 health regen and 0.75 stamina regen");
						}
					}
				}

                //If the enemy is not dead, then the enemy will deal damage to player.
				else {
                    
                    tempValue = attackRNG(monsData.power * 0.5, monsData.power * 1.5);
                    charHero.currentHealth -= tempValue;
                    journalService.write("You received "  + tempValue + " damage from " + monsData.name);
                    
                    // Check if player is dead
                    if (charHero.currentHealth <= 0) {
                        //this.setGameMessage(1, "You barely escaped with your life from " + monsData.name);
                        journalService.write("You barely escaped with your life from " + monsData.name);
                        charHero.currentHealth = 1;
                        monsData.currentHealth = monsData.maxHealth;
                    }
				}
                
			} else {
				//charHero.currentStamina = 0;
			}
			
		};
		
		/////// Other Functions
		
		/**
		 * Calculate the required experience points to level up.
		 * @return {integer} Required experience points to level up.
		 */
		this.getRequiredExperiencePointsToLevel = function (charHero) {
			return (charHero.level * charHero.level) + (5 * charHero.level);
		};

		
	}]);

})(window.angular);

