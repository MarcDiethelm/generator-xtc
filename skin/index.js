'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var SkinGenerator = module.exports = function SkinGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the skin subgenerator with the argument ' + this.name + '.');
};

util.inherits(SkinGenerator, yeoman.generators.NamedBase);

SkinGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};
