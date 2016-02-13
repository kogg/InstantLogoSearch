var _   = require('underscore');
var xml = require('xml');

module.exports = {
	description: xml({
		OpenSearchDescription: [
			{ _attr: { xmlns: 'http://a9.com/-/spec/opensearch/1.1/' } },
			{ ShortName: 'Instant Logo' },
			{ LongName: process.env.npm_package_title },
			{ Description: 'Search for ' + process.env.npm_package_title },
			{ Contact: process.env.npm_package_author_email },
			{ Url: { _attr: { type: 'text/html', template: process.env.npm_package_homepage + '/?q={searchTerms}' } } },
			{ Url: { _attr: { type: 'application/atom+xml', template: process.env.npm_package_homepage + '/api/logos.xml/?format=atom&q={searchTerms}' } } },
			{ Url: { _attr: { type: 'application/rss+xml', template: process.env.npm_package_homepage + '/api/logos.xml/?format=rss&q={searchTerms}' } } },
			{ Query: { _attr: { role: 'example', searchTerms: 'facebook' } } }
		]
	}, { declaration: true }),
	atom: function(terms, results) {
		return xml({
			feed: _.chain([
				{ _attr: {
					'xmlns':            'http://www.w3.org/2005/Atom',
					'xmlns:opensearch': 'http://a9.com/-/spec/opensearch/1.1/'
				} },
				{ title: _.first(results).name + ' | ' + process.env.npm_package_title },
				{ link: { _attr: { href: process.env.npm_package_homepage + '/?q=' + terms.join('+') } } },
				{ 'opensearch:totalResults': results.length },
				{ 'opensearch:Query': { _attr: { role: 'request', searchTerms: terms.join(' '), startPage: 1 } } },
				{ link: { _attr: {
					rel:   'search',
					type:  'application/opensearchdescription+xml',
					href:  process.env.npm_package_homepage + '/opensearchdescription.xml',
					title: 'Seach ' + process.env.npm_package_title
				} } }
			]).union(_.map(results, function(result) {
				return { entry: [
					{ title: result.name },
					{ link: result.url }
				] };
			})).value()
		}, true);
	},
	rss: function(terms, results) {
		return xml({
			rss: [
				{ _attr: {
					'version':          '2.0',
					'xmlns:atom':       'http://www.w3.org/2005/Atom',
					'xmlns:opensearch': 'http://a9.com/-/spec/opensearch/1.1/'
				} },
				{ channel: _.chain([
					{ title: (results.length ? _.first(results).name + ' | ' : '') + process.env.npm_package_title },
					{ link: { _attr: { href: process.env.npm_package_homepage + '/?q=' + terms.join('+') } } },
					{ 'opensearch:totalResults': results.length },
					{ 'opensearch:Query': { _attr: { role: 'request', searchTerms: terms.join(' '), startPage: 1 } } },
					{ link: { _attr: {
						rel:   'search',
						type:  'application/opensearchdescription+xml',
						href:  process.env.npm_package_homepage + '/opensearchdescription.xml',
						title: 'Seach ' + process.env.npm_package_title
					} } }
				]).union(_.map(results, function(result) {
					return { item: [
						{ title: result.name },
						{ link: result.url }
					] };
				})).value() }
			]
		}, true);
	}
};
