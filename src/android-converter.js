'use strict';

const parser = require('xmldom').DOMParser;
const serializer = require('xmldom').XMLSerializer;

exports = module.exports = {
	to: function(content) {
		var template = '<?xml version="1.0" encoding="utf-8"?><resources></resources>';
		var doc = new parser().parseFromString(template);
		var root = doc.childNodes[1];

		content.toString().split('\n').forEach(function(line, i){
			line = line.replace(/\r/, '');
			const founded = line.match(/^(.*):=(.*)$/);
			
			if (founded === null){
				console.log(i, line, founded);
				return;
			}

			var child = doc.createElement('string');
			let key = founded[1];
			let value = founded[2];
			
			//@see https://developer.android.com/guide/topics/resources/string-resource.html#escaping_quotes
			value = value.replace(/'/g, "\\'");
			value = value.replace(/"/g, '\\"');

			child.setAttribute('name', key);
			child.appendChild(doc.createTextNode(value));
			root.appendChild(child);
		});

		content = new serializer().serializeToString(doc);

		content = content.replace(/<resources>/, '\n<resources>');
		content = content.replace(/<\/resources>/, '\n</resources>');
		content = content.replace(/<string /g, '\n\t<string ');

		return {
			content: content,
			output: 'strings.xml'
		};
	},

	from: function(content) {
		var doc = new parser().parseFromString(content),
			lines = doc.getElementsByTagName('string'),
			result = '';

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];

			if (i > 0) {
				result += '\n';
			}

			result += line.getAttribute('name');
			result += ':=';
			result += line.textContent;
		}

		return {
			content: result,
			output: 'Language.properties'
		}; 
	}
};