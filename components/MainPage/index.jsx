var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var Helmet                   = require('react-helmet');
var React                    = require('react');

var search = require('../../search');
var Logos  = require('../Logos');

var PAGE_SIZE = 20;

module.exports = connect(createStructuredSelector({
	logos: createSelector(
		_.property('logos'),
		function(state) {
			return search.terms(state.searching);
		},
		function(logos, filters) {
			return search(_.pluck(logos, 'data'), filters);
		}
	),
	searching: _.property('searching')
}))(React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	getInitialState:           _.constant({ pages: 1 }),
	componentWillReceiveProps: function(nextProps) {
		if (!_.isEqual(this.props.logos, nextProps.logos)) {
			this.setState({ pages: 1 });
		}
		if (this.props.searching !== nextProps.searching) {
			this.updatePageView();
		}
	},
	render: function() {
		var numlogos = this.state.pages * PAGE_SIZE - 1;
		var loadmore = (numlogos < this.props.logos.length) && ((this.state.pages === 1) ? 'cta' : 'infinite');

		return (
			<div>
				<Helmet
					meta={[
						{ name: 'totalResults', content: this.props.logos.length },
						{ name: 'startIndex', content: 0 },
						{ name: 'itemsPerPage', content: Math.min(this.props.logos.length, numlogos) }
					]} />
				<Logos heading={this.heading()}
					logos={_.first(this.props.logos, numlogos)}
					suggest={(Math.max(0, numlogos - this.props.logos.length) > 0) && this.props.searching}
					loadmore={loadmore}
					carbonad={true}
					onLoadMore={function(how) {
						this.addImpressions(
							this.heading(),
							_.chain(this.props.logos)
								.rest(numlogos)
								.first(PAGE_SIZE)
								.value(),
							numlogos
						);
						ga('send', 'event', 'Logos', 'Load More', how || '', numlogos + PAGE_SIZE);
						this.setState({ pages: this.state.pages + 1 });
					}.bind(this)}
					/>
			</div>
		);
	},
	componentDidMount: function() {
		this.sendPageView();
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
	},
	heading: function() {
		return this.props.searching ? 'Search Results' : 'Popular Logos';
	},
	sendPageView: function() {
		this.addImpressions(this.heading(), _.first(this.props.logos, this.state.pages * PAGE_SIZE), 0);
		ga('send', 'pageview');
	},
	updatePageView: _.debounce(function() {
		if (this.props.searching) {
			ga('send', 'event', 'Search', 'Searching', this.props.searching);
		}
		// The searching "event" happens before we change the page
		// Plus, I'm not sure if the events flow bridges pageviews, so it makes more sense being part of the flow of the previous "page"
		this.context.router.replace('/' + (this.props.searching ? '?q=' + this.props.searching : ''));
		ga('set', { location: document.location.href, title: document.title });
		this.sendPageView();
	}, 500)
}));
