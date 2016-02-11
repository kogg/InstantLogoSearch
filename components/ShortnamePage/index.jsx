var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var React                    = require('react');

var Logos = require('../Logos');

var PAGE_SIZE = 20;

module.exports = connect(createStructuredSelector({
	logos: createSelector(
		_.property('logos'),
		function(logos) {
			return _.chain(logos)
				.sortBy(function(logo) {
					return -logo.data.downloads;
				})
				.pluck('data')
				.value();
		}
	),
	searching: _.property('searching')
}))(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.searching !== nextProps.searching) {
			this.context.router.replace('/' + (this.props.searching ? '?q=' + this.props.searching : ''));
		}
	},
	render: function() {
		var shortname_logos = _.where(this.props.logos, { shortname: this.props.params.shortname });

		return (
			<div>
				<Logos heading={(_.first(shortname_logos) || {}).name} logos={shortname_logos} />
				<Logos heading="Popular Logos"
					logos={_.first(this.props.logos, 5)}
					loadmore="cta"
					onLoadMore={function(how) {
						ga('send', 'event', 'Logos', 'Load More', how || '', PAGE_SIZE);
						this.context.router.replace('/');
					}.bind(this)} />
			</div>
		);
	},
	componentDidMount: function() {
		var shortname_logos = _.where(this.props.logos, { shortname: this.props.params.shortname });

		this.addImpressions((_.first(shortname_logos) || {}).name, shortname_logos, 0);
		this.addImpressions('Popular Logos', _.first(this.props.logos, 5), 0);
		ga('send', 'pageview');
	},
	addImpressions: function(list, logos, position_offset) {
		position_offset = position_offset || 0;
		_.each(logos, function(logo, i) {
			ga(
				'ec:addImpression',
				_.chain(logo)
					.pick('id', 'name')
					.extend({ list: list, position: position_offset + i + 1 })
					.value()
			);
		});
	}
}));
