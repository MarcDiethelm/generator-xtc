'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var ModuleGenerator = module.exports = function ModuleGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the module subgenerator with the argument ' + this.name + '.');
};

util.inherits(ModuleGenerator, yeoman.generators.NamedBase);

ModuleGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// welcome message
	// http://patorjk.com/software/taag/#p=display&f=Pepper&t=xtc%20mod%20gen
	var welcome =
		'\n' +
		"      _/__   _ _  _   _/  _  _  _ ".yellow.bold + '\n' +
		"    ></ /_  / / //_//_/  /_//_'/ /".yellow.bold + '\n' +
		"                         _/       ".yellow.bold + '\n\n' +
		'    express-terrific module generator\n\n'.blue.bold +
		'Please answer a few questions to create your new module.\n'.green
	;

	console.log(welcome);

	var prompts = [
		{
			name: 'name'
			,message: 'What\'s the name of the new module?\n' +
			          '(all lowercase, hyphen separated, without \'mod-\')'
			/*,validator: function (value, next) {
				var nameFolder = 'mod-' + value
					, destDir = path.join(modulesDir, nameFolder)
					;
				if (grunt.file.exists(destDir)) {
					console.log('A module with that name already exists!');
				}
				next(true);
			}
			,warning: 'A module with that name already exists!'*/
		}
	];

	this.prompt(prompts, function (err, props) {
		var  modulesDir = 'frontend/_terrific/';

		if (err) {
			return this.emit('error', err);
		}

		this.name = props.name;
		this.needHtml = /y/i.test(props.needHtml);
		this.needJS = /y/i.test(props.needJS);
		this.needCSS = /y/i.test(props.needCSS);

		this.nameCSS = 'mod-' + props.name;
		this.nameFolder = this.nameCSS;
		this.nameJS = toCamel(this.nameCSS).replace('mod', '');
		this.nameTest = this.name + '.test.js';
		//this.nameSkinJS
		//this.nameSkinCSS

		this.modulesDir = path.join(modulesDir, this.nameFolder);

		cb();
	}.bind(this));
};


ModuleGenerator.prototype.files = function files() {

	this.mkdir(this.modulesDir);
	this.template('_name.hbs', path.join(this.modulesDir, this.name +'.hbs'));
	this.template('_name.js', path.join(this.modulesDir, this.name +'.js'));
	this.template('_name.less', path.join(this.modulesDir, this.name +'.less'));

	this.mkdir(path.join(this.modulesDir, 'test'));
	this.template('test/_name.test.js', path.join(this.modulesDir, 'test', this.nameTest));
};


/**
* Camelizes the given string.
*
* @method toCamel
* @param {String} str
* The original string
* @return {String}
* The camelized string
*/
var toCamel = function(str){
	return str.replace(/(\-[A-Za-z])/g, function($1){return $1.toUpperCase().replace('-','');});
}
