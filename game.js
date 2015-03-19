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
			},
            selectedAttackID: -1,
            
            // Hero's Attack Types (can be added later). For now, damage types are Slash, Pierce, Blunt, Magic and Neutral)
            // Additionally, monster now will have their own armor type. Somewhat similar to Warcraft
            // Armor types for now are: LightArmor, HeavyArmor, magicArmor
            // Probably time to make buttons to switch between attackTypes.
            // Also, skills can be put in here, if necessary.
            attackType: [{
                attackID:0,
                attackName: "Slash",
                damageType: "Slash",
                staminaUsage: 1
            },
            {
                attackID:1,
                attackName: "Stab",
                damageType: "Piercing",
                staminaUsage: 1
            },
            {
                attackID:2,
                attackName: "Bash with Scabbard",
                damageType: "Blunt",
                staminaUsage: 1.5
            },
            {
                attackID:3,
                attackName: "Poke 'em",
                damageType: "Neutral",
                staminaUsage: 0.5
            },
            {
                attackID:4,
                attackName: "Conjure some balls of fire",
                damageType: "Magic",
                staminaUsage: 0.5
            }
            ]
		};
        
        var selectAttack = function(selAttackID){
            this.hero.selectedAttackID = selAttackId;
            console.log("Print this out, please");
        }
		
		var injectTemp = this;

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
		
		/////// Exploration Functions
		
		this.explore = function () {

		};

		/////// Battle Functions
		
		this.battle = function (charHero, monsData) {
			
			//Check if hero stamina is depleted. If hero tries to attack with stamina at 0, nothing will happen.
			if(charHero.selectedAttackID === -1){
                journalService.write("Yo, select your attack type first.");
            }
            else if (charHero.currentStamina >= 1) {
                
                //Use 1 stamina for attack
                charHero.currentStamina -= 1;
			
				//Damage damage to enemy first (enemy will deal damage if it is not dead)
                var tempValue = random (charHero.power * 0.5, charHero.power * 1.5);
                monsData.currentHealth -= tempValue; //Later on, this line needs to be altered to accomodate dmgCalculator function (in utilities.js)
				journalService.write("You dealt " + (Math.round(tempValue*10)/10) + " damage to " + monsData.name);
				
				// Check if enemy is dead
				if (monsData.currentHealth <= 0) {
					charHero.experiencePoints += monsData.expDrop;
					charHero.gold += monsData.goldDrop;
					monsData.currentHealth = monsData.maxHealth;
					journalService.write(charHero.name + " defeated " + monsData.name + ". " + charHero.name + " gained " + monsData.expDrop + " exp and " + monsData.goldDrop + " gold.");
					
					// Check if hero can level up
					if (charHero.experiencePoints >= this.getRequiredExperiencePointsToLevel(charHero)) {
						charHero.level += 1;
						charHero.power += 5;
						charHero.maxHealth += 20;
						charHero.maxStamina += 3;
						charHero.experiencePoints = 0;
						journalService.write(">>>>>>You levelled up and gained +5 power, +20 health and +3 stamina");
                        
						//Increase hero health and stamina regen every 3 level
						if (charHero.level % 3 === 0) {
							charHero.regen.health += 3;
							charHero.regen.stamina += 0.75;
                            journalService.write(">>>>>>Also, you gained +3 health regen and +0.75 stamina regen");
						}
					}
				}

                //If the enemy is not dead, then the enemy will deal damage to player.
				else {
                    
                    tempValue = random (monsData.power * 0.5, monsData.power * 1.5);
                    charHero.currentHealth -= tempValue;
                    journalService.write("You received "  + (Math.round(tempValue*10)/10) + " damage from " + monsData.name);
                    
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

