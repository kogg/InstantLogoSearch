var _         = require('underscore');
var http      = require('http');
var memoize   = require('memoizee');
var promisify = require('es6-promisify');
var GitHubApi = require('github');

var github = new GitHubApi({ version: '3.0.0' });

if (process.env.GITHUB_USERNAME && process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
	github.authenticate({
		type:     'basic',
		username: process.env.GITHUB_USERNAME,
		password: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
	});
}

var STATUS_MESSAGES = _.invert(http.STATUS_CODES);

function issue_to_suggestion(issue) {
	return {
		id:   issue.number,
		name: issue.title,
		url:  'https://github.com/kogg/instant-logos/issues/' + issue.number
	};
}

module.exports = {
	get: memoize(function(id) {
		return promisify(github.issues.getRepoIssue)({
			number: id,
			user:   'kogg',
			repo:   'instant-logos'
		}).then(
			function(issue) {
				if (issue.state !== 'open' || !_.findWhere(issue.labels, { name: 'suggestion' })) {
					var err = new Error(http.STATUS_CODES[404]);
					err.status = 404;
					return Promise.reject(err);
				}
				return issue_to_suggestion(issue);
			},
			function(err) {
				err.status = err.code || STATUS_MESSAGES[err.message] || STATUS_MESSAGES[JSON.parse(err.message).message];
				return Promise.reject(err);
			}
		);
	}, { maxAge: 10000, preFetch: true }),
	find: memoize(function() {
		return promisify(github.issues.repoIssues)({
			user:     'kogg',
			repo:     'instant-logos',
			labels:   'suggestion',
			state:    'open',
			sort:     'created',
			per_page: 100
		}).then(function(issues) {
			return _.map(issues, issue_to_suggestion);
		});
	}, { maxAge: 5000, preFetch: true }),
	create: function(data) {
		if (!_.result(data, 'name')) {
			var err = new Error(http.STATUS_CODES[400]);
			err.status = 400;
			return Promise.reject(err);
		}
		return this.find()
			.then(function(issues) {
				if (_.findWhere(issues, _.pick(data, 'name'))) {
					var err = new Error(http.STATUS_CODES[409]);
					err.status = 409;
					return Promise.reject(err);
				}
			})
			.then(function() {
				if (!data.file) {
					return promisify(github.issues.create)({
						user:   'kogg',
						repo:   'instant-logos',
						title:  data.name,
						labels: ['suggestion']
					});
				}
				return Promise.reject(new Error('Can\'t handle files, yet')); // FIXME
			})
			.then(issue_to_suggestion);
	}
};
