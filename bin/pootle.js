#!/usr/bin/env node

var nconf = require('nconf'),
	fs = require('fs');

nconf.argv({
	'format': {
		alias: 'f'
	},
	'input': {
		alias: 'i'
	}
});

var converters = {};

converters.android = require('../src/android-converter.js');
converters.ios = require('../src/ios-converter.js');

var input = nconf.get('input'),
	content = fs.readFileSync(input, { encoding: 'utf8' }),
	format, java;

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

var converter = converters[format],
	result;

if (java) {
	result = converter.to.call(converter, content);	
}
else {
	result = converter.from.call(converter, content);
}

fs.writeFile(result.output, result.content, function(err){
});