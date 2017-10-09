'use strict';

const parser = require('xmldom').DOMParser;
const serializer = require('xmldom').XMLSerializer;

exports = module.exports = {
	to: function(content) {
		var template = '<?xml version="1.0" encoding="utf-8"?><resources></resources>';
		var doc = new parser().parseFromString(template);
		var root = doc.childNodes[1];

		const keys = [];

		content.toString().split('\n').forEach(function(line, i){
			line = line.replace(/\r/, '');
			const founded = line.match(/^(.*):=(.*)$/);
			
			if (founded === null){
				console.log(i, line, founded);
				return;
			}

			let key = founded[1];
			let value = founded[2];

			if (keys.indexOf(key) !== -1)
			{
				console.log('duplicate key', key, 'value', value, 'skipping');
				return;
			} else{
				keys.push(key);
			}

			var child = doc.createElement('string');
			
			//@see https://developer.android.com/guide/topics/resources/string-resource.html#escaping_quotes
			value = value.replace(/'/g, "\\'");
			value = value.replace(/"/g, '\\"');

			const stringFormattingFounded = value.match(/%@/);
			if (stringFormattingFounded !== null){
				// avoid Error:(760) Multiple substitutions specified in non-positional format; did you mean to add the formatted="false" attribute? https://stackoverflow.com/a/12627660
				value = value.replace(/\%@/g, '\%s');
				child.setAttribute('formatted', false);
			}

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