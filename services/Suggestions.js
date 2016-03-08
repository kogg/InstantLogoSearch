var _         = require('underscore');
var fs        = require('fs');
var http      = require('http');
var memoize   = require('memoizee');
var path      = require('path');
var promisify = require('es6-promisify');
var Git       = require('nodegit');
var GitHubApi = require('github');

var STATUS_MESSAGES = _.invert(http.STATUS_CODES);
var TMP_PATH        = path.join(__dirname, '../.tmp');

var getRepo = Promise.reject(new Error('Git needs ENV vars GITHUB_USERNAME & GITHUB_PERSONAL_ACCESS_TOKEN'));
var github  = new GitHubApi({ version: '3.0.0' });

if (process.env.GITHUB_USERNAME && process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
	github.authenticate({
		type:     'basic',
		username: process.env.GITHUB_USERNAME,
		password: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
	});

	getRepo = Git.Clone('https://github.com/kogg/instant-logos.git', TMP_PATH, {
		checkoutBranch: 'develop',
		fetchOpts:      {
			callbacks: {
				certificateCheck: function() {
					return 1;
				},
				credentials: function() {
					return Git.Cred.userpassPlaintextNew(process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '', 'x-oauth-basic');
				}
			}
		}
	}).catch(function() {
		return Git.Repository.open(TMP_PATH);
	});
}

function issue_to_suggestion(issue) {
	return {
		id:   issue.number,
		name: issue.title,
		url:  'https://github.com/kogg/instant-logos/' + (issue.pull_request ? 'pull' : 'issues') + '/' + issue.number
	};
}

module.exports = {
	get: memoize(function(id) {
		return promisify(github.issues.getRepoIssue.bind(github.issues))({
			number: id,
			user:   'kogg',
			repo:   'instant-logos'
		}).then(
			function(issue) {
				if (issue.state !== 'open' || !_.findWhere(issue.labels, { name: 'logo-suggestion' })) {
					var err = new Error('Not Found');
					err.status = 404;
					throw err;
				}
				return issue_to_suggestion(issue);
			},
			function(err) {
				err.status = err.code || STATUS_MESSAGES[err.message] || STATUS_MESSAGES[JSON.parse(err.message).message];
				throw err;
			}
		);
	}, { maxAge: 10000, preFetch: true }),
	find: memoize(function() {
		return promisify(github.issues.repoIssues.bind(github.issues))({
			user:     'kogg',
			repo:     'instant-logos',
			labels:   'logo-suggestion',
			state:    'open',
			sort:     'created',
			per_page: 100
		}).then(
			function(issues) {
				return _.map(issues, issue_to_suggestion);
			},
			function(err) {
				err.status = err.code || STATUS_MESSAGES[err.message] || STATUS_MESSAGES[JSON.parse(err.message).message];
				throw err;
			}
		);
	}, { maxAge: 5000, preFetch: true }),
	create: function(data) {
		if (!_.result(data, 'name')) {
			var err = new Error(http.STATUS_CODES[400]);
			err.status = 400;
			return Promise.reject(err);
		}
		var promise = promisify(github.issues.create.bind(github.issues))({
			user:   'kogg',
			repo:   'instant-logos',
			title:  data.name,
			labels: ['logo-suggestion']
		});
		if (data.file) {
			promise = promise.then(function(issue) {
				var _getRepo     = getRepo;
				var randomstring = _.times(10, _.partial(_.sample, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._', null)).join('');
				var branch       = data.name.replace(/[^a-zA-Z0-9]+/g, '_') + '-' + randomstring;

				var promise = _getRepo.then(function(repo) {
					var filename = data.name.replace(/[/:]/g, '_') + ' (' + randomstring + ').svg';
					var promise = Promise.resolve()
						.then(function() {
							return repo.getBranchCommit('develop')
								.then(_.partial(repo.createBranch.bind(repo), branch))
								.then(repo.checkoutBranch.bind(repo));
						})
						.then(function() {
							// FIXME Find the proper filename to have here
							return promisify(fs.writeFile.bind(fs))(path.join(TMP_PATH, 'logos', filename), data.file);
						})
						.then(function() {
							return repo.index()
								.then(function(index) {
									var addByPathCode = index.addByPath(path.join('logos', filename));
									if (addByPathCode) {
										throw new Error('index#addByPath error code ' + addByPathCode);
									}
									var writeCode = index.write();
									if (writeCode) {
										throw new Error('index#write error code ' + writeCode);
									}
									return index.writeTree();
								});
						})
						.then(function(oid) {
							return Git.Reference.nameToId(repo, 'HEAD')
								.then(repo.getCommit.bind(repo))
								.then(function(parent) {
									var signature = repo.defaultSignature(repo);
									return repo.createCommit('HEAD', signature, signature, 'Adding logo file ' + filename, oid, [parent]);
								});
						})
						.then(function() {
							return promisify(repo.getRemote.bind(repo))('origin')
								.then(function(remote) {
									return remote.push(['refs/heads/' + branch + ':refs/heads/' + branch], {
										callbacks: {
											certificateCheck: function() {
												return 1;
											},
											credentials: function() {
												return Git.Cred.userpassPlaintextNew(process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '', 'x-oauth-basic');
											}
										}
									});
								})
								.then(function(code) {
									if (code) {
										throw new Error('remote#push error code ' + code);
									}
								});
						});

					var cleanupBranch = function() {
						return _getRepo
							.then(function(repo) {
								return repo.getBranch(branch);
							})
							.then(Git.Branch.delete.bind(Git.Branch));
					};
					promise
						.then(cleanupBranch, cleanupBranch)
						.catch(function(err) {
							console.log(err); // TODO #20
						});

					var checkoutDevelop = function() {
						return repo.getBranch('develop').then(repo.checkoutBranch.bind(repo));
					};
					return promise.then(checkoutDevelop, function(err) {
						return checkoutDevelop().then(function() {
							throw err;
						});
					});
				});

				// getRepo can be used after the previous work is done, regardless of failure
				getRepo = promise.then(_.constant(_getRepo), _.constant(_getRepo));

				return promise.then(function() {
					return promisify(github.pullRequests.createFromIssue.bind(github.pullRequests))({
						user:  'kogg',
						repo:  'instant-logos',
						issue: issue.number,
						base:  'develop',
						head:  branch
					}).catch(function(err) {
						console.log(err); // TODO #20
						// If we weren't able to create a pull request, we still have our initial issue. Good enough
						return Promise.resolve(issue);
					});
				});
			});
		}
		return promise
			.then(issue_to_suggestion)
			.catch(function(err) {
				console.log(err); // TODO #20
				throw err;
			});
	}
};
