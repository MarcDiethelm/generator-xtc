'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var SkinGenerator = module.exports = function SkinGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.Base.apply(this, arguments);
	this.argument('skinName', { type: String, required: false });

	this.projectPath = this.options.path ? path.resolve(process.cwd(), this.options.path) : process.cwd();
	var xtcPkg = require( path.join(this.projectPath, 'package.json') );
	this.xtcCfg = require( path.join(this.projectPath, 'lib/configure.js') ).get();
	this.xtcOverview = require( path.join(this.projectPath, 'lib/overview.js') )(this.xtcCfg);
};

util.inherits(SkinGenerator, yeoman.generators.NamedBase);



// welcome message
// http://patorjk.com/software/taag/#p=display&f=Pepper&t=xtc skin gen
var welcome =
	'\n' +
	chalk.yellow.bold("      _/__    _/_._   _  _  _ ") + '\n' +
	chalk.yellow.bold("    ></ /_  _\\/\\// / /_//_'/ /") + '\n' +
	chalk.yellow.bold("                     _/       ") + '\n\n' +
	chalk.blue.bold('    express-terrific skin generator\n\n') +
	chalk.green('Please answer a few questions to create your new skin.\n')
;
console.log(welcome);

SkinGenerator.prototype.moduleChoice = function moduleChoice() {
	var cb = this.async();
	var existingModules = this.xtcOverview.modules.map(function(module) {
			return {
				 name: module.name
				,value: module.name
			}
		});
	;
	this.prompt([{
		name: 'moduleName',
		type: 'list',
		message: 'What module is the skin for?',
		choices: existingModules
	}], function(answer) {
		this.moduleName = answer.moduleName;
		cb();
	}.bind(this));
};

SkinGenerator.prototype.askSkinName = function askSkinName() {
	var cb = this.async();

	var prompts = [
		{
			name: 'skinName'
			,message: 'What\'s the name of the new skin?\n' +
			          '(all lowercase, hyphen separated, without any prefix)'
			,default: this.skinName
		}
	];

	this.prompt(prompts, function(props) {
		this.skinName = props.skinName;
		cb();
	}.bind(this));
};


SkinGenerator.prototype.skinChoices = function doCustomize() {
	var cb = this.async();

	nl();

	var prompts = [
		{
			type: 'list'
			,name: 'customizeSelection'
			,message: 'Please choose the skins type'
			,choices: [
				{
					 name: 'JS only'
					,value: ['needJs']
				}
				,{
					 name: 'CSS only'
					,value: ['needCss']
				}
				,{
					 name: 'JS + CSS'
					,value: ['needJs', 'needCss']
				}
			]
		}
	];

	this.prompt(prompts, function (answer) {

		answer.customizeSelection.forEach(function(value, index, array) {
			this[value] = true;
		}, this)

		cb();
	}.bind(this));
};


SkinGenerator.prototype.configure = function configure() {
	var moduleFolderPrefix = this.xtcCfg.moduleDirName.replace('{{name}}', '').replace('/', '');

	this.nameModuleFolder = moduleFolderPrefix + this.moduleName;
	this.nameModuleJs = toCamel('-'+ this.moduleName); // the Terrific camelize function below assumes we have 'mod-' in front
	this.nameSkinJs = toCamel('-'+ this.skinName);
	this.modulesDir = path.join(this.xtcCfg.sources.modulesBaseDir, this.nameModuleFolder);
	this.skinDir = path.join(this.modulesDir, this.xtcCfg.skinsDirName);
	this.user = process.env.USER;
};


SkinGenerator.prototype.files = function files() {
	nl();
	var fileName = this.moduleName +'-'+ this.skinName;
	this.mkdir(this.skinDir);
	this.needCss && this.template('_name-skin_name.less', path.join(this.skinDir, fileName +'.less'));
	this.needJs && this.template('_name-skin_name.js', path.join(this.skinDir, fileName +'.js'));
};


SkinGenerator.prototype.snippet = function snippet() {

	if (this.xtcCfg.templateExtension === '.hbs') {
		console.info('\nSnippet:  '+ chalk.blue.bold('{{mod "%s" skins="%s"}}') +'\n', this.moduleName, this.skinName);
	}
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
