var _ = require('underscore');

module.exports = {
	'use': _.union(
		[
			'stylelint',
			'postcss-import',
			'postcss-nested',
			'postcss-custom-media',
			'autoprefixer',
			'postcss-color-rgba-fallback',
			'postcss-url',
			'postcss-cachebuster'
		],
		(process.env.NODE_ENV === 'production') ? ['cssnano'] : [],
		['postcss-reporter']
	),
	'cssnano':          { autoprefixer: false },
	'postcss-import':   { glob: true },
	'postcss-reporter': { clearMessages: true },
	'postcss-url':      {
		url:        'inline',
		fallback:   'copy',
		assetsPath: 'assets'
	},
	'stylelint': {
		"extends": [
			"stylelint-config-suitcss",
			"./.stylelintrc"
		]
	}
};
