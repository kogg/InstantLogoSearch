var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var levenshtein              = require('fast-levenshtein');
var React                    = require('react');

var Logos = require('../Logos');

module.exports = connect(createStructuredSelector({
	logos: createSelector(
		_.property('logos'),
		createSelector(
			_.property('searching'),
			function(searching) {
				return _.chain(searching.trim().toLowerCase().replace(/[.\-()]/gi, '').split(/\s+/))
					.compact()
					.sortBy(function(filter) {
						return -filter.length; // The longer the word, the more likely it won't match anything
					})
					.value();
			}
		),
		function(logos, filters) {
			if (_.isEmpty(filters)) {
				return _.chain(logos)
					.sortBy(function(logo) {
						return -logo.data.downloads;
					})
					.pluck('data')
					.value();
			}
			return _.chain(logos)
				.reject(function(logo) {
					return _.some(filters, function(filter) {
						return logo.data.shortname.indexOf(filter) === -1;
					});
				})
				.sortBy(function(logo) {
					return _.chain(filters)
						.map(_.partial(levenshtein.get, logo.data.shortname))
						.max()
						.value();
				})
				.pluck('data')
				.value();
		}
	)
}))(React.createClass({
	render: function() {
		return <Logos logos={this.props.logos} history={this.props.history} />;
	}
}));
