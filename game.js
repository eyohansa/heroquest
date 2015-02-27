(function(angular) {
	var game = angular.module("HeroicAdventure", []);

	game.controller("CharacterCtrl", function() {
		this.heroName = "Hero";
		this.experiencePoints = 0;
		this.level = 1;
		this.gold = 0;
		this.maxHealth = 10;
		this.currentHealth = 10;
		this.power = 1;
		this.gainExperiencePoints = function(points) {
			console.log('Gained ' + points + ' experience points.');
			this.experiencePoints += points;
			if (this.experiencePoints >= this.getRequiredExperiencePointsToLevel()) {
				console.log("You have leveled up!");
				this.level++;
				this.power++;
				this.experiencePoints = 0;
			}
		}
		this.getRequiredExperiencePointsToLevel = function() {
			return this.level * this.level + 10;
		}
	});

	game.controller()
})(window.angular);