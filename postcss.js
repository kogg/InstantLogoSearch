module.exports = {
	'use': [
		'postcss-import',
		'postcss-nested',
		'postcss-custom-media',
		'autoprefixer',
		'postcss-color-rgba-fallback',
		'postcss-url'
	],
	'postcss-import': {
		glob: true
	},
	'postcss-url': {
		url:        'copy',
		assetsPath: 'assets'
	}
};
