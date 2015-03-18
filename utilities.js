/**
 * Generate a random number between min (included) and max (included).
 * @param  {Number} min The minimum value.
 * @param  {Number} max The maximum value.
 * @return {Number}     The generated random number.
 */
var attackRNG = function(min, max) {
	return Math.round(Math.random() * (max - min + 1) + min);
}