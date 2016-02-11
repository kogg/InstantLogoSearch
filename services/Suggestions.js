var _         = require('underscore');
var fs        = require('fs');
var http      = require('http');
var memoize   = require('memoizee');
var path      = require('path');
var promisify = require('es6-promisify');
var Git       = require('nodegit');
var GitHubApi = require('github');

var github = new GitHubApi({ version: '3.0.0' });

if (process.env.GITHUB_USERNAME && process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
	github.authenticate({
		type:     'basic',
		username: process.env.GITHUB_USERNAME,
		password: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
	});
}

var getRepo = Git.Repository.open('.tmp').catch(function() {
	return Git.Clone('git@github.com:kogg/instant-logos.git', '.tmp', {
		checkoutBranch: 'develop',
		fetchOpts:      {
			callbacks: {
				certificateCheck: function() {
					return 1;
				},
				credentials: function(url, userName) {
					return Git.Cred.sshKeyFromAgent(userName);
				}
			}
		}
	});
});

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
				var _getRepo = getRepo;
				var promise  = _getRepo.then(function(repo) {
					var randomstring = _.times(5, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._', null)).join('');
					var branch       = data.name.replace(/[/:]/g, '_') + '-' + randomstring;
					var filename     = data.name.replace(/[/:]/g, '_') + ' (' + randomstring + ').svg';
					return repo.getBranchCommit('develop')
						.then(function(develop_commit) {
							return repo.createBranch(branch, develop_commit);
						})
						.then(function(ref) {
							return repo.checkoutBranch(ref);
						})
						.then(function() {
							return promisify(fs.writeFile)(path.join(repo.workdir(), 'logos', filename), data.file);
						})
						.then(function() {
							return repo.index();
						})
						.then(function(index) {
							index.addByPath(path.join('logos', filename));
							index.write();
							return index.writeTree();
						})
						.then(function(oid) {
							return Git.Reference.nameToId(repo, 'HEAD')
								.then(function(head) {
									return repo.getCommit(head);
								})
								.then(function(parent) {
									var signature = Git.Signature.now('Saiichi Hashimoto', 'saiichihashimoto@gmail.com');
									return repo.createCommit('HEAD', signature, signature, 'message', oid, [parent]);
								});
						})
						.then(function() {
							return repo.getRemote('origin');
						})
						.then(function(remote) {
							return remote.push(['refs/heads/' + branch + ':refs/heads/' + branch], {
								callbacks: {
									certificateCheck: function() {
										return 1;
									},
									credentials: function(url, userName) {
										return Git.Cred.sshKeyFromAgent(userName);
									}
								}
							});
						});
				});
				getRepo = promise
					.catch(_.noop)
					.then(function() {
						return _getRepo;
					});
				return promise;
			})
			.then(function(thing) {
				console.log('whatever', thing);
				return Promise.reject(new Error('whatever'));
			})
			.then(issue_to_suggestion);
	}
};
