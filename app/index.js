'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var XtcGenerator = module.exports = function XtcGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(XtcGenerator, yeoman.generators.Base);

XtcGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// welcome message
	var welcome =
			'\n' +
			chalk.yellow.bold("  _/__    _  __  ._  _ _/_  _  _  _ ") + '\n' +
			chalk.yellow.bold("></ /_   /_///_///_'/_ /   /_//_'/ /") + '\n' +
			chalk.yellow.bold("        /     |/           _/       ") + '\n\n' +
			chalk.blue.bold('    express-terrific project generator\n\n') +
			chalk.green('Please answer a few questions to create your new project.\n')
		;

	console.log(welcome);

	var prompts = [
		{
			name: 'name', message: 'What\'s the name of the new project?\n' +
			'(all lowercase, hyphen separated)'
		}
	];

	this.prompt(prompts, function (err, props) {

		if (err) {
			return this.emit('error', err);
		}

		this.name = props.name;

		cb();
	}.bind(this));
};

XtcGenerator.prototype.app = function app() {
	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');
};

XtcGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('editorconfig', '.editorconfig');
	this.copy('jshintrc', '.jshintrc');
};

