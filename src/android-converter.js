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
			const founded = line.match(/^(.*)=(.*)$/);
			if (founded !== null){
				var child = doc.createElement('string');
				child.setAttribute('name', founded[1]);
				child.appendChild(doc.createTextNode(founded[2]));

				root.appendChild(child);
			} else {
				console.log(i, line, founded);
			}
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
			result += '=';
			result += line.textContent;
		}

		return {
			content: result,
			output: 'Language.properties'
		}; 
	}
};