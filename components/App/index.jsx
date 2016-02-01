var _                        = require('underscore');
var connect                  = require('react-redux').connect;
var createSelector           = require('reselect').createSelector;
var createStructuredSelector = require('reselect').createStructuredSelector;
var FeathersMixin            = require('feathers-react-redux').FeathersMixin;
var Helmet                   = require('react-helmet');
var React                    = require('react');

var actions    = require('../../actions');
var Collection = require('../Collection');
var Header     = require('../Header');
var Logos      = require('../Logos');

module.exports = connect(createStructuredSelector({
	logos: createSelector(
		_.property('logos'),
		_.partial(_.pluck, _, 'data')
	),
	collection: _.property('collection')
}))(React.createClass({
	mixins:             [FeathersMixin],
	getInitialState:    _.constant({ filter: '' }),
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
				<Header onFilter={function(filter) {
					this.setState({ filter: filter });
				}.bind(this)} />
				<Logos logos={this.props.logos} collection={this.props.collection} filter={this.state.filter}
					onCollectLogo={_.compose(this.props.dispatch, actions.addToCollection)}
					onUncollectLogo={_.compose(this.props.dispatch, actions.removeFromCollection)} />
				<Collection />
			</div>
		);
	}
}));
