'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _projectJson = require('./templates/_package.json');
var _projectPath = '';
var log = console.log;
var dir = console.dir;


var XtcGenerator = module.exports = function XtcGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.pkg = _projectJson;
	this.projectPath = this.options.path ? path.resolve(process.cwd(), this.options.path) : process.cwd();
	_projectPath = this.projectPath;


	this.on('end', function () {
		this.installDependencies({
			skipInstall: options['skip-install'],
			callback: onDependenciesInstalled.bind(this)
		});
	});
};

util.inherits(XtcGenerator, yeoman.generators.Base);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WELCOME MESSAGE


var welcome =
	'\n' +
	chalk.magenta("    _/__    _  __  ._  _ _/_  _  _  _ ") + '\n' +
	chalk.magenta("  ></ /_   /_///_///_'/_ /   /_//_'/ /") + '\n' +
	chalk.magenta("          /     |/           _/       ") + '\n\n' +
	chalk.blue(' * express-terrific project generator *\n\n') +
	chalk.cyan('This generator will install xtc@%s\n') +
	chalk.cyan('Please answer a few questions to set up your new project.\n')
;

console.log(welcome, _projectJson.dependencies.xtc);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAME AND REPOSITORY


XtcGenerator.prototype.basics = function basics() {
	var cb = this.async()
		,prompts = [
		{
			name: 'name'
			,message: 'Enter a package name for the new project (no spaces)'
			,validate: validateString
		},
		{
			name: 'repoUri'
			,message: '"Read-only" repository URI (https://host/path/to/project.git or blank)'
			,validate: validateGitUri
		}
	];

	this.repository = {};

	this.prompt(prompts, function(props) {
		this.name = props.name;
		this.repository.uri = props.repoUri;
		cb();
	}.bind(this));
};


XtcGenerator.prototype.gitBranch = function gitBranch() {
	var cb, prompts;

	if (!this.repository.uri) { return }
	cb = this.async();

	prompts = [
		{
			name: 'branch'
			,message: 'What branch should be used when linking to project source files'
			,default: 'develop'
		}
	];

	this.prompt(prompts, function(props) {
		this.repository.branch = props.branch;
		cb();
	}.bind(this));
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CHOOSE SERVER AND BUILD PARTS


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

	this.needBuild = false;
	this.needServer = false;
	this.configs = ['"default"'];

	this.prompt(prompts, function(props) {
		var i;
		for (i = 0; i < props.neededParts.length; i++) {
			var value = props.neededParts[i];
			this[value] = true;
		}

		this.needBuild && this.configs.push('"build"');
		this.needServer && this.configs.push('"server"', '"secret"');
		this.configs.push('"local"');
		cb();
	}.bind(this));
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUILD CONFIG


XtcGenerator.prototype.glue = function glue() {
	var cb, prompts;

	if (!this.needBuild) { return }
	cb = this.async();

	prompts = [
		{
			name: 'enableSprites'
			,message: 'Enable sprites generation? Note: Needs a working "glue" (Python) installation.'
			,type: 'confirm'
			,default: false
		}
	];

	this.prompt(prompts, function(props) {
		this.enableSprites = props.enableSprites;
		cb();
	}.bind(this));
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SERVER CONFIG


XtcGenerator.prototype.sitename = function sitename() {
	var cb, prompts;

	if (!this.needServer) { return }
	cb = this.async();

	prompts = [
		{
			name: 'siteName'
			,message: 'Enter the website\'s name'
		}
	];

	this.prompt(prompts, function(props) {
		this.siteName = props.siteName;
		cb();
	}.bind(this));
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Copy Files


XtcGenerator.prototype.copyFiles = function copyFiles() {

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
	this.copy('_config/config-local.json', projectPath('_config/config-local.json'));

	// README.md
	this.copy('_README.md', projectPath('README.md'));

	// Frontend
	this.directory('frontend-example', projectPath('frontend'));

	// Server
	if (this.needServer) {
		this.copy('_config/config-server.json', projectPath('_config/config-server.json'));
		this.copy('_config/config-secret.json', projectPath('_config/config-secret.json'));
		this.copy('_config/pinned-views.json', projectPath('_config/pinned-views.json'));
		this.directory('_controllers', projectPath('controllers'));

		// Helpers
		this.mkdir(projectPath('lib'));
		this.copy('_lib/handlebars-helpers.js', projectPath('lib/handlebars-helpers.js'));
		//this.copy('server.js', projectPath('server.js'));
	}

	// Build
	if (this.needBuild) {
		this.copy('Gruntfile.js', projectPath('Gruntfile.js'));
		this.copy('_config/config-build.json', projectPath('_config/config-build.json'));
	}

	// Deployment
	/*if (this.buildPackDeployment) {
		this.copy('Procfile', projectPath('Procfile'));
	}*/

};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Outro


function onDependenciesInstalled() {

	var outro =
		'\nInstallation complete!\n\n' +

		chalk.cyan('npm run build') +'\t\tstarts dev build\n' +
		chalk.cyan('npm start') +    '\t\tstarts the server\n'
		//chalk.cyan('npm start') +    '\t\tstarts the server\n\n' +

		//chalk.cyan('npm run mkmod') +    '\t\tcreate a frontend module\n' +
		//chalk.cyan('npm run mkskin') +    '\t\tcreate a skin for a frontend module\n'
	;
	console.log(outro);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers


function projectPath(joinPath) {
	return path.join(_projectPath, joinPath);
}

function validateString(value) {
	return typeof value === 'string' && value.length > 0;
}

function validateGitUri(value) {
	return value === '' || /^https:\/\/[\w\.\:/\-~]+\.git$/.test(value);
}