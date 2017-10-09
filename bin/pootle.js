#!/usr/bin/env node

'use strict';

let nconf = require('nconf');
const fs = require('fs');
const path = require('path');

nconf.argv({
	'format': {
		alias: 'f'
	},
	'input': {
		alias: 'i'
	},
	'destination': {
		alias: 'd'
	}
});

let converters = {};

converters.android = require('../src/android-converter.js');
converters.ios = require('../src/ios-converter.js');

const input = nconf.get('input');
const outputFolderPath = nconf.get('destination');
let content = fs.readFileSync(input, { encoding: 'utf8' });
let format;
let java;

if (/.strings$/.test(input)) {
	format = 'ios';
}
else if (/.xml$/.test(input)) {
	format = 'android';
}
else if (/.properties$/.test(input)) {
	format = nconf.get('format');
	java = true;
}

const converter = converters[format];
let result;

if (java) {
	result = converter.to.call(converter, content);	
}
else {
	result = converter.from.call(converter, content);
}
const outputFilePath = outputFolderPath ? path.join(outputFolderPath, result.output) : result.output;
fs.writeFile( outputFilePath , result.content, function(err){
	if (err !== null){
		console.error(err);
	}
});