$(document).ready(function () {
	$('[data-toggle="tooltip"]').tooltip();
});

(function (angular) {
	var game = angular.module("HeroicAdventure", ['Monsters', 'Buildings']);

    game.factory('heroInventoryService', function () {
        var itemList = ["Gold", "Rock", "Copper", "Iron", "Silver", "Potion"], itemInventory = [], i = 0;
        for (i = 0; i < itemList.length; i += 1) {
            itemInventory.push({itemName: itemList[i], itemNumber: 0});
        }

        itemInventory.getItemIndex = function (itemName) {
            var i;

            for (i = 0; i < this.length; i += 1) {
                if (itemName === this[i].itemName) {
                    return i;
                }
            }

            return 0; // If no match can be found, return 0
        };

        itemInventory.addItemToInventory = function (itemName, itemNumber) {
            this[this.getItemIndex(itemName)].itemNumber += itemNumber;
        };

        itemInventory.reduceItemFromInventory = function (itemName, itemNumber) {
            this[this.getItemIndex(itemName)].itemNumber -= itemNumber;
        };
        
        return itemInventory;
        
    });
    
	game.factory('journalService', function () {
        var entryQueue = []; 
        var queueCap = 10;
		
        return {
			write: function (message) {
				if (entryQueue.push(message + '<br />') > queueCap) {
					entryQueue.shift();
				}

				$("#divJournal").html(entryQueue);
			},

			/**
			 * Save the state of the object to local storage with specified key.
			 * @param  {String} key    Item key of local storage where the object will be stored.
			 * @param  {Object} object Object to be saved.
			 */
			save: function (key, object) {
				var objectJson = JSON.stringify(object);
				localStorage.setItem(key, objectJson);
			},

			/**
			 * Load the state of the object from local storage with specified key.
			 * @param  {String} key Item key of local storage where the object is stored.
			 * @return {Object}     The object stored within local storage.
			 */
			load: function (key) {
				var item = localStorage.getItem(key);
				return JSON.parse(item);
			}
		}
	});
    
    game.controller('ViewCtrl', function () {
        this.activeView = "Battle"; //default value
        this.menu = ["Equipment", "Battle", "Building", "Item Shop", "Armory", "Explore"];
        
        this.switchActiveView = function (viewName) {
            this.activeView = viewName;
        };
    });

    /**
     * Handles hero logic.
     */
    game.factory("heroService", function() {
    	var selectedAttackID = -1;

    	return {
    		init: function() {
    			return {
					name: "Generic Hero",
		            nameLocked: false,
		            unconscious: false,
					experiencePoints: 0,
					level: 1,
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
		            itemInventory: [],
		            
		            // Hero's Attack Types (can be added later). For now, damage types are Slash, Pierce, Blunt, Magic and Neutral)
		            // Also, skills can be put in here, if necessary.
		            attackType: [{
		                attackID: 0,
		                attackName: "Slice and d6 'em",
		                damageType: "Slash",
		                flavText: "",
		                staminaUsage: 1,
		                powerRating: 1
		            }, {
		                attackID: 1,
		                attackName: "Stabbity stab 'em",
		                damageType: "Piercing",
		                flavText: "",
		                staminaUsage: 1,
		                powerRating: 1
		            }, {
		                attackID: 2,
		                attackName: "Bash with something \"blunt\" ",
		                damageType: "Blunt",
		                flavText: "You know what I mean *nudge*. You know, with your head, or arm, or legs.",
		                staminaUsage: 1.5,
		                powerRating: 1.25
		            }, {
		                attackID: 3,
		                attackName: "Some kind of \"Attack\"",
		                damageType: "Neutral",
		                flavText: "If this attack name isn't shady enough, I don't know what else to write to make it \"neutral\"",
		                staminaUsage: 0.5,
		                powerRating: 0.5
		            }, {
		                attackID: 4,
		                attackName: "Something like magic missile",
		                damageType: "Magic",
		                flavText: "Just because magic missile is overused. And yet, I can't get away from that name",
		                staminaUsage: 2,
		                powerRating: 1.5
		            }],
		            
		            
				};
			},
			hero: function() {
				return hero;
			}
		}
    });
        
	game.controller("CharacterCtrl", ['heroService', 'heroInventoryService', '$interval', '$document', 'journalService', function (heroService, heroInventoryService, $interval, $document, journalService) {
		this.day = 0;

		this.hero = heroService.init();
		var injectHero = this;

		// Hero's health and stamina regen. Regen is set at every second.
		var TIME_SECOND_CONSTANT = 1000; //1 second equal to 1000
        var GAME_TICK_CONST = 0.5; // 1/GAME_TICK = number of times the game updates
        
        // Interval function for hero's health and stamina regeneration, and also for incremental part of game
		var gameTick = $interval(function () {

            /////// HEALTH AND STAMINA SECTION ///////
			// Add HP if HP is less than max HP
			if (injectHero.hero.currentHealth < injectHero.hero.maxHealth) {
				injectHero.hero.currentHealth += injectHero.hero.regen.health * GAME_TICK_CONST;
			}

			// Add stamina if stamina is less than max stamina
			if (injectHero.hero.currentStamina < injectHero.hero.maxStamina) {
				injectHero.hero.currentStamina += injectHero.hero.regen.stamina * GAME_TICK_CONST;
			}
			
			// Checks for overflow in HP due to regen
			if (injectHero.hero.currentHealth >= injectHero.hero.maxHealth) {
				injectHero.hero.currentHealth = injectHero.hero.maxHealth;
                if (injectHero.hero.unconscious === true){
                    injectHero.hero.unconscious = false; // Hero can move again.
                    journalService.write("Hero can move again now. Now be careful next time, you hear?");
                }
			}
			
			// Checks for overflow in stamina due to regen
			if (injectHero.hero.currentStamina >= injectHero.hero.maxStamina) {
				injectHero.hero.currentStamina = injectHero.hero.maxStamina;
			}
            
            injectHero.hero.itemInventory = heroInventoryService;
            
		}, GAME_TICK_CONST * TIME_SECOND_CONSTANT);
		
		this.save = function() {
			journalService.save('heroquest.hero', this.hero);
			journalService.save('heroquest.day', this.day);
			journalService.write("Saved.");
		}

		this.load = function() {
			this.hero = journalService.load('heroquest.hero');
			this.day = journalService.load('heroquest.day');
			journalService.write("Loaded.");
		}

		$document.ready(function () {
			//injectHero.load();
            journalService.write("You, a lone person, who wander in sewer for ages, decided to turn your life around.");
            journalService.write("");
            journalService.write("One day, you think to yourself \"Hmm, I should try start murdering these rats\".");
            journalService.write("");
            journalService.write("While the idea just sounded god awful, unrelated and questionable, the journey begins nonetheless...");
            journalService.write("");
            journalService.write("One thing to remember, player. Do not incur the wrath of the creator, or you shall receive eternal curse.");
		});

		this.reset = function() {
			this.hero = heroService.init();
			this.day = 0;
		}

		this.selectAttack = function () {
            journalService.write(this.hero.name + " has chosen " + attackTypeColorText(this.hero.attackType[this.hero.selectedAttackID].attackName, this.hero.attackType[this.hero.selectedAttackID].damageType));
        }


        // Interval function for increasing number of day passed
		var daybreak = $interval(function () {
			// New day every 10s.
			injectHero.day += 1;
		}, 10 * TIME_SECOND_CONSTANT);
	}]);

	game.controller("ActionCtrl", ['heroInventoryService', 'journalService', function (heroInventoryService, journalService) {
		
		/////// Exploration Functions
		
		this.explore = function () {

		};

		/////// Battle Functions
		
		this.battle = function (charHero, monsData) {
			
            if(charHero.name.length > 20){
                journalService.write(boldText("Your name is too long, I'll just give you weird names, how's that?"));
                charHero.name = "Poopmeister";
                charHero.nameLocked = true;
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
            } else if(charHero.selectedAttackID === -1){
                journalService.write("Yo, select your attack type first.");
            } else if (charHero.currentStamina - charHero.attackType[charHero.selectedAttackID].staminaUsage > 0) {
                
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
					heroInventoryService.addItemToInventory("Gold", monsData.goldDrop);
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
                        journalService.write(colorText(strongText("You got knocked unconscious by " + monsData.name + ". Good job, player."), "red") + " Now sit down and wait until he/she/it/thing fully recovers.");
                        charHero.currentHealth = 0;
                        charHero.unconscious = true;
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

