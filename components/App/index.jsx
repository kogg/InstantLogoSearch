var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var Helmet         = require('react-helmet');
var React          = require('react');

var actions = require('../../actions');
var Header  = require('../Header');
var Logos   = require('../Logos');

module.exports = connect(createSelector(
	_.property('logos'),
	_.property('collection'),
	function(logos, collection) {
		return {
			logos: _.chain(logos)
				.values()
				.pluck('data')
				.map(function(logo) {
					return _.defaults({ in_collection: collection[logo.id] }, logo);
				})
				.value()
		};
	}
))(React.createClass({
	mixins:             [FeathersMixin],
	getInitialState:    _.constant({ filters: [''] }),
	componentWillMount: function() {
		this.feathers('logo');
	},
	componentDidMount: function() {
		this.props.dispatch(actions.loadCollection());
	},
	render: function() {
		return (
			<div className="hero">
				<Helmet
					title={process.env.npm_package_title}
					meta={[
						{ name: 'description', content: process.env.npm_package_description },
						{ property: 'og:site_name', content: process.env.npm_package_title },
						{ property: 'og:title', content: process.env.npm_package_title },
						{ property: 'og:description', content: process.env.npm_package_description },
						{ name: 'twitter:title', content: process.env.npm_package_title },
						{ name: 'twitter:description', content: process.env.npm_package_description }
					]}
				/>
				<Header onFilter={function(filters) {
					this.setState({ filters: filters });
				}.bind(this)} />
				<Logos logos={this.props.logos} filters={this.state.filters}
					onCollectLogo={_.compose(this.props.dispatch, actions.addToCollection)}
					onUncollectLogo={_.compose(this.props.dispatch, actions.removeFromCollection)} />
			</div>
		);
	}
}));
