'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _projectPath = '';


var XtcGenerator = module.exports = function XtcGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

	this.projectPath = this.options.path ? path.resolve(process.cwd(), this.options.path) : process.cwd();
	_projectPath = this.projectPath;
};

util.inherits(XtcGenerator, yeoman.generators.Base);

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


/*XtcGenerator.prototype.foo = function foo() {
	var cb = this.async()
	this.fetch('https://raw.githubusercontent.com/yeoman/generator/master/lib/actions/fetch.js', '__test', function() {
		console.dir(arguments)
	});
}*/
XtcGenerator.prototype.basics = function basics() {
	var cb = this.async()
		,prompts = [
		{
			name: 'name'
			,message: 'What\'s the name of the new project?\n(all lowercase, hyphen separated)'
		},
		{
			name: 'repository'
			,message: 'Repository ( https "read-only" .git URI, if available)'
		}
	];

	this.prompt(prompts, function(props) {
		this.name = props.name;
		this.repository = props.repository;
		cb();
	}.bind(this));
};


XtcGenerator.prototype.parts = function parts() {
	var cb = this.async()
		,prompts = [
		{
			name: 'neededParts'
			,type: 'checkbox'
			,message: 'What parts of xtc do you need'
			,choices: [
				{
					name: 'Server'
					,value: 'needServer'
					,checked: true
				}
				,{
					name: 'Build'
					,value: 'needBuild'
					,checked: true
				}
			]
		}
	];

	this.needServer = false;
	this.needBuild = false;

	this.prompt(prompts, function(props) {
		var i;
		for (i = 0; i < props.neededParts.length; i++) {
			this[props.neededParts[i]] = true;
		}
		cb();
	}.bind(this));
};


XtcGenerator.prototype.sitename = function sitename() {
	var cb, prompts;

	if (!this.needServer) {
		return;
	}

	cb = this.async();
	prompts = [
		{
			name: 'siteName'
			,message: 'What is the name of the web site'
		}
	];

	this.prompt(prompts, function(props) {
		this.siteName = props.siteName;
		cb();
	}.bind(this));
};

XtcGenerator.prototype.app = function app() {

	// Project
	this.copy('_package.json', projectPath('package.json'));
	this.copy('_.gitignore', projectPath('.gitignore'));
	//this.copy('_bower.json', 'bower.json');
	//this.copy('editorconfig', '.editorconfig');
	//this.copy('jshintrc', '.jshintrc');

	// Config
	this.mkdir(projectPath('_config'));
	this.copy('_config/configs.json', projectPath('_config/configs.json'));
	this.copy('_config/config-default.js', projectPath('_config/config-default.js'));
	this.copy('_config/config-project.json', projectPath('_config/config-project.json'));
	this.copy('_config/config-secret.json', projectPath('_config/config-secret.json'));
	this.copy('_config/config-local.json', projectPath('_config/config-local.json'));

	// README.md
	this.copy('_README.md', projectPath('README.md'));

	// Frontend
	this.directory('frontend-example', projectPath('frontend'));

	// Server
	if (this.needServer) {
		//this.copy('server.js', projectPath('server.js'));
		this.copy('_config/pinned-views.json', projectPath('_config/pinned-views.json'));
		this.directory('_controllers', projectPath('controllers'));
		// Helpers
		this.mkdir(projectPath('lib'));
		this.copy('_lib/handlebars-helpers.js', projectPath('lib/handlebars-helpers.js'));
	}

	// Build
	if (this.needBuild) {
		this.copy('Gruntfile.js', projectPath('Gruntfile.js'));
	}

	// Deployment
	/*if (this.buildPackDeployment) {
		this.copy('Procfile', projectPath('Procfile'));
	}*/

};


function projectPath(joinPath) {
	return path.join(_projectPath, joinPath);
}
