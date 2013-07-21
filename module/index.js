'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var ModuleGenerator = module.exports = function ModuleGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);
};

// Merge configuration data
var cfg = require( path.join(process.cwd(), 'app_modules/configure.js') ).merge('_config/', [
		 'default'
		,'project'
		,'secret'
		,'local'
	]).get();

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

	// module name
	var prompts = [
		{
			name: 'name'
			,message: 'What\'s the name of the new module?\n' +
			          '(all lowercase, hyphen separated, without any prefix)'
			,default: this.name
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
		if (err) {
			return this.emit('error', err);
		}
		this.name = props.name;
		cb();
	}.bind(this));
};


ModuleGenerator.prototype.customize = function customize() {
	var cb = this.async();

	nl();

	// need customization?
	var prompts = [
		{
			name: 'customize'
			,message: 'By default this module will have one template, a style sheet, a JS module (with tests) and a README.\n' +
			          'Do you want to change that?'
			,default: 'y|N'
		}
	];

	this.prompt(prompts, function (err, props) {
		if (err) {
			return this.emit('error', err);
		}
		this.customize = !(/y/i.test(props.customize));

		cb();
	}.bind(this));
};


ModuleGenerator.prototype.doCustomize = function doCustomize() {
	var cb = this.async();

	if (!this.customize) {
		cb();
		return;
	}

	nl();

	var prompts = [
		{
			name: 'customizeSelection'
			,message: 'Please choose:\n' +
			          '[1] JS only\n' +
			          '[2] HTML only\n' +
			          '\n' +
			          '[3] HTML + CSS\n' +
			          '[4] HTML + JS\n' +
			          '[5] JS + CSS\n' +
			          ': '
		}
	];

	this.prompt(prompts, function (err, props) {

		if (err) {
			return this.emit('error', err);
		}

		switch (props.customizeSelection) {
			case '1':
				this.needJs = true;
				break;
			case '2':
				this.needHtml = true;
				break;
			case '3':
				this.needHtml = true;
				this.needCss = true;
				break;
			case '4':
				this.needHtml = true;
				this.needJs = true;
				break;
			case '5':
				this.needJs = true;
				this.needCss = true;
				break;
			default:
				// to do: ask again
		}

		cb();
	}.bind(this));
};


ModuleGenerator.prototype.configure = function configure() {
	this.nameCSS = 'mod-' + this.name;
	this.nameFolder = cfg.moduleDirName.replace('{{name}}', this.name);
	this.nameJS = toCamel(this.nameCSS).replace('mod', '');
	this.nameTest = this.name + '.test.js';
	//this.nameSkinJS
	//this.nameSkinCSS
	this.modulesDir = path.join(cfg.paths.modulesBaseDir, this.nameFolder);
};


ModuleGenerator.prototype.files = function files() {
	nl();
	this.mkdir(this.modulesDir);
	(!this.customize || this.needHtml) && this.template('_name.hbs', path.join(this.modulesDir, this.name +'.hbs'));
	(!this.customize || this.needCss) && this.template('_name.less', path.join(this.modulesDir, this.name +'.less'));

	if (!this.customize || this.needJs) {
		this.template('_name.js', path.join(this.modulesDir, this.name +'.js'));
		this.mkdir(path.join(this.modulesDir, 'test'));
		this.template('test/_name.test.js', path.join(this.modulesDir, 'test', this.nameTest));
	}
	this.template('_README.md', path.join(this.modulesDir, 'README.md'));
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

function nl(count) {
	count = count || 1;

	while (count > 0) {
		console.log('');
		count--;
	}
}
