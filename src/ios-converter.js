'use strict';

exports = module.exports = {
	to: function(content) {
        let returnContent = '';
		content.toString().split('\n').forEach(function(line, i){
			line = line.replace(/\r/, '');
			const founded = line.match(/^(.*)=(.*)$/);
			if (founded !== null){
				returnContent += '"'+founded[1]+'"="'+founded[2]+'";\n';
			} else {
				console.log(i, line, founded);
			}
		});
		return {
			content: returnContent,
			output: 'Localizable.strings'
		};
	},

	from: function(content) {
        let returnContent = '';
		content.toString().split('\n').forEach(function(line, i){
			if (/^"(.*)"\s*=\s*"(.*)";$/m.test(line)){
                line = line.replace(/"\s*=\s*"/g, '=');
                line = line.replace(/(^"|";$)/mg, '');
                returnContent += line + '\n';
            }
		});

		return {
			content: returnContent,
			output: 'Language.properties'
		};
	}
};