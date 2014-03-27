/**
 * This module is for you to add your template helpers.
 * Below are some examples how to do it.
 * Refer to http://handlebarsjs.com/#helpers for more info about Handlebars helpers
 *
 * The helpers defined in this file are included and registered with Handlebars in /lib/handlebars-helpers-xtc.js.
 */

var NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== 'production') NODE_ENV = 'development';

/**
 * Filler text helper
 * See: https://github.com/MarcDiethelm/Hipsum.js
 * @author xtc
 * @type {function}
 */
module.exports.filler = require('hipsum')();


/**
 * Log template data to console.
 * // This implementation overwrites a predefined version from xtc
 * @param {...*} obj — Arguments to console.log
 * @author xtc
 * Usage in template: {{log [...obj]}}
 */
module.exports.log = function log(obj) {
	var input = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
	console.log.apply( console, input );
};


/**
 * JSON.stringify a JS object into a template
 * @param obj
 * @returns {SafeString}
 * @author xtc
 */
module.exports.stringify = function stringify(obj) {
	try {
		return new handlebars.SafeString( JSON.stringify(obj) );
	}
	catch (e) {
		var err = utils.error('Handlebars helper stringify', e);
		console.error(err.c);
		return new handlebars.SafeString( err.web );
	}
};


/**
 * Environment mode block helper
 * Return the rendered block content if the block argument matches the NODE_ENV variable
 * // This implementation overwrites a predefined version from xtc
 * @param name {String} The block argument, 'development' or 'production'
 * @param options {Object} The block options. Contains block content as a compiled Handlebars template function.
 * @returns {String} Empty or rendered block content
 * @author xtc
 */
module.exports.env = function(name, options) {
	// return the block contents only if the name matches NODE_ENV ('development', 'production', etc.)
	return name == NODE_ENV ? options.fn(this) : '';
};
