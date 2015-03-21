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
                attackName: "Slice and d6 'em",
                damageType: "Slash",
                flavText: "",
                staminaUsage: 1,
                powerRating: 1
            },
            {
                attackID:1,
                attackName: "Stabbity stab 'em",
                damageType: "Piercing",
                flavText: "",
                staminaUsage: 1,
                powerRating: 1
            },
            {
                attackID:2,
                attackName: "Bash with something \"blunt\" ",
                damageType: "Blunt",
                flavText: "You know what I mean *nudge*. You know, with your head, or arm, or legs.",
                staminaUsage: 1.5,
                powerRating: 1.25
            },
            {
                attackID:3,
                attackName: "Some kind of \"Attack\"",
                damageType: "Neutral",
                flavText: "If this attack name isn't shady enough, I don't know what else to write to make it \"neutral\"",
                staminaUsage: 0.5,
                powerRating: 0.5
            },
            {
                attackID:4,
                attackName: "Something like magic missile",
                damageType: "Magic",
                flavText: "Just because magic missile is overused. And yet, I can't get away from that name",
                staminaUsage: 2,
                powerRating: 1.5
            }
            ],
            
            selectAttack: function() {
                journalService.write(this.name + " chosen " + attackTypeColorText(this.attackType[this.selectedAttackID].attackName, this.attackType[this.selectedAttackID].damageType));
            }
		};
		
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
            if(charHero.name.length > 20){
                journalService.write(boldText("Your name is too long, I'll just give you weird names, how's that?"));
                charHero.name = "Poopmeister";
                charHero.attackType[0].attackName = "Poop blade"
                charHero.attackType[0].flavText = "Yup."
                charHero.attackType[1].attackName = "Butt piercer"
                charHero.attackType[1].flavText = "Yeah."
                charHero.attackType[2].attackName = "Butt smash"
                charHero.attackType[2].flavText = "Neat."
                charHero.attackType[3].attackName = "Poop"
                charHero.attackType[3].flavText = "Well, stool."
                charHero.attackType[4].attackName = "Magical sharts"
                charHero.attackType[4].flavText = "Slightly better than regular sharts. I mean, it's magical after all."
            }
            
			if(charHero.selectedAttackID === -1){
                journalService.write("Yo, select your attack type first.");
            }
            else if (charHero.currentStamina - charHero.attackType[charHero.selectedAttackID].staminaUsage > 0) {
                
                //Use 1 stamina for attack
                charHero.currentStamina -= charHero.attackType[charHero.selectedAttackID].staminaUsage;
			
				//Damage damage to enemy first (enemy will deal damage if it is not dead)
                var damageValue = random (charHero.power * 0.5, charHero.power * 1.5); // First, get a number from a range of damage from 50% to 150% of original attack value.
                damageValue = damageValue * charHero.attackType[charHero.selectedAttackID].powerRating; // Second, multiply the damage with power rating of the attack type.
                damageValue = dmgCalculator(damageValue, charHero.attackType[charHero.selectedAttackID].damageType, monsData.armorType); // Finally, mitigate the damage based on enemy armor.
                monsData.currentHealth -= damageValue;
				journalService.write(boldText(charHero.name) + " dealt " + attackTypeColorText(boldText((Math.round(damageValue * 100) / 100)) + " " + charHero.attackType[charHero.selectedAttackID].damageType, charHero.attackType[charHero.selectedAttackID].damageType) + " damage to " + boldText(monsData.name));
				
				// Check if enemy is dead
				if (monsData.currentHealth <= 0) {
					charHero.experiencePoints += monsData.expDrop;
					charHero.gold += monsData.goldDrop;
					monsData.currentHealth = monsData.maxHealth;
					journalService.write(boldText(charHero.name) + " defeated " + boldText(monsData.name) + ". " + charHero.name + " gained " + colorText(boldText(monsData.expDrop) + " exp", "green") + " and " + colorText(boldText(monsData.goldDrop) + " gold","#ffa500") + ".");
					
					// Check if hero can level up
					if (charHero.experiencePoints >= this.getRequiredExperiencePointsToLevel(charHero)) {
						charHero.level += 1;
						charHero.power += 5;
						charHero.maxHealth += 20;
						charHero.maxStamina += 3;
						charHero.experiencePoints = 0;
						journalService.write(italicText(">>>>>>You levelled up and gained +5 power, +20 health and +3 stamina"));
                        
						//Increase hero health and stamina regen every 3 level
						if (charHero.level % 3 === 0) {
							charHero.regen.health += 3;
							charHero.regen.stamina += 0.75;
                            journalService.write(italicText(">>>>>>Also, you gained +3 health regen and +0.75 stamina regen"));
						}
					}
				}

                //If the enemy is not dead, then the enemy will deal damage to player.
				else {
                    
                    damageValue = random (monsData.power * 0.5, monsData.power * 1.5);
                    charHero.currentHealth -= damageValue;
                    journalService.write(randomOuchMessage() + ", " + monsData.name + " dealt "  + boldText((Math.round(damageValue * 100) / 100)) + " damage");
                    
                    // Check if player is dead
                    if (charHero.currentHealth <= 0) {
                        journalService.write(colorText(strongText("You barely escaped with your life from " + monsData.name)), "red");
                        charHero.currentHealth = 1;
                        monsData.currentHealth = monsData.maxHealth;
                    }
				}
                
			} else {
				journalService.write(tagPair(boldText("You ran out of stamina. Calm down, champ."),"big"));
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

