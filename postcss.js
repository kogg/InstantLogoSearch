var _ = require('underscore');

module.exports = {
	'use': _.union(
		[
			'postcss-import-url',
			'postcss-import',
			'postcss-nested',
			'autoprefixer',
			'postcss-mq-keyframes',
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
		url:      'inline',
		fallback: 'copy'
	}
};
